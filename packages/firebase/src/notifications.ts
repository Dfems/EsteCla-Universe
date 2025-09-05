import type { Auth } from 'firebase/auth'
import type { Firestore, FirestoreDataConverter, Timestamp } from 'firebase/firestore'
import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore'

export interface NotificationItem {
  id: string
  type: 'follow'
  fromUid: string
  createdAt: Date | null
  read?: boolean
}

export function requireAuth(auth: Auth) {
  const u = auth.currentUser
  if (!u) throw new Error('Utente non autenticato')
  return u
}

export async function createFollowNotification(db: Firestore, targetUid: string, fromUid: string) {
  await addDoc(collection(db, 'users', targetUid, 'notifications'), {
    type: 'follow',
    fromUid,
    createdAt: serverTimestamp(),
    read: false,
  })
}

export function observeNotifications(
  services: { auth: Auth; db: Firestore },
  cb: (count: number) => void
) {
  const u = services.auth.currentUser
  if (!u) return () => {}
  const q = query(
    collection(services.db, 'users', u.uid, 'notifications'),
    where('read', '==', false),
    orderBy('createdAt', 'desc'),
    limit(100)
  )
  return onSnapshot(
    q,
    (snap) => cb(snap.size),
    () => cb(0)
  )
}

export interface NotificationsPage {
  items: NotificationItem[]
  cursor: Timestamp | null
}

interface NotificationDoc {
  type: 'follow'
  fromUid: string
  createdAt?: Timestamp
  read?: boolean
}

const notificationConverter: FirestoreDataConverter<NotificationDoc> = {
  toFirestore(data) {
    return data as unknown as Record<string, unknown>
  },
  fromFirestore(snapshot) {
    return snapshot.data() as unknown as NotificationDoc
  },
}

export async function listNotificationsPage(
  services: { auth: Auth; db: Firestore },
  pageSize = 20,
  cursor?: Timestamp
): Promise<NotificationsPage> {
  const u = services.auth.currentUser
  if (!u) return { items: [], cursor: null }
  const base = query(
    collection(services.db, 'users', u.uid, 'notifications').withConverter(notificationConverter),
    orderBy('createdAt', 'desc'),
    limit(pageSize)
  )
  const q = cursor ? query(base, startAfter(cursor)) : base
  const snap = await getDocs(q)
  const docs = snap.docs
  const items: NotificationItem[] = docs.map((d) => {
    const data = d.data()
    return {
      id: d.id,
      type: data.type,
      fromUid: data.fromUid,
      createdAt: data.createdAt ? data.createdAt.toDate() : null,
      read: data.read ?? false,
    }
  })
  const last = docs[docs.length - 1]
  const lastData = last ? (last.data() as NotificationDoc) : undefined
  const nextCursor = lastData?.createdAt ?? null
  return { items, cursor: nextCursor }
}

export async function markNotificationRead(
  services: { auth: Auth; db: Firestore },
  id: string,
  value = true
) {
  const u = services.auth.currentUser
  if (!u) return
  await updateDoc(doc(services.db, 'users', u.uid, 'notifications', id), { read: value })
}

export async function markAllNotificationsRead(services: { auth: Auth; db: Firestore }) {
  const u = services.auth.currentUser
  if (!u) return
  const first = await getDocs(
    query(
      collection(services.db, 'users', u.uid, 'notifications'),
      where('read', '==', false),
      orderBy('createdAt', 'desc'),
      limit(100)
    )
  )
  await Promise.all(first.docs.map((d) => updateDoc(d.ref, { read: true })))
}

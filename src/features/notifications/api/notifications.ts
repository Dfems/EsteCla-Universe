import { db, auth } from '@services/firebase'
import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  FirestoreDataConverter,
  Timestamp,
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

export async function createFollowNotification(targetUid: string, fromUid: string) {
  // Da usare lato Functions; lasciamo l'API client per eventuali usi futuri controllati
  await addDoc(collection(db, 'users', targetUid, 'notifications'), {
    type: 'follow',
    fromUid,
    createdAt: serverTimestamp(),
    read: false,
  })
}

export function observeNotifications(cb: (count: number) => void) {
  const u = auth.currentUser
  if (!u) return () => {}
  const q = query(
    collection(db, 'users', u.uid, 'notifications'),
    where('read', '==', false),
    orderBy('createdAt', 'desc'),
    limit(100)
  )
  return onSnapshot(
    q,
    (snap) => cb(snap.size),
    (err) => {
      const code = (err as { code?: string }).code
      if (code === 'permission-denied') {
        cb(0)
        return
      }
      console.error('Errore notifications listener:', err)
      cb(0)
    }
  )
}

export interface NotificationsPage {
  items: NotificationItem[]
  cursor: Timestamp | null
}

interface NotificationDoc {
  type: 'follow'
  fromUid: string
  createdAt?: import('firebase/firestore').Timestamp
  read?: boolean
}

const notificationConverter: FirestoreDataConverter<NotificationDoc> = {
  toFirestore(data) {
    // Only used for writes in Functions; here we mainly read. Keep passthrough.
    return data as unknown as Record<string, unknown>
  },
  fromFirestore(snapshot) {
    return snapshot.data() as unknown as NotificationDoc
  },
}

export async function listNotificationsPage(
  pageSize = 20,
  cursor?: Timestamp
): Promise<NotificationsPage> {
  const u = auth.currentUser
  if (!u) return { items: [], cursor: null }
  const base = query(
    collection(db, 'users', u.uid, 'notifications').withConverter(notificationConverter),
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
  // Pick the last available createdAt as cursor; if missing, return null
  const last = docs[docs.length - 1]
  const lastData = last ? (last.data() as NotificationDoc) : undefined
  const nextCursor = lastData?.createdAt ?? null
  return { items, cursor: nextCursor }
}

export async function markNotificationRead(id: string, value = true) {
  const u = auth.currentUser
  if (!u) return
  await updateDoc(doc(db, 'users', u.uid, 'notifications', id), { read: value })
}

export async function markAllNotificationsRead() {
  const u = auth.currentUser
  if (!u) return
  // Nota: per semplicità aggiorniamo le ultime N; per bulk reale usare una Cloud Function
  const first = await getDocs(
    query(
      collection(db, 'users', u.uid, 'notifications'),
      where('read', '==', false),
      orderBy('createdAt', 'desc'),
      limit(100)
    )
  )
  await Promise.all(first.docs.map((d) => updateDoc(d.ref, { read: true })))
}

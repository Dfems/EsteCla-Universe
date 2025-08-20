import { useEffect, useMemo, useRef, useState } from 'react'
import {
  collectionGroup,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  type QuerySnapshot,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { db } from '@services/firebase'
import type { Post, UserInfo } from '@models/interfaces'

type FeedUser = Pick<UserInfo, 'username' | 'profilePic'>

export interface FeedItem {
  id: string
  user: FeedUser
  post: Post
}

function toDate(v?: unknown): Date | undefined {
  if (!v) return undefined
  if (v instanceof Date) return v
  if (typeof v === 'object' && v !== null && 'toDate' in v) {
    try {
      return (v as { toDate: () => Date }).toDate()
    } catch {
      return undefined
    }
  }
  return undefined
}

export function useGlobalFeed(limit?: number) {
  const [items, setItems] = useState<FeedItem[]>([])
  const usersCache = useRef<Map<string, FeedUser>>(new Map())

  useEffect(() => {
    const q = query(collectionGroup(db, 'posts'), orderBy('createdAt', 'desc'))

    interface Row {
      uid: string
      post: Post
    }
    async function processSnapshot(snap: QuerySnapshot<DocumentData>) {
      const rows: Row[] = snap.docs.map((d: QueryDocumentSnapshot<DocumentData>) => {
        const data = d.data() as Record<string, unknown>
        const uid: string = d.ref.parent.parent?.id || ''
        const post: Post = {
          id: d.id,
          imageUrl: (data.imageUrl as string) || '',
          caption: (data.caption as string) || '',
          createdAt: toDate(data.createdAt),
          publishAt: toDate(data.publishAt),
          imageAt: toDate(data.imageAt),
        }
        return { uid, post }
      })

      const limited = typeof limit === 'number' ? rows.slice(0, limit) : rows

      const missingUids: string[] = Array.from(
        new Set(
          limited.map((r: Row) => r.uid).filter((u: string) => u && !usersCache.current.has(u))
        )
      )

      if (missingUids.length) {
        await Promise.all(
          missingUids.map(async (uid: string) => {
            try {
              const userSnap = await getDoc(doc(db, 'users', uid))
              if (userSnap.exists()) {
                const u = userSnap.data() as UserInfo
                usersCache.current.set(uid, { username: u.username, profilePic: u.profilePic })
              } else {
                usersCache.current.set(uid, { username: 'utente', profilePic: undefined })
              }
            } catch {
              usersCache.current.set(uid, { username: 'utente', profilePic: undefined })
            }
          })
        )
      }

      const feed: FeedItem[] = limited.map(({ uid, post }: Row) => ({
        id: post.id,
        user: usersCache.current.get(uid) || { username: 'utente', profilePic: undefined },
        post,
      }))

      setItems(feed)
    }

    const unsub = onSnapshot(
      q,
      (snap) => {
        // Evita callback async direttamente in onSnapshot
        void processSnapshot(snap).catch((e) => {
          console.error('Errore elaborazione feed:', e)
          setItems([])
        })
      },
      (err) => {
        const code = (err as { code?: string; message?: string }).code
        if (code === 'permission-denied') {
          const projectId = (db.app.options as { projectId?: string }).projectId
          console.warn(
            `Feed non accessibile: permessi insufficienti (rules). projectId=${projectId}`
          )
          setItems([])
          return
        }
        if (code === 'failed-precondition') {
          console.error('Indice richiesto per la query del feed. Dettagli:', err)
          setItems([])
          return
        }
        console.error('Errore feed (non gestito):', err)
        setItems([])
      }
    )

    return () => unsub()
  }, [limit])

  return useMemo(() => ({ items }), [items])
}

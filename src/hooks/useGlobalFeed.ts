import { useEffect, useMemo, useRef, useState } from 'react'
import { collectionGroup, doc, getDoc, onSnapshot, orderBy, query } from 'firebase/firestore'
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
    const unsub = onSnapshot(q, async (snap) => {
      const rows = snap.docs.map((d) => {
        const data = d.data() as Record<string, unknown>
        const uid = d.ref.parent.parent?.id || ''
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

      const missingUids = Array.from(
        new Set(limited.map((r) => r.uid).filter((u) => u && !usersCache.current.has(u)))
      )

      if (missingUids.length) {
        await Promise.all(
          missingUids.map(async (uid) => {
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

      const feed: FeedItem[] = limited.map(({ uid, post }) => ({
        id: post.id,
        user: usersCache.current.get(uid) || { username: 'utente', profilePic: undefined },
        post,
      }))

      setItems(feed)
    })

    return () => unsub()
  }, [limit])

  return useMemo(() => ({ items }), [items])
}

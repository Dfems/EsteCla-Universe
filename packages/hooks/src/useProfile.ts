import { getServices } from '@estecla/firebase'
import type { Post, UserInfo } from '@estecla/types'
import { collection, doc, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export interface UseProfileParams {
  username: string | undefined
  onMissing?: () => void
}

export function useProfile(params: UseProfileParams) {
  const { username, onMissing } = params
  const { db } = getServices()
  const [profileUser, setProfileUser] = useState<UserInfo | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingPosts, setLoadingPosts] = useState(true)

  useEffect(() => {
    if (!username) return

    let unsubscribeUser: (() => void) | null = null
    let unsubscribePosts: (() => void) | null = null
    setLoading(true)
    setLoadingPosts(true)

    const init = async () => {
      try {
        const userQueryLower = query(
          collection(db, 'users'),
          where('usernameLowercase', '==', username.toLowerCase())
        )
        let querySnapshot = await getDocs(userQueryLower)

        if (querySnapshot.empty) {
          const userQueryExact = query(collection(db, 'users'), where('username', '==', username))
          querySnapshot = await getDocs(userQueryExact)
          if (querySnapshot.empty) {
            onMissing?.()
            return
          }
        }

        const userDocSnap = querySnapshot.docs[0]
        const userRef = doc(db, 'users', userDocSnap.id)

        unsubscribeUser = onSnapshot(
          userRef,
          (snap) => {
            if (snap.exists()) {
              const data = snap.data() as UserInfo
              setProfileUser(data)

              if (unsubscribePosts) unsubscribePosts()
              unsubscribePosts = onSnapshot(
                query(collection(db, 'users', data.uid, 'posts'), orderBy('createdAt', 'desc')),
                (postsSnap) => {
                  interface TimestampLike {
                    toDate: () => Date
                  }
                  const toDate = (v?: unknown): Date | undefined => {
                    if (!v) return undefined
                    if (v instanceof Date) return v
                    if (typeof v === 'object' && v !== null && 'toDate' in v) {
                      try {
                        return (v as TimestampLike).toDate()
                      } catch {
                        return undefined
                      }
                    }
                    return undefined
                  }

                  const userPosts: Post[] = postsSnap.docs.map((d) => {
                    const p = d.data() as {
                      imageUrl: string
                      caption: string
                      createdAt?: unknown
                      publishAt?: unknown
                      imageAt?: unknown
                    }

                    return {
                      id: d.id,
                      imageUrl: p.imageUrl,
                      caption: p.caption,
                      createdAt: toDate(p.createdAt),
                      publishAt: toDate(p.publishAt),
                      imageAt: toDate(p.imageAt),
                    }
                  })
                  setPosts(userPosts)
                  setLoadingPosts(false)
                },
                (err) => console.error('Errore sottoscrizione post: ', err)
              )
            } else {
              onMissing?.()
            }
          },
          (err) => console.error('Errore sottoscrizione utente: ', err)
        )
      } catch (error) {
        console.error('Errore nel fetch del profilo: ', error)
      } finally {
        setLoading(false)
      }
    }

    void init()

    return () => {
      if (unsubscribeUser) unsubscribeUser()
      if (unsubscribePosts) unsubscribePosts()
    }
  }, [db, username, onMissing])

  return { profileUser, posts, loading, loadingPosts, setProfileUser }
}

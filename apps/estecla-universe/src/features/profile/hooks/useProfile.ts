// src/hooks/useProfile.ts
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { collection, query, where, getDocs, orderBy, onSnapshot, doc } from 'firebase/firestore'
import { db } from '@services/firebase'
import { Post, UserInfo } from '@estecla/types'

export const useProfile = () => {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
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
        // Trova il documento utente in base allo username (case-insensitive) o fallback esatto
        const userQueryLower = query(
          collection(db, 'users'),
          where('usernameLowercase', '==', username.toLowerCase())
        )
        let querySnapshot = await getDocs(userQueryLower)

        if (querySnapshot.empty) {
          const userQueryExact = query(collection(db, 'users'), where('username', '==', username))
          querySnapshot = await getDocs(userQueryExact)
          if (querySnapshot.empty) {
            navigate('/')
            return
          }
        }

        const userDocSnap = querySnapshot.docs[0]
        const userRef = doc(db, 'users', userDocSnap.id)

        // Sottoscrizione in tempo reale al documento utente
        unsubscribeUser = onSnapshot(
          userRef,
          (snap) => {
            if (snap.exists()) {
              const data = snap.data() as UserInfo
              setProfileUser(data)

              // Sottoscrizione ai post dell'utente (subcollection)
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
              navigate('/')
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

    init()

    return () => {
      if (unsubscribeUser) unsubscribeUser()
      if (unsubscribePosts) unsubscribePosts()
    }
  }, [username, navigate])

  return { profileUser, posts, loading, loadingPosts, setProfileUser }
}

// src/hooks/useProfile.ts
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { collection, query, where, getDocs, orderBy, onSnapshot, doc } from 'firebase/firestore'
import { db } from '@services/firebase'
import { Post, UserInfo } from '@models/interfaces'

export const useProfile = () => {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const [profileUser, setProfileUser] = useState<UserInfo | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!username) return

    let unsubscribeUser: (() => void) | null = null
    let unsubscribePosts: (() => void) | null = null
    setLoading(true)

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

              // Sottoscrizione ai post dell'utente quando abbiamo l'uid
              if (unsubscribePosts) unsubscribePosts()
              unsubscribePosts = onSnapshot(
                query(
                  collection(db, 'posts'),
                  where('userId', '==', data.uid),
                  orderBy('timestamp', 'desc')
                ),
                (postsSnap) => {
                  const userPosts = postsSnap.docs.map((d) => ({
                    id: d.id,
                    ...d.data(),
                  })) as Post[]
                  setPosts(userPosts)
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

  return { profileUser, posts, loading, setProfileUser }
}

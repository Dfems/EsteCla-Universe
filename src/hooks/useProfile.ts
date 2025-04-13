// src/hooks/useProfile.ts
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '../services/firebase'
import { Post, UserInfo } from '../types/interfaces'

export const useProfile = () => {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const [profileUser, setProfileUser] = useState<UserInfo | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return
      try {
        const userQuery = query(collection(db, 'users'), where('username', '==', username))
        const querySnapshot = await getDocs(userQuery)

        if (querySnapshot.empty) {
          navigate('/')
          return
        }

        const userDoc = querySnapshot.docs[0]
        const data = userDoc.data() as UserInfo
        setProfileUser(data)

        const postsSnapshot = await getDocs(
          query(
            collection(db, 'posts'),
            where('userId', '==', data.uid),
            orderBy('timestamp', 'desc')
          )
        )
        const userPosts = postsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[]
        setPosts(userPosts)
      } catch (error) {
        console.error('Errore nel fetch del profilo: ', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [username, navigate])

  return { profileUser, posts, loading, setProfileUser }
}

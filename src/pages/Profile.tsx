// src/pages/Profile.tsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Avatar,
  Button,
  Flex,
  Grid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
  Input,
  Textarea,
} from '@chakra-ui/react'
import {
  doc,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  runTransaction,
  query,
  collection,
  where,
  orderBy,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../services/firebase'
import { useAuth } from '../context/AuthContext'
import { Post, UserInfo } from '../types/interfaces'
import PostCard from '../components/PostCard'
import LoadingSpinner from '../components/LoadingSpinner'

const Profile = () => {
  const { username } = useParams<{ username: string }>()
  const { user: currentUser } = useAuth() // currentUser è di tipo UserInfo | null
  const [profileUser, setProfileUser] = useState<UserInfo | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editedBio, setEditedBio] = useState('')
  const toast = useToast()
  const navigate = useNavigate()

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Fetching profile for username:', username)
        if (!username) return

        // Eseguiamo una query per cercare l'utente in base al campo "username"
        const userQuery = query(collection(db, 'users'), where('username', '==', username))
        const querySnapshot = await getDocs(userQuery)

        if (querySnapshot.empty) {
          // Se non troviamo l'utente, reindirizziamo alla home
          navigate('/')
          return
        }

        // Consideriamo il primo documento trovato
        const userDoc = querySnapshot.docs[0]
        const data = userDoc.data() as UserInfo
        setProfileUser(data)
        setEditedBio(data.bio ?? '')

        // Recuperiamo i post di questo utente ordinati per timestamp decrescente
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
        toast({ title: 'Error loading profile', status: 'error' })
        console.log(error)
      }
    }

    fetchProfile()
  }, [username, navigate, toast])

  // Handle follow/unfollow
  const handleFollow = async () => {
    if (!currentUser || !profileUser) return

    try {
      await runTransaction(db, async (transaction) => {
        const currentUserRef = doc(db, 'users', currentUser.uid)
        const profileUserRef = doc(db, 'users', profileUser.uid)

        const isAlreadyFollowing = profileUser.followers?.includes(currentUser.uid)

        // Aggiorniamo la lista "following" dell'utente loggato
        transaction.update(currentUserRef, {
          following: isAlreadyFollowing
            ? arrayRemove(profileUser.uid)
            : arrayUnion(profileUser.uid),
        })

        // Aggiorniamo la lista "followers" dell'utente del profilo
        transaction.update(profileUserRef, {
          followers: isAlreadyFollowing
            ? arrayRemove(currentUser.uid)
            : arrayUnion(currentUser.uid),
        })
      })

      // Aggiorniamo localmente il profilo per riflettere subito il cambiamento
      setProfileUser((prev) =>
        prev
          ? {
              ...prev,
              followers: prev.followers?.includes(currentUser.uid)
                ? prev.followers.filter((id) => id !== currentUser.uid)
                : [...(prev.followers || []), currentUser.uid],
            }
          : null
      )
    } catch (error) {
      toast({ title: 'Error updating follow status', status: 'error' })
      console.log(error)
    }
  }

  // Handle profile picture upload
  const handleProfilePicUpload = async (file: File) => {
    if (!currentUser || !profileUser) return

    try {
      const storageRef = ref(storage, `profile-pics/${currentUser.uid}`)
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)

      await updateDoc(doc(db, 'users', currentUser.uid), {
        profilePic: downloadURL,
      })

      // Aggiorniamo localmente l'avatar nel profilo
      setProfileUser((prev) => (prev ? { ...prev, profilePic: downloadURL } : null))
    } catch (error) {
      toast({ title: 'Error updating profile picture', status: 'error' })
      console.log(error)
    }
  }

  // Salvataggio modifiche della bio
  const handleSaveBio = async () => {
    if (!currentUser || !profileUser) return

    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        bio: editedBio,
      })
      setIsEditing(false)
      toast({ title: 'Bio updated', status: 'success' })
    } catch (error) {
      toast({ title: 'Error updating bio', status: 'error' })
      console.log(error)
    }
  }

  if (!profileUser) {
    return <LoadingSpinner />
  }

  const isCurrentUser = currentUser?.uid === profileUser.uid
  const isFollowing = profileUser.followers?.includes(currentUser?.uid || '')

  return (
    <Box maxW="935px" mx="auto" p={4}>
      <Flex gap={8} mb={8}>
        <Avatar src={profileUser.profilePic} size="2xl" border="2px solid white" boxShadow="lg" />

        <Box flex={1}>
          <Flex gap={4} alignItems="center" mb={4}>
            <Text fontSize="2xl">{profileUser.username}</Text>

            {isCurrentUser ? (
              <Button onClick={() => setIsEditing(!isEditing)}>Edit Profile</Button>
            ) : (
              <Button colorScheme={isFollowing ? 'gray' : 'blue'} onClick={handleFollow}>
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}
          </Flex>

          <Flex gap={8} mb={4}>
            <Text>
              <strong>{posts.length}</strong> memories
            </Text>
            {/* <Text>
              <strong>{profileUser.followers?.length ?? 0}</strong> followers
            </Text>
            <Text>
              <strong>{profileUser.following?.length ?? 0}</strong> following
            </Text> */}
          </Flex>

          {isEditing ? (
            <Textarea value={editedBio} onChange={(e) => setEditedBio(e.target.value)} mb={2} />
          ) : (
            <Text>{profileUser.bio}</Text>
          )}

          {isEditing && (
            <Flex gap={2} mt={2}>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleProfilePicUpload(e.target.files[0])}
                display="none"
                id="profile-pic-upload"
              />
              <label htmlFor="profile-pic-upload">
                <Button as="span">Change Photo</Button>
              </label>
              <Button colorScheme="green" onClick={handleSaveBio}>
                Save Bio
              </Button>
              <Button onClick={() => setIsEditing(false)}>Cancel</Button>
            </Flex>
          )}
        </Box>
      </Flex>

      <Tabs variant="enclosed">
        <TabList>
          <Tab>Memories</Tab>
          <Tab>Ristorants</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {posts.length === 0 && <Text>No memories found</Text>}
            <Grid templateColumns="repeat(3, 1fr)" gap={1}>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </Grid>
          </TabPanel>
          <TabPanel>
            <Text>Ristoranti salvati</Text>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default Profile

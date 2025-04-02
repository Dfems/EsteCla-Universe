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
import { db, storage } from '../services/firebase'
import {
  doc,
  getDoc,
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
import { useAuth } from '../context/AuthContext'
import PostCard from '../components/PostCard'

interface User {
  uid: string
  username: string
  fullName: string
  profilePic: string
  bio: string
  followers: string[]
  following: string[]
}

interface Post {
  id: string
  imageUrl: string
  caption: string
  timestamp: Date
}

export default function Profile() {
  const { username } = useParams<{ username: string }>()
  const { user: currentUser } = useAuth()
  const [profileUser, setProfileUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editedBio, setEditedBio] = useState('')
  const toast = useToast()
  const navigate = useNavigate()

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userQuery = await getDoc(doc(db, 'users', username!))
        if (!userQuery.exists()) {
          navigate('/')
          return
        }
        setProfileUser(userQuery.data() as User)
        setEditedBio(userQuery.data().bio || '')

        // Fetch user's posts
        const postsSnapshot = await getDocs(
          query(
            collection(db, 'posts'),
            where('userId', '==', userQuery.data().uid),
            orderBy('timestamp', 'desc')
          )
        )
        setPosts(
          postsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Post[]
        )
      } catch (error) {
        toast({ title: 'Error loading profile', status: 'error' })
        console.log(error)
      }
    }

    if (username) fetchProfile()
  }, [username])

  // Handle follow/unfollow
  const handleFollow = async () => {
    if (!currentUser || !profileUser) return

    try {
      await runTransaction(db, async (transaction) => {
        const currentUserRef = doc(db, 'users', currentUser.uid)
        const profileUserRef = doc(db, 'users', profileUser.uid)

        transaction.update(currentUserRef, {
          following: profileUser.followers.includes(currentUser.uid)
            ? arrayRemove(profileUser.uid)
            : arrayUnion(profileUser.uid),
        })

        transaction.update(profileUserRef, {
          followers: profileUser.followers.includes(currentUser.uid)
            ? arrayRemove(currentUser.uid)
            : arrayUnion(currentUser.uid),
        })
      })

      setProfileUser((prev) =>
        prev
          ? {
              ...prev,
              followers: prev.followers.includes(currentUser.uid)
                ? prev.followers.filter((id) => id !== currentUser.uid)
                : [...prev.followers, currentUser.uid],
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

      setProfileUser((prev) => (prev ? { ...prev, profilePic: downloadURL } : null))
    } catch (error) {
      toast({ title: 'Error updating profile picture', status: 'error' })
      console.log(error)
    }
  }

  // Save bio edits
  const handleSaveBio = async () => {
    if (!currentUser || !profileUser) return

    try {
      await updateDoc(doc(db, 'users', currentUser.uid), { bio: editedBio })
      setIsEditing(false)
      toast({ title: 'Bio updated', status: 'success' })
    } catch (error) {
      toast({ title: 'Error updating bio', status: 'error' })
      console.log(error)
    }
  }

  if (!profileUser) return <div>Loading...</div>

  const isCurrentUser = currentUser?.uid === profileUser.uid
  const isFollowing = profileUser.followers.includes(currentUser?.uid || '')

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
              <strong>{posts.length}</strong> posts
            </Text>
            <Text>
              <strong>{profileUser.followers.length}</strong> followers
            </Text>
            <Text>
              <strong>{profileUser.following.length}</strong> following
            </Text>
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
          <Tab>Posts</Tab>
          <Tab>Saved</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Grid templateColumns="repeat(3, 1fr)" gap={1}>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </Grid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

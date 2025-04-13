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
  useColorModeValue, // Importa l'hook per i valori dinamici
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
  const [newProfilePicFile, setNewProfilePicFile] = useState<File | null>(null)
  const toast = useToast()
  const navigate = useNavigate()

  // Definiamo alcuni token dinamici per il tema
  const containerBg = useColorModeValue('white', 'gray.800') // Background principale
  const borderColor = useColorModeValue('gray.200', 'gray.600') // Bordo per Avatar, TabList, ecc.
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900') // Colore del testo
  const tabSelectedColor = useColorModeValue('black', 'white') // Colore del testo nelle Tab selezionate
  const tabSelectedBorder = useColorModeValue('2px solid black', '2px solid white') // Border per la tab selezionata

  // Fetch dei dati del profilo
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!username) return

        const userQuery = query(collection(db, 'users'), where('username', '==', username))
        const querySnapshot = await getDocs(userQuery)

        if (querySnapshot.empty) {
          navigate('/')
          return
        }

        const userDoc = querySnapshot.docs[0]
        const data = userDoc.data() as UserInfo
        setProfileUser(data)
        setEditedBio(data.bio ?? '')

        // Post ordinati per timestamp
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

  // Gestione follow/unfollow
  const handleFollow = async () => {
    if (!currentUser || !profileUser) return
    try {
      await runTransaction(db, async (transaction) => {
        const currentUserRef = doc(db, 'users', currentUser.uid)
        const profileUserRef = doc(db, 'users', profileUser.uid)

        const isAlreadyFollowing = profileUser.followers?.includes(currentUser.uid)

        transaction.update(currentUserRef, {
          following: isAlreadyFollowing
            ? arrayRemove(profileUser.uid)
            : arrayUnion(profileUser.uid),
        })

        transaction.update(profileUserRef, {
          followers: isAlreadyFollowing
            ? arrayRemove(currentUser.uid)
            : arrayUnion(currentUser.uid),
        })
      })

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

  // Salvataggio modifiche profilo
  const handleSaveProfile = async () => {
    if (!currentUser || !profileUser) return
    try {
      const updatedData: Partial<UserInfo> = { bio: editedBio }

      if (newProfilePicFile) {
        const storageRef = ref(storage, `profile-pics/${currentUser.uid}/${newProfilePicFile.name}`)
        await uploadBytes(storageRef, newProfilePicFile)
        const newProfilePicURL = await getDownloadURL(storageRef)
        updatedData.profilePic = newProfilePicURL
      }

      await updateDoc(doc(db, 'users', currentUser.uid), updatedData)
      setProfileUser((prev) => (prev ? { ...prev, ...updatedData } : prev))
      setIsEditing(false)
      toast({ title: 'Profile updated', status: 'success' })
    } catch (error) {
      toast({ title: 'Error updating profile', status: 'error' })
      console.log(error)
    }
  }

  if (!profileUser) {
    return <LoadingSpinner />
  }

  const isCurrentUser = currentUser?.uid === profileUser.uid
  const isFollowing = profileUser.followers?.includes(currentUser?.uid || '')

  return (
    <Box maxW="935px" mx="auto" p={4} minH="100vh" bg={containerBg} color={textColor}>
      {/* Layout a 2 colonne fisse per avatar e info */}
      <Grid templateColumns="min-content 1fr" gap={6} alignItems="center" mb={8}>
        <Avatar
          src={profileUser.profilePic}
          size="2xl"
          name={profileUser.username}
          showBorder
          borderWidth="1px"
          borderColor={borderColor}
        />

        <Box>
          {/* Prima riga: username + pulsante Edit/Follow */}
          <Flex align="center" gap={4} mb={4}>
            <Text fontSize="2xl" fontWeight="bold" noOfLines={1}>
              {profileUser.username}
            </Text>
            {isCurrentUser ? (
              <Button size="sm" onClick={() => setIsEditing(!isEditing)}>
                Modifica profilo
              </Button>
            ) : (
              <Button size="sm" colorScheme={isFollowing ? 'gray' : 'blue'} onClick={handleFollow}>
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}
          </Flex>

          {/* Seconda riga: statistiche */}
          <Flex gap={6} mb={4}>
            <Text>
              <strong>{posts.length}</strong> post
            </Text>
            <Text>
              <strong>{profileUser.followers?.length ?? 0}</strong> follower
            </Text>
            <Text>
              <strong>{profileUser.following?.length ?? 0}</strong> seguiti
            </Text>
          </Flex>

          {/* Nome completo (se presente) + bio */}
          {profileUser.fullName && (
            <Text fontWeight="bold" mb={2}>
              {profileUser.fullName}
            </Text>
          )}

          {isEditing ? (
            <Box>
              <Textarea
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                mb={2}
                placeholder="Aggiorna la tua bio"
              />
              <Flex gap={2} flexWrap="wrap">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && setNewProfilePicFile(e.target.files[0])}
                  display="none"
                  id="profile-pic-upload"
                />
                <label htmlFor="profile-pic-upload">
                  <Button as="span" size="sm" variant="outline">
                    Cambia Foto
                  </Button>
                </label>
                <Button size="sm" colorScheme="green" onClick={handleSaveProfile}>
                  Salva
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                  Annulla
                </Button>
              </Flex>
            </Box>
          ) : (
            <Text whiteSpace="pre-wrap">{profileUser.bio}</Text>
          )}
        </Box>
      </Grid>

      {/* Tabs per i contenuti */}
      <Tabs variant="unstyled">
        <TabList borderBottom="1px solid" borderColor={borderColor} mb={2}>
          <Tab
            _selected={{ color: tabSelectedColor, borderBottom: tabSelectedBorder }}
            mr={4}
            fontWeight="bold"
          >
            Memories
          </Tab>
          <Tab
            _selected={{ color: tabSelectedColor, borderBottom: tabSelectedBorder }}
            fontWeight="bold"
          >
            Ristorants
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            {posts.length === 0 ? (
              <Text mt={4}>Nessun post trovato</Text>
            ) : (
              <Grid templateColumns="repeat(3, 1fr)" gap={1}>
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </Grid>
            )}
          </TabPanel>
          <TabPanel p={0}>
            <Text mt={4}>Ristoranti salvati</Text>
            {/* Inserisci qui il contenuto relativo ai ristoranti salvati */}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default Profile

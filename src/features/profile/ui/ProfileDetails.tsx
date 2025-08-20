// src/features/profile/ui/ProfileDetails.tsx
import React, { useMemo, useState } from 'react'
import {
  Box,
  Avatar,
  Flex,
  Grid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Button,
  Tooltip,
  HStack,
  IconButton,
} from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import { BsGrid3X3, BsBookmark } from 'react-icons/bs'
import { FaList } from 'react-icons/fa'
import { MdOutlineRestaurant } from 'react-icons/md'
import PostCard from '@components/ui/PostCard'
import PostListItem from '@components/ui/PostListItem'
import { UserInfo, Post } from '@models/interfaces'
import useThemeColors from '@hooks/useThemeColors'

interface ProfileDetailsProps {
  profileUser: UserInfo
  posts: Post[]
  isOwnProfile?: boolean
  onEdit?: () => void
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({
  profileUser,
  posts,
  isOwnProfile,
  onEdit,
}) => {
  const { containerBg, borderColor, textColor } = useThemeColors()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const postsSorted = useMemo(() => {
    // Ordina per publishAt/createdAt/timestamp disc
    const key = (p: Post) => (p.publishAt || p.createdAt || p.timestamp || new Date(0)).getTime()
    return [...posts].sort((a, b) => key(b) - key(a))
  }, [posts])

  return (
    <Box
      maxW="935px"
      mx="auto"
      px={{ base: 4, md: 6 }}
      py={4}
      minH="100vh"
      bg={containerBg}
      color={textColor}
      mt={{ base: 6, md: 6 }}
    >
      {/* Header profilo stile Instagram */}
      <Grid
        templateColumns={{ base: '80px 1fr', md: 'min-content 1fr' }}
        gap={{ base: 8, md: 10 }}
        alignItems="center"
        mb={{ base: 6, md: 10 }}
      >
        <Avatar
          src={profileUser.profilePic}
          size={{ base: 'xl', md: '2xl' }}
          name={profileUser.username}
          showBorder
          borderWidth="1px"
          borderColor={borderColor}
          alignSelf="center"
        />

        <Box w="full">
          {/* Riga username + azioni */}
          <Flex align={{ base: 'flex-start', md: 'center' }} gap={4} mb={4} wrap="wrap">
            <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="semibold" noOfLines={1}>
              {profileUser.username}
            </Text>
            {isOwnProfile && (
              <Tooltip label="Modifica profilo" hasArrow>
                <Button size="sm" variant="outline" onClick={onEdit} leftIcon={<EditIcon />}>
                  Modifica profilo
                </Button>
              </Tooltip>
            )}
          </Flex>

          {/* Statistiche */}
          <Flex gap={{ base: 6, md: 8 }} mb={4}>
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

          {/* Bio */}
          {profileUser.fullName && (
            <Text fontWeight="semibold" mb={1}>
              {profileUser.fullName}
            </Text>
          )}
          {profileUser.bio && <Text whiteSpace="pre-wrap">{profileUser.bio}</Text>}
          {profileUser.birthday && (
            <Text fontSize="sm" color="gray.500" mt={2}>
              🎂{' '}
              {new Date(profileUser.birthday).toLocaleDateString('it-IT', {
                day: 'numeric',
                month: 'long',
              })}
            </Text>
          )}
        </Box>
      </Grid>

      {/* Tabs stile Instagram */}
      <Tabs variant="instagram">
        <TabList borderColor={borderColor}>
          <Tab>
            <Flex align="center" gap={2}>
              <Box as={BsGrid3X3} aria-hidden />
              <Text display={{ base: 'none', md: 'inline' }}>POST</Text>
            </Flex>
          </Tab>
          <Tab>
            <Flex align="center" gap={2}>
              <Box as={BsBookmark} aria-hidden />
              <Text display={{ base: 'none', md: 'inline' }}>SALVATI</Text>
            </Flex>
          </Tab>
          <Tab>
            <Flex align="center" gap={2}>
              <Box as={MdOutlineRestaurant} aria-hidden />
              <Text display={{ base: 'none', md: 'inline' }}>RISTORANTI</Text>
            </Flex>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <Flex justify="space-between" align="center" py={3} px={1}>
              <Text fontWeight="semibold">I tuoi post</Text>
              <HStack>
                <Tooltip label="Vista griglia">
                  <IconButton
                    aria-label="Vista griglia"
                    size="sm"
                    icon={<BsGrid3X3 />}
                    variant={viewMode === 'grid' ? 'solid' : 'ghost'}
                    onClick={() => setViewMode('grid')}
                  />
                </Tooltip>
                <Tooltip label="Vista lista">
                  <IconButton
                    aria-label="Vista lista"
                    size="sm"
                    icon={<FaList />}
                    variant={viewMode === 'list' ? 'solid' : 'ghost'}
                    onClick={() => setViewMode('list')}
                  />
                </Tooltip>
              </HStack>
            </Flex>
            {postsSorted.length === 0 ? (
              <Flex justify="center" py={12}>
                <Text color="gray.500">Ancora nessun post</Text>
              </Flex>
            ) : viewMode === 'grid' ? (
              <Grid templateColumns="repeat(3, 1fr)" gap={1}>
                {postsSorted.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </Grid>
            ) : (
              <Box px={1}>
                {postsSorted.map((post) => (
                  <PostListItem
                    key={post.id}
                    user={{ username: profileUser.username, profilePic: profileUser.profilePic }}
                    post={post}
                  />
                ))}
              </Box>
            )}
          </TabPanel>
          <TabPanel p={0}>
            <Flex justify="center" py={12}>
              <Text color="gray.500">Contenuti salvati</Text>
            </Flex>
            {/* Inserisci qui il contenuto relativo ai ristoranti/elementi salvati */}
          </TabPanel>
          <TabPanel p={0}>
            <Flex justify="center" py={12}>
              <Text color="gray.500">Ristoranti</Text>
            </Flex>
            {/* Elenco ristoranti o griglia; integra quando i dati saranno disponibili */}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default ProfileDetails

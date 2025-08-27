// src/features/profile/ui/ProfileDetails.tsx
import React, { useMemo } from 'react'
import {
  Box,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  HStack,
  IconButton,
} from '@chakra-ui/react'

import { BsGrid3X3, BsBookmark, BsCalendarEvent } from 'react-icons/bs'
import { FaList } from 'react-icons/fa'
import { MdOutlineRestaurant } from 'react-icons/md'
import ProfileHeader from './ProfileHeader'
import ProfilePostGrid from './ProfilePostGrid'
import ProfilePostList from './ProfilePostList'
import ProfileCalendar from './ProfileCalendar'
import { UserInfo, Post } from '@estecla/types'
import { useThemeColors } from '@estecla/hooks'
import { useProfileViewMode } from '@features/profile/hooks/useProfileViewMode'

interface ProfileDetailsProps {
  profileUser: UserInfo
  posts: Post[]
  isOwnProfile?: boolean
  onEdit?: () => void
  loadingPosts?: boolean
  onOpenFollowers?: () => void
  onOpenFollowing?: () => void
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({
  profileUser,
  posts,
  isOwnProfile,
  onEdit,
  loadingPosts,
  onOpenFollowers,
  onOpenFollowing,
}) => {
  const { containerBg, borderColor, textColor } = useThemeColors()
  const { viewMode, setGrid, setList } = useProfileViewMode('grid')

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
      {/* Header profilo estratto in componente */}
      <ProfileHeader
        profileUser={profileUser}
        postsCount={posts.length}
        isOwnProfile={isOwnProfile}
        onEdit={onEdit}
        borderColor={borderColor}
        onOpenFollowers={onOpenFollowers}
        onOpenFollowing={onOpenFollowing}
      />

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
          <Tab>
            <Flex align="center" gap={2}>
              <Box as={BsCalendarEvent} aria-hidden />
              <Text display={{ base: 'none', md: 'inline' }}>CALENDARIO</Text>
            </Flex>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <Flex justify="space-between" align="center" py={3} px={1}>
              <Text fontWeight="semibold">
                {isOwnProfile ? 'I tuoi post' : `I post di ${profileUser.username}`}
              </Text>
              <HStack>
                <Tooltip label="Vista griglia">
                  <IconButton
                    aria-label="Vista griglia"
                    size="sm"
                    icon={<BsGrid3X3 />}
                    variant={viewMode === 'grid' ? 'solid' : 'ghost'}
                    onClick={setGrid}
                  />
                </Tooltip>
                <Tooltip label="Vista lista">
                  <IconButton
                    aria-label="Vista lista"
                    size="sm"
                    icon={<FaList />}
                    variant={viewMode === 'list' ? 'solid' : 'ghost'}
                    onClick={setList}
                  />
                </Tooltip>
              </HStack>
            </Flex>
            {postsSorted.length === 0 ? (
              <Flex justify="center" py={12}>
                <Text color="gray.500">Ancora nessun post</Text>
              </Flex>
            ) : viewMode === 'grid' ? (
              <ProfilePostGrid posts={postsSorted} username={profileUser.username} />
            ) : (
              <ProfilePostList
                posts={postsSorted}
                user={{ username: profileUser.username, profilePic: profileUser.profilePic }}
              />
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
          <TabPanel p={0}>
            <ProfileCalendar
              posts={postsSorted.filter((p) => !!p.imageAt)}
              isLoading={loadingPosts}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default ProfileDetails

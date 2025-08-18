// src/components/Profile/ProfileDetails.tsx
import React from 'react'
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
  IconButton,
  Tooltip,
} from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import PostCard from '@components/ui/PostCard'
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
  const { containerBg, borderColor, textColor, tabSelectedColor, tabSelectedBorder } =
    useThemeColors()

  return (
    <Box maxW="935px" mx="auto" p={4} minH="100vh" bg={containerBg} color={textColor}>
      {/* Layout con avatar e info */}
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
          {/* Prima riga: username e pulsanti (modifica/follow) */}
          <Flex align="center" gap={4} mb={4}>
            <Text fontSize="2xl" fontWeight="bold" noOfLines={1}>
              {profileUser.username}
            </Text>
            {isOwnProfile && (
              <Tooltip label="Modifica profilo" hasArrow>
                <IconButton
                  aria-label="Modifica profilo"
                  icon={<EditIcon />}
                  size="sm"
                  variant="ghost"
                  onClick={onEdit}
                />
              </Tooltip>
            )}
          </Flex>

          {profileUser.birthday && (
            <Text fontSize="sm" color="gray.500" mt={-2} mb={2}>
              🎂{' '}
              {new Date(profileUser.birthday).toLocaleDateString('it-IT', {
                day: 'numeric',
                month: 'long',
              })}
            </Text>
          )}

          {/* Statistiche */}
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

          {/* Bio */}
          <Text whiteSpace="pre-wrap">{profileUser.bio}</Text>
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

export default ProfileDetails

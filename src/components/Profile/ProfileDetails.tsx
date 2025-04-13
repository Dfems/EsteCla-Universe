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
  useColorModeValue,
} from '@chakra-ui/react'
import PostCard from '../common/PostCard'
import { UserInfo, Post } from '../../types/interfaces'

interface ProfileDetailsProps {
  profileUser: UserInfo
  posts: Post[]
  // Puoi estendere le props con funzioni di follow/edit se necessario
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ profileUser, posts }) => {
  const containerBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900')
  const tabSelectedColor = useColorModeValue('black', 'white')
  const tabSelectedBorder = useColorModeValue('2px solid black', '2px solid white')

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
            {/* I pulsanti per edit o follow possono essere passati come children o gestiti diversamente */}
          </Flex>

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

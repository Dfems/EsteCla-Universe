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
  Button,
  Tooltip,
} from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import { BsGrid3X3, BsBookmark } from 'react-icons/bs'
import { MdOutlineRestaurant } from 'react-icons/md'
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
    <Box
      maxW="935px"
      mx="auto"
      px={{ base: 4, md: 6 }}
      py={4}
      minH="100vh"
      bg={containerBg}
      color={textColor}
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
      <Tabs variant="unstyled">
        <TabList
          borderTop="1px solid"
          borderColor={borderColor}
          display="flex"
          justifyContent="center"
          gap={{ base: 6, md: 12 }}
          mb={2}
        >
          <Tab
            px={0}
            fontSize="xs"
            letterSpacing="wider"
            fontWeight="bold"
            color="gray.500"
            _selected={{ color: tabSelectedColor, borderTop: tabSelectedBorder }}
            borderTop="2px solid transparent"
            pt={3}
          >
            <Flex align="center" gap={2}>
              <Box as={BsGrid3X3} aria-hidden />
              <Text display={{ base: 'none', md: 'inline' }}>POST</Text>
            </Flex>
          </Tab>
          <Tab
            px={0}
            fontSize="xs"
            letterSpacing="wider"
            fontWeight="bold"
            color="gray.500"
            _selected={{ color: tabSelectedColor, borderTop: tabSelectedBorder }}
            borderTop="2px solid transparent"
            pt={3}
          >
            <Flex align="center" gap={2}>
              <Box as={BsBookmark} aria-hidden />
              <Text display={{ base: 'none', md: 'inline' }}>SALVATI</Text>
            </Flex>
          </Tab>
          <Tab
            px={0}
            fontSize="xs"
            letterSpacing="wider"
            fontWeight="bold"
            color="gray.500"
            _selected={{ color: tabSelectedColor, borderTop: tabSelectedBorder }}
            borderTop="2px solid transparent"
            pt={3}
          >
            <Flex align="center" gap={2}>
              <Box as={MdOutlineRestaurant} aria-hidden />
              <Text display={{ base: 'none', md: 'inline' }}>RISTORANTI</Text>
            </Flex>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            {posts.length === 0 ? (
              <Flex justify="center" py={12}>
                <Text color="gray.500">Ancora nessun post</Text>
              </Flex>
            ) : (
              <Grid templateColumns="repeat(3, 1fr)" gap={1}>
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </Grid>
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

import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useToast,
} from '@chakra-ui/react'
import type { UserInfo } from '@estecla/types'
import React, { useEffect, useMemo, useState } from 'react'

export interface EditProfileUpdates {
  username: string
  fullName?: string
  bio?: string
  birthday?: string
  profilePicFile?: File | null
}

export interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: UserInfo
  onSave: (updates: EditProfileUpdates) => Promise<void> | void
}

export default function EditProfileModal({ isOpen, onClose, user, onSave }: EditProfileModalProps) {
  const toast = useToast()
  const [fullName, setFullName] = useState(user.fullName || '')
  const [bio, setBio] = useState(user.bio || '')
  const [username, setUsername] = useState(user.username)
  const [birthday, setBirthday] = useState(user.birthday || '')
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setFullName(user.fullName || '')
      setBio(user.bio || '')
      setUsername(user.username)
      setBirthday(user.birthday || '')
      setProfilePicFile(null)
    }
  }, [isOpen, user])

  const previewUrl = useMemo(() => {
    if (profilePicFile) return URL.createObjectURL(profilePicFile)
    return user.profilePic || ''
  }, [profilePicFile, user.profilePic])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setProfilePicFile(e.target.files[0])
  }

  const save = async () => {
    setSaving(true)
    try {
      await onSave({ username, fullName, bio, birthday, profilePicFile })
      toast({ status: 'success', title: 'Profilo aggiornato' })
      onClose()
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Salvataggio fallito'
      toast({ status: 'error', title: 'Errore', description: message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modifica profilo</ModalHeader>
        <ModalBody>
          <Box display="flex" gap={4} alignItems="center" mb={4}>
            <Avatar src={previewUrl} name={username} size="lg" />
            <Input type="file" accept="image/*" onChange={onFileChange} alignContent="center" />
          </Box>
          <FormControl mb={3}>
            <FormLabel>Username</FormLabel>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Nome completo</FormLabel>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
          </FormControl>
          <FormControl mt={3}>
            <FormLabel>Data di nascita</FormLabel>
            <Input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose} variant="ghost">
            Annulla
          </Button>
          <Button colorScheme="blue" onClick={save} isLoading={saving} loadingText="Salvo...">
            Salva
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

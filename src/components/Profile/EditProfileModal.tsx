import React, { useEffect, useMemo, useState } from 'react'
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
import { UserInfo } from '../../types/interfaces'
import { auth, db, storage } from '../../services/firebase'
import { updateProfile } from 'firebase/auth'
import { collection, doc, getDocs, query, updateDoc, where, deleteField } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

interface Props {
  isOpen: boolean
  onClose: () => void
  user: UserInfo
}

const EditProfileModal: React.FC<Props> = ({ isOpen, onClose, user }) => {
  const toast = useToast()
  const [fullName, setFullName] = useState(user.fullName || '')
  const [bio, setBio] = useState(user.bio || '')
  const [username, setUsername] = useState(user.username)
  const [birthday, setBirthday] = useState(user.birthday || '')
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  const calculateAge = (dateStr: string) => {
    const d = new Date(dateStr)
    if (Number.isNaN(d.getTime())) return NaN
    const today = new Date()
    let age = today.getFullYear() - d.getFullYear()
    const m = today.getMonth() - d.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--
    return age
  }

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
    if (!auth.currentUser) return
    setSaving(true)
    try {
      const trimmedUsername = username.trim()
      if (!/^([a-zA-Z0-9_.-]){3,20}$/.test(trimmedUsername)) {
        throw new Error('Username non valido. Usa 3-20 caratteri consentiti.')
      }
      const usernameLowercase = trimmedUsername.toLowerCase()
      if (usernameLowercase !== (user.usernameLowercase || user.username.toLowerCase())) {
        // controlla unicità
        const snap = await getDocs(
          query(collection(db, 'users'), where('usernameLowercase', '==', usernameLowercase))
        )
        if (!snap.empty) throw new Error('Username già in uso.')
      }

      let profilePicUrl = user.profilePic || ''
      if (profilePicFile) {
        const fileRef = ref(storage, `profilePics/${user.uid}/${profilePicFile.name}`)
        await uploadBytes(fileRef, profilePicFile)
        profilePicUrl = await getDownloadURL(fileRef)
      }

      // Prepara il payload di update
      const payload: Record<string, unknown> = {
        fullName: fullName.trim() || null,
        bio: bio.trim() || '',
        username: trimmedUsername,
        usernameLowercase,
        profilePic: profilePicUrl || null,
      }

      // Validazione birthday: opzionale, ma se presente deve avere età >= 13 e non essere futura
      if (birthday) {
        const age = calculateAge(birthday)
        if (Number.isNaN(age)) throw new Error('Data di compleanno non valida.')
        if (age < 13) throw new Error('Devi avere almeno 13 anni.')
        const max = new Date().toISOString().split('T')[0]
        if (birthday > max) throw new Error('La data di compleanno non può essere nel futuro.')
        payload.birthday = birthday
      } else {
        payload.birthday = deleteField()
      }

      await updateDoc(doc(db, 'users', user.uid), payload)

      await updateProfile(auth.currentUser, {
        displayName: trimmedUsername,
        photoURL: profilePicUrl || undefined,
      })

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
            <Input type="file" accept="image/*" onChange={onFileChange} />
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

export default EditProfileModal

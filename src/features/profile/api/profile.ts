import { auth, db, storage } from '@services/firebase'
import { updateProfile } from 'firebase/auth'
import { deleteField, doc, updateDoc, type FieldValue } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import type { UserInfo } from '@models/interfaces'
import { ensureUsernameAvailable } from '@/lib/users'

function calculateAge(dateStr: string): number {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return NaN
  const today = new Date()
  let age = today.getFullYear() - d.getFullYear()
  const m = today.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--
  return age
}

export async function updateUserProfile(params: {
  current: UserInfo
  updates: {
    username: string
    fullName?: string
    bio?: string
    birthday?: string
    profilePicFile?: File | null
  }
}): Promise<UserInfo> {
  const { current, updates } = params
  if (!auth.currentUser) throw new Error('Utente non autenticato')

  const trimmedUsername = updates.username.trim()
  if (!/^([a-zA-Z0-9_.-]){3,20}$/.test(trimmedUsername)) {
    throw new Error('Username non valido. Usa 3-20 caratteri consentiti.')
  }

  const usernameLowercase = trimmedUsername.toLowerCase()
  if (usernameLowercase !== (current.usernameLowercase || current.username.toLowerCase())) {
    const available = await ensureUsernameAvailable(usernameLowercase)
    if (!available) throw new Error('Username già in uso.')
  }

  let profilePicUrl = current.profilePic || ''
  if (updates.profilePicFile) {
    const fileRef = ref(storage, `profilePics/${current.uid}/${updates.profilePicFile.name}`)
    await uploadBytes(fileRef, updates.profilePicFile)
    profilePicUrl = await getDownloadURL(fileRef)
  }

  // Validazione birthday: opzionale, ma se presente deve avere età >= 13 e non essere futura
  let birthdayUpdate: string | FieldValue | undefined
  if (updates.birthday) {
    const age = calculateAge(updates.birthday)
    if (Number.isNaN(age)) throw new Error('Data di compleanno non valida.')
    if (age < 13) throw new Error('Devi avere almeno 13 anni.')
    const max = new Date().toISOString().split('T')[0]
    if (updates.birthday > max) throw new Error('La data di compleanno non può essere nel futuro.')
    birthdayUpdate = updates.birthday
  } else if (updates.birthday === '') {
    // quando viene svuotata nel form
    birthdayUpdate = deleteField()
  }

  // Applica update su Firestore
  const userRef = doc(db, 'users', current.uid)
  const firestorePayload: {
    bio: string
    username: string
    usernameLowercase: string
    fullName?: string
    profilePic?: string
    birthday?: string | import('firebase/firestore').FieldValue
  } = {
    bio: (updates.bio || '').trim(),
    username: trimmedUsername,
    usernameLowercase,
  }
  const fn = (updates.fullName || '').trim()
  firestorePayload.fullName = fn ? fn : (deleteField() as unknown as undefined)
  firestorePayload.profilePic = profilePicUrl
    ? profilePicUrl
    : (deleteField() as unknown as undefined)
  if (birthdayUpdate !== undefined) firestorePayload.birthday = birthdayUpdate
  await updateDoc(userRef, firestorePayload)

  // Aggiorna profilo Auth
  await updateProfile(auth.currentUser, {
    displayName: trimmedUsername,
    photoURL: profilePicUrl || undefined,
  })

  const updated: UserInfo = {
    ...current,
    username: trimmedUsername,
    usernameLowercase,
    fullName: fn || undefined,
    bio: (updates.bio || '').trim(),
    birthday: typeof birthdayUpdate === 'string' ? birthdayUpdate : undefined,
    profilePic: profilePicUrl || undefined,
  }
  return updated
}

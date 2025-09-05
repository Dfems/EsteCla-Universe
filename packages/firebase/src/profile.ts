import { updateProfile } from 'firebase/auth'
import { deleteField, doc, updateDoc, type FieldValue } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import type { UserInfo } from '@estecla/types'
import { ensureUsernameAvailable } from './users'
import { getServices } from './sdk'

function calculateAge(dateStr: string): number {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return NaN
  const today = new Date()
  let age = today.getFullYear() - d.getFullYear()
  const m = today.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--
  return age
}

function requireAuth() {
  const { auth } = getServices()
  const u = auth.currentUser
  if (!u) throw new Error('Utente non autenticato')
  return u
}

function validateAndNormalizeUsername(username: string): { trimmed: string; lowercase: string } {
  const trimmed = username.trim()
  if (!/^([a-zA-Z0-9_.-]){3,20}$/.test(trimmed)) {
    throw new Error('Username non valido. Usa 3-20 caratteri consentiti.')
  }
  return { trimmed, lowercase: trimmed.toLowerCase() }
}

async function ensureUsernameIfChanged(
  current: UserInfo,
  usernameLowercase: string
): Promise<void> {
  const { db } = getServices()
  const currentLower = current.usernameLowercase || current.username.toLowerCase()
  if (usernameLowercase !== currentLower) {
    const available = await ensureUsernameAvailable(db, usernameLowercase)
    if (!available) throw new Error('Username già in uso.')
  }
}

async function maybeUploadProfilePic(uid: string, file?: File | null): Promise<string> {
  const { storage } = getServices()
  if (!file) return ''
  const fileRef = ref(storage, `profilePics/${uid}/${file.name}`)
  await uploadBytes(fileRef, file)
  return getDownloadURL(fileRef)
}

function computeBirthdayUpdate(birthday?: string): string | FieldValue | undefined {
  if (birthday === undefined) return undefined
  if (birthday === '') return deleteField()
  const age = calculateAge(birthday)
  if (Number.isNaN(age)) throw new Error('Data di compleanno non valida.')
  if (age < 13) throw new Error('Devi avere almeno 13 anni.')
  const max = new Date().toISOString().split('T')[0]
  if (birthday > max) throw new Error('La data di compleanno non può essere nel futuro.')
  return birthday
}

function cleanString(v?: string): string {
  return (v || '').trim()
}

function valueOrDelete<T extends string>(value?: T): T | undefined {
  const v = (value || '').toString().trim()
  return v ? (v as T) : (deleteField() as unknown as undefined)
}

function buildFirestorePayload(args: {
  bio: string | undefined
  username: string
  usernameLowercase: string
  fullName?: string
  profilePic?: string
  birthday?: string | FieldValue | undefined
}) {
  const { bio, username, usernameLowercase, fullName, profilePic, birthday } = args
  const payload: {
    bio: string
    username: string
    usernameLowercase: string
    fullName?: string
    profilePic?: string
    birthday?: string | FieldValue
  } = {
    bio: cleanString(bio),
    username,
    usernameLowercase,
  }
  payload.fullName = valueOrDelete(fullName)
  payload.profilePic = valueOrDelete(profilePic)
  if (birthday !== undefined) payload.birthday = birthday
  return payload
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
  const authUser = requireAuth()
  const { db } = getServices()

  const { trimmed, lowercase } = validateAndNormalizeUsername(updates.username)
  await ensureUsernameIfChanged(current, lowercase)

  const uploadedPic = await maybeUploadProfilePic(current.uid, updates.profilePicFile)
  const profilePicUrl = uploadedPic || current.profilePic || ''

  const birthdayUpdate = computeBirthdayUpdate(updates.birthday)

  const userRef = doc(db, 'users', current.uid)
  const payload = buildFirestorePayload({
    bio: updates.bio,
    username: trimmed,
    usernameLowercase: lowercase,
    fullName: updates.fullName,
    profilePic: profilePicUrl,
    birthday: birthdayUpdate,
  })
  await updateDoc(userRef, payload)

  await updateProfile(authUser, {
    displayName: trimmed,
    photoURL: profilePicUrl || undefined,
  })

  const updated: UserInfo = {
    ...current,
    username: trimmed,
    usernameLowercase: lowercase,
    fullName: cleanString(updates.fullName) || undefined,
    bio: cleanString(updates.bio),
    birthday: typeof birthdayUpdate === 'string' ? birthdayUpdate : undefined,
    profilePic: profilePicUrl || undefined,
  }
  return updated
}

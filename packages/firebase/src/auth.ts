import type { Auth, User } from 'firebase/auth'
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
} from 'firebase/auth'
import type { Firestore } from 'firebase/firestore'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import type { FirebaseStorage } from 'firebase/storage'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import type { UserInfo } from '@estecla/types'
import { ensureUsernameAvailable, pickAvailableUsername } from './users'
import { googleProvider, getServices } from './sdk'

const USERS_COLLECTION = 'users'

export async function loginWithEmailPassword(
  services: { auth: Auth; db: Firestore },
  email: string,
  password: string
): Promise<User> {
  const userCred = await signInWithEmailAndPassword(services.auth, email, password)
  const userDocRef = doc(services.db, USERS_COLLECTION, userCred.user.uid)
  const snap = await getDoc(userDocRef)
  if (!snap.exists()) {
    // Logout for safety if profile doc missing
    await services.auth.signOut()
    throw new Error('Account non registrato. Registrati prima di accedere.')
  }
  return userCred.user
}

// Service injection version (for backwards compatibility)
export async function loginWithGoogleAndEnsureUser(
  services: { auth: Auth; db: Firestore }
): Promise<User> {
  const userCred = await signInWithPopup(services.auth, googleProvider)
  const firebaseUser = userCred.user
  const userDocRef = doc(services.db, USERS_COLLECTION, firebaseUser.uid)
  const snap = await getDoc(userDocRef)
  if (!snap.exists()) {
    const base = (firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'user') as string
    const username = await pickAvailableUsername(services.db, base)
    const usernameLowercase = username.toLowerCase()
    await updateProfile(firebaseUser, {
      displayName: username,
      photoURL: firebaseUser.photoURL || undefined,
    })
    const newUser: UserInfo = {
      uid: firebaseUser.uid,
      username,
      usernameLowercase,
      fullName: firebaseUser.displayName || undefined,
      profilePic: firebaseUser.photoURL || undefined,
      bio: '',
      followers: [],
      following: [],
      email: firebaseUser.email || undefined,
    }
    await setDoc(userDocRef, newUser)
  }
  return firebaseUser
}

// Simplified version that matches main branch exactly
export async function loginWithGoogleDirect(): Promise<User> {
  console.log('🚀 Starting Google login with direct approach')
  try {
    const { auth, db } = getServices()
    console.log('✅ Got Firebase services:', { auth: !!auth, db: !!db })
    console.log('🔧 Auth config:', { projectId: auth.app.options.projectId })
    console.log('🔑 Google provider ready:', { providerId: googleProvider.providerId })
    
    console.log('🔑 Starting Google popup sign-in')
    const userCred = await signInWithPopup(auth, googleProvider)
    console.log('✅ Google sign-in successful, user:', userCred.user.email)
    
    const firebaseUser = userCred.user
    const userDocRef = doc(db, USERS_COLLECTION, firebaseUser.uid)
    const snap = await getDoc(userDocRef)
    
    if (!snap.exists()) {
      console.log('👤 Creating new user profile')
      const base = (firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'user') as string
      const username = await pickAvailableUsername(db, base)
      const usernameLowercase = username.toLowerCase()
      await updateProfile(firebaseUser, {
        displayName: username,
        photoURL: firebaseUser.photoURL || undefined,
      })
      const newUser: UserInfo = {
        uid: firebaseUser.uid,
        username,
        usernameLowercase,
        fullName: firebaseUser.displayName || undefined,
        profilePic: firebaseUser.photoURL || undefined,
        bio: '',
        followers: [],
        following: [],
        email: firebaseUser.email || undefined,
      }
      await setDoc(userDocRef, newUser)
      console.log('✅ New user profile created:', username)
    } else {
      console.log('✅ Existing user found')
    }
    
    console.log('🎉 Google login completed successfully')
    return firebaseUser
  } catch (error) {
    console.error('❌ Google login failed:', error)
    console.error('❌ Error details:', {
      code: (error as any)?.code,
      message: (error as any)?.message,
      stack: (error as any)?.stack
    })
    throw error
  }
}

export async function registerWithEmailPassword(
  services: { auth: Auth; db: Firestore; storage: FirebaseStorage },
  params: {
    email: string
    password: string
    username: string
    fullName?: string
    birthday?: string
    profilePicFile?: File | null
  }
): Promise<UserInfo> {
  const { email, password, username, fullName, birthday, profilePicFile } = params
  const trimmedUsername = username.trim()
  if (!/^([a-zA-Z0-9_.-]){3,20}$/.test(trimmedUsername)) {
    throw new Error(
      'Username non valido. Usa 3-20 caratteri alfanumerici, punto, trattino o underscore.'
    )
  }

  const usernameLowercase = trimmedUsername.toLowerCase()
  if (!(await ensureUsernameAvailable(services.db, usernameLowercase))) {
    throw new Error('Username già in uso. Scegline un altro.')
  }

  const userCred = await createUserWithEmailAndPassword(services.auth, email, password)
  const firebaseUser = userCred.user

  let profilePicURL = ''
  if (profilePicFile) {
    const fileRef = ref(services.storage, `profilePics/${firebaseUser.uid}/${profilePicFile.name}`)
    await uploadBytes(fileRef, profilePicFile)
    profilePicURL = await getDownloadURL(fileRef)
  }

  await updateProfile(firebaseUser, {
    displayName: trimmedUsername,
    photoURL: profilePicURL || undefined,
  })

  const userData: UserInfo = {
    uid: firebaseUser.uid,
    username: trimmedUsername,
    usernameLowercase,
    fullName: fullName?.trim() || undefined,
    birthday: birthday || undefined,
    profilePic: profilePicURL || undefined,
    bio: '',
    followers: [],
    following: [],
    email: firebaseUser.email || undefined,
  }

  await setDoc(doc(services.db, USERS_COLLECTION, firebaseUser.uid), userData)
  return userData
}

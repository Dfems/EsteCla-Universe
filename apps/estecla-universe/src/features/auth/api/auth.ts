import {
  loginWithEmailPassword as coreLoginWithEmailPassword,
  loginWithGoogleDirect,
  registerWithEmailPassword as coreRegisterWithEmailPassword,
} from '@estecla/firebase'
import type { UserInfo } from '@estecla/types'
import { auth, db, storage } from '@services/firebase'
import type { User } from 'firebase/auth'

export async function loginWithEmailPassword(email: string, password: string): Promise<User> {
  return coreLoginWithEmailPassword({ auth, db }, email, password)
}

export async function loginWithGoogleAndEnsureUser(): Promise<User> {
  return loginWithGoogleDirect()
}

export async function registerWithEmailPassword(params: {
  email: string
  password: string
  username: string
  fullName?: string
  birthday?: string
  profilePicFile?: File | null
}): Promise<UserInfo> {
  return coreRegisterWithEmailPassword({ auth, db, storage }, params)
}

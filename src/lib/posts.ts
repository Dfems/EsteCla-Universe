import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db, storage } from '@services/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export interface NewPostInput {
  uid: string
  file: File
  caption?: string
}

export async function uploadImageAndCreatePost({ uid, file, caption }: NewPostInput) {
  const path = `uploads/${uid}/${Date.now()}-${file.name}`
  const fileRef = ref(storage, path)
  await uploadBytes(fileRef, file)
  const imageUrl = await getDownloadURL(fileRef)

  await addDoc(collection(db, 'users', uid, 'posts'), {
    imageUrl,
    caption: caption?.trim() || '',
    createdAt: serverTimestamp(),
  })

  return { imageUrl }
}

import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db, storage } from '@services/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export interface NewPostInput {
  uid: string
  file: File
  caption?: string
  imageDateISO?: string
  sameAsPublish?: boolean
}

export async function uploadImageAndCreatePost({
  uid,
  file,
  caption,
  imageDateISO,
  sameAsPublish,
}: NewPostInput) {
  const path = `uploads/${uid}/${Date.now()}-${file.name}`
  const fileRef = ref(storage, path)
  await uploadBytes(fileRef, file)
  const imageUrl = await getDownloadURL(fileRef)

  // Prepare timestamps
  const publishAt = serverTimestamp()
  // If sameAsPublish is true or imageDateISO is missing, store server timestamp; otherwise store a Date from the provided ISO string
  const imageAt = sameAsPublish || !imageDateISO ? serverTimestamp() : new Date(imageDateISO)

  await addDoc(collection(db, 'users', uid, 'posts'), {
    imageUrl,
    caption: caption?.trim() || '',
    // Keep createdAt for backward compatibility (Home ordering), equal to publishAt
    createdAt: publishAt,
    publishAt,
    imageAt,
  })

  return { imageUrl }
}

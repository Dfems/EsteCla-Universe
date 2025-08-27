import { addDoc, collection, serverTimestamp, type Firestore } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, type FirebaseStorage } from 'firebase/storage'

export interface NewPostInput {
  uid: string
  file: File
  caption?: string
  imageDateISO?: string
  sameAsPublish?: boolean
}

export async function uploadImageAndCreatePost(
  services: { db: Firestore; storage: FirebaseStorage },
  { uid, file, caption, imageDateISO, sameAsPublish }: NewPostInput
) {
  const { db, storage } = services
  const path = `uploads/${uid}/${Date.now()}-${file.name}`
  const fileRef = ref(storage, path)
  await uploadBytes(fileRef, file)
  const imageUrl = await getDownloadURL(fileRef)

  const publishAt = serverTimestamp()
  const imageAt = sameAsPublish || !imageDateISO ? serverTimestamp() : new Date(imageDateISO)

  await addDoc(collection(db, 'users', uid, 'posts'), {
    ownerUid: uid,
    imageUrl,
    caption: caption?.trim() || '',
    createdAt: publishAt,
    publishAt,
    imageAt,
  })

  return { imageUrl }
}

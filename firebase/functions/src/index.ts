import { onDocumentCreated, onDocumentDeleted } from 'firebase-functions/v2/firestore'
import { setGlobalOptions } from 'firebase-functions/v2'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

// Inizializza Admin SDK (una sola volta)
initializeApp()
const db = getFirestore()

// Imposta regione di default per tutte le functions
setGlobalOptions({ region: 'us-central1' })

async function createFollowNotification(targetUid: string, fromUid: string) {
  await db.collection('users').doc(targetUid).collection('notifications').add({
    type: 'follow',
    fromUid,
    createdAt: FieldValue.serverTimestamp(),
    read: false,
  })
}

// Quando A segue B: crea mirror in B/followers/A e aggiorna contatori; invia notifica
export const onFollowingCreated = onDocumentCreated(
  'users/{followerUid}/following/{followedUid}',
  async (event: { params: { followerUid: string; followedUid: string } }) => {
    const { followerUid, followedUid } = event.params as {
      followerUid: string
      followedUid: string
    }

    const followerRef = db
      .collection('users')
      .doc(followedUid)
      .collection('followers')
      .doc(followerUid)

    const batch = db.batch()
    batch.set(followerRef, { createdAt: FieldValue.serverTimestamp() }, { merge: true })

    const followerUserRef = db.collection('users').doc(followedUid)
    const followingUserRef = db.collection('users').doc(followerUid)
    batch.set(followerUserRef, { followersCount: FieldValue.increment(1) }, { merge: true })
    batch.set(followingUserRef, { followingCount: FieldValue.increment(1) }, { merge: true })

    await batch.commit()

    try {
      await createFollowNotification(followedUid, followerUid)
    } catch (e) {
      console.error('Failed to create follow notification', e)
    }
  }
)

// Quando A smette di seguire B: rimuovi mirror e aggiorna contatori
export const onFollowingDeleted = onDocumentDeleted(
  'users/{followerUid}/following/{followedUid}',
  async (event: { params: { followerUid: string; followedUid: string } }) => {
    const { followerUid, followedUid } = event.params as {
      followerUid: string
      followedUid: string
    }

    const followerRef = db
      .collection('users')
      .doc(followedUid)
      .collection('followers')
      .doc(followerUid)

    const batch = db.batch()
    batch.delete(followerRef)

    const followerUserRef = db.collection('users').doc(followedUid)
    const followingUserRef = db.collection('users').doc(followerUid)
    batch.set(followerUserRef, { followersCount: FieldValue.increment(-1) }, { merge: true })
    batch.set(followingUserRef, { followingCount: FieldValue.increment(-1) }, { merge: true })

    await batch.commit()
  }
)

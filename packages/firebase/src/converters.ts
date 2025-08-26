import type {
  FirestoreDataConverter,
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore'
import type { Post, UserInfo } from '@estecla/types'

export const userConverter: FirestoreDataConverter<UserInfo> = {
  toFirestore(user: UserInfo): DocumentData {
    return user as unknown as DocumentData
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): UserInfo {
    const data = snapshot.data(options) as DocumentData
    return { ...(data as UserInfo), uid: snapshot.id }
  },
}

export const postConverter: FirestoreDataConverter<Post> = {
  toFirestore(post: Post): DocumentData {
    return post as unknown as DocumentData
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Post {
    const data = snapshot.data(options) as DocumentData
    return { ...(data as Post), id: snapshot.id }
  },
}

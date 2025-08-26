export interface UserInfo {
  uid: string
  username: string
  usernameLowercase?: string
  fullName?: string
  profilePic?: string
  bio?: string
  followers?: string[]
  following?: string[]
  followersCount?: number
  followingCount?: number
  email?: string
  birthday?: string
}
export interface Post {
  id: string
  imageUrl: string
  caption: string
  timestamp?: Date
  createdAt?: Date
  publishAt?: Date
  imageAt?: Date
}
export interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

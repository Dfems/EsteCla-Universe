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
  // Optional birthday stored as ISO date string (YYYY-MM-DD)
  birthday?: string
}

export interface Post {
  id: string
  imageUrl: string
  caption: string
  // Per compatibilità storica (Home iniziale)
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

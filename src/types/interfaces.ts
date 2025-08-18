export interface UserInfo {
  uid: string
  username: string
  usernameLowercase?: string
  fullName?: string
  profilePic?: string
  bio?: string
  followers?: string[]
  following?: string[]
  email?: string
  // Optional birthday stored as ISO date string (YYYY-MM-DD)
  birthday?: string
}

export interface Post {
  id: string
  imageUrl: string
  caption: string
  timestamp: Date
}

export interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

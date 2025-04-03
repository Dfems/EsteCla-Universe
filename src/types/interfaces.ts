export interface UserInfo {
  uid: string
  username: string
  fullName?: string
  profilePic?: string
  bio?: string
  followers?: string[]
  following?: string[]
}

export interface Post {
  id: string
  imageUrl: string
  caption: string
  timestamp: Date
}

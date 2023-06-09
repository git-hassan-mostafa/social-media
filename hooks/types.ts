import { Session } from "next-auth"

export interface Post {
  comments: {
    id?:string,
    text: string,
    user: {
      id:string,
      email: string,
      name: string,
      photo: string
    }
  }[],
  createdAt: string
  likes: number
  photo: string
  text: string
  user: {
    email: string
    name: string
    photo: string
    _id: string
  },
  profile?: boolean,
  _id: string,
  onDelete?: () => void,
  onEdit?: () => void
}

export type User = {

}

export interface UserSession extends Session {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
    id?: string | null
    likedPost?: Post[] | null
    savedPost?: Post[] | null
  }
}

export type SessionType = {
  data: UserSession | null,
  status: "authenticated" | "loading" | "unauthenticated"
}

export interface profileProps {
  _id: string | null | undefined,
  name: string | null | undefined,
  email: string | null | undefined,
  photo: string | null | undefined,
}
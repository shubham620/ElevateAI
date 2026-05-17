import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string
      role?: string
      department?: string
    }
  }

  interface User {
    id: string
    role?: string
    department?: string
  }
}

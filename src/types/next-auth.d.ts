import { Account as PrismaAccount, User as PrismaUser } from '@/generated/prisma/client'
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: UserSession
  }

  interface UserSession
    extends Pick<PrismaAccount, 'id' | 'userId' | 'role' | 'organizationVersionId'>,
      Pick<PrismaUser, 'firstName' | 'lastName' | 'level'> {
    email: PrismaUser['email']
    accountId: string
    organizationId: string | null
    needsAccountSelection?: boolean
  }

  interface User extends DefaultUser {
    userId?: string
    accountId?: string
    needsAccountSelection?: boolean
  }
}

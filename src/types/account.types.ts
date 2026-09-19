import { type Account, type User } from '@/generated/prisma/client'

export type AccountWithUser = Account & {
  user: User
  organizationVersion: { organizationId: string }
}

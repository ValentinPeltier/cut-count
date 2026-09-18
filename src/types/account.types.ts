import { type Account, type User } from '@/db-common'

export type AccountWithUser = Account & {
  user: User
  organizationVersion: { organizationId: string }
}

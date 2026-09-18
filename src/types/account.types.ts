import { type Account, type User, Environment } from '@/db-common'

export type AccountWithUser = Account & {
  user: User
  organizationVersion: { organizationId: string; environment: Environment }
}

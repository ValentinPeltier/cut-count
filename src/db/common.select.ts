import { Prisma } from '@/db-common'

const baseUserInfoSelect = {
  user: {
    select: {
      email: true,
      firstName: true,
      lastName: true,
      level: true,
      updatedAt: true,
    },
  },
  status: true,
  role: true,
  updatedAt: true,
} satisfies Prisma.AccountSelect

export const findAccountSelect = (extra?: Prisma.AccountSelect): Prisma.AccountSelect => ({
  ...baseUserInfoSelect,
  ...(extra || {}),
})

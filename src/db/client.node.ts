import { PrismaClient } from '@/generated/prisma/client'
import { createPrismaMariaDbAdapter } from './prismaMariaDbAdapter'

const adapter = createPrismaMariaDbAdapter()

export const prismaClient = new PrismaClient({
  adapter,
  omit: {
    user: { password: true, resetToken: true },
  },
}) as PrismaClient

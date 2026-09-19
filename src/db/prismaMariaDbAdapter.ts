import { PrismaMariaDb } from '@prisma/adapter-mariadb'

export const createPrismaMariaDbAdapter = (connectionString = process.env.DATABASE_URL) => {
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set')
  }

  return new PrismaMariaDb(connectionString)
}

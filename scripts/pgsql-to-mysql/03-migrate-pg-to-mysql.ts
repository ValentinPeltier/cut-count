import { createPrismaMariaDbAdapter } from '@/db/prismaMariaDbAdapter'
import { PrismaClient } from '@/generated/prisma/client'
import 'dotenv/config'
import { execSync } from 'node:child_process'
import pg from 'pg'

const BATCH_SIZE = 500

const pgRowToCamel = (row: Record<string, unknown>): Record<string, unknown> => {
  const mapped: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(row)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase())
    mapped[camelKey] = value
  }
  return mapped
}

const chunk = <T>(items: T[], size: number): T[][] => {
  const chunks: T[][] = []
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size))
  }
  return chunks
}

const copyTable = async (
  pool: pg.Pool,
  tableName: string,
  insertBatch: (rows: Record<string, unknown>[]) => Promise<void>,
  transform?: (row: Record<string, unknown>) => Record<string, unknown> | null,
) => {
  const { rows } = await pool.query<Record<string, unknown>>(`SELECT * FROM "${tableName}"`)
  const mapped = rows
    .map((row) => (transform ? transform(row) : pgRowToCamel(row)))
    .filter((row): row is Record<string, unknown> => row !== null)

  for (const batch of chunk(mapped, BATCH_SIZE)) {
    if (batch.length > 0) {
      await insertBatch(batch)
    }
  }

  console.log(`Copied ${mapped.length} rows from ${tableName}`)
  return mapped.length
}

const main = async () => {
  const sourceUrl = process.env.SOURCE_DATABASE_URL
  if (!sourceUrl) {
    throw new Error('SOURCE_DATABASE_URL must point to the migrated PostgreSQL database')
  }
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must point to the target MySQL database')
  }

  console.log('Applying MySQL migrations...')
  execSync('npx prisma migrate deploy', { stdio: 'inherit' })

  const pool = new pg.Pool({ connectionString: sourceUrl })
  const prisma = new PrismaClient({ adapter: createPrismaMariaDbAdapter() }) as PrismaClient

  try {
    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0')

    const truncateOrder = [
      'situations',
      'users_on_study',
      'study_emission_factor_versions',
      'opening_hours',
      'study_sites',
      'studies',
      'emission_factor_part_metadata',
      'emission_factor_parts',
      'emission_metadata',
      'emission_factor_versions',
      'emission_factor_sub_posts',
      'emission_factors',
      'emission_factor_import_version',
      'sites',
      'cncs',
      'cnc_versions',
      'user_application_settings',
      'accounts',
      'users',
      'organization_versions',
      'organizations',
    ]

    for (const table of truncateOrder) {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE \`${table}\``)
    }

    const counts: Record<string, number> = {}

    counts.organizations = await copyTable(pool, 'organizations', (rows) =>
      prisma.organization.createMany({ data: rows as never[] }),
    )
    counts.organization_versions = await copyTable(pool, 'organization_versions', (rows) =>
      prisma.organizationVersion.createMany({ data: rows as never[] }),
    )
    counts.users = await copyTable(pool, 'users', (rows) => prisma.user.createMany({ data: rows as never[] }))
    counts.accounts = await copyTable(pool, 'accounts', (rows) => prisma.account.createMany({ data: rows as never[] }))
    counts.user_application_settings = await copyTable(pool, 'user_application_settings', (rows) =>
      prisma.userApplicationSettings.createMany({ data: rows as never[] }),
    )
    counts.cnc_versions = await copyTable(pool, 'cnc_versions', (rows) =>
      prisma.cncVersion.createMany({ data: rows as never[] }),
    )
    counts.cncs = await copyTable(pool, 'cncs', (rows) => prisma.cnc.createMany({ data: rows as never[] }))
    counts.sites = await copyTable(pool, 'sites', (rows) => prisma.site.createMany({ data: rows as never[] }))
    counts.emission_factor_import_version = await copyTable(pool, 'emission_factor_import_version', (rows) =>
      prisma.emissionFactorImportVersion.createMany({ data: rows as never[] }),
    )

    const emissionFactorSubPosts: { emissionFactorId: string; subPost: string }[] = []
    counts.emission_factors = await copyTable(
      pool,
      'emission_factors',
      (rows) => prisma.emissionFactor.createMany({ data: rows as never[] }),
      (row) => {
        const subPosts = row.sub_posts as string[] | null
        if (subPosts?.length) {
          for (const subPost of subPosts) {
            emissionFactorSubPosts.push({ emissionFactorId: row.id as string, subPost })
          }
        }
        const rest = { ...row }
        delete rest.sub_posts
        return pgRowToCamel(rest)
      },
    )

    for (const batch of chunk(emissionFactorSubPosts, BATCH_SIZE)) {
      await prisma.emissionFactorSubPost.createMany({ data: batch as never[] })
    }
    counts.emission_factor_sub_posts = emissionFactorSubPosts.length
    console.log(`Copied ${emissionFactorSubPosts.length} rows from emission_factor_sub_posts`)

    counts.emission_factor_versions = await copyTable(pool, 'emission_factor_versions', (rows) =>
      prisma.emissionFactorVersion.createMany({ data: rows as never[] }),
    )
    counts.emission_metadata = await copyTable(pool, 'emission_metadata', (rows) =>
      prisma.emissionFactorMetaData.createMany({ data: rows as never[] }),
    )
    counts.emission_factor_parts = await copyTable(pool, 'emission_factor_parts', (rows) =>
      prisma.emissionFactorPart.createMany({ data: rows as never[] }),
    )
    counts.emission_factor_part_metadata = await copyTable(pool, 'emission_factor_part_metadata', (rows) =>
      prisma.emissionFactorPartMetaData.createMany({ data: rows as never[] }),
    )
    counts.studies = await copyTable(pool, 'studies', (rows) => prisma.study.createMany({ data: rows as never[] }))
    counts.study_sites = await copyTable(pool, 'study_sites', (rows) =>
      prisma.studySite.createMany({ data: rows as never[] }),
    )
    counts.opening_hours = await copyTable(pool, 'opening_hours', (rows) =>
      prisma.openingHours.createMany({ data: rows as never[] }),
    )
    counts.study_emission_factor_versions = await copyTable(pool, 'study_emission_factor_versions', (rows) =>
      prisma.studyEmissionFactorVersion.createMany({ data: rows as never[] }),
    )
    counts.users_on_study = await copyTable(pool, 'users_on_study', (rows) =>
      prisma.userOnStudy.createMany({ data: rows as never[] }),
    )
    counts.situations = await copyTable(pool, 'situations', (rows) =>
      prisma.situation.createMany({ data: rows as never[] }),
    )

    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1')

    console.log('\nRow counts copied:')
    for (const [table, count] of Object.entries(counts)) {
      console.log(`  ${table}: ${count}`)
    }

    const pgSubPostCount = (
      await pool.query<{ count: string }>(
        `SELECT COALESCE(SUM(cardinality(sub_posts)), 0)::text AS count FROM emission_factors`,
      )
    ).rows[0]?.count

    const mysqlSubPostCount = await prisma.emissionFactorSubPost.count()
    if (pgSubPostCount !== String(mysqlSubPostCount)) {
      throw new Error(`SubPost junction row mismatch: PostgreSQL=${pgSubPostCount}, MySQL=${mysqlSubPostCount}`)
    }

    console.log('SubPost junction verification passed.')
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

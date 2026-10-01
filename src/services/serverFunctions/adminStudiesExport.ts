'use server'

import { findAllStudySitesForAdminExport } from '@/db/adminStudiesExport'
import { NOT_AUTHORIZED } from '@/lib/services/permissions/check'
import { buildAdminStudiesExportSheet } from '@/services/adminStudiesExport/buildAdminStudiesExportSheet'
import { writeAdminStudiesExportWorkbook } from '@/services/adminStudiesExport/writeAdminStudiesExportWorkbook'
import { dbActualizedAuth } from '@/services/auth'
import { withServerResponse } from '@/utils/serverResponse'
import { isSuperAdmin } from '@/utils/user'
import { getTranslations } from 'next-intl/server'

export const exportAdminStudiesExcel = async () =>
  withServerResponse('exportAdminStudiesExcel', async () => {
    const session = await dbActualizedAuth()
    if (!session?.user || !isSuperAdmin(session.user.role)) {
      throw new Error(NOT_AUTHORIZED)
    }

    const sites = await findAllStudySitesForAdminExport()
    const tPost = await getTranslations('emissionFactors.post')
    const tAdmin = await getTranslations('adminPanel')
    const sheet = buildAdminStudiesExportSheet(sites, (key) => tPost(key))
    const buffer = await writeAdminStudiesExportWorkbook(sheet)

    return {
      xlsxBuffer: Array.from(new Uint8Array(buffer)),
      filename: tAdmin('exportStudiesFilename'),
    }
  })

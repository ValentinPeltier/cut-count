import { ADMIN_STUDIES_EXPORT_ROWS } from '@/constants/adminStudiesExport'
import { StudyResultUnit } from '@/generated/prisma/enums'
import JSZip from 'jszip'
import { buildAdminStudiesExportSheet } from './buildAdminStudiesExportSheet'
import type { AdminExportStudySite } from './types'
import { columnAWidth, writeAdminStudiesExportWorkbook } from './writeAdminStudiesExportWorkbook'

const site: AdminExportStudySite = {
  id: 'site-1',
  numberOfSessions: null,
  numberOfTickets: null,
  numberOfOpenDays: null,
  distanceToParis: null,
  situation: null,
  site: { name: 'Alpha', cnc: null },
  study: {
    name: 'Count golden study',
    resultsUnit: StudyResultUnit.T,
    createdBy: { user: { email: 'author@yopmail.com' } },
  },
}

const cellStyle = (sheetXml: string, address: string) => {
  const match = sheetXml.match(new RegExp(`<c r="${address}"(?: s="(\\d+)")?`))
  return match?.[1]
}

describe('writeAdminStudiesExportWorkbook', () => {
  it('applies bold, italic and indent on column A and fits its width', async () => {
    const sheet = buildAdminStudiesExportSheet([site], (key) => key)
    const buffer = await writeAdminStudiesExportWorkbook(sheet)
    const zip = await JSZip.loadAsync(buffer)
    const sheetXml = await zip.file('xl/worksheets/sheet1.xml')!.async('string')
    const stylesXml = await zip.file('xl/styles.xml')!.async('string')
    const workbookXml = await zip.file('xl/workbook.xml')!.async('string')

    expect(workbookXml).toContain('name="Sheet1"')

    expect(sheetXml).toContain('<v>Données générales</v>')
    expect(cellStyle(sheetXml, 'A2')).toBe('1')
    expect(cellStyle(sheetXml, 'A14')).toBe('1')
    expect(cellStyle(sheetXml, 'A48')).toBe('1')
    expect(cellStyle(sheetXml, 'A50')).toBe('3')
    expect(stylesXml).toContain('<b/>')
    expect(stylesXml).toContain('<i/>')
    expect(stylesXml).toContain('indent="1"')

    const longestLabel = 'Newsletters envoyées (nb de news * nb de personnes) (u)'
    const width = columnAWidth(ADMIN_STUDIES_EXPORT_ROWS)
    expect(width).toBeGreaterThanOrEqual(longestLabel.length)
    expect(sheetXml).toContain(`width="${width}`)
  })
})

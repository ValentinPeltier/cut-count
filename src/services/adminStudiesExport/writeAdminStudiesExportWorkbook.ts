import {
  ADMIN_STUDIES_EXPORT_ROWS,
  type AdminExportTextStyle,
  type AdminStudiesExportRow,
} from '@/constants/adminStudiesExport'
import JSZip from 'jszip'
import xlsx from 'node-xlsx'
import type { AdminStudiesExportSheet } from './buildAdminStudiesExportSheet'

const COLUMN_WIDTH_PADDING = 2
const INDENT_EXTRA_WIDTH = 2

const STYLE_INDEX: Record<AdminExportTextStyle, number> = {
  bold: 1,
  italic: 2,
  indent: 3,
}

const CALIBRI = '<sz val="12"/><color theme="1"/><name val="Calibri"/><family val="2"/><scheme val="minor"/>'

export const columnAWidth = (rows: AdminStudiesExportRow[]): number => {
  const longest = rows.reduce((max, row) => {
    const extra = row.textStyle === 'indent' ? INDENT_EXTRA_WIDTH : 0
    return Math.max(max, row.label.length + extra)
  }, 0)
  return longest + COLUMN_WIDTH_PADDING
}

const withColumnAStyles = (stylesXml: string): string => {
  const boldFont = `<font><b/>${CALIBRI}</font>`
  const italicFont = `<font><i/>${CALIBRI}</font>`
  const boldXf = '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>'
  const italicXf = '<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/>'
  const indentXf =
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment horizontal="left" indent="1"/></xf>'

  return stylesXml
    .replace('<fonts count="1">', '<fonts count="3">')
    .replace('</fonts>', `${boldFont}${italicFont}</fonts>`)
    .replace('<cellXfs count="1">', '<cellXfs count="4">')
    .replace('</cellXfs>', `${boldXf}${italicXf}${indentXf}</cellXfs>`)
}

const withColumnACellStyles = (sheetXml: string): string =>
  sheetXml.replace(/<c r="A(\d+)"/g, (match, rowNumber: string) => {
    const exportRow = ADMIN_STUDIES_EXPORT_ROWS[Number(rowNumber) - 2]
    if (!exportRow?.textStyle) {
      return match
    }
    return `<c r="A${rowNumber}" s="${STYLE_INDEX[exportRow.textStyle]}"`
  })

export const writeAdminStudiesExportWorkbook = async (sheet: AdminStudiesExportSheet): Promise<Buffer> => {
  const buffer = xlsx.build([
    {
      ...sheet,
      options: {
        ...sheet.options,
        '!cols': [{ wch: columnAWidth(ADMIN_STUDIES_EXPORT_ROWS) }],
      },
    },
  ])

  const zip = await JSZip.loadAsync(buffer)
  const stylesFile = zip.file('xl/styles.xml')
  const sheetFile = zip.file('xl/worksheets/sheet1.xml')
  if (!stylesFile || !sheetFile) {
    throw new Error('Generated workbook is missing styles or the first worksheet')
  }

  zip.file('xl/styles.xml', withColumnAStyles(await stylesFile.async('string')))
  zip.file('xl/worksheets/sheet1.xml', withColumnACellStyles(await sheetFile.async('string')))

  return zip.generateAsync({ type: 'nodebuffer' })
}

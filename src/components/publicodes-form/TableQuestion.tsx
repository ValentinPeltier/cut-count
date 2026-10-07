import { Table as BaseTable } from '@/lib/components'
import { InputField, OnFieldChange } from '@/publicodes/form'
import { EvaluatedTableLayout } from '@/publicodes/form/layouts'
import { usePublicodesTranslation } from '@/publicodes/hooks'
import { Paper, TableContainer } from '@mui/material'
import { EvaluatedFormElement } from '@publicodes/forms'
import { ColumnDef, StockFeatures, stockFeatures, useTable } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

interface TableLayoutProps<RuleName extends string> {
  tableLayout: EvaluatedTableLayout<RuleName>
  onChange: OnFieldChange<RuleName>
}

/**
 * Type representing a row in the table.
 * Each row contains the form elements for that row indexed by column.
 */
type TableRowData<RuleName extends string> = {
  id: string
  elements: Array<EvaluatedFormElement<RuleName>>
}

type TableQuestionTableMeta<RuleName extends string> = {
  tLayout: ReturnType<typeof useTranslations>
  getTitleTranslation: (rule: RuleName) => string
  onChange: OnFieldChange<RuleName>
}

export default function TableQuestion<RuleName extends string>({
  tableLayout: { title, headers, evaluatedRows },
  onChange,
}: TableLayoutProps<RuleName>) {
  const tLayout = useTranslations('publicodes-layout.table')
  const { getTitleTranslation } = usePublicodesTranslation()

  const tableData = useMemo<TableRowData<RuleName>[]>(() => {
    return evaluatedRows.map((row, rowIndex) => ({
      id: `row-${rowIndex}`,
      elements: row,
    }))
  }, [evaluatedRows])

  // `columns` must stay referentially stable: TanStack uses each `cell` function as a component type,
  // so rebuilding the columns re-mounts every cell and inputs lose focus while being typed into.
  // Unstable handlers/translations are read from `table.options.meta` at render time instead of refs.
  const columns = useMemo<ColumnDef<StockFeatures, TableRowData<RuleName>>[]>(() => {
    return headers.map((header, colIndex) => ({
      id: `col-${colIndex}`,
      header: ({ table }) => {
        const meta = table.options.meta as TableQuestionTableMeta<RuleName>
        return meta.tLayout(header)
      },
      cell: ({ row, table }) => {
        const meta = table.options.meta as TableQuestionTableMeta<RuleName>
        const formElement = row.original.elements[colIndex]
        if (!formElement) {
          return null
        }

        // TODO: could we have a cleaner way to distinguish between value and inputs ?
        // FIXME: the first column isn't translated for now
        return colIndex === 0 ? (
          <p>{meta.getTitleTranslation(formElement.id)}</p>
        ) : (
          <div className="w100 justify-center">
            <InputField formElement={formElement} onChange={meta.onChange} />
          </div>
        )
      },
    }))
  }, [headers])

  const table = useTable<typeof stockFeatures, TableRowData<RuleName>>({
    features: stockFeatures,
    data: tableData,
    columns,
    meta: {
      tLayout,
      getTitleTranslation,
      onChange,
    } satisfies TableQuestionTableMeta<RuleName>,
    getRowId: (row) => row.id,
  })

  return (
    <TableContainer component={Paper} className="mt1">
      <BaseTable table={table} testId={`table-${title}`} size="medium" />
    </TableContainer>
  )
}

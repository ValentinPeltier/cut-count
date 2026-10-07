import { Table as BaseTable } from '@/lib/components'
import { usePublicodesForm } from '@/lib/publicodes/context'
import { Button } from '@/lib/ui'
import { InputField, OnFieldChange } from '@/publicodes/form'
import { EvaluatedListLayout } from '@/publicodes/form/layouts'
import { usePublicodesTranslation } from '@/publicodes/hooks'
import { ContentCopy, Delete } from '@mui/icons-material'
import { Box, IconButton, Paper, TableContainer } from '@mui/material'
import { EvaluatedFormElement } from '@publicodes/forms'
import { ColumnDef, StockFeatures, stockFeatures, useTable } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { Situation } from 'publicodes'
import { useCallback, useEffect, useMemo } from 'react'

interface ListLayoutProps<RuleName extends string> {
  listLayout: EvaluatedListLayout<RuleName>
  onChange: OnFieldChange<RuleName>
}

/**
 * Type representing a row in the table.
 * Each row contains the form elements for that row indexed by column.
 */
type TableRowData<RuleName extends string> = {
  id: string
  situation: Situation<RuleName>
  elements: Array<EvaluatedFormElement<RuleName>>
}

type ListQuestionTableMeta<RuleName extends string> = {
  tAction: ReturnType<typeof useTranslations>
  tStudyQuestions: ReturnType<typeof useTranslations>
  getQuestion: (rule: RuleName) => string
  onListChange: (situationId: string, ruleName: RuleName, value: string | number | boolean | undefined) => void
  handleDeleteRow: (rowId: string) => void
  handleDuplicateRow: (rowId: string) => void
}

export default function ListQuestion<RuleName extends string>({
  listLayout: { targetRule, evaluatedListRows, rules },
}: ListLayoutProps<RuleName>) {
  const tAction = useTranslations('common.action')
  const tStudyQuestions = useTranslations('study.questions')
  const { getQuestionTranslation: getQuestion } = usePublicodesTranslation()
  const { updateListLayoutSituation, createNewListLayoutSituation, deleteListLayoutSituation } = usePublicodesForm()

  useEffect(() => {
    if (evaluatedListRows.length === 0) {
      createNewListLayoutSituation(targetRule)
    }
  }, [evaluatedListRows, createNewListLayoutSituation, targetRule])

  const onListChange = useCallback(
    (situationId: string, ruleName: RuleName, value: string | number | boolean | undefined) => {
      updateListLayoutSituation(targetRule, situationId, ruleName, value)
    },
    [updateListLayoutSituation, targetRule],
  )

  const handleAddRow = useCallback(() => {
    createNewListLayoutSituation(targetRule)
  }, [createNewListLayoutSituation, targetRule])

  const handleDeleteRow = useCallback(
    (rowId: string) => {
      deleteListLayoutSituation(targetRule, rowId)
    },
    [deleteListLayoutSituation, targetRule],
  )

  const handleDuplicateRow = useCallback(
    (rowId: string) => {
      createNewListLayoutSituation(targetRule, rowId)
    },
    [createNewListLayoutSituation, targetRule],
  )

  // `columns` must stay referentially stable: TanStack uses each `cell` function as a component type,
  // so rebuilding the columns re-mounts every cell and inputs lose focus while being typed into.
  // Unstable handlers/translations are read from `table.options.meta` at render time instead of refs.
  const columns = useMemo<ColumnDef<StockFeatures, TableRowData<RuleName>>[]>(() => {
    const columns: ColumnDef<StockFeatures, TableRowData<RuleName>>[] = rules.map((rule, colIndex) => ({
      id: `col-${colIndex}`,
      header: ({ table }) => {
        const meta = table.options.meta as ListQuestionTableMeta<RuleName>
        return meta.getQuestion(rule)
      },
      cell: ({ row, table }) => {
        const meta = table.options.meta as ListQuestionTableMeta<RuleName>
        const formElement = row.original.elements[colIndex]
        if (!formElement) {
          return null
        }

        const onChange = (ruleName: RuleName, value: string | number | boolean | undefined) => {
          meta.onListChange(row.original.id, ruleName, value)
        }
        return <InputField key={`${row.id}-col-${formElement.id}`} formElement={formElement} onChange={onChange} />
      },
    }))

    columns.push({
      id: 'col-actions',
      header: ({ table }) => {
        const meta = table.options.meta as ListQuestionTableMeta<RuleName>
        return meta.tStudyQuestions('actions')
      },
      cell: ({ row, table }) => {
        const meta = table.options.meta as ListQuestionTableMeta<RuleName>
        const tableRow = row.original as TableRowData<RuleName>
        return (
          <Box sx={{ display: 'flex' }}>
            <IconButton
              title={meta.tAction('duplicate')}
              aria-label="duplicate"
              color="primary"
              onClick={() => meta.handleDuplicateRow(tableRow.id)}
            >
              <ContentCopy />
            </IconButton>
            <IconButton
              title={meta.tAction('delete')}
              aria-label="delete"
              color="error"
              onClick={() => meta.handleDeleteRow(tableRow.id)}
            >
              <Delete />
            </IconButton>
          </Box>
        )
      },
    })
    return columns
  }, [rules])

  const table = useTable<typeof stockFeatures, TableRowData<RuleName>>({
    features: stockFeatures,
    data: evaluatedListRows,
    columns,
    meta: {
      tAction,
      tStudyQuestions,
      getQuestion,
      onListChange,
      handleDeleteRow,
      handleDuplicateRow,
    } satisfies ListQuestionTableMeta<RuleName>,
    getRowId: (row) => row.id,
  })

  return (
    <Box>
      <Button className="align" onClick={handleAddRow}>
        {tStudyQuestions('add')}
      </Button>
      <TableContainer component={Paper} className="mt1">
        <BaseTable table={table} testId={`table-${targetRule}`} size="medium" />
      </TableContainer>
    </Box>
  )
}

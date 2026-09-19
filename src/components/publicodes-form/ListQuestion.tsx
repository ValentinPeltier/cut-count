import { Table as BaseTable } from '@/lib/components'
import { usePublicodesForm } from '@/lib/publicodes/context'
import { Button } from '@/lib/ui'
import { InputField, OnFieldChange } from '@/publicodes/form'
import { EvaluatedListLayout } from '@/publicodes/form/layouts'
import { usePublicodesTranslation } from '@/publicodes/hooks'
import { ContentCopy, Delete } from '@mui/icons-material'
import { Box, IconButton, Paper, TableContainer } from '@mui/material'
import { EvaluatedFormElement } from '@publicodes/forms'
import { ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { Situation } from 'publicodes'
import { useCallback, useEffect, useMemo, useRef } from 'react'

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

export default function ListQuestion<RuleName extends string>({
  listLayout: { targetRule, evaluatedListRows, rules },
}: ListLayoutProps<RuleName>) {
  const tAction = useTranslations('common.action')
  const tStudyQuestions = useTranslations('study.questions')
  const { getQuestionTranslation: getQuestion } = usePublicodesTranslation()
  const { updateListLayoutSituation, createNewListLayoutSituation, deleteListLayoutSituation } = usePublicodesForm()

  // `columns` must stay referentially stable: TanStack uses each `cell` function as a component type,
  // so rebuilding the columns re-mounts every cell and inputs lose focus while being typed into.
  const tActionRef = useRef(tAction)
  tActionRef.current = tAction
  const tStudyQuestionsRef = useRef(tStudyQuestions)
  tStudyQuestionsRef.current = tStudyQuestions
  const getQuestionRef = useRef(getQuestion)
  getQuestionRef.current = getQuestion

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
  const onListChangeRef = useRef(onListChange)
  onListChangeRef.current = onListChange

  const handleAddRow = useCallback(() => {
    createNewListLayoutSituation(targetRule)
  }, [createNewListLayoutSituation, targetRule])

  const handleDeleteRow = useCallback(
    (rowId: string) => {
      deleteListLayoutSituation(targetRule, rowId)
    },
    [deleteListLayoutSituation, targetRule],
  )
  const handleDeleteRowRef = useRef(handleDeleteRow)
  handleDeleteRowRef.current = handleDeleteRow

  const handleDuplicateRow = useCallback(
    (rowId: string) => {
      createNewListLayoutSituation(targetRule, rowId)
    },
    [createNewListLayoutSituation, targetRule],
  )
  const handleDuplicateRowRef = useRef(handleDuplicateRow)
  handleDuplicateRowRef.current = handleDuplicateRow

  const columns = useMemo<ColumnDef<TableRowData<RuleName>>[]>(() => {
    const columns: ColumnDef<TableRowData<RuleName>>[] = rules.map((rule, colIndex) => ({
      id: `col-${colIndex}`,
      header: () => getQuestionRef.current(rule),
      cell: ({ row }) => {
        const formElement = row.original.elements[colIndex]
        if (!formElement) {
          return null
        }

        const onChange = (ruleName: RuleName, value: string | number | boolean | undefined) => {
          onListChangeRef.current(row.original.id, ruleName, value)
        }
        return <InputField key={`${row.id}-col-${formElement.id}`} formElement={formElement} onChange={onChange} />
      },
    }))

    const columnAction: ColumnDef<TableRowData<RuleName>> = {
      id: 'col-actions',
      header: () => tStudyQuestionsRef.current('actions'),
      cell: ({ row }) => {
        const tableRow = row.original as TableRowData<RuleName>
        return (
          <Box display="flex">
            <IconButton
              title={tActionRef.current('duplicate')}
              aria-label="duplicate"
              color="primary"
              onClick={() => handleDuplicateRowRef.current(tableRow.id)}
            >
              <ContentCopy />
            </IconButton>
            <IconButton
              title={tActionRef.current('delete')}
              aria-label="delete"
              color="error"
              onClick={() => handleDeleteRowRef.current(tableRow.id)}
            >
              <Delete />
            </IconButton>
          </Box>
        )
      },
    }

    columns.push(columnAction)
    return columns
  }, [rules])

  const table = useReactTable<TableRowData<RuleName>>({
    data: evaluatedListRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
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

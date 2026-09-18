import TableQuestion from '@/components/publicodes-form/TableQuestion'
import { render, screen } from '@testing-library/react'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('@abc-transitionbascarbone/publicodes/hooks', () => ({
  usePublicodesTranslation: () => ({
    getTitleTranslation: (title: string) => title,
  }),
}))

jest.mock('@abc-transitionbascarbone/publicodes/form', () => ({
  InputField: ({ formElement }: { formElement: { id: string } }) => <span>{formElement.id}</span>,
}))

describe('TableQuestion with CUT-like layout', () => {
  it('renders table headers and cell inputs', () => {
    render(
      <TableQuestion
        tableLayout={{
          title: 'cut-table',
          headers: ['col-a', 'col-b'],
          evaluatedRows: [
            [
              { id: 'row.rule.a', label: 'A', element: 'input', type: 'number' },
              { id: 'row.rule.b', label: 'B', element: 'input', type: 'number' },
            ],
          ],
        }}
        onChange={jest.fn()}
      />,
    )

    expect(screen.getByText('col-a')).toBeInTheDocument()
    expect(screen.getByText('row.rule.b')).toBeInTheDocument()
  })
})

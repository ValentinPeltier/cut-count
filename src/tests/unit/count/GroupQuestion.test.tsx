import GroupQuestion from '@/components/publicodes-form/GroupQuestion'
import { render, screen } from '@testing-library/react'

jest.mock('@/publicodes/form/inputFields', () => ({
  CheckboxInput: ({ evaluatedElement }: { evaluatedElement: { id: string; label: string } }) => (
    <label>
      <input type="checkbox" aria-label={evaluatedElement.label} />
      {evaluatedElement.id}
    </label>
  ),
}))

describe('GroupQuestion', () => {
  it('renders checkbox inputs from group layout', () => {
    render(
      <GroupQuestion
        groupLayout={
          {
            evaluatedElements: [
              { id: 'fonctionnement . énergie . est équipé climatisation', label: 'Clim', element: 'input', type: 'checkbox' },
              { id: 'ignored.text', label: 'Text', element: 'text' },
            ],
          } as any
        }
        onChange={jest.fn()}
      />,
    )

    expect(screen.getByLabelText('Clim')).toBeInTheDocument()
    expect(screen.getByText('fonctionnement . énergie . est équipé climatisation')).toBeInTheDocument()
    expect(screen.queryByText('ignored.text')).not.toBeInTheDocument()
  })
})

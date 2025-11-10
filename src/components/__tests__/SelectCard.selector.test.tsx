import React, { useState } from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SelectCard from '../../backpackCard/SelectCard'

function Wrapper() {
  const [value, setValue] = useState<string>('all')
  return <SelectCard value={value} onChange={setValue} />
}

describe('SelectCard tablist selector uniqueness and stability', () => {
  it('uniquely selects tablist by role and name', () => {
    render(<Wrapper />)

    const tablistByRole = screen.getByRole('tablist', { name: 'Select category' })
    expect(tablistByRole).toBeInTheDocument()

    const allTablists = screen.getAllByRole('tablist')
    expect(allTablists.length).toBeGreaterThanOrEqual(1)

    // Scoped query ensures uniqueness within SelectCard
    const card = screen.getByTestId('select-card')
    const scopedTablist = within(card).getByRole('tablist', { name: 'Select category' })
    expect(scopedTablist).toBe(tablistByRole)
  })

  it('selects tablist via dedicated data-testid and remains unique even with similar structures present', () => {
    render(
      <>
        <Wrapper />
        {/* Similar structure not matching due to different label */}
        <div role="tablist" aria-label="Similar category" />
      </>
    )

    // Direct selector: highest specificity and fastest lookup
    const tablistByTestId = screen.getByTestId('select-category-tablist')
    expect(tablistByTestId).toBeInTheDocument()

    // Ensure we did not match the similar structure
    const similar = screen.getByRole('tablist', { name: 'Similar category' })
    expect(similar).toBeInTheDocument()
    expect(tablistByTestId).not.toBe(similar)
  })

  it('remains stable across dynamic state changes', async () => {
    const user = userEvent.setup()
    render(<Wrapper />)

    const card = screen.getByTestId('select-card')
    const tablist = within(card).getByTestId('select-category-tablist')
    expect(tablist).toBeInTheDocument()

    // Click to change selected category
    const stageBtn = within(card).getByTestId('select-option-stage')
    await user.click(stageBtn)

    // Tablist remains stable and present
    expect(within(card).getByTestId('select-category-tablist')).toBeInTheDocument()

    // Verify dynamic selected state toggles for robustness
    expect(stageBtn).toHaveAttribute('aria-selected', 'true')
    const allBtn = within(card).getByTestId('select-option-all')
    expect(allBtn).toHaveAttribute('aria-selected', 'false')
  })
})
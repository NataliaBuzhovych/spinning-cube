import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import PauseButton from './PauseButton'

describe('PauseButton', () => {
  it('reads "Pause" while the cube is rotating', () => {
    render(<PauseButton paused={false} onClick={() => {}} />)
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument()
  })

  it('reads "Resume" while the cube is paused', () => {
    render(<PauseButton paused onClick={() => {}} />)
    expect(screen.getByRole('button', { name: 'Resume' })).toBeInTheDocument()
  })

  it('calls onClick once per click', async () => {
    const onClick = vi.fn()
    render(<PauseButton paused={false} onClick={onClick} />)

    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)

    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(2)
  })

  it('sets aria-pressed to match the paused state', () => {
    const { rerender } = render(
      <PauseButton paused={false} onClick={() => {}} />,
    )
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')

    rerender(<PauseButton paused onClick={() => {}} />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })
})

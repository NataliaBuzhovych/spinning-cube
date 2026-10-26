import { Children, isValidElement, type ReactNode } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

// WebGL is not available in jsdom: render only the component children of the
// Canvas (the Cube), dropping the three.js intrinsics such as lights.
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: ReactNode }) => (
    <div>
      {Children.toArray(children).filter(
        (child) => isValidElement(child) && typeof child.type !== 'string',
      )}
    </div>
  ),
}))
vi.mock('@react-three/drei', () => ({ OrbitControls: () => null }))
vi.mock('./Cube', () => ({
  default: ({ paused }: { paused: boolean }) => (
    <span data-testid="cube" data-paused={String(paused)} />
  ),
}))

const cubePaused = () => screen.getByTestId('cube').dataset.paused

describe('App', () => {
  it('starts rotating', () => {
    render(<App />)
    expect(cubePaused()).toBe('false')
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument()
  })

  it('toggles the cube and the label when the button is clicked', async () => {
    render(<App />)

    await userEvent.click(screen.getByRole('button', { name: 'Pause' }))
    expect(cubePaused()).toBe('true')
    expect(screen.getByRole('button', { name: 'Resume' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Resume' }))
    expect(cubePaused()).toBe('false')
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument()
  })

  it('toggles on Space and prevents the default action', () => {
    render(<App />)

    const first = fireEvent.keyDown(window, { code: 'Space' })
    expect(first).toBe(false) // false means preventDefault was called
    expect(cubePaused()).toBe('true')

    fireEvent.keyDown(window, { code: 'Space' })
    expect(cubePaused()).toBe('false')
  })

  it('toggles exactly once when the button is focused', async () => {
    render(<App />)
    const button = screen.getByRole('button')
    button.focus()

    await userEvent.keyboard(' ')

    expect(cubePaused()).toBe('true')
  })

  it('ignores a held key and other keys', () => {
    render(<App />)

    fireEvent.keyDown(window, { code: 'Space', repeat: true })
    fireEvent.keyDown(window, { code: 'KeyA' })

    expect(cubePaused()).toBe('false')
  })

  it('ignores Space typed into an editable field', () => {
    render(<App />)
    const input = document.body.appendChild(document.createElement('input'))

    fireEvent.keyDown(input, { code: 'Space' })

    expect(cubePaused()).toBe('false')
    input.remove()
  })

  it('stops listening after unmount', () => {
    const { unmount } = render(<App />)
    unmount()

    expect(fireEvent.keyDown(window, { code: 'Space' })).toBe(true)
  })
})

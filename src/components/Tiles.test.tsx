import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Tiles from './Tiles'
import { useAppDispatch } from '../hooks'
import { clearHighlight } from '../store/submissionsSlice'

vi.mock('../hooks', () => ({
  useAppDispatch: vi.fn(),
}))

vi.mock('../store/submissionsSlice', () => ({
  clearHighlight: vi.fn(() => ({ type: 'submissions/clearHighlight' })),
}))

describe('Tiles', () => {
  const items = [
    {
      id: '1',
      name: 'Alice',
      source: 'Form',
      age: 25,
      email: 'alice@example.com',
      gender: 'Female',
      country: 'USA',
      acceptedTC: true,
      pictureBase64: 'data:image/png;base64,xyz',
    },
    {
      id: '2',
      name: 'Bob',
      source: 'API',
      age: 30,
      email: 'bob@example.com',
      gender: 'Male',
      country: 'Canada',
      acceptedTC: false,
    },
  ]

  let dispatchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    dispatchMock = vi.fn()
    ;(useAppDispatch as unknown as ReturnType<typeof vi.fn>).mockReturnValue(dispatchMock)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  it('renders all tiles with item data', () => {
    render(<Tiles items={items} />)

    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.getByText('bob@example.com')).toBeInTheDocument()
    expect(screen.getByText('USA')).toBeInTheDocument()
    expect(screen.getByText('Canada')).toBeInTheDocument()
  })

  it('applies "new" class to highlighted tile', () => {
    render(<Tiles items={items} highlightId="1" />)
    const highlighted = screen.getByText('Alice').closest('.tile')
    expect(highlighted).toHaveClass('new')
  })

  it('dispatches clearHighlight after 3 seconds if highlightId is set', () => {
    render(<Tiles items={items} highlightId="1" />)
    expect(dispatchMock).not.toHaveBeenCalled()

    vi.advanceTimersByTime(3000)
    expect(dispatchMock).toHaveBeenCalledWith(clearHighlight())
  })

  it('clears timeout when highlightId changes', () => {
    const { rerender } = render(<Tiles items={items} highlightId="1" />)
    rerender(<Tiles items={items} highlightId="2" />)

    vi.advanceTimersByTime(3000)
    expect(dispatchMock).toHaveBeenCalledWith(clearHighlight())
    expect(dispatchMock).toHaveBeenCalledTimes(1)
  })

  it('renders image if pictureBase64 is provided', () => {
    render(<Tiles items={items} />)
    const img = screen.getByAltText('Alice avatar')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', items[0].pictureBase64)
  })
})
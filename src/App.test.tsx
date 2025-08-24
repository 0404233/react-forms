import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import App from './App'

vi.mock('./components/Modal', () => ({
  default: ({ isOpen, title, children, onClose }: any) =>
    isOpen ? (
      <div data-testid="modal">
        <h2>{title}</h2>
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    ) : null,
}))

vi.mock('./forms/HookForm', () => ({
  default: ({ onSuccess }: any) => (
    <div>
      <p>HookForm</p>
      <button onClick={onSuccess}>Submit HookForm</button>
    </div>
  ),
}))

vi.mock('./forms/UncontrolledForm', () => ({
  default: ({ onSuccess }: any) => (
    <div>
      <p>UncontrolledForm</p>
      <button onClick={onSuccess}>Submit UncontrolledForm</button>
    </div>
  ),
}))

vi.mock('./components/Tiles', () => ({
  default: ({ items, highlightId }: any) => (
    <div data-testid="tiles">
      {items.map((item: any) => (
        <div key={item.id} data-highlight={item.id === highlightId}>
          {item.name}
        </div>
      ))}
    </div>
  ),
}))

vi.mock('./hooks', () => ({
  useSubmissions: () => ({
    items: [
      { id: 1, name: 'One' },
      { id: 2, name: 'Two' },
    ],
    lastNewId: 2,
  }),
}))

describe('App.tsx — full coverage no mercy', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders header and buttons', () => {
    screen.getByText('React Forms')
    screen.getByText('Open Uncontrolled Form')
    screen.getByText('Open React Hook Form')
  })

  it('renders Tiles and highlights lastNewId', () => {
    const tiles = screen.getByTestId('tiles')
    expect(tiles.querySelectorAll('[data-highlight="true"]').length).toBe(1)
  })

  it('opens UncontrolledForm modal and submits', async () => {
    await userEvent.click(screen.getByText('Open Uncontrolled Form'))
    const modal = screen.getByTestId('modal')
    within(modal).getByText('Uncontrolled Form')
    await userEvent.click(within(modal).getByText('Submit UncontrolledForm'))
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })

  it('opens HookForm modal and submits', async () => {
    await userEvent.click(screen.getByText('Open React Hook Form'))
    const modal = screen.getByTestId('modal')
    within(modal).getByText('React Hook Form')
    await userEvent.click(within(modal).getByText('Submit HookForm'))
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })

  it('closes modal via Close button', async () => {
    await userEvent.click(screen.getByText('Open React Hook Form'))
    const modal = screen.getByTestId('modal')
    await userEvent.click(within(modal).getByText('Close'))
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })

  it('renders nothing in modal when which is none', () => {
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })
})
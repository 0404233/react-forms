import { describe, it, vi, expect, beforeEach } from 'vitest'

vi.mock('react-dom/client', async () => {
  const actual = await vi.importActual<typeof import('react-dom/client')>('react-dom/client')
  return {
    ...actual,
    createRoot: vi.fn(() => ({
      render: vi.fn()
    }))
  }
})

describe('main.tsx', () => {
  beforeEach(() => {
    const root = document.createElement('div')
    root.id = 'root'
    document.body.appendChild(root)
  })

  it('call createRoot', async () => {
    const { createRoot } = await import('react-dom/client')
    const rootMock = createRoot(document.getElementById('root')!)
    void rootMock

    await import('./main')

    expect(createRoot).toHaveBeenCalled()
  })
})

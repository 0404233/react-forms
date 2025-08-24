import reducer, { addSubmission, clearHighlight } from './submissionsSlice'
import { describe, it, expect } from 'vitest'

describe('submissionsSlice', () => {
  const baseSubmission = {
    name: 'Alice',
    age: 30,
    email: 'alice@example.com',
    password: 'securepassword',
    gender: 'female' as const,
    acceptedTC: true,
    country: 'France',
    source: 'react-hook-form' as const,
  }

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual({ items: [] })
  })

  it('should add a submission and set lastNewId', () => {
    const action = addSubmission(baseSubmission)
    const state = reducer(undefined, action)

    expect(state.items.length).toBe(1)
    expect(state.items[0]).toMatchObject(baseSubmission)
    expect(state.items[0].id).toBeDefined()
    expect(state.items[0].createdAt).toBeDefined()
    expect(state.lastNewId).toBe(state.items[0].id)
  })

  it('should add multiple submissions and keep order', () => {
    const first = addSubmission({ ...baseSubmission, name: 'Bob' })
    const second = addSubmission({ ...baseSubmission, name: 'Charlie' })

    let state = reducer(undefined, first)
    state = reducer(state, second)

    expect(state.items.length).toBe(2)
    expect(state.items[0].name).toBe('Charlie')
    expect(state.items[1].name).toBe('Bob')
    expect(state.lastNewId).toBe(state.items[0].id)
  })

  it('should clear highlight', () => {
    const action = addSubmission(baseSubmission)
    let state = reducer(undefined, action)

    expect(state.lastNewId).toBeDefined()

    state = reducer(state, clearHighlight())
    expect(state.lastNewId).toBeUndefined()
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Autocomplete from './Autocomplete';
import '@testing-library/jest-dom'

describe('Autocomplete', () => {
  const options = ['USA', 'Canada', 'Germany', 'France']

  it('renders label and input', () => {
    render(
      <Autocomplete
        options={options}
        value=""
        onChange={() => {}}
        id="country"
        label="Country"
      />
    )

    expect(screen.getByLabelText(/Country/i)).toBeInTheDocument()
  })

  it('calls onChange when input changes', () => {
    const handleChange = vi.fn()

    render(
      <Autocomplete
        options={options}
        value=""
        onChange={handleChange}
        id="country"
        label="Country"
      />
    )

    const input = screen.getByLabelText(/Country/i)
    fireEvent.change(input, { target: { value: 'USA' } })

    expect(handleChange).toHaveBeenCalledWith('USA')
  })

  it('filters options by query', () => {
    render(
      <Autocomplete
        options={options}
        value=""
        onChange={() => {}}
        id="country"
        label="Country"
      />
    )

    const input = screen.getByLabelText(/Country/i)
    fireEvent.input(input, { target: { value: 'an' } })

    const list = screen.getByRole('listbox', { hidden: true }) as HTMLDataListElement
    const children = Array.from(list.children) as HTMLOptionElement[]

    expect(children.map((opt) => opt.value)).toEqual(
      expect.arrayContaining(['Canada', 'Germany', 'France'])
    )
  })

  it('shows error message', () => {
    render(
      <Autocomplete
        options={options}
        value=""
        onChange={() => {}}
        id="country"
        label="Country"
        error="Country is required"
      />
    )

    expect(screen.getByText(/Country is required/i)).toBeInTheDocument()
  })
})

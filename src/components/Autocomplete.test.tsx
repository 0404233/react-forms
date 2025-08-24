import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Autocomplete from './Autocomplete';
import '@testing-library/jest-dom';

describe('Autocomplete', () => {
  const options = ['USA', 'Canada', 'Germany', 'France'];

  it('renders label and input', () => {
    render(
      <Autocomplete
        options={options}
        value=""
        onChange={() => {}}
        id="country"
        label="Country"
      />
    );

    expect(screen.getByLabelText(/Country/i)).toBeInTheDocument();
  });

  it('calls onChange when input changes', async () => {
    const handleChange = vi.fn();

    render(
      <Autocomplete
        options={options}
        value=""
        onChange={handleChange}
        id="country"
        label="Country"
      />
    );

    const input = screen.getByLabelText(/Country/i);
    await userEvent.type(input, 'USA', { delay: 1 });

    expect(handleChange).toHaveBeenCalledTimes(3);
    expect(handleChange.mock.calls[0][0]).toBe('U');
    expect(handleChange.mock.calls[1][0]).toBe('S');
    expect(handleChange.mock.calls[2][0]).toBe('A');
  });

  it('filters options by query', async () => {
    render(
      <Autocomplete
        options={options}
        value=""
        onChange={() => {}}
        id="country"
        label="Country"
      />
    );

    const input = screen.getByLabelText(/Country/i);
    await userEvent.type(input, 'an', { delay: 1 });

    const list = screen.getByRole('listbox', {
      hidden: true,
    }) as HTMLDataListElement;
    const children = Array.from(list.children) as HTMLOptionElement[];

    expect(children.map((opt) => opt.value)).toEqual(
      expect.arrayContaining(['Canada', 'Germany', 'France'])
    );
  });

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
    );

    expect(screen.getByText(/Country is required/i)).toBeInTheDocument();
  });
});

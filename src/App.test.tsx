import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { describe, it, expect } from 'vitest';
import { Provider } from 'react-redux';
import { store } from './store';

describe('App', () => {
  it('renders header', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(screen.getByText(/React Forms/i)).toBeInTheDocument();
  });

  it('renders form open buttons', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(screen.getByText(/Open Uncontrolled Form/i)).toBeInTheDocument();
    expect(screen.getByText(/Open React Hook Form/i)).toBeInTheDocument();
  });
});
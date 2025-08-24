import { describe, it, expect } from 'vitest';
import { useSubmissions, useCountries } from './hooks';

describe('hooks', () => {
  it('should export functions', () => {
    expect(typeof useSubmissions).toBe('function');
    expect(typeof useCountries).toBe('function');
  });
});
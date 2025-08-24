import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, vi, beforeEach, expect } from 'vitest';

import UncontrolledForm from './UncontrolledForm';
import * as hooks from '../hooks';
import * as imageUtils from '../utils/image';

describe('UncontrolledForm', () => {
  const dispatchMock = vi.fn();
  const onSuccessMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(hooks, 'useAppDispatch').mockReturnValue(dispatchMock);
    vi.spyOn(hooks, 'useCountries').mockReturnValue(['USA', 'Canada']);
    vi.spyOn(imageUtils, 'validateImageFile').mockReturnValue({ ok: true });
    vi.spyOn(imageUtils, 'fileToBase64').mockResolvedValue(
      'data:image/png;base64,xyz'
    );
  });

  it('shows error if image validation fails', async () => {
    vi.spyOn(imageUtils, 'validateImageFile').mockReturnValue({
      ok: false,
      error: 'Invalid file',
    });
    render(<UncontrolledForm onSuccess={onSuccessMock} />);

    const file = new File(['dummy'], 'avatar.txt', { type: 'text/plain' });
    const pictureInput = screen.getByLabelText(/Picture/i) as HTMLInputElement;
    Object.defineProperty(pictureInput, 'files', { value: [file] });

    await userEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(dispatchMock).not.toHaveBeenCalled();
      expect(onSuccessMock).not.toHaveBeenCalled();
    });
  });
});

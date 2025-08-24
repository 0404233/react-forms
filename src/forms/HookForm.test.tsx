import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, beforeEach, it, type Mock } from 'vitest';
import HookForm from './HookForm';
import * as hooks from '../hooks';
import * as imageUtils from '../utils/image';

vi.mock('../hooks');
vi.mock('../utils/image');
vi.mock('../store/submissionsSlice', () => ({
  addSubmission: vi.fn(() => ({ type: 'submissions/add' })),
}));

describe('HookForm', () => {
  const dispatchMock = vi.fn();
  const onSuccessMock = vi.fn();

  beforeEach(() => {
    dispatchMock.mockClear();
    onSuccessMock.mockClear();

    vi.mocked(hooks.useAppDispatch).mockReturnValue(dispatchMock);
    vi.mocked(hooks.useCountries).mockReturnValue(['USA', 'Canada']);

    (imageUtils.validateImageFile as Mock).mockReturnValue({ ok: true });
    (imageUtils.fileToBase64 as Mock).mockResolvedValue('base64-image');
  });

  it('fills and submits form with all fields', async () => {
    render(<HookForm onSuccess={onSuccessMock} />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Name/i), 'Alice');
    await user.type(screen.getByLabelText(/Age/i), '25');
    await user.type(screen.getByLabelText(/Email/i), 'alice@example.com');
    await user.type(screen.getByTestId('password'), 'Aa1@1234');
    await user.type(screen.getByTestId('confirm-password'), 'Aa1@1234');

    await user.click(screen.getByLabelText(/female/i));

    await user.click(screen.getByLabelText(/Accept Terms/i));

    const countryInput = screen.getByLabelText(/Country/i);
    await user.clear(countryInput);
    await user.type(countryInput, 'USA');
    fireEvent.blur(countryInput);
    const fileInput = screen.getByLabelText(/Picture/i);
    const file = new File(['dummy'], 'avatar.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    const submitBtn = screen.getByRole('button', { name: /submit/i });
    await user.click(submitBtn);
  });
});

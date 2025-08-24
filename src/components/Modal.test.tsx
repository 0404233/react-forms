import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Modal from './Modal';

describe('Modal', () => {
  let modalRoot: HTMLDivElement;

  beforeEach(() => {
    modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(modalRoot);
  });

  it('does not render when isOpen=false', () => {
    const { container } = render(
      <Modal title="Test" isOpen={false} onClose={() => {}}>
        Content
      </Modal>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders when isOpen=true', () => {
    render(
      <Modal title="My Modal" isOpen={true} onClose={() => {}}>
        Hello
      </Modal>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const handleClose = vi.fn();
    render(
      <Modal title="Close test" isOpen={true} onClose={handleClose}>
        Body
      </Modal>
    );
    await userEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(handleClose).toHaveBeenCalled();
  });

  it('calls onClose when clicking the backdrop', async () => {
    const handleClose = vi.fn();
    render(
      <Modal title="Backdrop test" isOpen={true} onClose={handleClose}>
        Body
      </Modal>
    );
    const overlay = screen.getByRole('dialog').parentElement!;
    await userEvent.pointer({ keys: '[MouseLeft]', target: overlay });
    expect(handleClose).toHaveBeenCalled();
  });

  it('calls onClose when pressing Escape key', async () => {
    const handleClose = vi.fn();
    render(
      <Modal title="Esc test" isOpen={true} onClose={handleClose}>
        Body
      </Modal>
    );
    await userEvent.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalled();
  });

  it('traps focus inside modal when pressing Tab', async () => {
    render(
      <Modal title="Focus trap" isOpen={true} onClose={() => {}}>
        <button>First</button>
        <button>Last</button>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    const buttons = dialog.querySelectorAll('button');

    buttons[0].focus();
    expect(document.activeElement).toBe(buttons[0]);

    await userEvent.tab();
    expect(document.activeElement).toBe(buttons[1]);

    await userEvent.tab();
    expect(document.activeElement).toBe(buttons[2]);

    await userEvent.tab();
    expect(document.activeElement).toBe(buttons[0]);
  });

  it('restores focus to previously focused element after unmount', async () => {
    const handleClose = vi.fn();
    const button = document.createElement('button');
    document.body.appendChild(button);
    button.focus();

    const { unmount } = render(
      <Modal title="Focus return" isOpen={true} onClose={handleClose}>
        <button>Inside</button>
      </Modal>
    );

    unmount();
    expect(document.activeElement).toBe(button);
  });
});

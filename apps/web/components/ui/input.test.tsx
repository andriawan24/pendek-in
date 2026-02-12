import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './input';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders a label when provided', () => {
    render(<Input label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('associates label with input via htmlFor', () => {
    render(<Input label="Email" id="email-input" />);
    const label = screen.getByText('Email');
    expect(label).toHaveAttribute('for', 'email-input');
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Input className="custom" data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveClass('custom');
  });

  it('accepts user input', async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Type here" />);
    const input = screen.getByPlaceholderText('Type here');
    await user.type(input, 'Hello');
    expect(input).toHaveValue('Hello');
  });

  it('passes through HTML input attributes', () => {
    render(<Input type="password" required data-testid="pw" />);
    const input = screen.getByTestId('pw');
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toBeRequired();
  });

  it('generates an id when none is provided', () => {
    render(<Input label="Name" />);
    const input = screen.getByLabelText('Name');
    expect(input.id).toBeTruthy();
  });
});

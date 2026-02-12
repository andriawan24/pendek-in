import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateRangeSelector } from './date-range-selector';

describe('DateRangeSelector', () => {
  it('renders all date range options', () => {
    render(<DateRangeSelector value="7d" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: '7 Days' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '30 Days' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '90 Days' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'All Time' })
    ).toBeInTheDocument();
  });

  it('calls onChange with the correct value when a button is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DateRangeSelector value="7d" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: '30 Days' }));
    expect(onChange).toHaveBeenCalledWith('30d');
  });

  it('calls onChange for each range option', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DateRangeSelector value="7d" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: '90 Days' }));
    expect(onChange).toHaveBeenCalledWith('90d');

    await user.click(screen.getByRole('button', { name: 'All Time' }));
    expect(onChange).toHaveBeenCalledWith('all');
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from './stat-card';
import { Link2 } from 'lucide-react';

describe('StatCard', () => {
  it('renders title and value', () => {
    render(<StatCard title="Total Links" value={42} icon={Link2} />);
    expect(screen.getByText('Total Links')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('formats numeric values with toLocaleString', () => {
    render(<StatCard title="Clicks" value={1234567} icon={Link2} />);
    expect(screen.getByText('1,234,567')).toBeInTheDocument();
  });

  it('renders string values as-is', () => {
    render(<StatCard title="Top Link" value="/my-link" icon={Link2} />);
    expect(screen.getByText('/my-link')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(
      <StatCard
        title="Top Link"
        value="/best"
        icon={Link2}
        subtitle="500 clicks"
      />
    );
    expect(screen.getByText('500 clicks')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    const { container } = render(
      <StatCard title="Links" value={5} icon={Link2} />
    );
    expect(container.querySelector('.text-xs.text-zinc-500')).toBeNull();
  });

  it('renders positive trend', () => {
    render(
      <StatCard
        title="Clicks"
        value={100}
        icon={Link2}
        trend={{ value: 15, isPositive: true }}
      />
    );
    expect(screen.getByText('+15%')).toBeInTheDocument();
  });

  it('renders negative trend', () => {
    render(
      <StatCard
        title="Clicks"
        value={100}
        icon={Link2}
        trend={{ value: -5, isPositive: false }}
      />
    );
    expect(screen.getByText('-5%')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <StatCard title="Test" value={1} icon={Link2} className="my-custom" />
    );
    expect(container.firstElementChild).toHaveClass('my-custom');
  });
});

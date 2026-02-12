import { describe, it, expect, beforeAll, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatItem from './stat-item';

// Mock IntersectionObserver for framer-motion's useInView
beforeAll(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class IntersectionObserver {
      constructor() {}
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
});

describe('StatItem', () => {
  it('renders the label', () => {
    render(<StatItem value={100} label="Total Links" />);
    expect(screen.getByText('Total Links')).toBeInTheDocument();
  });

  it('renders the counter with initial value of 0', () => {
    render(<StatItem value={500} label="Clicks" />);
    // AnimatedCounter starts at 0 before animation kicks in
    expect(screen.getByText(/0/)).toBeInTheDocument();
  });

  it('renders suffix when provided', () => {
    render(<StatItem value={99} label="Uptime" suffix="%" />);
    expect(screen.getByText(/%/)).toBeInTheDocument();
  });
});

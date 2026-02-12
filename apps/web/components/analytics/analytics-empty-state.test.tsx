import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AnalyticsEmptyState } from './analytics-empty-state';

// Mock next/link to render a simple anchor
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('AnalyticsEmptyState', () => {
  it('renders the empty state heading', () => {
    render(<AnalyticsEmptyState />);
    expect(screen.getByText('No Analytics Yet')).toBeInTheDocument();
  });

  it('renders the descriptive text', () => {
    render(<AnalyticsEmptyState />);
    expect(
      screen.getByText(/Create your first link to start tracking/)
    ).toBeInTheDocument();
  });

  it('renders a link to the dashboard', () => {
    render(<AnalyticsEmptyState />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/dashboard');
  });

  it('renders the CTA button', () => {
    render(<AnalyticsEmptyState />);
    expect(
      screen.getByRole('button', { name: /Create Your First Link/i })
    ).toBeInTheDocument();
  });
});

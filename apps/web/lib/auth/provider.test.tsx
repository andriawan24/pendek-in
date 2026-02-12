import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './provider';

// Mock the session manager
vi.mock('./session', () => {
  const mockSessionManager = {
    getSession: vi.fn(() => null),
    isAuthenticated: vi.fn(() => false),
    saveSession: vi.fn(),
    clearSession: vi.fn(),
    updateUser: vi.fn(),
    getAccessToken: vi.fn(() => null),
  };
  return { sessionManager: mockSessionManager };
});

// Mock the api functions
vi.mock('./api', () => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  loginWithGoogle: vi.fn(),
  updateProfile: vi.fn(),
  verifyEmail: vi.fn(),
  resendVerification: vi.fn(),
}));

import { sessionManager } from './session';
import * as api from './api';

function TestConsumer() {
  const { user, isAuthenticated, logout } = useAuth();
  return (
    <div>
      <span data-testid="auth-status">
        {isAuthenticated ? 'authenticated' : 'unauthenticated'}
      </span>
      <span data-testid="user-email">{user?.email ?? 'none'}</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('provides unauthenticated state by default', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    expect(screen.getByTestId('auth-status')).toHaveTextContent(
      'unauthenticated'
    );
    expect(screen.getByTestId('user-email')).toHaveTextContent('none');
  });

  it('provides authenticated state when session exists', () => {
    const mockSession = {
      user: { id: '1', email: 'test@example.com', name: 'Test' },
      tokens: { accessToken: 'tok', refreshToken: 'ref' },
    };
    vi.mocked(sessionManager.getSession).mockReturnValue(mockSession);
    vi.mocked(sessionManager.isAuthenticated).mockReturnValue(true);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    expect(screen.getByTestId('auth-status')).toHaveTextContent(
      'authenticated'
    );
    expect(screen.getByTestId('user-email')).toHaveTextContent(
      'test@example.com'
    );
  });

  it('clears user on logout', async () => {
    const user = userEvent.setup();
    const mockSession = {
      user: { id: '1', email: 'test@example.com', name: 'Test' },
      tokens: { accessToken: 'tok', refreshToken: 'ref' },
    };
    vi.mocked(sessionManager.getSession).mockReturnValue(mockSession);
    vi.mocked(sessionManager.isAuthenticated).mockReturnValue(true);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    expect(screen.getByTestId('auth-status')).toHaveTextContent(
      'authenticated'
    );

    await user.click(screen.getByRole('button', { name: 'Logout' }));
    expect(screen.getByTestId('auth-status')).toHaveTextContent(
      'unauthenticated'
    );
  });
});

describe('useAuth', () => {
  it('throws when used outside AuthProvider', () => {
    // Suppress console.error for the expected error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestConsumer />)).toThrow(
      'useAuth must be used within an AuthProvider'
    );

    consoleSpy.mockRestore();
  });
});

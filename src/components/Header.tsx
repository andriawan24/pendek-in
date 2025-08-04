'use client';

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { useAuth } from './AuthProvider';

const Header = () => {
  const { user, loading, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="w-full py-4 px-6 border-b dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white transition-colors">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold text-xl" aria-label="Home">
          Pendek.in
        </Link>
        <div className="flex items-center gap-4">
          <nav>
            <ul className="flex gap-4">
              <li>
                <Link
                  href="/"
                  className="hover:underline transition-all duration-200"
                  aria-label="Home"
                >
                  Home
                </Link>
              </li>
              {user && (
                <li>
                  <Link
                    href="/links"
                    className="hover:underline transition-all duration-200"
                    aria-label="My Links"
                  >
                    My Links
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {!loading && (
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;

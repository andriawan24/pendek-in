'use client';

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

const Header = () => {
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
              <li>
                <Link
                  href="/links"
                  className="hover:underline transition-all duration-200"
                  aria-label="My Links"
                >
                  My Links
                </Link>
              </li>
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;

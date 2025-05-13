'use client';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-6 px-6 border-t mt-auto dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © {currentYear} Pendek.in - Your Personal URL Shortener
        </p>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <a
            href="#"
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            aria-label="Terms of Service"
          >
            Terms
          </a>
          <a
            href="#"
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            aria-label="Privacy Policy"
          >
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState } from 'react';
import { Moon, Sun, ArrowLeft, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  setActivePage: (page: 'dashboard' | 'send' | 'receive' | 'transactions' | 'seed-phrase' | 'settings') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, setActivePage }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
        <header className="fixed top-0 left-0 right-0 p-4 z-50 flex justify-between items-center">
          <button
            onClick={() => setActivePage('dashboard')}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePage('settings')}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              aria-label="Settings"
            >
              <Settings size={20} />
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>
        <main className="pt-16">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
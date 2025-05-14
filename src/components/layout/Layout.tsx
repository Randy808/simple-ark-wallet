import React, { act, useState } from "react";
import { Moon, Sun, ArrowLeft, Settings, Menu } from "lucide-react";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  setActivePage: (
    page:
      | "dashboard"
      | "send"
      | "receive"
      | "transactions"
      | "seed-phrase"
      | "settings"
  ) => void;
  activePage: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  setActivePage,
  activePage,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
        {/* Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full transform transition-transform duration-300 ease-in-out z-50 ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <Sidebar
            onItemClick={() => setIsSidebarOpen(false)}
            setActivePage={setActivePage}
          />
        </div>
        <header className="fixed top-0 left-0 right-0 p-4 z-30 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {activePage === "dashboard" && (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors lg:hidden"
                aria-label="Toggle sidebar"
              >
                <Menu size={20} />
              </button>
            )}
            {activePage !== "dashboard" && (
              <button
                onClick={() => setActivePage("dashboard")}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                aria-label="Back to dashboard"
              >
                <ArrowLeft size={20} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePage("settings")}
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
        <main className="pt-16">{children}</main>
      </div>
    </div>
  );
};

export default Layout;

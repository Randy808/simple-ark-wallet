import React from 'react';
import { ChevronRight, Shield, Key, Moon, Bell, HelpCircle } from 'lucide-react';

const Settings: React.FC = () => {
  const menuItems = [
    {
      icon: Shield,
      label: 'Security',
      description: 'Protect your wallet',
      onClick: () => {},
    },
    {
      icon: Key,
      label: 'Recovery Phrase',
      description: 'View your seed phrase',
      onClick: () => {},
    },
    {
      icon: Moon,
      label: 'Appearance',
      description: 'Dark mode, themes',
      onClick: () => {},
    },
    {
      icon: Bell,
      label: 'Notifications',
      description: 'Transaction alerts',
      onClick: () => {},
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      description: 'Get assistance',
      onClick: () => {},
    },
  ];

  return (
    <div className="max-w-md mx-auto px-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        {menuItems.map((item, index) => (
          <div
            key={item.label}
            className={`flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${
              index !== menuItems.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
            }`}
            onClick={item.onClick}
          >
            <div className="flex items-center">
              <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700">
                <item.icon size={20} className="text-gray-600 dark:text-gray-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
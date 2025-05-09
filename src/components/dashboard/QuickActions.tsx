import React from 'react';
import { Wallet, RefreshCw, QrCode, Gift } from 'lucide-react';

const QuickActions: React.FC = () => {
  const actions = [
    { icon: Wallet, label: 'Buy BTC', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
    { icon: RefreshCw, label: 'Swap', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' },
    { icon: QrCode, label: 'Scan', color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' },
    { icon: Gift, label: 'Rewards', color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {actions.map((action, index) => (
        <button 
          key={index}
          className="flex flex-col items-center justify-center p-3 bg-white dark:bg-gray-800 rounded-xl shadow transition-transform hover:scale-105"
        >
          <div className={`p-3 rounded-full mb-2 ${action.color}`}>
            <action.icon size={20} />
          </div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
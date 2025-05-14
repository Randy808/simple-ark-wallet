import React from 'react';
import { Wallet, ArrowUpRight, Clock, Settings, Key, Plus } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

interface SidebarProps {
  onItemClick?: () => void;
  setActivePage?: (page: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onItemClick, setActivePage }) => {
  const { wallets, setActiveWallet, activeWallet } = useWallet();

  const handleWalletClick = (walletId: string) => {
    setActiveWallet(walletId);
    if (onItemClick) onItemClick();
  };

  return (
    <div className="flex flex-col h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">MY WALLETS</h2>
          <button 
            className="p-1 text-gray-500 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Add wallet"
          >
            <Plus size={16} onClick={() => {
              setActivePage?.("create-wallet");
              if (onItemClick) onItemClick();
            }}/>
          </button>
        </div>
        
        <div className="mt-2 space-y-1">
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              className={`flex items-center w-full px-3 py-2 text-left rounded-lg transition-colors ${
                wallet.isActive
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
              }`}
              onClick={() => handleWalletClick(wallet.id)}
            >
              <Wallet 
                size={18} 
                className={wallet.isActive ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'} 
              />
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium truncate">{wallet.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {wallet.balance.toFixed(8)} BTC
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <nav className="flex-1 px-4 mt-6">
        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">NAVIGATION</h2>
        <div className="space-y-1">
          <NavItem Icon={ArrowUpRight} label="Send" route="send" onClick={onItemClick} />
          <NavItem Icon={Clock} label="Transactions" route="transactions" onClick={onItemClick} />
          <NavItem Icon={Key} label="Seed Phrase" route="seed-phrase" onClick={onItemClick} />
          <NavItem Icon={Settings} label="Settings" route="settings" onClick={onItemClick} />
        </div>
      </nav>
      
      <div className="p-4 mt-auto">
        <div className="flex items-center p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
          <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full"></div>
          <div className="ml-3">
            <p className="text-xs font-medium text-gray-900 dark:text-white">Ark Network</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Connected</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface NavItemProps {
  Icon: React.ElementType;
  label: string;
  route: string;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ Icon, label, route, onClick }) => (
  <button
    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50"
    onClick={onClick}
  >
    <Icon size={18} className="text-gray-500 dark:text-gray-400" />
    <span className="ml-3">{label}</span>
  </button>
);

export default Sidebar;
import React from 'react';
import BalanceCard from '../components/dashboard/BalanceCard';
import TransactionsList from '../components/dashboard/TransactionsList';

interface DashboardProps {
  onNavigate: (page: 'dashboard' | 'send' | 'receive' | 'transactions' | 'seed-phrase' | 'settings') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-2xl mx-auto px-4">
      <BalanceCard onSend={() => onNavigate('send')} onReceive={() => onNavigate('receive')} />
      <TransactionsList />
    </div>
  );
};

export default Dashboard;
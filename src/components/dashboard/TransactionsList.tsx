import React from 'react';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Transaction } from '../../types';
import { useWallet } from '../../context/WalletContext';

const TransactionsList: React.FC = () => {
  const { transactions, activeWallet } = useWallet();
  
  const filteredTransactions = transactions
    .filter(tx => tx.walletId === (activeWallet?.id || 0))
    .slice(0, 10);
  
  return (
    <div className="mt-8">
      <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx) => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No transactions yet
          </div>
        )}
      </div>
    </div>
  );
};

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const { type, amount, status, timestamp, address } = transaction;
  
  const formattedAddress = `${address.substring(0, 6)}...${address.substring(address.length - 6)}`;
  const formattedDate = new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center">
        <div className={`p-2 rounded-full mr-4 ${
          type === 'receive' 
            ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
            : 'bg-black dark:bg-white text-white dark:text-black'
        }`}>
          {type === 'receive' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
        </div>
        
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {type === 'receive' ? 'Received' : 'Sent'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</p>
        </div>
      </div>
      
      <div className="text-right">
        <p className="font-medium text-gray-900 dark:text-white">
          {type === 'receive' ? '+' : '-'}{amount.toFixed(8)}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{formattedAddress}</p>
      </div>
    </div>
  );
};

export default TransactionsList;
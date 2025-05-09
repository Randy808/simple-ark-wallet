import React, { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Filter, Search, ExternalLink } from 'lucide-react';
import { Transaction } from '../../types';
import { useWallet } from '../../context/WalletContext';

const TransactionsTable: React.FC = () => {
  const { transactions, activeWallet } = useWallet();
  const [filter, setFilter] = useState<'all' | 'send' | 'receive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter transactions for active wallet and by type
  const filteredTransactions = transactions
    .filter(tx => tx.walletId === activeWallet.id)
    .filter(tx => filter === 'all' || tx.type === filter)
    .filter(tx => 
      tx.address.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tx.id.includes(searchQuery)
    );
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
      <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Transaction History</h2>
        
        <div className="flex flex-col md:flex-row justify-between space-y-3 md:space-y-0">
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                filter === 'all'
                  ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                  : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                filter === 'receive'
                  ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                  : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
              onClick={() => setFilter('receive')}
            >
              Received
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                filter === 'send'
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                  : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
              onClick={() => setFilter('send')}
            >
              Sent
            </button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {filteredTransactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTransactions.map((tx) => (
                <TransactionRow key={tx.id} transaction={tx} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
          No transactions found
        </div>
      )}
    </div>
  );
};

interface TransactionRowProps {
  transaction: Transaction;
}

const TransactionRow: React.FC<TransactionRowProps> = ({ transaction }) => {
  const { type, amount, address, timestamp, status } = transaction;
  
  const formattedAddress = `${address.substring(0, 10)}...${address.substring(
    address.length - 10
  )}`;
  
  const formattedDate = new Date(timestamp).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  
  const formattedTime = new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div 
            className={`p-1.5 rounded-full mr-2 ${
              type === 'receive' 
                ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
            }`}
          >
            {type === 'receive' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {type === 'receive' ? 'Received' : 'Sent'}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`text-sm font-medium ${
            type === 'receive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}
        >
          {type === 'receive' ? '+' : '-'}{amount.toFixed(8)} BTC
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-500 dark:text-gray-400">{formattedAddress}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">{formattedDate}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{formattedTime}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span 
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            status === 'completed'
              ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
              : status === 'pending'
              ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
              : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
          <ExternalLink size={16} />
        </button>
      </td>
    </tr>
  );
};

export default TransactionsTable;
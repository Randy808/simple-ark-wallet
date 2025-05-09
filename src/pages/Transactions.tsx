import React from 'react';
import TransactionsTable from '../components/transactions/TransactionsTable';

const Transactions: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Transaction History</h1>
      <TransactionsTable />
    </div>
  );
};

export default Transactions;
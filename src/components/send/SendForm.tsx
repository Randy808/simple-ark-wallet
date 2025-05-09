import React, { useState } from 'react';
import { QrCode, AlertCircle } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

const SendForm: React.FC = () => {
  const { activeWallet, sendTransaction } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const maxAmount = Math.max(0, activeWallet.balance - 0.0001).toFixed(8);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!recipient) {
      setError('Please enter a recipient address');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    const amountValue = parseFloat(amount);
    
    if (amountValue > activeWallet.balance) {
      setError('Insufficient balance');
      return;
    }
    
    setIsConfirming(true);
  };
  
  const handleConfirm = () => {
    const amountValue = parseFloat(amount);
    sendTransaction(recipient, amountValue);
    setIsConfirming(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      setIsSuccess(false);
      setRecipient('');
      setAmount('');
    }, 3000);
  };
  
  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 mb-4 flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Transaction Sent!</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Your transaction has been successfully submitted to the network
        </p>
        <button
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
          onClick={() => setIsSuccess(false)}
        >
          Done
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Send Bitcoin</h1>
        <p className="text-gray-500 dark:text-gray-400">Available: {activeWallet.balance} BTC</p>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-start">
          <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            To
          </label>
          <div className="relative">
            <input
              id="recipient"
              type="text"
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
              placeholder="Enter vtxo pubkey"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg"
              onClick={() => {}}
            >
              <QrCode size={18} />
            </button>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Amount (Sats)
            </label>
            <button
              type="button"
              className="text-sm text-purple-600 dark:text-purple-400 font-medium"
              onClick={() => setAmount(maxAmount)}
            >
              Max
            </button>
          </div>
          <input
            id="amount"
            type="number"
            step="1"
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Network Fee</span>
            <span className="text-gray-700 dark:text-gray-300">0.0001 BTC</span>
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors font-medium text-lg"
        >
          Review Transaction
        </button>
      </form>
      
      {isConfirming && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Confirm Transaction</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Sending</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{amount} BTC</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">To</p>
                <p className="text-md font-medium text-gray-900 dark:text-white break-all">{recipient}</p>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Network Fee</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">0.0001 BTC</p>
                </div>
                
                <div className="flex justify-between mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {(parseFloat(amount) + 0.0001).toFixed(8)} BTC
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                className="flex-1 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsConfirming(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
                onClick={handleConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendForm;
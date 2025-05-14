import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

interface BalanceCardProps {
  onSend: () => void;
  onReceive: () => void;
}


const BalanceCard: React.FC<BalanceCardProps> = ({ onSend, onReceive }) => {
  const { activeWallet, refreshWallet, getSoonestExpiry } = useWallet();
  const btcToUsd = 103314;
  const usdBalance = (activeWallet?.balance || 0) * btcToUsd / 100_000_000;
  let [daysUntilExpiry, setDaysUntilExpiry] = useState(0);
  let [expiryInfo, setExpiryInfo] = useState<any>();

  useEffect(() => {
    (async () => {
      let expiryInformation = await getSoonestExpiry();
      let d = Math.ceil((expiryInformation.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      setDaysUntilExpiry(d);
      setExpiryInfo(expiryInformation);
    })()
  }, [])


  const refreshFee = 0.0001;

  return (
    <div className="text-center py-12">
      <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Your Balance</h2>
      <div className="mb-2">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
          ${usdBalance.toLocaleString('en-US', { maximumFractionDigits: 2 })}
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">
          {Math.ceil((activeWallet?.balance || 1))} sats
        </p>
      </div>
      
      <div className="mt-4 mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
        <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-1">
          Expires in {daysUntilExpiry} days at block {expiryInfo?.height}
        </p>
        <button 
          onClick={refreshWallet}
          className="mt-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto"
        >
          <RefreshCw size={16} />
          <span>Refresh ({refreshFee} BTC fee)</span>
        </button>
      </div>
      
      <div className="flex justify-center gap-4">
        <button 
          onClick={onReceive}
          className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <ArrowDownLeft size={20} />
          <span>Receive</span>
        </button>
        <button 
          onClick={onSend}
          className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors flex items-center gap-2"
        >
          <ArrowUpRight size={20} />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
};

export default BalanceCard;
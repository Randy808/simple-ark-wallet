import React, { useState } from 'react';
import { Eye, EyeOff, Copy, RefreshCw, AlertCircle, Lock } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

const SeedPhraseView: React.FC = () => {
  const { user, isSeedPhraseVisible, toggleSeedPhraseVisibility } = useWallet();
  const [isConfirming, setIsConfirming] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(user.seedPhrase.join(' '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleConfirm = () => {
    setIsConfirming(false);
  };
  
  if (isConfirming) {
    return (
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
          <AlertCircle size={24} className="text-yellow-600 dark:text-yellow-400" />
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-4">
          View Recovery Phrase
        </h2>
        
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg mb-6">
          <p className="text-yellow-800 dark:text-yellow-300 text-sm">
            Your recovery phrase is the only way to recover your wallet if you lose access. 
            Never share it with anyone or store it digitally.
          </p>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">1</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Make sure no one is watching</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Check your surroundings before proceeding</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">2</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Store it securely</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Write it down and store in a secure location</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">3</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Never share with anyone</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Anyone with your phrase can access your funds</p>
            </div>
          </div>
        </div>
        
        <button
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
          onClick={handleConfirm}
        >
          I understand, show my phrase
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Recovery Phrase</h2>
      
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg mb-6 flex items-start">
        <AlertCircle size={16} className="text-yellow-700 dark:text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
        <p className="text-yellow-800 dark:text-yellow-300 text-sm">
          Write these words down in order and store them in a secure location. They are the only way to recover your wallet.
        </p>
      </div>
      
      <div className="relative">
        <div 
          className={`grid grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-4 ${
            !isSeedPhraseVisible ? 'blur-md select-none' : ''
          }`}
        >
          {user.seedPhrase.map((word, index) => (
            <div key={index} className="flex items-center">
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-xs font-medium text-indigo-600 dark:text-indigo-400 mr-2">
                {index + 1}
              </span>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{word}</span>
            </div>
          ))}
        </div>
        
        {!isSeedPhraseVisible && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow">
              <Lock size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Tap to reveal</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex space-x-3 mb-6">
        <button
          className="flex items-center justify-center flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          onClick={toggleSeedPhraseVisibility}
        >
          {isSeedPhraseVisible ? (
            <>
              <EyeOff size={16} className="mr-2" />
              <span>Hide</span>
            </>
          ) : (
            <>
              <Eye size={16} className="mr-2" />
              <span>Reveal</span>
            </>
          )}
        </button>
        
        <button
          className="flex items-center justify-center flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          onClick={handleCopy}
          disabled={!isSeedPhraseVisible}
        >
          {copied ? (
            <>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={16} className="mr-2" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      
      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className="flex items-center mb-2">
          <RefreshCw size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Back up again</h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Keeping your phrase safe is your responsibility. It cannot be recovered if lost.
        </p>
      </div>
    </div>
  );
};

export default SeedPhraseView;
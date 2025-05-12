import React from "react";
import { useWallet } from "../context/WalletContext";
import { Copy, Share2 } from "lucide-react";

const Receive: React.FC = () => {
  const { activeWallet } = useWallet();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeWallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Bitcoin Address",
          text: activeWallet.address,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Receive Bitcoin
      </h2>

      <div className="mb-8">
        <div className="w-full max-w-xs mx-auto bg-white p-4 rounded-lg shadow-inner mb-6">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${activeWallet.address}`}
            alt="QR Code"
            className="w-full h-full"
          />
        </div>

        <div className="relative">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg break-all text-sm text-gray-600 dark:text-gray-300 font-mono">
            {`${activeWallet.address.substring(
              0,
              16
            )}...${activeWallet.address.substring(
              activeWallet.address.length - 16,
              activeWallet.address.length
            )}`}
          </div>

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-2">
            <button
              onClick={handleCopy}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Copy size={16} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {copied && (
          <p className="text-sm text-purple-600 dark:text-purple-400 mt-2 text-center">
            Address copied to clipboard!
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
          <h3 className="text-sm font-medium text-purple-900 dark:text-purple-300 mb-1">
            Only Bitcoin
          </h3>
          <p className="text-sm text-purple-600 dark:text-purple-400">
            Send only Ark-locked Bitcoin (BTC) to this public key. Sending any other coins may
            result in permanent loss.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            Network Fee
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The sender will pay the network fee. You'll receive the exact amount
            sent.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Receive;

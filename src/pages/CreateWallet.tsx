import { X, Check } from "lucide-react";
import { useState } from "react";
import { useWallet } from "../context/WalletContext";

export default function CreateWallet() {
  let { networks, createWallet } = useWallet();
  const [newWallet, setNewWallet] = useState({
    name: "",
    network: "",
    blockExplorerUrl: "",
    aspUrl: "",
  });

  let handleCreateWallet = async () => {
    await createWallet(
      newWallet.name,
      newWallet.network,
      newWallet.aspUrl,
      newWallet.blockExplorerUrl
    );
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Create New Wallet
          </h3>
          <button
            onClick={() => {}}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Wallet Name
            </label>
            <input
              type="text"
              value={newWallet.name}
              onChange={(e) =>
                setNewWallet({ ...newWallet, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter wallet name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Network
            </label>
            <select
              value={newWallet.network}
              onChange={(e) =>
                setNewWallet({ ...newWallet, network: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select network</option>
              {networks.map((network) => (
                <option key={network.id} value={network.id}>
                  {network.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Block Explorer URL
            </label>
            <input
              type="url"
              value={newWallet.blockExplorerUrl}
              onChange={(e) =>
                setNewWallet({
                  ...newWallet,
                  blockExplorerUrl: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ASP URL
            </label>
            <input
              type="url"
              value={newWallet.aspUrl}
              onChange={(e) =>
                setNewWallet({ ...newWallet, aspUrl: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="https://asp.example.com"
            />
          </div>
        </div>

        <div className="mt-6 flex space-x-3">
          <button
            // onClick={() => setIsCreating(false)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateWallet}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
            disabled={
              !newWallet.name ||
              !newWallet.network ||
              !newWallet.blockExplorerUrl ||
              !newWallet.aspUrl
            }
          >
            <Check size={16} />
            <span>Create</span>
          </button>
        </div>
      </div>
    </>
  );
}

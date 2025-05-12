import React, { useState } from "react";
import { FolderOpen, AlertCircle } from "lucide-react";
import { useWallet } from "../context/WalletContext";
import {
  exists,
  writeTextFile,
  readTextFile,
  BaseDirectory,
  mkdir,
} from "@tauri-apps/plugin-fs";

interface SetupProps {
  onContinue: Function;
}

const Setup: React.FC<SetupProps> = ({
  onContinue,
}: {
  onContinue: Function;
}) => {
  // const { completeBinarySetup } = useWallet();

  async function completeBinarySetup(path: string) {
    let barkPath = path;

    // Ensure AppData directory exists (Tauri handles the base directory itself, so you only need to ensure the file-level path is safe)
    await mkdir("", {
      baseDir: BaseDirectory.AppData,
      recursive: true,
    });

    const filePath = "bark_config.txt";
    await writeTextFile(filePath, barkPath, {
      baseDir: BaseDirectory.AppData,
    });

    onContinue();
  }

  const [path, setPath] = useState("");
  const [error, setError] = useState("");

  const handleSelectPath = async () => {
    // Simulating path selection
    // Ask user to pick a directory
    const { open } = await import("@tauri-apps/plugin-dialog");
    const selectedPath = await open({ directory: true });
    setPath(selectedPath || "");
  };

  const handleContinue = () => {
    if (!path) {
      setError("Please select a path for the binary");
      return;
    }
    completeBinarySetup(path);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Ark Wallet
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Before we begin, we need to set up the wallet binary on your system.
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle
              className="text-purple-600 dark:text-purple-400 mt-1 mr-3"
              size={20}
            />
            <p className="text-sm text-purple-700 dark:text-purple-300">
              The wallet binary is required for secure key management and
              transaction signing. Please choose a location where you have write
              permissions.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Binary Location
          </label>
          <div className="flex items-center">
            <input
              type="text"
              value={path}
              readOnly
              className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-l-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none"
              placeholder="Select a path..."
            />
            <button
              onClick={handleSelectPath}
              className="px-4 py-3 bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-700 rounded-r-xl text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <FolderOpen size={20} />
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </div>

        <button
          onClick={handleContinue}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors font-medium"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Setup;

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { Wallet, Transaction, User } from "../types";
import { mockWallets, mockTransactions, mockUser } from "../data/mockData";
import { invoke } from "@tauri-apps/api/core";

interface WalletContextType {
  wallets: Wallet[];
  transactions: Transaction[];
  user: User;
  activeWallet: Wallet;
  isSeedPhraseVisible: boolean;
  setWallets: React.Dispatch<React.SetStateAction<Wallet[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  setActiveWallet: (walletId: string) => void;
  addWallet: (wallet: Omit<Wallet, "id" | "isActive">) => void;
  sendTransaction: (address: string, amount: number) => void;
  toggleSeedPhraseVisibility: () => void;
  refreshWallet: () => void;
  getSoonestExpiry: () => any;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

type Vtxo = {
  id: string;
  amount_sat: number;
  vtxo_type: "arkoor"; // If there are other possible values, change this to: string
  utxo: string;
  user_pubkey: string;
  asp_pubkey: string;
  expiry_height: number;
  spk: {
    Exit: {
      exit_delta: number;
    };
  };
};

type BarkBalance = {
  onchain_sat: number;
  offchain_sat: number;
  pending_exit_sat: number;
};

export const WalletProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [wallets, setWallets] = useState<Wallet[]>(mockWallets);
  const [transactions, setTransactions] =
    useState<Transaction[]>(mockTransactions);
  const [user, setUser] = useState<User>(mockUser);
  const [isSeedPhraseVisible, setIsSeedPhraseVisible] = useState(false);

  const activeWallet = wallets.find((wallet) => wallet.isActive) || wallets[0];

  async function updateBalance() {
    let fetched_balance: string = await invoke("get_balance");
    let b: BarkBalance = JSON.parse(fetched_balance);

    setWallets(
      wallets.map((wallet) =>
        wallet.id === activeWallet.id ? { ...wallet, balance: b.offchain_sat } : wallet
      )
    );
  }

  useEffect(() => {
    (async () => {
      await updateBalance();
    })();
  }, []);

  const setActiveWallet = (walletId: string) => {
    setWallets(
      wallets.map((wallet) => ({
        ...wallet,
        isActive: wallet.id === walletId,
      }))
    );
  };

  const addWallet = (wallet: Omit<Wallet, "id" | "isActive">) => {
    const newId = (wallets.length + 1).toString();
    const newWallet = {
      ...wallet,
      id: newId,
      isActive: false,
    };

    setWallets([...wallets, newWallet]);
  };

  const sendTransaction = async (address: string, amount: number) => {
    if (!activeWallet) return;

    let vtxoResponse: string = await invoke("send_money", {
      pubkey: address,
      amount,
    });

    await updateBalance();

    const fee = 0.0001;
    const newTransaction: Transaction = {
      id: (transactions.length + 1).toString(),
      type: "send",
      amount: amount,
      fee: fee,
      timestamp: Date.now(),
      address: address,
      status: "pending",
      walletId: activeWallet.id,
    };

    setTransactions([newTransaction, ...transactions]);

    setWallets(
      wallets.map((wallet) =>
        wallet.id === activeWallet.id
          ? { ...wallet, balance: wallet.balance - amount - fee }
          : wallet
      )
    );

    setTimeout(() => {
      setTransactions(
        transactions.map((tx) =>
          tx.id === newTransaction.id ? { ...tx, status: "completed" } : tx
        )
      );
    }, 2000);
  };

  const refreshWallet = () => {
    if (!activeWallet) return;

    const fee = 0.0001;
    const newExpiryBlock = activeWallet.expiryBlock + 2016; // Approximately 2 weeks worth of blocks
    const newExpiryDate = new Date(
      new Date(activeWallet.expiryDate).getTime() + 14 * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0];

    setWallets(
      wallets.map((wallet) =>
        wallet.id === activeWallet.id
          ? {
              ...wallet,
              balance: wallet.balance - fee,
              expiryBlock: newExpiryBlock,
              expiryDate: newExpiryDate,
            }
          : wallet
      )
    );

    const newTransaction: Transaction = {
      id: (transactions.length + 1).toString(),
      type: "send",
      amount: fee,
      fee: fee,
      timestamp: Date.now(),
      address: "Refresh Transaction",
      status: "completed",
      walletId: activeWallet.id,
    };

    setTransactions([newTransaction, ...transactions]);
  };

  const toggleSeedPhraseVisibility = () => {
    setIsSeedPhraseVisible(!isSeedPhraseVisible);
  };


  function blockDeltaToDate(blocksFromNow: number): Date {
    const minutesPerBlock = 10;
    const totalMinutes = blocksFromNow * minutesPerBlock;
    const now = new Date();
    return new Date(now.getTime() + totalMinutes * 60 * 1000);
  }

  async function getBlockHeight() {
    let blockHeightResponse = await fetch("http://localhost:3000/blocks/tip/height");
    return blockHeightResponse.json();
  }  

  async function getSoonestExpiry(): Promise<{date: Date, height: number}> {
    let serializedVtxos: string = await invoke("get_vtxos")
    let vtxos: Vtxo[] = JSON.parse(serializedVtxos);

    let smallestExpiryHeight = Number.MAX_SAFE_INTEGER;
    for(let vtxo of vtxos) {
      if(vtxo.expiry_height < smallestExpiryHeight) {
        smallestExpiryHeight = vtxo.expiry_height;
      }
    }

    let blockHeight = await getBlockHeight();
    return {
      date: blockDeltaToDate(smallestExpiryHeight - blockHeight),
      height: blockHeight
    }
  }

  return (
    <WalletContext.Provider
      value={{
        wallets,
        transactions,
        user,
        activeWallet,
        isSeedPhraseVisible,
        setWallets,
        setTransactions,
        setActiveWallet,
        addWallet,
        sendTransaction,
        toggleSeedPhraseVisibility,
        refreshWallet,
        getSoonestExpiry
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

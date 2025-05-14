export interface Wallet {
  id: string;
  name: string;
  address?: string;
  balance: number;
  isActive: boolean;
  expiryBlock?: number;
  expiryDate?: string;
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive';
  amount: number;
  fee: number;
  timestamp: number;
  address: string;
  status: 'pending' | 'completed' | 'failed';
  walletId: string;
}

export interface User {
  seedPhrase: string[];
}

export interface Network {
  id: string;
  name: string;
  symbol: string;
  isTestnet: boolean;
  color: string;
}
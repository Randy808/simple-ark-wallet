import { Wallet, Transaction, User } from '../types';

export const mockWallets: Wallet[] = [
  {
    id: '1',
    name: 'Main Wallet',
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    balance: 1.245,
    isActive: true,
    expiryBlock: 840000,
    expiryDate: '2024-04-15',
  },
  {
    id: '2',
    name: 'Savings',
    address: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
    balance: 0.785,
    isActive: false,
    expiryBlock: 840500,
    expiryDate: '2024-04-20',
  },
  {
    id: '3',
    name: 'Business',
    address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    balance: 0.042,
    isActive: false,
    expiryBlock: 841000,
    expiryDate: '2024-04-25',
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'receive',
    amount: 0.125,
    fee: 0.0001,
    timestamp: Date.now() - 86400000, // 1 day ago
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    status: 'completed',
    walletId: '1',
  },
  {
    id: '2',
    type: 'send',
    amount: 0.05,
    fee: 0.0001,
    timestamp: Date.now() - 172800000, // 2 days ago
    address: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
    status: 'completed',
    walletId: '1',
  },
  {
    id: '3',
    type: 'receive',
    amount: 0.37,
    fee: 0.0001,
    timestamp: Date.now() - 345600000, // 4 days ago
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    status: 'completed',
    walletId: '1',
  },
  {
    id: '4',
    type: 'send',
    amount: 0.12,
    fee: 0.0001,
    timestamp: Date.now() - 518400000, // 6 days ago
    address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    status: 'completed',
    walletId: '1',
  },
  {
    id: '5',
    type: 'send',
    amount: 0.005,
    fee: 0.0001,
    timestamp: Date.now() - 60000, // 1 minute ago
    address: '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5',
    status: 'pending',
    walletId: '1',
  },
];

export const mockUser: User = {
  seedPhrase: [
    'abandon', 'ability', 'able', 'about', 'above', 'absent',
    'absorb', 'abstract', 'absurd', 'abuse', 'access', 'accident'
  ],
};
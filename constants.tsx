
import { Wallet, Asset } from './types';

export const INITIAL_WALLETS: Wallet[] = [
  {
    id: 'w1',
    address: '85ay4kP7u9mZ8xJsc8',
    balance: '0.001',
    source: 'Debot',
    labels: ['warning', 'lock'],
  },
  {
    id: 'w2',
    address: '4W21vYqN2zL8RwoB',
    balance: '0.003',
    source: 'Debot',
    labels: ['warning', 'lock'],
  },
  {
    id: 'w3',
    address: 'EbpNy9Q1xL7iH6C',
    balance: '0.000',
    source: 'Telegram',
  },
  {
    id: 'w4',
    address: '安全钱包',
    balance: '0.007',
    source: 'Debot',
    isSafety: true,
  }
];

export const MOCK_ASSETS: Asset[] = [
  { symbol: 'Claude_OS', name: 'Claude_OS', unrealizedPnL: '-$19.19', unrealizedPnLPercent: '-97.3%', realizedPnL: '$0', realizedPnLPercent: '0%', totalProfit: '-$19.19', balance: '$0.5257', avgBuy: '$18.42', avgSell: '$0', trades: '1', winLoss: '1/0' },
  { symbol: 'Kisuke', name: 'Kisuke', unrealizedPnL: '-$1.994', unrealizedPnLPercent: '-99%', realizedPnL: '$0', realizedPnLPercent: '0%', totalProfit: '-$1.994', balance: '$0.0187', avgBuy: '$1.742', avgSell: '$0', trades: '1', winLoss: '1/0' },
  { symbol: 'BBC', name: 'BBC', unrealizedPnL: '-$1.954', unrealizedPnLPercent: '-97.2%', realizedPnL: '$0', realizedPnLPercent: '0%', totalProfit: '-$1.954', balance: '$0.0553', avgBuy: '$1.739', avgSell: '$0', trades: '1', winLoss: '1/0' },
  { symbol: 'PUQI', name: 'PUQI', unrealizedPnL: '-$1.979', unrealizedPnLPercent: '-97.7%', realizedPnL: '$0', realizedPnLPercent: '0%', totalProfit: '-$1.979', balance: '$0.0466', avgBuy: '$1.751', avgSell: '$0', trades: '1', winLoss: '1/0' },
  { symbol: 'ICE', name: 'ICE', unrealizedPnL: '-$1.958', unrealizedPnLPercent: '-96.7%', realizedPnL: '$0', realizedPnLPercent: '0%', totalProfit: '-$1.958', balance: '$0.0666', avgBuy: '$1.752', avgSell: '$0', trades: '1', winLoss: '1/0' },
  { symbol: 'FPK', name: 'FPK', unrealizedPnL: '-$1.96', unrealizedPnLPercent: '-97.5%', realizedPnL: '$0', realizedPnLPercent: '0%', totalProfit: '-$1.96', balance: '$0.0489', avgBuy: '$1.737', avgSell: '$0', trades: '1', winLoss: '1/0' },
];

export interface VanityRequirement {
  vipLevel: number;
  volume: number;
  label: string;
  chain: 'EVM' | 'Solana';
  digits: number;
}

export const VANITY_REQUIREMENTS: VanityRequirement[] = [
  // EVM Levels
  { vipLevel: 0, volume: 0, label: '6 位靓号', chain: 'EVM', digits: 6 },
  { vipLevel: 1, volume: 500000, label: '7 位靓号', chain: 'EVM', digits: 7 },
  { vipLevel: 3, volume: 3000000, label: '8 位靓号', chain: 'EVM', digits: 8 },
  // Solana Levels
  { vipLevel: 0, volume: 0, label: '3 位靓号', chain: 'Solana', digits: 3 },
  { vipLevel: 1, volume: 500000, label: '4 位靓号', chain: 'Solana', digits: 4 },
  { vipLevel: 3, volume: 3000000, label: '5 位靓号', chain: 'Solana', digits: 5 },
];

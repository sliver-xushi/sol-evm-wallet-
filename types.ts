
export interface Asset {
  symbol: string;
  name: string;
  unrealizedPnL: string;
  unrealizedPnLPercent: string;
  realizedPnL: string;
  realizedPnLPercent: string;
  totalProfit: string;
  balance: string;
  avgBuy: string;
  avgSell: string;
  trades: string;
  winLoss: string;
}

export interface Wallet {
  id: string;
  address: string;
  displayAddress?: string;
  balance: string;
  source: 'Debot' | 'Telegram' | 'External';
  isSafety?: boolean;
  isVanity?: boolean;
  isCustodied?: boolean;
  labels?: string[];
}

export interface UserStatus {
  tradingVolume: number;
  unlockedVanityLevel: number; // 6 for 6-digit, 7 for 7-digit, etc.
}

export enum VanityStyle {
  SYSTEM_RECOMMENDED = 'RECOMMENDED',
  CUSTOM = 'CUSTOM'
}

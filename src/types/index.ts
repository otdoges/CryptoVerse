
export interface User {
  id: string;
  email: string;
  username: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  balance: number;
  assets: Asset[];
  createdAt: string;
  updatedAt: string;
}

export interface Asset {
  id: string;
  tokenId: string;
  symbol: string;
  amount: number;
  averagePrice: number;
  currentPrice: number;
}

export interface Transaction {
  id: string;
  portfolioId: string;
  tokenId: string;
  type: 'BUY' | 'SELL';
  amount: number;
  price: number;
  total: number;
  timestamp: string;
}

export interface WatchlistItem {
  id: string;
  userId: string;
  tokenId: string;
  symbol: string;
  name: string;
  addedAt: string;
}

export type OrderType = 'MARKET' | 'LIMIT' | 'STOP_LOSS';

export interface Order {
  type: OrderType;
  side: 'BUY' | 'SELL';
  symbol: string;
  amount: number;
  price?: number;
  stopPrice?: number;
  total?: number;
}

export interface TimeframeOption {
  label: string;
  value: string;
}

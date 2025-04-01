
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

// DexScreener API Types
export interface DexScreenerPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: DexToken;
  quoteToken: DexToken;
  priceNative: string;
  priceUsd: string;
  txns: {
    m5: {
      buys: number;
      sells: number;
    };
    h1: {
      buys: number;
      sells: number;
    };
    h6: {
      buys: number;
      sells: number;
    };
    h24: {
      buys: number;
      sells: number;
    };
  };
  volume: {
    h24: number;
    h6: number;
    h1: number;
    m5: number;
  };
  priceChange: {
    h24: number;
    h6: number;
    h1: number;
    m5: number;
  };
  liquidity?: {
    usd?: number;
    base?: number;
    quote?: number;
  };
  fdv?: number;
  marketCap?: number;
}

export interface DexToken {
  address: string;
  name: string;
  symbol: string;
}

export interface DexScreenerSearchResponse {
  pairs: DexScreenerPair[];
}

// Supabase Portfolio Types
export interface SupabasePortfolio {
  id: string;
  user_id: string;
  token_address: string;
  chain_id: string;
  token_symbol: string;
  token_name: string;
  amount: number;
  average_price: number;
  created_at: string;
  updated_at: string;
}

// Supabase Transaction Types
export interface SupabaseTransaction {
  id: string;
  user_id: string;
  token_address: string;
  chain_id: string;
  token_symbol: string;
  transaction_type: 'BUY' | 'SELL';
  amount: number;
  price: number;
  total_value: number;
  timestamp: string;
}

// Supabase Watchlist Types
export interface SupabaseWatchlist {
  id: string;
  user_id: string;
  token_address: string;
  chain_id: string;
  token_symbol: string;
  token_name: string;
  created_at: string;
}

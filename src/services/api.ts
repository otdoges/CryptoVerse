
import { Cryptocurrency, Portfolio, Asset, Transaction, WatchlistItem } from '@/types';

// Mock cryptocurrency data based on real market data
const mockCryptocurrencies: Cryptocurrency[] = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    current_price: 64287.22,
    market_cap: 1259822835234,
    market_cap_rank: 1,
    fully_diluted_valuation: 1349936110944,
    total_volume: 28319038935,
    high_24h: 64852.36,
    low_24h: 63228.11,
    price_change_24h: 627.64,
    price_change_percentage_24h: 0.98583,
    market_cap_change_24h: 12265777316,
    market_cap_change_percentage_24h: 0.98365,
    circulating_supply: 19600000,
    total_supply: 21000000,
    max_supply: 21000000,
    ath: 73737.33,
    ath_change_percentage: -12.81685,
    ath_date: '2024-03-14T07:10:34.572Z',
    atl: 67.81,
    atl_change_percentage: 94800.99168,
    atl_date: '2013-07-06T00:00:00.000Z',
    last_updated: '2023-05-10T12:30:09.416Z'
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    current_price: 3452.58,
    market_cap: 414971291271,
    market_cap_rank: 2,
    fully_diluted_valuation: 414971291271,
    total_volume: 14640979356,
    high_24h: 3487.22,
    low_24h: 3389.75,
    price_change_24h: 25.31,
    price_change_percentage_24h: 0.7381,
    market_cap_change_24h: 3112731223,
    market_cap_change_percentage_24h: 0.75521,
    circulating_supply: 120220572.85258,
    total_supply: 120220572.85258,
    max_supply: null,
    ath: 4891.7,
    ath_change_percentage: -29.42118,
    ath_date: '2021-11-16T14:24:19.604Z',
    atl: 0.432979,
    atl_change_percentage: 797470.54606,
    atl_date: '2015-10-20T00:00:00.000Z',
    last_updated: '2023-05-10T12:30:34.342Z'
  },
  {
    id: 'solana',
    symbol: 'sol',
    name: 'Solana',
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    current_price: 142.89,
    market_cap: 62149150676,
    market_cap_rank: 5,
    fully_diluted_valuation: 79468789018,
    total_volume: 2687542470,
    high_24h: 145.12,
    low_24h: 138.42,
    price_change_24h: 0.422523,
    price_change_percentage_24h: 0.29663,
    market_cap_change_24h: 194158942,
    market_cap_change_percentage_24h: 0.31341,
    circulating_supply: 435200064.662603,
    total_supply: 556703498.239628,
    max_supply: null,
    ath: 259.96,
    ath_change_percentage: -45.03325,
    ath_date: '2021-11-06T21:54:35.825Z',
    atl: 0.50079,
    atl_change_percentage: 28431.18202,
    atl_date: '2020-05-11T19:35:23.449Z',
    last_updated: '2023-05-10T12:30:44.536Z'
  },
  {
    id: 'binancecoin',
    symbol: 'bnb',
    name: 'BNB',
    image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
    current_price: 583.36,
    market_cap: 89220193156,
    market_cap_rank: 4,
    fully_diluted_valuation: 116670617956,
    total_volume: 1176633547,
    high_24h: 589.78,
    low_24h: 570.35,
    price_change_24h: 7.37,
    price_change_percentage_24h: 1.27917,
    market_cap_change_24h: 1122051535,
    market_cap_change_percentage_24h: 1.27322,
    circulating_supply: 153856150,
    total_supply: 153856150,
    max_supply: 200000000,
    ath: 686.31,
    ath_change_percentage: -14.79823,
    ath_date: '2021-05-10T07:24:17.097Z',
    atl: 0.0398177,
    atl_change_percentage: 1464766.53547,
    atl_date: '2017-10-19T00:00:00.000Z',
    last_updated: '2023-05-10T12:30:14.978Z'
  },
  {
    id: 'cardano',
    symbol: 'ada',
    name: 'Cardano',
    image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
    current_price: 0.462381,
    market_cap: 16256686508,
    market_cap_rank: 9,
    fully_diluted_valuation: 20805201339,
    total_volume: 358945151,
    high_24h: 0.466682,
    low_24h: 0.450498,
    price_change_24h: 0.00664894,
    price_change_percentage_24h: 1.45912,
    market_cap_change_24h: 227647080,
    market_cap_change_percentage_24h: 1.42077,
    circulating_supply: 35173634.1567, // Fixed the invalid number format here
    total_supply: 45000000000,
    max_supply: 45000000000,
    ath: 3.09,
    ath_change_percentage: -84.99641,
    ath_date: '2021-09-02T06:00:10.474Z',
    atl: 0.01925275,
    atl_change_percentage: 2300.29498,
    atl_date: '2020-03-13T02:22:55.044Z',
    last_updated: '2023-05-10T12:30:01.001Z'
  }
];

// Mock portfolio data
let mockPortfolio: Portfolio = {
  id: '1',
  userId: '1',
  name: 'My Portfolio',
  balance: 100000,
  assets: [
    {
      id: '1',
      tokenId: 'bitcoin',
      symbol: 'BTC',
      amount: 0.5,
      averagePrice: 60000,
      currentPrice: mockCryptocurrencies.find(crypto => crypto.id === 'bitcoin')?.current_price || 0
    },
    {
      id: '2',
      tokenId: 'ethereum',
      symbol: 'ETH',
      amount: 3,
      averagePrice: 3200,
      currentPrice: mockCryptocurrencies.find(crypto => crypto.id === 'ethereum')?.current_price || 0
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Mock transactions
const mockTransactions: Transaction[] = [
  {
    id: '1',
    portfolioId: '1',
    tokenId: 'bitcoin',
    type: 'BUY',
    amount: 0.5,
    price: 60000,
    total: 30000,
    timestamp: '2023-04-30T14:25:10.851Z'
  },
  {
    id: '2',
    portfolioId: '1',
    tokenId: 'ethereum',
    type: 'BUY',
    amount: 3,
    price: 3200,
    total: 9600,
    timestamp: '2023-05-03T10:15:22.431Z'
  }
];

// Mock watchlist
let mockWatchlist: WatchlistItem[] = [
  {
    id: '1',
    userId: '1',
    tokenId: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    addedAt: '2023-04-28T08:12:01.234Z'
  },
  {
    id: '2',
    userId: '1',
    tokenId: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    addedAt: '2023-04-28T08:12:10.123Z'
  },
  {
    id: '3',
    userId: '1',
    tokenId: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    addedAt: '2023-04-29T14:22:45.678Z'
  }
];

// API functions
export const fetchCryptocurrencies = async (): Promise<Cryptocurrency[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockCryptocurrencies;
};

export const fetchCryptocurrencyById = async (id: string): Promise<Cryptocurrency | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockCryptocurrencies.find(crypto => crypto.id === id);
};

export const fetchPortfolio = async (userId: string): Promise<Portfolio> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  return {
    ...mockPortfolio,
    assets: mockPortfolio.assets.map(asset => ({
      ...asset,
      currentPrice: mockCryptocurrencies.find(crypto => crypto.id === asset.tokenId)?.current_price || asset.currentPrice
    }))
  };
};

export const fetchTransactions = async (portfolioId: string): Promise<Transaction[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return mockTransactions.filter(transaction => transaction.portfolioId === portfolioId);
};

export const fetchWatchlist = async (userId: string): Promise<WatchlistItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockWatchlist.filter(item => item.userId === userId);
};

export const addToWatchlist = async (userId: string, cryptocurrency: Cryptocurrency): Promise<WatchlistItem> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const newItem: WatchlistItem = {
    id: Date.now().toString(),
    userId,
    tokenId: cryptocurrency.id,
    symbol: cryptocurrency.symbol.toUpperCase(),
    name: cryptocurrency.name,
    addedAt: new Date().toISOString()
  };
  
  mockWatchlist = [...mockWatchlist, newItem];
  
  return newItem;
};

export const removeFromWatchlist = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  mockWatchlist = mockWatchlist.filter(item => item.id !== id);
};

export const executeOrder = async (
  portfolioId: string,
  order: { tokenId: string, type: 'BUY' | 'SELL', amount: number, price: number }
): Promise<Transaction> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const { tokenId, type, amount, price } = order;
  const total = amount * price;
  
  // Update portfolio balance and assets
  if (type === 'BUY') {
    mockPortfolio.balance -= total;
    
    const existingAssetIndex = mockPortfolio.assets.findIndex(asset => asset.tokenId === tokenId);
    if (existingAssetIndex >= 0) {
      const existingAsset = mockPortfolio.assets[existingAssetIndex];
      const totalAmount = existingAsset.amount + amount;
      const newAveragePrice = ((existingAsset.amount * existingAsset.averagePrice) + (amount * price)) / totalAmount;
      
      mockPortfolio.assets[existingAssetIndex] = {
        ...existingAsset,
        amount: totalAmount,
        averagePrice: newAveragePrice,
        currentPrice: price
      };
    } else {
      mockPortfolio.assets.push({
        id: Date.now().toString(),
        tokenId,
        symbol: mockCryptocurrencies.find(crypto => crypto.id === tokenId)?.symbol.toUpperCase() || tokenId.toUpperCase(),
        amount,
        averagePrice: price,
        currentPrice: price
      });
    }
  } else if (type === 'SELL') {
    mockPortfolio.balance += total;
    
    const existingAssetIndex = mockPortfolio.assets.findIndex(asset => asset.tokenId === tokenId);
    if (existingAssetIndex >= 0) {
      const existingAsset = mockPortfolio.assets[existingAssetIndex];
      const remainingAmount = existingAsset.amount - amount;
      
      if (remainingAmount > 0) {
        mockPortfolio.assets[existingAssetIndex] = {
          ...existingAsset,
          amount: remainingAmount,
          currentPrice: price
        };
      } else {
        mockPortfolio.assets = mockPortfolio.assets.filter((_, index) => index !== existingAssetIndex);
      }
    }
  }
  
  mockPortfolio.updatedAt = new Date().toISOString();
  
  // Create a new transaction
  const newTransaction: Transaction = {
    id: Date.now().toString(),
    portfolioId,
    tokenId,
    type,
    amount,
    price,
    total,
    timestamp: new Date().toISOString()
  };
  
  mockTransactions.push(newTransaction);
  
  return newTransaction;
};

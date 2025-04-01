
import { DexScreenerPair, DexScreenerSearchResponse } from "@/types";

const DEX_SCREENER_API_BASE_URL = "https://api.dexscreener.com/latest";

/**
 * Search for token pairs across all supported DEXes
 * @param query - Token symbol, name or address
 * @returns A list of pairs matching the search query
 */
export const searchTokenPairs = async (query: string): Promise<DexScreenerPair[]> => {
  try {
    const response = await fetch(`${DEX_SCREENER_API_BASE_URL}/dex/search?q=${query}`);
    
    if (!response.ok) {
      throw new Error(`DexScreener API error: ${response.status}`);
    }
    
    const data: DexScreenerSearchResponse = await response.json();
    return data.pairs || [];
  } catch (error) {
    console.error("Failed to search token pairs:", error);
    throw error;
  }
};

/**
 * Get pair information by pair address
 * @param pairAddress - The DEX pair address
 * @param chainId - Optional chain ID filter
 * @returns Pair information
 */
export const getPairByAddress = async (pairAddress: string, chainId?: string): Promise<DexScreenerPair | null> => {
  try {
    let url = `${DEX_SCREENER_API_BASE_URL}/dex/pairs/${pairAddress}`;
    if (chainId) {
      url = `${DEX_SCREENER_API_BASE_URL}/dex/pairs/${chainId}/${pairAddress}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`DexScreener API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.pairs && data.pairs.length > 0 ? data.pairs[0] : null;
  } catch (error) {
    console.error("Failed to get pair by address:", error);
    throw error;
  }
};

/**
 * Get all pairs for a specific token address
 * @param tokenAddress - The token address
 * @returns List of pairs containing the token
 */
export const getPairsByTokenAddress = async (tokenAddress: string): Promise<DexScreenerPair[]> => {
  try {
    const response = await fetch(`${DEX_SCREENER_API_BASE_URL}/dex/tokens/${tokenAddress}`);
    
    if (!response.ok) {
      throw new Error(`DexScreener API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.pairs || [];
  } catch (error) {
    console.error("Failed to get pairs by token address:", error);
    throw error;
  }
};

/**
 * Get trending pairs based on volume
 * @returns List of trending pairs
 */
export const getTrendingPairs = async (): Promise<DexScreenerPair[]> => {
  try {
    // This is a bit of a hack since DexScreener doesn't have a direct "trending" endpoint
    // We're searching for common tokens and sorting by volume
    const queries = ["ethereum", "bitcoin", "solana", "bnb"];
    const allPairs: DexScreenerPair[] = [];
    
    for (const query of queries) {
      const pairs = await searchTokenPairs(query);
      allPairs.push(...pairs);
    }
    
    // Sort by 24h volume and take top 10
    return allPairs
      .filter(pair => pair.volume && pair.volume.h24)
      .sort((a, b) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0))
      .slice(0, 10);
  } catch (error) {
    console.error("Failed to get trending pairs:", error);
    throw error;
  }
};


import { supabase } from "@/integrations/supabase/client";
import { User, SupabasePortfolio, SupabaseTransaction, SupabaseWatchlist } from "@/types";
import { toast } from "sonner";

// Authentication
export const loginWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const registerWithEmail = async (email: string, password: string, username: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) {
      return null;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.session.user.id)
      .single();
      
    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return null;
    }
    
    return {
      id: data.session.user.id,
      email: data.session.user.email || '',
      username: profileData?.username || data.session.user.email?.split("@")[0] || '',
    };
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
};

// Portfolio operations
export const getUserPortfolio = async (userId: string): Promise<SupabasePortfolio[]> => {
  try {
    const { data, error } = await supabase
      .from("portfolios")
      .select("*")
      .eq("user_id", userId);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Get portfolio error:", error);
    throw error;
  }
};

export const updatePortfolioAsset = async (
  portfolioItem: Partial<SupabasePortfolio> & { user_id: string; token_address: string; chain_id: string }
): Promise<SupabasePortfolio> => {
  try {
    // Check if the asset already exists
    const { data: existingData, error: queryError } = await supabase
      .from("portfolios")
      .select("*")
      .eq("user_id", portfolioItem.user_id)
      .eq("token_address", portfolioItem.token_address)
      .eq("chain_id", portfolioItem.chain_id)
      .single();
    
    if (queryError && queryError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw queryError;
    }
    
    if (existingData) {
      // Update existing asset
      const { data, error } = await supabase
        .from("portfolios")
        .update({
          amount: portfolioItem.amount,
          average_price: portfolioItem.average_price,
          updated_at: new Date().toISOString()
        })
        .eq("id", existingData.id)
        .select("*")
        .single();
      
      if (error) throw error;
      return data!;
    } else {
      // Insert new asset
      const { data, error } = await supabase
        .from("portfolios")
        .insert([portfolioItem])
        .select("*")
        .single();
      
      if (error) throw error;
      return data!;
    }
  } catch (error) {
    console.error("Update portfolio asset error:", error);
    toast.error("Failed to update portfolio");
    throw error;
  }
};

export const deletePortfolioAsset = async (assetId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("portfolios")
      .delete()
      .eq("id", assetId);
    
    if (error) throw error;
  } catch (error) {
    console.error("Delete portfolio asset error:", error);
    throw error;
  }
};

// Transaction operations
export const getUserTransactions = async (userId: string): Promise<SupabaseTransaction[]> => {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("timestamp", { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Get transactions error:", error);
    throw error;
  }
};

export const addTransaction = async (transaction: Omit<SupabaseTransaction, 'id' | 'created_at'>): Promise<SupabaseTransaction> => {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .insert([transaction])
      .select("*")
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Add transaction error:", error);
    throw error;
  }
};

// Watchlist operations
export const getUserWatchlist = async (userId: string): Promise<SupabaseWatchlist[]> => {
  try {
    const { data, error } = await supabase
      .from("watchlists")
      .select("*")
      .eq("user_id", userId);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Get watchlist error:", error);
    throw error;
  }
};

export const addToWatchlist = async (watchlistItem: Omit<SupabaseWatchlist, 'id' | 'created_at'>): Promise<SupabaseWatchlist> => {
  try {
    const { data, error } = await supabase
      .from("watchlists")
      .insert([watchlistItem])
      .select("*")
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Add to watchlist error:", error);
    throw error;
  }
};

export const removeFromWatchlist = async (itemId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("watchlists")
      .delete()
      .eq("id", itemId);
    
    if (error) throw error;
  } catch (error) {
    console.error("Remove from watchlist error:", error);
    throw error;
  }
};

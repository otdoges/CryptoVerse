
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import TradingChart from "@/components/charts/TradingChart";
import OrderForm from "@/components/trading/OrderForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cryptocurrency } from "@/types";
import { fetchCryptocurrencies, fetchCryptocurrencyById } from "@/services/api";
import { RefreshCw, TrendingUp, TrendingDown, Activity } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Trade = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<Cryptocurrency | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  useEffect(() => {
    const loadCryptocurrencies = async () => {
      setLoading(true);
      try {
        const data = await fetchCryptocurrencies();
        setCryptocurrencies(data);
        
        if (!symbol && data.length > 0) {
          // If no symbol in URL, navigate to the first cryptocurrency
          navigate(`/trade/${data[0].symbol.toLowerCase()}`);
        }
        
      } catch (error) {
        console.error("Failed to load cryptocurrencies:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCryptocurrencies();
  }, [symbol, navigate, refreshTrigger]);
  
  useEffect(() => {
    const loadSelectedCrypto = async () => {
      if (symbol) {
        setLoading(true);
        try {
          // Find by symbol in our cached data first
          let crypto = cryptocurrencies.find(
            (c) => c.symbol.toLowerCase() === symbol.toLowerCase()
          );
          
          // If not found, fetch directly (in a real app)
          if (!crypto && symbol) {
            crypto = await fetchCryptocurrencyById(symbol);
          }
          
          if (crypto) {
            setSelectedCrypto(crypto);
          }
        } catch (error) {
          console.error("Failed to load selected cryptocurrency:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadSelectedCrypto();
  }, [symbol, cryptocurrencies]);
  
  const handleCryptoChange = (value: string) => {
    navigate(`/trade/${value.toLowerCase()}`);
  };
  
  const handleOrderExecuted = () => {
    // Refresh data after an order is executed
    setRefreshTrigger((prev) => prev + 1);
  };
  
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Trade</h1>
        <p className="text-gray-400 mt-1">Buy and sell cryptocurrencies with paper trading</p>
      </div>
      
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="w-full md:w-80">
            <Select
              value={symbol}
              onValueChange={handleCryptoChange}
              disabled={loading}
            >
              <SelectTrigger className="bg-crypto-dark-card border-crypto-gray text-white">
                <SelectValue placeholder="Select cryptocurrency" />
              </SelectTrigger>
              <SelectContent className="bg-crypto-dark-card border-crypto-gray text-white">
                {cryptocurrencies.map((crypto) => (
                  <SelectItem 
                    key={crypto.id} 
                    value={crypto.symbol}
                    className="hover:bg-crypto-dark-hover"
                  >
                    <div className="flex items-center">
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="w-5 h-5 mr-2"
                      />
                      {crypto.name} ({crypto.symbol.toUpperCase()})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedCrypto && (
            <div className="flex items-center space-x-4">
              <div>
                <span className="text-gray-400 text-sm">Price:</span>
                <span className="text-white font-medium ml-2">
                  ${selectedCrypto.current_price.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-400 text-sm">24h:</span>
                <span className={`font-medium ml-2 ${
                  selectedCrypto.price_change_percentage_24h >= 0
                    ? "text-crypto-green"
                    : "text-crypto-red"
                }`}>
                  {selectedCrypto.price_change_percentage_24h >= 0 ? "+" : ""}
                  {selectedCrypto.price_change_percentage_24h.toFixed(2)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {loading && !selectedCrypto ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="animate-spin text-gray-400" size={32} />
        </div>
      ) : selectedCrypto ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="h-[500px]">
              <TradingChart symbol={selectedCrypto.symbol} />
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-crypto-dark-card border-crypto-gray">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Market Cap</p>
                      <p className="text-white font-semibold mt-1">
                        ${(selectedCrypto.market_cap / 1e9).toFixed(2)}B
                      </p>
                    </div>
                    <Activity className="text-crypto-blue" size={20} />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-crypto-dark-card border-crypto-gray">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">24h High</p>
                      <p className="text-crypto-green font-semibold mt-1">
                        ${selectedCrypto.high_24h.toLocaleString()}
                      </p>
                    </div>
                    <TrendingUp className="text-crypto-green" size={20} />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-crypto-dark-card border-crypto-gray">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">24h Low</p>
                      <p className="text-crypto-red font-semibold mt-1">
                        ${selectedCrypto.low_24h.toLocaleString()}
                      </p>
                    </div>
                    <TrendingDown className="text-crypto-red" size={20} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div>
            <OrderForm 
              symbol={selectedCrypto.symbol.toUpperCase()} 
              currentPrice={selectedCrypto.current_price}
              onOrderExecuted={handleOrderExecuted}
            />
            
            <Card className="bg-crypto-dark-card border-crypto-gray mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-white">About {selectedCrypto.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-gray-400 text-sm">Market Cap Rank</div>
                    <div className="text-white">{selectedCrypto.market_cap_rank}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Circulating Supply</div>
                    <div className="text-white">
                      {selectedCrypto.circulating_supply.toLocaleString()} {selectedCrypto.symbol.toUpperCase()}
                    </div>
                  </div>
                  {selectedCrypto.max_supply && (
                    <div>
                      <div className="text-gray-400 text-sm">Max Supply</div>
                      <div className="text-white">
                        {selectedCrypto.max_supply.toLocaleString()} {selectedCrypto.symbol.toUpperCase()}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-gray-400 text-sm">All Time High</div>
                    <div className="text-white">
                      ${selectedCrypto.ath.toLocaleString()} 
                      <span className="text-crypto-red text-xs ml-1">
                        ({selectedCrypto.ath_change_percentage.toFixed(2)}%)
                      </span>
                    </div>
                    <div className="text-gray-500 text-xs">
                      {new Date(selectedCrypto.ath_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400">Select a cryptocurrency to start trading</p>
        </div>
      )}
    </Layout>
  );
};

export default Trade;

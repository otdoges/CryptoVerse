
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cryptocurrency } from "@/types";
import { fetchCryptocurrencies } from "@/services/api";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MarketOverview = () => {
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadCryptocurrencies = async () => {
      setLoading(true);
      try {
        const data = await fetchCryptocurrencies();
        setCryptocurrencies(data);
      } catch (error) {
        console.error("Failed to load cryptocurrencies:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCryptocurrencies();
    
    // In a real app, this would poll for updates every minute
    const interval = setInterval(loadCryptocurrencies, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleRowClick = (symbol: string) => {
    navigate(`/trade/${symbol.toLowerCase()}`);
  };
  
  return (
    <Card className="bg-crypto-dark-card border-crypto-gray">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-white">Market Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <RefreshCw className="animate-spin text-gray-400" size={24} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-crypto-gray">
                  <th className="text-left py-2 px-2 text-gray-400 font-medium">Name</th>
                  <th className="text-right py-2 px-2 text-gray-400 font-medium">Price</th>
                  <th className="text-right py-2 px-2 text-gray-400 font-medium">24h Change</th>
                  <th className="text-right py-2 px-2 text-gray-400 font-medium">Market Cap</th>
                </tr>
              </thead>
              <tbody>
                {cryptocurrencies.map((crypto) => (
                  <tr 
                    key={crypto.id} 
                    className="border-b border-crypto-gray hover:bg-crypto-dark-hover cursor-pointer"
                    onClick={() => handleRowClick(crypto.symbol)}
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center">
                        <img 
                          src={crypto.image} 
                          alt={crypto.name} 
                          className="w-6 h-6 mr-2" 
                        />
                        <div>
                          <div className="font-medium text-white">{crypto.name}</div>
                          <div className="text-xs text-gray-400">{crypto.symbol.toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right text-white">
                      ${crypto.current_price.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div 
                        className={`flex items-center justify-end ${
                          crypto.price_change_percentage_24h >= 0
                            ? "text-crypto-green"
                            : "text-crypto-red"
                        }`}
                      >
                        {crypto.price_change_percentage_24h >= 0 ? (
                          <TrendingUp size={16} className="mr-1" />
                        ) : (
                          <TrendingDown size={16} className="mr-1" />
                        )}
                        {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right text-gray-300">
                      ${(crypto.market_cap / 1e9).toFixed(2)}B
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketOverview;

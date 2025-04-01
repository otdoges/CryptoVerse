
import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DexScreenerPair } from "@/types";
import { getPairsByTokenAddress } from "@/services/dexscreenerApi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";
import { RefreshCw } from "lucide-react";

interface DexChartProps {
  tokenAddress?: string;
  tokenSymbol: string;
  chainId?: string;
}

// Mock data for chart until we implement real data
const createMockPriceData = (basePrice: number, dataPoints: number = 24) => {
  const data = [];
  let currentPrice = basePrice;
  
  for (let i = 0; i < dataPoints; i++) {
    // Generate price with small random fluctuations (up to ±3%)
    const randomChange = (Math.random() * 6 - 3) / 100;
    currentPrice = currentPrice * (1 + randomChange);
    
    data.push({
      time: new Date(Date.now() - (dataPoints - i) * 3600 * 1000).toISOString(),
      price: currentPrice,
    });
  }
  
  return data;
};

const DexChart = ({ tokenAddress, tokenSymbol, chainId }: DexChartProps) => {
  const [pairs, setPairs] = useState<DexScreenerPair[]>([]);
  const [selectedPair, setSelectedPair] = useState<DexScreenerPair | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<string>("1d");
  
  const timeframeOptions = [
    { label: "1h", value: "1h" },
    { label: "6h", value: "6h" },
    { label: "24h", value: "1d" },
    { label: "7d", value: "7d" },
  ];
  
  // Mock price data based on selected pair
  const chartData = useMemo(() => {
    if (selectedPair) {
      return createMockPriceData(parseFloat(selectedPair.priceUsd));
    }
    return [];
  }, [selectedPair]);

  useEffect(() => {
    const fetchPairs = async () => {
      setLoading(true);
      try {
        // If tokenAddress is provided, fetch pairs for that token
        if (tokenAddress) {
          const fetchedPairs = await getPairsByTokenAddress(tokenAddress);
          setPairs(fetchedPairs.filter(pair => !chainId || pair.chainId === chainId));
          
          // Select the first pair if available
          if (fetchedPairs.length > 0) {
            setSelectedPair(fetchedPairs[0]);
          }
        } else {
          // If no tokenAddress, use mock data
          console.log("No token address provided, using mock data");
          // This would be replaced with real data in a production app
        }
      } catch (error) {
        console.error("Failed to fetch token pairs:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPairs();
  }, [tokenAddress, chainId]);
  
  const formatPrice = (price: number) => {
    if (price < 0.01) return price.toFixed(6);
    if (price < 1) return price.toFixed(4);
    if (price < 1000) return price.toFixed(2);
    return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  
  // Get price change percentage for the selected timeframe
  const getPriceChange = () => {
    if (!selectedPair) return 0;
    
    switch (timeframe) {
      case "1h": return selectedPair.priceChange?.h1 || 0;
      case "6h": return selectedPair.priceChange?.h6 || 0;
      case "1d": return selectedPair.priceChange?.h24 || 0;
      case "7d": return 0; // DexScreener API doesn't provide 7d price change
      default: return selectedPair.priceChange?.h24 || 0;
    }
  };
  
  const priceChangePercentage = getPriceChange();
  const isPriceUp = priceChangePercentage >= 0;
  
  return (
    <Card className="bg-crypto-dark-card border-crypto-gray p-4 h-full">
      <CardHeader className="p-0 pb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
          <CardTitle className="text-lg font-semibold text-white">{tokenSymbol} Price Chart</CardTitle>
          <div className="flex items-center space-x-2 mt-2 md:mt-0">
            {pairs.length > 1 && (
              <Select defaultValue={selectedPair?.pairAddress} onValueChange={(value) => {
                const newPair = pairs.find(p => p.pairAddress === value);
                if (newPair) setSelectedPair(newPair);
              }}>
                <SelectTrigger className="w-[180px] border-crypto-gray bg-crypto-dark text-white">
                  <SelectValue placeholder="Select DEX" />
                </SelectTrigger>
                <SelectContent className="bg-crypto-dark-card border-crypto-gray text-white">
                  {pairs.map((pair) => (
                    <SelectItem
                      key={pair.pairAddress}
                      value={pair.pairAddress}
                      className="hover:bg-crypto-dark-hover"
                    >
                      {pair.dexId} ({pair.chainId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[100px] border-crypto-gray bg-crypto-dark text-white">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent className="bg-crypto-dark-card border-crypto-gray text-white">
                {timeframeOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="hover:bg-crypto-dark-hover"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {selectedPair && (
          <div className="flex flex-wrap gap-4">
            <div>
              <p className="text-gray-400 text-xs">Current Price</p>
              <p className="text-white text-lg font-semibold">${formatPrice(parseFloat(selectedPair.priceUsd))}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Price Change ({timeframe})</p>
              <p className={`text-lg font-semibold ${isPriceUp ? 'text-crypto-green' : 'text-crypto-red'}`}>
                {isPriceUp ? '+' : ''}{priceChangePercentage.toFixed(2)}%
              </p>
            </div>
            {selectedPair.volume && (
              <div>
                <p className="text-gray-400 text-xs">24h Volume</p>
                <p className="text-white">${(selectedPair.volume.h24 || 0).toLocaleString()}</p>
              </div>
            )}
            {selectedPair.liquidity && selectedPair.liquidity.usd && (
              <div>
                <p className="text-gray-400 text-xs">Liquidity</p>
                <p className="text-white">${selectedPair.liquidity.usd.toLocaleString()}</p>
              </div>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-0 h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <RefreshCw className="animate-spin text-crypto-blue h-8 w-8" />
          </div>
        ) : selectedPair ? (
          <ChartContainer
            config={{
              price: {
                theme: {
                  light: "#3b82f6",
                  dark: "#3b82f6",
                },
              },
            }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#192131" />
                <XAxis
                  dataKey="time"
                  tickFormatter={(time) => {
                    const date = new Date(time);
                    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
                  }}
                  tick={{ fill: '#9ca3af' }}
                />
                <YAxis
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={(value) => formatPrice(value)}
                  tick={{ fill: '#9ca3af' }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        const date = new Date(value as string);
                        return date.toLocaleTimeString();
                      }}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  name="Price"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No price data available for {tokenSymbol}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DexChart;

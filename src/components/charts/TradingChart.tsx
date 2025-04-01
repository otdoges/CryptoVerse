
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { TimeframeOption } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DexChart from "./DexChart";

interface TradingChartProps {
  symbol: string;
}

// Hard-coded token addresses for demo purposes
const tokenAddresses: Record<string, { address: string, chainId: string }> = {
  "ETH": { 
    address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", 
    chainId: "ethereum"
  },
  "BTC": { 
    address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", // WBTC on Ethereum
    chainId: "ethereum"
  },
  "SOL": { 
    address: "0xd31a59c85ae9d8edefec411d448f90841571b89c", // Wrapped SOL on ETH
    chainId: "ethereum"
  },
  "BNB": {
    address: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c", 
    chainId: "bsc"
  },
  "ADA": {
    address: "0x3ee2200efb3400fabb9aacf31297cbdd1d435d47", // Wrapped ADA on BSC
    chainId: "bsc"
  }
};

const TradingChart = ({ symbol }: TradingChartProps) => {
  const [timeframe, setTimeframe] = useState<string>("1d");
  
  const timeframeOptions: TimeframeOption[] = [
    { label: "1h", value: "1h" },
    { label: "6h", value: "6h" },
    { label: "24h", value: "1d" },
    { label: "7d", value: "7d" },
  ];

  const tokenInfo = tokenAddresses[symbol.toUpperCase()];
  
  return (
    <Card className="bg-crypto-dark-card border-crypto-gray p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Price Chart</h3>
        <div className="flex items-center space-x-2">
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
      
      {tokenInfo ? (
        <DexChart 
          tokenAddress={tokenInfo.address}
          tokenSymbol={symbol.toUpperCase()}
          chainId={tokenInfo.chainId}
        />
      ) : (
        <div className="h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl font-semibold text-white mb-2">
              {symbol.toUpperCase()} Chart ({timeframe})
            </div>
            <div className="text-gray-400 mb-6">
              No DexScreener data available for this token
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TradingChart;

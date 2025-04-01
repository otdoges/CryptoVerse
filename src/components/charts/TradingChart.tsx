
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimeframeOption } from "@/types";

interface TradingChartProps {
  symbol: string;
}

const TradingChart = ({ symbol }: TradingChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [timeframe, setTimeframe] = useState<string>("1d");
  
  const timeframeOptions: TimeframeOption[] = [
    { label: "1m", value: "1m" },
    { label: "5m", value: "5m" },
    { label: "15m", value: "15m" },
    { label: "1h", value: "1h" },
    { label: "4h", value: "4h" },
    { label: "1d", value: "1d" },
    { label: "1w", value: "1w" },
  ];
  
  useEffect(() => {
    // In a real app, this would initialize TradingView's Advanced Chart widget
    // or connect to a charting library like TradingView, Chart.js, or Lightweight Charts
    
    if (chartContainerRef.current) {
      const mockChartContent = document.createElement("div");
      mockChartContent.className = "w-full h-full flex items-center justify-center";
      mockChartContent.innerHTML = `
        <div class="text-center">
          <div class="text-xl font-semibold text-white mb-2">${symbol.toUpperCase()} Chart (${timeframe})</div>
          <div class="text-gray-400 mb-6">Mock Trading Chart - In a real implementation, this would integrate with TradingView or similar</div>
          <div class="w-full h-64 bg-crypto-dark-hover rounded-lg relative overflow-hidden">
            <div class="absolute inset-0 flex items-center justify-center opacity-20">
              <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                <polyline points="16 7 22 7 22 13"></polyline>
              </svg>
            </div>
            
            <div class="absolute bottom-0 w-full">
              <div class="h-40 bg-gradient-to-t from-crypto-blue/10 to-transparent"></div>
              <svg class="w-full h-40 -mt-40" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path 
                  d="M0,50 Q10,30 20,50 T40,50 T60,40 T80,60 T100,50 V100 H0 Z" 
                  fill="none" 
                  stroke="rgb(14, 165, 233)" 
                  stroke-width="2"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      `;
      
      // Clear previous chart if any
      while (chartContainerRef.current.firstChild) {
        chartContainerRef.current.removeChild(chartContainerRef.current.firstChild);
      }
      
      chartContainerRef.current.appendChild(mockChartContent);
    }
    
  }, [symbol, timeframe]);
  
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
      <div ref={chartContainerRef} className="chart-container" />
    </Card>
  );
};

export default TradingChart;

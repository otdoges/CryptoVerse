
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Portfolio, Asset } from "@/types";
import { fetchPortfolio } from "@/services/api";
import { ArrowUpRight, ArrowDownRight, Wallet, RefreshCw } from "lucide-react";

interface PortfolioSummaryProps {
  userId: string;
  refreshTrigger?: number;
}

const PortfolioSummary = ({ userId, refreshTrigger }: PortfolioSummaryProps) => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [totalProfitLoss, setTotalProfitLoss] = useState<number>(0);
  const [profitLossPercentage, setProfitLossPercentage] = useState<number>(0);
  
  useEffect(() => {
    const loadPortfolio = async () => {
      setLoading(true);
      try {
        const data = await fetchPortfolio(userId);
        setPortfolio(data);
        
        // Calculate total portfolio value (balance + assets)
        const assetsValue = data.assets.reduce(
          (sum, asset) => sum + asset.amount * asset.currentPrice,
          0
        );
        setTotalValue(data.balance + assetsValue);
        
        // Calculate profit/loss
        const initialInvestment = 100000; // Assuming initial investment of $100k
        const currentValue = data.balance + assetsValue;
        const profitLoss = currentValue - initialInvestment;
        setTotalProfitLoss(profitLoss);
        setProfitLossPercentage((profitLoss / initialInvestment) * 100);
      } catch (error) {
        console.error("Failed to load portfolio:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPortfolio();
  }, [userId, refreshTrigger]);
  
  if (loading) {
    return (
      <Card className="bg-crypto-dark-card border-crypto-gray">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-white">Portfolio Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <RefreshCw className="animate-spin text-gray-400" size={24} />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!portfolio) {
    return (
      <Card className="bg-crypto-dark-card border-crypto-gray">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-white">Portfolio Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-400">
            No portfolio data available
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-crypto-dark-card border-crypto-gray">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-white">Portfolio Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Total Value</span>
              <span className="text-2xl font-bold text-white">
                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Profit/Loss</span>
              <div className={`flex items-center ${totalProfitLoss >= 0 ? "text-crypto-green" : "text-crypto-red"}`}>
                {totalProfitLoss >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                <span className="font-semibold ml-1">
                  ${Math.abs(totalProfitLoss).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  <span className="ml-1">({profitLossPercentage.toFixed(2)}%)</span>
                </span>
              </div>
            </div>
          </div>
          
          <div className="pt-2 border-t border-crypto-gray">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center text-gray-400">
                <Wallet size={16} className="mr-1" />
                <span>Available Balance</span>
              </div>
              <span className="text-white font-semibold">
                ${portfolio.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            
            <Progress 
              value={(portfolio.balance / totalValue) * 100} 
              className="h-2 bg-crypto-dark" 
            />
            
            <div className="text-xs text-gray-400 mt-1">
              {((portfolio.balance / totalValue) * 100).toFixed(2)}% of portfolio
            </div>
          </div>
          
          <div>
            <h4 className="text-gray-300 font-medium mb-3">Asset Allocation</h4>
            
            {portfolio.assets.length === 0 ? (
              <div className="text-sm text-gray-400">
                No assets in portfolio
              </div>
            ) : (
              <div className="space-y-3">
                {portfolio.assets.map((asset: Asset) => {
                  const assetValue = asset.amount * asset.currentPrice;
                  const assetPercentage = (assetValue / totalValue) * 100;
                  const profitLoss = assetValue - asset.amount * asset.averagePrice;
                  const profitLossPercentage = (profitLoss / (asset.amount * asset.averagePrice)) * 100;
                  
                  return (
                    <div key={asset.id}>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                          <span className="text-white font-medium">{asset.symbol}</span>
                          <span className="text-xs text-gray-400 ml-2">
                            {asset.amount.toFixed(asset.symbol === 'BTC' ? 8 : 4)} {asset.symbol}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-medium">
                            ${assetValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div className={`text-xs flex items-center justify-end ${profitLoss >= 0 ? "text-crypto-green" : "text-crypto-red"}`}>
                            {profitLoss >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            <span>{profitLossPercentage.toFixed(2)}%</span>
                          </div>
                        </div>
                      </div>
                      <Progress 
                        value={assetPercentage} 
                        className="h-1 bg-crypto-dark" 
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioSummary;


import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import MarketOverview from "@/components/market/MarketOverview";
import PortfolioSummary from "@/components/portfolio/PortfolioSummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types";
import { fetchTransactions } from "@/services/api";
import { Wallet, TrendingUp, History, RefreshCw } from "lucide-react";

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  useEffect(() => {
    const loadTransactions = async () => {
      if (isAuthenticated && user) {
        setLoading(true);
        try {
          const data = await fetchTransactions("1"); // Using portfolioId "1" for demo
          setTransactions(data);
        } catch (error) {
          console.error("Failed to load transactions:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadTransactions();
  }, [isAuthenticated, user, refreshTrigger]);
  
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back, {user?.username}!</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MarketOverview />
        </div>
        <div>
          <PortfolioSummary userId={user?.id || ""} refreshTrigger={refreshTrigger} />
        </div>
      </div>
      
      <div className="mt-6">
        <Card className="bg-crypto-dark-card border-crypto-gray">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-white">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <RefreshCw className="animate-spin text-gray-400" size={24} />
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8">
                <History className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <h3 className="text-lg font-medium text-gray-300">No transactions yet</h3>
                <p className="text-gray-400 mt-1">Start trading to see your transaction history</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-crypto-gray">
                      <th className="text-left py-2 px-2 text-gray-400 font-medium">Type</th>
                      <th className="text-left py-2 px-2 text-gray-400 font-medium">Asset</th>
                      <th className="text-right py-2 px-2 text-gray-400 font-medium">Amount</th>
                      <th className="text-right py-2 px-2 text-gray-400 font-medium">Price</th>
                      <th className="text-right py-2 px-2 text-gray-400 font-medium">Total</th>
                      <th className="text-right py-2 px-2 text-gray-400 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-crypto-gray">
                        <td className="py-3 px-2">
                          <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            tx.type === "BUY" ? "bg-crypto-green/20 text-crypto-green" : "bg-crypto-red/20 text-crypto-red"
                          }`}>
                            {tx.type}
                          </div>
                        </td>
                        <td className="py-3 px-2 text-white">
                          {tx.tokenId.toUpperCase()}
                        </td>
                        <td className="py-3 px-2 text-right text-white">
                          {tx.amount}
                        </td>
                        <td className="py-3 px-2 text-right text-gray-300">
                          ${tx.price.toLocaleString()}
                        </td>
                        <td className="py-3 px-2 text-right text-white">
                          ${tx.total.toLocaleString()}
                        </td>
                        <td className="py-3 px-2 text-right text-gray-300">
                          {new Date(tx.timestamp).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;

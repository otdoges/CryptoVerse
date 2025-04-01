
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <Layout>
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block">DeFi Trading</span>
                <span className="block text-crypto-blue">Simulator</span>
              </h1>
              <p className="mt-6 text-xl text-gray-300 max-w-3xl">
                Experience real market conditions without the risk. Train your trading strategies, analyze market movements, and master crypto trading in a safe environment.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button 
                  className="bg-crypto-purple hover:bg-purple-600 text-white px-8 py-6" 
                  size="lg"
                  onClick={() => navigate("/register")}
                >
                  Start Trading Now
                  <ArrowRight className="ml-2" size={18} />
                </Button>
                <Button 
                  variant="outline" 
                  className="border-crypto-blue text-crypto-blue hover:bg-crypto-blue/10 px-8 py-6" 
                  size="lg"
                  onClick={() => navigate("/features")}
                >
                  Explore Features
                </Button>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute top-0 left-0 w-72 h-72 bg-crypto-purple opacity-30 rounded-full filter blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-crypto-blue opacity-30 rounded-full filter blur-3xl animate-pulse delay-700"></div>
                <div className="relative">
                  <div className="w-full bg-crypto-dark-card border border-crypto-gray rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                          <div className="w-10 h-10 rounded-md bg-crypto-blue flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                          </div>
                          <div className="text-white font-bold">BTC/USD</div>
                        </div>
                        <div className="text-crypto-green">+2.45%</div>
                      </div>
                      <div className="h-48 bg-crypto-dark-hover rounded-lg relative overflow-hidden mb-6">
                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                            <polyline points="16 7 22 7 22 13"></polyline>
                          </svg>
                        </div>
                        
                        <div className="absolute bottom-0 w-full">
                          <div className="h-32 bg-gradient-to-t from-crypto-blue/10 to-transparent"></div>
                          <svg className="w-full h-32 -mt-32" preserveAspectRatio="none" viewBox="0 0 100 100">
                            <path 
                              d="M0,50 Q10,30 20,50 T40,50 T60,40 T80,60 T100,50 V100 H0 Z" 
                              fill="none" 
                              stroke="rgb(14, 165, 233)" 
                              strokeWidth="2"
                            ></path>
                          </svg>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-crypto-dark p-3 rounded-md">
                          <div className="text-xs text-gray-400 mb-1">Current Price</div>
                          <div className="text-white font-bold">$64,287.22</div>
                        </div>
                        <div className="bg-crypto-dark p-3 rounded-md">
                          <div className="text-xs text-gray-400 mb-1">24h Volume</div>
                          <div className="text-white font-bold">$28.3B</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-crypto-dark-card border border-crypto-gray rounded-xl p-6">
                <div className="w-12 h-12 rounded-lg bg-crypto-blue/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-crypto-blue"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Real-time Market Data</h3>
                <p className="text-gray-400">Access live cryptocurrency prices, market depth, and trading volumes from major exchanges.</p>
              </div>
              
              <div className="bg-crypto-dark-card border border-crypto-gray rounded-xl p-6">
                <div className="w-12 h-12 rounded-lg bg-crypto-purple/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-crypto-purple"><path d="M5 22h14"></path><path d="M5 2h14"></path><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"></path><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Paper Trading</h3>
                <p className="text-gray-400">Practice with virtual funds using various order types including market, limit, and stop-loss orders.</p>
              </div>
              
              <div className="bg-crypto-dark-card border border-crypto-gray rounded-xl p-6">
                <div className="w-12 h-12 rounded-lg bg-crypto-green/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-crypto-green"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Portfolio Tracking</h3>
                <p className="text-gray-400">Monitor your portfolio performance, analyze historical trades, and evaluate your strategies.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Start Your Trading Journey</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Join thousands of traders who are improving their skills in a risk-free environment.
            </p>
            <Button 
              className="bg-crypto-blue hover:bg-blue-600 text-white px-8 py-6" 
              size="lg"
              onClick={() => navigate("/register")}
            >
              Create Free Account
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;

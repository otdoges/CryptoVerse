
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderType } from "@/types";
import { executeOrder } from "@/services/api";
import { toast } from "sonner";

interface OrderFormProps {
  symbol: string;
  currentPrice: number;
  onOrderExecuted?: () => void;
}

const OrderForm = ({ symbol, currentPrice, onOrderExecuted }: OrderFormProps) => {
  const [orderType, setOrderType] = useState<OrderType>("MARKET");
  const [orderSide, setOrderSide] = useState<"BUY" | "SELL">("BUY");
  const [amount, setAmount] = useState<string>("");
  const [price, setPrice] = useState<string>(currentPrice.toString());
  const [stopPrice, setStopPrice] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  
  useEffect(() => {
    // Update price when currentPrice changes (for market orders)
    if (orderType === "MARKET") {
      setPrice(currentPrice.toString());
    }
  }, [currentPrice, orderType]);
  
  useEffect(() => {
    // Calculate order total
    const amountValue = parseFloat(amount) || 0;
    const priceValue = parseFloat(price) || 0;
    setTotal(amountValue * priceValue);
  }, [amount, price]);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
  };
  
  const handleStopPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStopPrice(e.target.value);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if ((orderType === "LIMIT" || orderType === "STOP_LOSS") && (!price || parseFloat(price) <= 0)) {
      toast.error("Please enter a valid price");
      return;
    }
    
    if (orderType === "STOP_LOSS" && (!stopPrice || parseFloat(stopPrice) <= 0)) {
      toast.error("Please enter a valid stop price");
      return;
    }
    
    try {
      setLoading(true);
      
      // In a real app, this would place an order with a real or simulated exchange
      await executeOrder("1", {
        tokenId: symbol.toLowerCase(),
        type: orderSide,
        amount: parseFloat(amount),
        price: parseFloat(price)
      });
      
      toast.success(`${orderSide} order executed successfully`);
      setAmount("");
      
      if (onOrderExecuted) {
        onOrderExecuted();
      }
    } catch (error) {
      console.error("Failed to execute order:", error);
      toast.error("Failed to execute order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-crypto-dark-card border-crypto-gray p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Place Order</h3>
      
      <Tabs defaultValue="MARKET" onValueChange={(value) => setOrderType(value as OrderType)} className="w-full">
        <TabsList className="grid grid-cols-3 w-full bg-crypto-dark">
          <TabsTrigger value="MARKET" className="data-[state=active]:bg-crypto-blue">Market</TabsTrigger>
          <TabsTrigger value="LIMIT" className="data-[state=active]:bg-crypto-blue">Limit</TabsTrigger>
          <TabsTrigger value="STOP_LOSS" className="data-[state=active]:bg-crypto-blue">Stop Loss</TabsTrigger>
        </TabsList>
        
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <Button
              type="button"
              className={`${
                orderSide === "BUY"
                  ? "bg-crypto-green hover:bg-green-600"
                  : "bg-crypto-dark hover:bg-crypto-dark-hover text-white"
              }`}
              onClick={() => setOrderSide("BUY")}
            >
              Buy
            </Button>
            <Button
              type="button"
              className={`${
                orderSide === "SELL"
                  ? "bg-crypto-red hover:bg-red-600"
                  : "bg-crypto-dark hover:bg-crypto-dark-hover text-white"
              }`}
              onClick={() => setOrderSide("SELL")}
            >
              Sell
            </Button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-gray-300">Amount ({symbol})</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={handleAmountChange}
                  className="bg-crypto-dark border-crypto-gray text-white"
                  step="any"
                  min="0"
                />
              </div>
              
              <TabsContent value="MARKET" className="mt-0 p-0">
                <div className="space-y-2">
                  <Label htmlFor="market-price" className="text-gray-300">Market Price (USD)</Label>
                  <Input
                    id="market-price"
                    type="number"
                    value={currentPrice.toFixed(2)}
                    className="bg-crypto-dark border-crypto-gray text-white"
                    disabled
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="LIMIT" className="mt-0 p-0">
                <div className="space-y-2">
                  <Label htmlFor="limit-price" className="text-gray-300">Limit Price (USD)</Label>
                  <Input
                    id="limit-price"
                    type="number"
                    placeholder="0.00"
                    value={price}
                    onChange={handlePriceChange}
                    className="bg-crypto-dark border-crypto-gray text-white"
                    step="any"
                    min="0"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="STOP_LOSS" className="mt-0 p-0">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="stop-price" className="text-gray-300">Stop Price (USD)</Label>
                    <Input
                      id="stop-price"
                      type="number"
                      placeholder="0.00"
                      value={stopPrice}
                      onChange={handleStopPriceChange}
                      className="bg-crypto-dark border-crypto-gray text-white"
                      step="any"
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="limit-price-sl" className="text-gray-300">Limit Price (USD)</Label>
                    <Input
                      id="limit-price-sl"
                      type="number"
                      placeholder="0.00"
                      value={price}
                      onChange={handlePriceChange}
                      className="bg-crypto-dark border-crypto-gray text-white"
                      step="any"
                      min="0"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <div className="space-y-2">
                <Label className="text-gray-300">Total (USD)</Label>
                <div className="p-2 bg-crypto-dark border border-crypto-gray rounded-md text-white">
                  ${total.toFixed(2)}
                </div>
              </div>
              
              <Button
                type="submit"
                className={`w-full ${
                  orderSide === "BUY"
                    ? "bg-crypto-green hover:bg-green-600"
                    : "bg-crypto-red hover:bg-red-600"
                }`}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  `${orderSide} ${symbol}`
                )}
              </Button>
            </div>
          </form>
        </div>
      </Tabs>
    </Card>
  );
};

export default OrderForm;

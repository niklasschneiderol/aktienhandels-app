import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface StockSearchProps {
  onSearch: (symbol: string) => void;
  isLoading?: boolean;
}

export const StockSearch = ({ onSearch, isLoading }: StockSearchProps) => {
  const [symbol, setSymbol] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symbol.trim()) {
      onSearch(symbol.trim().toUpperCase());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter stock symbol (e.g., AAPL, MSFT, GOOGL)..."
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="pl-12 h-14 text-lg shadow-card border-2 focus-visible:ring-2 focus-visible:ring-primary"
            disabled={isLoading}
          />
        </div>
        <Button 
          type="submit" 
          size="lg"
          className="h-14 px-8 gradient-primary hover:opacity-90 transition-opacity shadow-elevated"
          disabled={isLoading || !symbol.trim()}
        >
          Search
        </Button>
      </div>
    </form>
  );
};

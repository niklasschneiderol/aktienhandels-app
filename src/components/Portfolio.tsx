import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface PortfolioStock {
  symbol: string;
  weight: number;
}

interface PortfolioProps {
  stocks: PortfolioStock[];
  onAddStock: (stock: PortfolioStock) => void;
  onRemoveStock: (symbol: string) => void;
  onSelectStock: (symbol: string) => void;
}

export const Portfolio = ({ stocks, onAddStock, onRemoveStock, onSelectStock }: PortfolioProps) => {
  const [symbol, setSymbol] = useState("");
  const { toast } = useToast();

  const handleAdd = () => {
    if (!symbol.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte Symbol eingeben",
        variant: "destructive",
      });
      return;
    }

    onAddStock({ symbol: symbol.toUpperCase(), weight: 0 });
    setSymbol("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <Card className="p-3 shadow-card border-border/50 h-full">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-7 w-7 rounded gradient-primary flex items-center justify-center">
          <Briefcase className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-base font-bold">Portfolio</h2>
      </div>

      <div className="mb-3">
        <div className="flex gap-2">
          <Input
            placeholder="Symbol (z.B. AAPL)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            onKeyPress={handleKeyPress}
            className="text-sm h-9"
            data-testid="input-portfolio-symbol"
          />
          <Button onClick={handleAdd} size="sm" className="h-9 px-3" data-testid="button-add-portfolio">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-1.5">
        {stocks.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">
            Keine Positionen im Portfolio
          </p>
        ) : (
          stocks.map((stock) => (
            <div
              key={stock.symbol}
              className="flex items-center justify-between p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
              onClick={() => onSelectStock(stock.symbol)}
              data-testid={`portfolio-item-${stock.symbol}`}
            >
              <p className="text-sm font-semibold">{stock.symbol}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveStock(stock.symbol);
                }}
                className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                data-testid={`button-remove-${stock.symbol}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

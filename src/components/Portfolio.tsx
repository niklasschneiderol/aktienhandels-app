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
  const [weight, setWeight] = useState("");
  const { toast } = useToast();

  const handleAdd = () => {
    if (!symbol || !weight) {
      toast({
        title: "Fehler",
        description: "Bitte Symbol und Gewichtung eingeben",
        variant: "destructive",
      });
      return;
    }

    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0 || weightNum > 100) {
      toast({
        title: "Fehler",
        description: "Gewichtung muss zwischen 0 und 100 liegen",
        variant: "destructive",
      });
      return;
    }

    onAddStock({ symbol: symbol.toUpperCase(), weight: weightNum });
    setSymbol("");
    setWeight("");
  };

  const totalWeight = stocks.reduce((sum, stock) => sum + stock.weight, 0);

  return (
    <Card className="p-4 shadow-card border-border/50 h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded gradient-primary flex items-center justify-center">
          <Briefcase className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-lg font-bold">Portfolio</h2>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex gap-2">
          <Input
            placeholder="Symbol (z.B. AAPL)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="text-sm h-8"
          />
          <Input
            placeholder="%"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="text-sm h-8 w-20"
          />
          <Button onClick={handleAdd} size="sm" className="h-8 px-2">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        {stocks.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            Keine Positionen im Portfolio
          </p>
        ) : (
          stocks.map((stock) => (
            <div
              key={stock.symbol}
              className="flex items-center justify-between p-2 rounded bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
              onClick={() => onSelectStock(stock.symbol)}
            >
              <div className="flex-1">
                <p className="text-sm font-semibold">{stock.symbol}</p>
                <p className="text-xs text-muted-foreground">{stock.weight.toFixed(1)}%</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveStock(stock.symbol);
                }}
                className="h-6 w-6 p-0"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))
        )}
      </div>

      {stocks.length > 0 && (
        <div className="pt-2 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="font-semibold">Gesamt:</span>
            <span className={totalWeight > 100 ? "text-destructive font-bold" : "font-semibold"}>
              {totalWeight.toFixed(1)}%
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};

import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { IndicatorInterpretation } from "@/services/stockApi";

interface TechnicalIndicatorsProps {
  interpretations: IndicatorInterpretation[];
}

export const TechnicalIndicators = ({ interpretations }: TechnicalIndicatorsProps) => {
  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'bullish':
        return <TrendingUp className="h-4 w-4 text-primary" />;
      case 'bearish':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'bullish':
        return 'bg-primary/10 border-primary/30';
      case 'bearish':
        return 'bg-destructive/10 border-destructive/30';
      default:
        return 'bg-muted/50 border-border/50';
    }
  };

  if (interpretations.length === 0) {
    return (
      <Card className="p-3 shadow-card border-border/50">
        <h3 className="text-sm font-bold mb-2">Technische Indikatoren</h3>
        <p className="text-xs text-muted-foreground text-center py-4">
          Keine Daten verfügbar
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-3 shadow-card border-border/50">
      <h3 className="text-sm font-bold mb-3">Technische Indikatoren</h3>
      <div className="space-y-2">
        {interpretations.map((item, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg border ${getSignalColor(item.signal)}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {getSignalIcon(item.signal)}
                  <p className="text-xs font-semibold">{item.indicator}</p>
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  Wert: <span className="font-mono">{item.value}</span>
                </p>
                <p className="text-xs font-medium">{item.interpretation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

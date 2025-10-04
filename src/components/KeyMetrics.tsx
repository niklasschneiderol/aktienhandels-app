import { TrendingUp, DollarSign, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface KeyMetricsProps {
  marketCap?: number;
  peRatio?: number;
  eps?: number;
}

const formatLargeNumber = (num: number): string => {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toFixed(2)}`;
};

export const KeyMetrics = ({ marketCap, peRatio, eps }: KeyMetricsProps) => {
  const metrics = [
    {
      label: "Market Cap",
      value: marketCap ? formatLargeNumber(marketCap) : "N/A",
      icon: DollarSign,
    },
    {
      label: "KGV",
      value: peRatio ? peRatio.toFixed(2) : "N/A",
      icon: BarChart3,
    },
    {
      label: "EPS",
      value: eps ? `$${eps.toFixed(2)}` : "N/A",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {metrics.map((metric) => (
        <Card key={metric.label} className="p-2 shadow-card border-border/50">
          <div className="flex items-center gap-2">
            <metric.icon className="h-4 w-4 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              <p className="text-sm font-bold truncate">{metric.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

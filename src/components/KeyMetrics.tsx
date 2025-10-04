import { TrendingUp, DollarSign, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      icon: TrendingUp,
      color: "text-primary",
    },
    {
      label: "P/E Ratio",
      value: peRatio ? peRatio.toFixed(2) : "N/A",
      icon: BarChart3,
      color: "text-primary",
    },
    {
      label: "EPS",
      value: eps ? `$${eps.toFixed(2)}` : "N/A",
      icon: DollarSign,
      color: "text-primary",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className="shadow-card border-2 hover:shadow-elevated transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.label}
            </CardTitle>
            <metric.icon className={`h-5 w-5 ${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metric.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

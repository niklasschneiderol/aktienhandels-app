import { Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CompanyOverviewProps {
  name: string;
  symbol: string;
  exchange?: string;
  sector?: string;
  description?: string;
}

export const CompanyOverview = ({ name, symbol, exchange, sector, description }: CompanyOverviewProps) => {
  return (
    <Card className="p-3 shadow-card border-border/50">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-8 w-8 rounded gradient-primary flex items-center justify-center">
          <Building2 className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold truncate">{name}</h2>
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span className="font-semibold">{symbol}</span>
            {exchange && <span>{exchange}</span>}
            {sector && <span>{sector}</span>}
          </div>
        </div>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground line-clamp-3 mt-2">
          {description}
        </p>
      )}
    </Card>
  );
};

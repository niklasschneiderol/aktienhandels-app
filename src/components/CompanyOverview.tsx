import { Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CompanyOverviewProps {
  name: string;
  symbol: string;
  exchange?: string;
  sector?: string;
}

export const CompanyOverview = ({ name, symbol, exchange, sector }: CompanyOverviewProps) => {
  return (
    <Card className="shadow-card border-2">
      <CardHeader className="bg-gradient-subtle">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-2xl mb-1">{name}</CardTitle>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="font-semibold text-primary">{symbol}</span>
              {exchange && <span>• {exchange}</span>}
              {sector && <span>• {sector}</span>}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface QuarterData {
  fiscalDateEnding: string;
  revenue?: number;
  grossProfit?: number;
  netIncome?: number;
  operatingCashflow?: number;
}

interface QuarterlyDataProps {
  quarters: QuarterData[];
}

const formatCurrency = (num: number | undefined): string => {
  if (!num) return "N/A";
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toFixed(2)}`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', { year: 'numeric', month: 'short' });
};

export const QuarterlyData = ({ quarters }: QuarterlyDataProps) => {
  return (
    <Card className="p-3 shadow-card border-border/50">
      <h3 className="text-sm font-bold mb-2">Quartalsberichte</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs py-2">Quartal</TableHead>
              <TableHead className="text-right text-xs py-2">Umsatz</TableHead>
              <TableHead className="text-right text-xs py-2">Bruttogewinn</TableHead>
              <TableHead className="text-right text-xs py-2">Nettogewinn</TableHead>
              <TableHead className="text-right text-xs py-2">Cashflow</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quarters.length > 0 ? (
              quarters.map((quarter, index) => (
                <TableRow key={index}>
                  <TableCell className="text-xs py-2 font-medium">
                    {formatDate(quarter.fiscalDateEnding)}
                  </TableCell>
                  <TableCell className="text-right text-xs py-2 tabular-nums">
                    {formatCurrency(quarter.revenue)}
                  </TableCell>
                  <TableCell className="text-right text-xs py-2 tabular-nums">
                    {formatCurrency(quarter.grossProfit)}
                  </TableCell>
                  <TableCell className="text-right text-xs py-2 tabular-nums">
                    {formatCurrency(quarter.netIncome)}
                  </TableCell>
                  <TableCell className="text-right text-xs py-2 tabular-nums">
                    {formatCurrency(quarter.operatingCashflow)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground text-xs py-4">
                  Keine Daten verfügbar
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

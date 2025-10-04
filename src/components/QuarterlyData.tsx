import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
};

export const QuarterlyData = ({ quarters }: QuarterlyDataProps) => {
  return (
    <Card className="shadow-card border-2">
      <CardHeader className="bg-gradient-subtle">
        <CardTitle className="text-xl">Quarterly Financial Data</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-accent/50">
                <TableHead className="font-semibold">Quarter</TableHead>
                <TableHead className="text-right font-semibold">Revenue</TableHead>
                <TableHead className="text-right font-semibold">Gross Profit</TableHead>
                <TableHead className="text-right font-semibold">Net Income</TableHead>
                <TableHead className="text-right font-semibold">Cash Flow</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quarters.length > 0 ? (
                quarters.map((quarter, index) => (
                  <TableRow key={index} className="hover:bg-accent/30 transition-colors">
                    <TableCell className="font-medium">
                      {formatDate(quarter.fiscalDateEnding)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(quarter.revenue)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(quarter.grossProfit)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(quarter.netIncome)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(quarter.operatingCashflow)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No quarterly data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

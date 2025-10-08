import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

const formatChartValue = (value: number): string => {
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toFixed(0);
};

export const QuarterlyData = ({ quarters }: QuarterlyDataProps) => {
  const chartData = quarters.slice().reverse().map((quarter) => ({
    quarter: formatDate(quarter.fiscalDateEnding),
    Umsatz: quarter.revenue ? quarter.revenue / 1e6 : 0,
    Bruttogewinn: quarter.grossProfit ? quarter.grossProfit / 1e6 : 0,
    Nettogewinn: quarter.netIncome ? quarter.netIncome / 1e6 : 0,
    Cashflow: quarter.operatingCashflow ? quarter.operatingCashflow / 1e6 : 0,
  }));

  return (
    <Card className="p-3 shadow-card border-border/50">
      <h3 className="text-sm font-bold mb-3">Quartalsberichte</h3>
      
      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-3">
          <TabsTrigger value="chart" data-testid="tab-chart">Diagramm</TabsTrigger>
          <TabsTrigger value="table" data-testid="tab-table">Tabelle</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chart" className="mt-0">
          {quarters.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="quarter" 
                  className="text-xs" 
                  tick={{ fontSize: 11 }}
                />
                <YAxis 
                  className="text-xs" 
                  tick={{ fontSize: 11 }}
                  tickFormatter={formatChartValue}
                />
                <Tooltip 
                  formatter={(value: number) => `$${value.toFixed(2)}M`}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="Umsatz" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Bruttogewinn" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Nettogewinn" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Cashflow" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-muted-foreground text-sm py-8">
              Keine Daten verfügbar
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="table" className="mt-0">
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
        </TabsContent>
      </Tabs>
    </Card>
  );
};

import { useState } from "react";
import { StockSearch } from "@/components/StockSearch";
import { CompanyOverview } from "@/components/CompanyOverview";
import { KeyMetrics } from "@/components/KeyMetrics";
import { QuarterlyData } from "@/components/QuarterlyData";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, AlertCircle } from "lucide-react";
import {
  fetchCompanyOverview,
  fetchIncomeStatement,
  fetchCashFlow,
} from "@/services/stockApi";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StockData {
  overview: {
    name: string;
    symbol: string;
    exchange: string;
    sector: string;
    marketCap: number;
    peRatio: number;
    eps: number;
  };
  quarters: Array<{
    fiscalDateEnding: string;
    revenue?: number;
    grossProfit?: number;
    netIncome?: number;
    operatingCashflow?: number;
  }>;
}

const Index = () => {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (symbol: string) => {
    setIsLoading(true);
    try {
      // Fetch all data in parallel
      const [overview, incomeStatements, cashFlows] = await Promise.all([
        fetchCompanyOverview(symbol),
        fetchIncomeStatement(symbol),
        fetchCashFlow(symbol),
      ]);

      // Combine the data from different sources
      const quarterlyData = incomeStatements.slice(0, 3).map((income, index) => {
        const cashFlow = cashFlows[index];
        return {
          fiscalDateEnding: income.fiscalDateEnding,
          revenue: parseFloat(income.totalRevenue) || undefined,
          grossProfit: parseFloat(income.grossProfit) || undefined,
          netIncome: parseFloat(income.netIncome) || undefined,
          operatingCashflow: parseFloat(cashFlow?.operatingCashflow || "0") || undefined,
        };
      });

      setStockData({
        overview: {
          name: overview.Name,
          symbol: overview.Symbol,
          exchange: overview.Exchange,
          sector: overview.Sector,
          marketCap: parseFloat(overview.MarketCapitalization),
          peRatio: parseFloat(overview.PERatio),
          eps: parseFloat(overview.EPS),
        },
        quarters: quarterlyData,
      });

      toast({
        title: "Success",
        description: `Loaded data for ${overview.Name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch stock data",
        variant: "destructive",
      });
      setStockData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-subtle">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10 shadow-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Stock Data Dashboard</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Search Section */}
          <section className="text-center space-y-4">
            <h2 className="text-3xl font-bold mb-2">Search Company Data</h2>
            <p className="text-muted-foreground mb-6">
              Enter a stock symbol to view detailed financial information
            </p>
            <StockSearch onSearch={handleSearch} isLoading={isLoading} />
          </section>

          {/* API Key Notice */}
          <Alert className="max-w-2xl mx-auto bg-success-light border-primary/20">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              <strong>Note:</strong> This demo uses Alpha Vantage API with the 'demo' key (limited to symbol 'IBM'). 
              For full functionality, get a free API key at{" "}
              <a 
                href="https://www.alphavantage.co/support/#api-key" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline font-semibold"
              >
                alphavantage.co
              </a>
              {" "}and replace it in src/services/stockApi.ts
            </AlertDescription>
          </Alert>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-muted-foreground">Loading stock data...</p>
            </div>
          )}

          {/* Stock Data Display */}
          {stockData && !isLoading && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <CompanyOverview
                name={stockData.overview.name}
                symbol={stockData.overview.symbol}
                exchange={stockData.overview.exchange}
                sector={stockData.overview.sector}
              />

              <KeyMetrics
                marketCap={stockData.overview.marketCap}
                peRatio={stockData.overview.peRatio}
                eps={stockData.overview.eps}
              />

              <QuarterlyData quarters={stockData.quarters} />
            </div>
          )}

          {/* Empty State */}
          {!stockData && !isLoading && (
            <div className="text-center py-12 text-muted-foreground">
              <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p>Search for a stock symbol to get started</p>
              <p className="text-sm mt-2">Try searching for: IBM (demo), AAPL, MSFT, GOOGL</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;

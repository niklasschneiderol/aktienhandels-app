import { useState, useEffect } from "react";
import { StockSearch } from "@/components/StockSearch";
import { CompanyOverview } from "@/components/CompanyOverview";
import { KeyMetrics } from "@/components/KeyMetrics";
import { QuarterlyData } from "@/components/QuarterlyData";
import { TechnicalIndicators } from "@/components/TechnicalIndicators";
import { Portfolio, PortfolioStock } from "@/components/Portfolio";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, AlertCircle, Save, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  fetchCompanyOverview,
  fetchIncomeStatement,
  fetchCashFlow,
  fetchTechnicalIndicators,
  interpretIndicators,
  IndicatorInterpretation,
} from "@/services/stockApi";
import { savePortfolio, loadPortfolio } from "@/services/portfolioStorage";
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
  indicators: IndicatorInterpretation[];
}

const Index = () => {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [portfolio, setPortfolio] = useState<PortfolioStock[]>([]);
  const { toast } = useToast();

  // Load portfolio on mount
  useEffect(() => {
    const saved = loadPortfolio();
    setPortfolio(saved);
  }, []);

  const handleAddStock = (stock: PortfolioStock) => {
    const updated = [...portfolio, stock];
    setPortfolio(updated);
    savePortfolio(updated);
    toast({
      title: "Hinzugefügt",
      description: `${stock.symbol} wurde zum Portfolio hinzugefügt`,
    });
  };

  const handleRemoveStock = (symbol: string) => {
    const updated = portfolio.filter((s) => s.symbol !== symbol);
    setPortfolio(updated);
    savePortfolio(updated);
  };

  const handleSavePortfolio = () => {
    savePortfolio(portfolio);
    toast({
      title: "Gespeichert",
      description: "Portfolio wurde erfolgreich gespeichert",
    });
  };

  const handleExportPortfolio = () => {
    const dataStr = JSON.stringify(portfolio, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolio.json';
    link.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Exportiert",
      description: "Portfolio wurde als JSON heruntergeladen",
    });
  };

  const handleSelectStock = (symbol: string) => {
    handleSearch(symbol);
  };

  const handleSearch = async (symbol: string) => {
    setIsLoading(true);
    try {
      // Fetch all data in parallel
      const [overview, incomeStatements, cashFlows, technicalIndicators] = await Promise.all([
        fetchCompanyOverview(symbol),
        fetchIncomeStatement(symbol),
        fetchCashFlow(symbol),
        fetchTechnicalIndicators(symbol),
      ]);

      // Combine the data from different sources
      const quarterlyData = incomeStatements.slice(0, 8).map((income, index) => {
        const cashFlow = cashFlows[index];
        return {
          fiscalDateEnding: income.fiscalDateEnding,
          revenue: parseFloat(income.totalRevenue) || undefined,
          grossProfit: parseFloat(income.grossProfit) || undefined,
          netIncome: parseFloat(income.netIncome) || undefined,
          operatingCashflow: parseFloat(cashFlow?.operatingCashflow || "0") || undefined,
        };
      });

      const interpretations = interpretIndicators(technicalIndicators);

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
        indicators: interpretations,
      });

      toast({
        title: "Erfolgreich",
        description: `Daten für ${overview.Name} geladen`,
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: error instanceof Error ? error.message : "Fehler beim Laden der Daten",
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
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded gradient-primary flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">eToro Portfolio Tracker</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-4">
          {/* Left Column - Stock Data */}
          <div className="space-y-4">
            {/* Search Section */}
            <div className="space-y-2">
              <StockSearch onSearch={handleSearch} isLoading={isLoading} />
            </div>

            {/* API Key Notice */}
            <Alert className="bg-success-light border-primary/20">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertDescription className="text-xs">
                <strong>API-Quellen:</strong>{" "}
                <a 
                  href="https://finnhub.io/register" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline font-semibold"
                >
                  Finnhub
                </a>
                {" & "}
                <a 
                  href="https://www.alphavantage.co/support/#api-key" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline font-semibold"
                >
                  Alpha Vantage
                </a>
                {" - Kostenlose API-Keys erforderlich (25 Requests/Tag)"}
              </AlertDescription>
            </Alert>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                <p className="mt-2 text-sm text-muted-foreground">Lade Daten...</p>
              </div>
            )}

            {/* Stock Data Display */}
            {stockData && !isLoading && (
              <div className="space-y-3 animate-in fade-in duration-300">
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

                <TechnicalIndicators interpretations={stockData.indicators} />

                <QuarterlyData quarters={stockData.quarters} />
              </div>
            )}

            {/* Empty State */}
            {!stockData && !isLoading && (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">Suche nach einem Symbol</p>
                <p className="text-xs mt-1">Beispiel: IBM (demo), AAPL, MSFT</p>
              </div>
            )}
          </div>

          {/* Right Column - Portfolio */}
          <div className="lg:sticky lg:top-20 lg:h-fit">
            <Portfolio
              stocks={portfolio}
              onAddStock={handleAddStock}
              onRemoveStock={handleRemoveStock}
              onSelectStock={handleSelectStock}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

// Hybrid Stock API Service - Finnhub.io + Yahoo Finance
// Finnhub for company data, Yahoo Finance for financial statements

const FINNHUB_API_KEY = 'd3iibspr01qmn7fk7l90d3iibspr01qmn7fk7l9g';
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const YAHOO_BASE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart';

export interface CompanyOverview {
  Symbol: string;
  Name: string;
  Exchange: string;
  Sector: string;
  MarketCapitalization: string;
  PERatio: string;
  EPS: string;
}

export interface IncomeStatement {
  fiscalDateEnding: string;
  totalRevenue: string;
  grossProfit: string;
  netIncome: string;
}

export interface CashFlow {
  fiscalDateEnding: string;
  operatingCashflow: string;
}

export const fetchCompanyOverview = async (symbol: string): Promise<CompanyOverview> => {
  // Fetch company profile from Finnhub
  const profileResponse = await fetch(
    `${FINNHUB_BASE_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`
  );
  
  if (!profileResponse.ok) {
    throw new Error('Failed to fetch company data');
  }
  
  const profile = await profileResponse.json();
  
  if (!profile.name) {
    throw new Error('Invalid symbol or API limit reached');
  }

  // Fetch basic financials for P/E and EPS from Finnhub
  const metricsResponse = await fetch(
    `${FINNHUB_BASE_URL}/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_API_KEY}`
  );
  
  const metrics = await metricsResponse.json();
  
  return {
    Symbol: profile.ticker || symbol,
    Name: profile.name || '',
    Exchange: profile.exchange || '',
    Sector: profile.finnhubIndustry || '',
    MarketCapitalization: (profile.marketCapitalization * 1000000).toString(),
    PERatio: metrics.metric?.peBasicExclExtraTTM?.toString() || '0',
    EPS: metrics.metric?.epsBasicExclExtraItemsAnnual?.toString() || '0',
  };
};

export const fetchIncomeStatement = async (symbol: string): Promise<IncomeStatement[]> => {
  try {
    // Use Yahoo Finance API for financial statements
    const response = await fetch(
      `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=incomeStatementHistory,incomeStatementHistoryQuarterly`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch income statement');
    }
    
    const data = await response.json();
    const quarterlyData = data.quoteSummary?.result?.[0]?.incomeStatementHistoryQuarterly?.incomeStatementHistory;
    
    if (!quarterlyData || quarterlyData.length === 0) {
      throw new Error('No financial data available');
    }
    
    return quarterlyData.slice(0, 4).map((item: any) => ({
      fiscalDateEnding: item.endDate?.fmt || '',
      totalRevenue: item.totalRevenue?.raw?.toString() || '0',
      grossProfit: item.grossProfit?.raw?.toString() || '0',
      netIncome: item.netIncome?.raw?.toString() || '0',
    }));
  } catch (error) {
    console.error('Error fetching income statement:', error);
    throw error;
  }
};

export const fetchCashFlow = async (symbol: string): Promise<CashFlow[]> => {
  try {
    // Use Yahoo Finance API for cash flow statements
    const response = await fetch(
      `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=cashflowStatementHistory,cashflowStatementHistoryQuarterly`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch cash flow');
    }
    
    const data = await response.json();
    const quarterlyData = data.quoteSummary?.result?.[0]?.cashflowStatementHistoryQuarterly?.cashflowStatements;
    
    if (!quarterlyData || quarterlyData.length === 0) {
      return [];
    }
    
    return quarterlyData.slice(0, 4).map((item: any) => ({
      fiscalDateEnding: item.endDate?.fmt || '',
      operatingCashflow: item.totalCashFromOperatingActivities?.raw?.toString() || '0',
    }));
  } catch (error) {
    console.error('Error fetching cash flow:', error);
    return [];
  }
};

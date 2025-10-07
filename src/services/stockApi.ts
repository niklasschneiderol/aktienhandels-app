// Stock API Service - Finnhub.io
// Get a free API key from https://finnhub.io/register

const API_KEY = 'demo'; // Replace with your actual Finnhub API key
const BASE_URL = 'https://finnhub.io/api/v1';

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
  // Fetch company profile
  const profileResponse = await fetch(
    `${BASE_URL}/stock/profile2?symbol=${symbol}&token=${API_KEY}`
  );
  
  if (!profileResponse.ok) {
    throw new Error('Failed to fetch company data');
  }
  
  const profile = await profileResponse.json();
  
  if (!profile.name) {
    throw new Error('Invalid symbol or API limit reached');
  }

  // Fetch basic financials for P/E and EPS
  const metricsResponse = await fetch(
    `${BASE_URL}/stock/metric?symbol=${symbol}&metric=all&token=${API_KEY}`
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
  const response = await fetch(
    `${BASE_URL}/stock/financials?symbol=${symbol}&statement=ic&freq=quarterly&token=${API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch income statement');
  }
  
  const data = await response.json();
  
  if (!data.financials || data.financials.length === 0) {
    throw new Error('No financial data available');
  }
  
  return data.financials.map((item: any) => ({
    fiscalDateEnding: item.period || '',
    totalRevenue: item.revenue?.toString() || '0',
    grossProfit: item.grossProfit?.toString() || '0',
    netIncome: item.netIncome?.toString() || '0',
  }));
};

export const fetchCashFlow = async (symbol: string): Promise<CashFlow[]> => {
  const response = await fetch(
    `${BASE_URL}/stock/financials?symbol=${symbol}&statement=cf&freq=quarterly&token=${API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch cash flow');
  }
  
  const data = await response.json();
  
  if (!data.financials || data.financials.length === 0) {
    return [];
  }
  
  return data.financials.map((item: any) => ({
    fiscalDateEnding: item.period || '',
    operatingCashflow: item.cashFlowFromOperatingActivities?.toString() || '0',
  }));
};

// Stock API Service
// Note: This uses Alpha Vantage API as an example
// You'll need to get a free API key from https://www.alphavantage.co/support/#api-key

const API_KEY = 'demo'; // Replace with your actual API key
const BASE_URL = 'https://www.alphavantage.co/query';

export interface CompanyOverview {
  Symbol: string;
  Name: string;
  Exchange: string;
  Sector: string;
  MarketCapitalization: string;
  PERatio: string;
  EPS: string;
}

export interface QuarterlyEarnings {
  fiscalDateEnding: string;
  reportedEPS: string;
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
  const response = await fetch(
    `${BASE_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch company data');
  }
  
  const data = await response.json();
  
  if (data.Note || data['Error Message']) {
    throw new Error(data.Note || data['Error Message'] || 'API limit reached or invalid symbol');
  }
  
  return data;
};

export const fetchIncomeStatement = async (symbol: string): Promise<IncomeStatement[]> => {
  const response = await fetch(
    `${BASE_URL}?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch income statement');
  }
  
  const data = await response.json();
  
  if (data.Note || data['Error Message']) {
    throw new Error('API limit reached or invalid data');
  }
  
  return data.quarterlyReports || [];
};

export const fetchCashFlow = async (symbol: string): Promise<CashFlow[]> => {
  const response = await fetch(
    `${BASE_URL}?function=CASH_FLOW&symbol=${symbol}&apikey=${API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch cash flow');
  }
  
  const data = await response.json();
  
  if (data.Note || data['Error Message']) {
    throw new Error('API limit reached or invalid data');
  }
  
  return data.quarterlyReports || [];
};

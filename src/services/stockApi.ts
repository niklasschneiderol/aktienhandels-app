// Hybrid Stock API Service - Finnhub.io + Alpha Vantage
// Finnhub for company data, Alpha Vantage for financial statements & technical indicators

const FINNHUB_API_KEY = 'd3iibspr01qmn7fk7l90d3iibspr01qmn7fk7l9g';
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const ALPHAVANTAGE_API_KEY = 'V81FRDZ1OC5UETB8';
const ALPHAVANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

export interface CompanyOverview {
  Symbol: string;
  Name: string;
  Exchange: string;
  Sector: string;
  MarketCapitalization: string;
  PERatio: string;
  EPS: string;
  PreviousClose?: number;
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

export interface SymbolSearchResult {
  symbol: string;
  name: string;
  type: string;
  region: string;
  currency: string;
}

export const searchSymbol = async (keywords: string): Promise<SymbolSearchResult[]> => {
  try {
    const response = await fetch(
      `${ALPHAVANTAGE_BASE_URL}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(keywords)}&apikey=${ALPHAVANTAGE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to search symbols');
    }
    
    const data = await response.json();
    
    if (data.Note) {
      throw new Error('API rate limit reached. Please try again later.');
    }
    
    const matches = data.bestMatches || [];
    
    return matches.slice(0, 10).map((item: any) => ({
      symbol: item['1. symbol'] || '',
      name: item['2. name'] || '',
      type: item['3. type'] || '',
      region: item['4. region'] || '',
      currency: item['8. currency'] || '',
    }));
  } catch (error) {
    console.error('Error searching symbols:', error);
    return [];
  }
}

export const fetchCompanyOverview = async (symbol: string): Promise<CompanyOverview> => {
  // Fetch company profile, metrics, and quote in parallel from Finnhub
  const [profileResponse, metricsResponse, quoteResponse] = await Promise.all([
    fetch(`${FINNHUB_BASE_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`),
    fetch(`${FINNHUB_BASE_URL}/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_API_KEY}`),
    fetch(`${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`)
  ]);
  
  if (!profileResponse.ok) {
    throw new Error('Failed to fetch company data');
  }
  
  const profile = await profileResponse.json();
  
  if (!profile.name) {
    throw new Error('Invalid symbol or API limit reached');
  }

  const metrics = await metricsResponse.json();
  const quote = await quoteResponse.json();
  
  return {
    Symbol: profile.ticker || symbol,
    Name: profile.name || '',
    Exchange: profile.exchange || '',
    Sector: profile.finnhubIndustry || '',
    MarketCapitalization: (profile.marketCapitalization * 1000000).toString(),
    PERatio: metrics.metric?.peBasicExclExtraTTM?.toString() || '0',
    EPS: metrics.metric?.epsBasicExclExtraItemsAnnual?.toString() || '0',
    PreviousClose: quote.pc || undefined,
  };
};

export const fetchIncomeStatement = async (symbol: string): Promise<IncomeStatement[]> => {
  try {
    const response = await fetch(
      `${ALPHAVANTAGE_BASE_URL}?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${ALPHAVANTAGE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch income statement');
    }
    
    const data = await response.json();
    
    if (data.Note) {
      throw new Error('API rate limit reached. Please try again later.');
    }
    
    const quarterlyReports = data.quarterlyReports || [];
    
    if (quarterlyReports.length === 0) {
      throw new Error('No financial data available');
    }
    
    return quarterlyReports.slice(0, 8).map((item: any) => ({
      fiscalDateEnding: item.fiscalDateEnding || '',
      totalRevenue: item.totalRevenue || '0',
      grossProfit: item.grossProfit || '0',
      netIncome: item.netIncome || '0',
    }));
  } catch (error) {
    console.error('Error fetching income statement:', error);
    throw error;
  }
};

export const fetchCashFlow = async (symbol: string): Promise<CashFlow[]> => {
  try {
    const response = await fetch(
      `${ALPHAVANTAGE_BASE_URL}?function=CASH_FLOW&symbol=${symbol}&apikey=${ALPHAVANTAGE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch cash flow');
    }
    
    const data = await response.json();
    
    if (data.Note) {
      return [];
    }
    
    const quarterlyReports = data.quarterlyReports || [];
    
    if (quarterlyReports.length === 0) {
      return [];
    }
    
    return quarterlyReports.slice(0, 8).map((item: any) => ({
      fiscalDateEnding: item.fiscalDateEnding || '',
      operatingCashflow: item.operatingCashflow || '0',
    }));
  } catch (error) {
    console.error('Error fetching cash flow:', error);
    return [];
  }
};

// Technical Indicators
export interface TechnicalIndicators {
  rsi: number | null;
  sma50: number | null;
  sma200: number | null;
  macd: number | null;
  macdSignal: number | null;
}

export interface IndicatorInterpretation {
  indicator: string;
  value: string;
  interpretation: string;
  signal: 'bullish' | 'bearish' | 'neutral';
}

export const fetchTechnicalIndicators = async (symbol: string): Promise<TechnicalIndicators> => {
  try {
    const [rsiRes, sma50Res, sma200Res, macdRes] = await Promise.all([
      fetch(`${ALPHAVANTAGE_BASE_URL}?function=RSI&symbol=${symbol}&interval=daily&time_period=14&series_type=close&apikey=${ALPHAVANTAGE_API_KEY}`),
      fetch(`${ALPHAVANTAGE_BASE_URL}?function=SMA&symbol=${symbol}&interval=daily&time_period=50&series_type=close&apikey=${ALPHAVANTAGE_API_KEY}`),
      fetch(`${ALPHAVANTAGE_BASE_URL}?function=SMA&symbol=${symbol}&interval=daily&time_period=200&series_type=close&apikey=${ALPHAVANTAGE_API_KEY}`),
      fetch(`${ALPHAVANTAGE_BASE_URL}?function=MACD&symbol=${symbol}&interval=daily&series_type=close&apikey=${ALPHAVANTAGE_API_KEY}`)
    ]);

    const [rsiData, sma50Data, sma200Data, macdData] = await Promise.all([
      rsiRes.json(),
      sma50Res.json(),
      sma200Res.json(),
      macdRes.json()
    ]);

    // Extract latest values
    const getRSI = () => {
      const data = rsiData['Technical Analysis: RSI'];
      if (!data) return null;
      const latestDate = Object.keys(data)[0];
      return parseFloat(data[latestDate]['RSI']) || null;
    };

    const getSMA = (data: any, key: string) => {
      if (!data) return null;
      const latestDate = Object.keys(data)[0];
      return parseFloat(data[latestDate]['SMA']) || null;
    };

    const getMACD = () => {
      const data = macdData['Technical Analysis: MACD'];
      if (!data) return null;
      const latestDate = Object.keys(data)[0];
      return {
        macd: parseFloat(data[latestDate]['MACD']) || null,
        signal: parseFloat(data[latestDate]['MACD_Signal']) || null
      };
    };

    const macdValues = getMACD();

    return {
      rsi: getRSI(),
      sma50: getSMA(sma50Data['Technical Analysis: SMA'], 'SMA'),
      sma200: getSMA(sma200Data['Technical Analysis: SMA'], 'SMA'),
      macd: macdValues?.macd || null,
      macdSignal: macdValues?.signal || null,
    };
  } catch (error) {
    console.error('Error fetching technical indicators:', error);
    return {
      rsi: null,
      sma50: null,
      sma200: null,
      macd: null,
      macdSignal: null,
    };
  }
};

export const interpretIndicators = (indicators: TechnicalIndicators): IndicatorInterpretation[] => {
  const interpretations: IndicatorInterpretation[] = [];

  // RSI Interpretation
  if (indicators.rsi !== null) {
    let interpretation = '';
    let signal: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    
    if (indicators.rsi > 70) {
      interpretation = 'Überkauft - Mögliche Korrektur';
      signal = 'bearish';
    } else if (indicators.rsi < 30) {
      interpretation = 'Überverkauft - Mögliche Erholung';
      signal = 'bullish';
    } else {
      interpretation = 'Neutral';
      signal = 'neutral';
    }

    interpretations.push({
      indicator: 'RSI (14)',
      value: indicators.rsi.toFixed(2),
      interpretation,
      signal
    });
  }

  // SMA Interpretation
  if (indicators.sma50 !== null && indicators.sma200 !== null) {
    let interpretation = '';
    let signal: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    
    if (indicators.sma50 > indicators.sma200) {
      interpretation = 'Aufwärtstrend (Golden Cross)';
      signal = 'bullish';
    } else if (indicators.sma50 < indicators.sma200) {
      interpretation = 'Abwärtstrend (Death Cross)';
      signal = 'bearish';
    } else {
      interpretation = 'Seitwärtstrend';
      signal = 'neutral';
    }

    interpretations.push({
      indicator: 'SMA (50/200)',
      value: `${indicators.sma50.toFixed(2)} / ${indicators.sma200.toFixed(2)}`,
      interpretation,
      signal
    });
  }

  // MACD Interpretation
  if (indicators.macd !== null && indicators.macdSignal !== null) {
    let interpretation = '';
    let signal: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    
    if (indicators.macd > indicators.macdSignal) {
      interpretation = 'Bullisches Momentum';
      signal = 'bullish';
    } else if (indicators.macd < indicators.macdSignal) {
      interpretation = 'Bearisches Momentum';
      signal = 'bearish';
    } else {
      interpretation = 'Neutral';
      signal = 'neutral';
    }

    interpretations.push({
      indicator: 'MACD (9,12,26)',
      value: indicators.macd.toFixed(4),
      interpretation,
      signal
    });
  }

  return interpretations;
};

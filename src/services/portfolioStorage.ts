import { PortfolioStock } from "@/components/Portfolio";

const STORAGE_KEY = 'etoro-portfolio';

export const savePortfolio = (stocks: PortfolioStock[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stocks));
  } catch (error) {
    console.error('Error saving portfolio:', error);
  }
};

export const loadPortfolio = (): PortfolioStock[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading portfolio:', error);
    return [];
  }
};

export const clearPortfolio = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing portfolio:', error);
  }
};

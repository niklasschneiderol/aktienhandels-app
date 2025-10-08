import { useState, useEffect, useRef } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchSymbol, SymbolSearchResult } from "@/services/stockApi";

interface StockSearchProps {
  onSearch: (symbol: string) => void;
  isLoading?: boolean;
}

export const StockSearch = ({ onSearch, isLoading }: StockSearchProps) => {
  const [symbol, setSymbol] = useState("");
  const [searchResults, setSearchResults] = useState<SymbolSearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      const trimmedSymbol = symbol.trim();
      
      if (trimmedSymbol.length >= 2) {
        setIsSearching(true);
        const results = await searchSymbol(trimmedSymbol);
        setSearchResults(results);
        setShowDropdown(results.length > 0);
        setIsSearching(false);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [symbol]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symbol.trim()) {
      onSearch(symbol.trim().toUpperCase());
      setShowDropdown(false);
    }
  };

  const handleSelectResult = (result: SymbolSearchResult) => {
    setSymbol(result.symbol);
    setShowDropdown(false);
    onSearch(result.symbol);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-3">
        <div className="relative flex-1" ref={dropdownRef}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Suche nach Symbol oder Firmenname (z.B. Apple, MSFT, Tesla)..."
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
            className="pl-12 h-14 text-lg shadow-card border-2 focus-visible:ring-2 focus-visible:ring-primary"
            disabled={isLoading}
            data-testid="input-stock-search"
          />
          
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border-2 border-border rounded-lg shadow-elevated z-50 max-h-80 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={`${result.symbol}-${index}`}
                  type="button"
                  onClick={() => handleSelectResult(result)}
                  className="w-full px-4 py-3 text-left hover:bg-accent/50 transition-colors border-b border-border last:border-b-0 flex flex-col gap-1"
                  data-testid={`search-result-${index}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-primary">{result.symbol}</span>
                    <span className="text-xs text-muted-foreground">{result.region}</span>
                  </div>
                  <div className="text-sm text-foreground line-clamp-1">{result.name}</div>
                  <div className="text-xs text-muted-foreground">{result.type}</div>
                </button>
              ))}
            </div>
          )}
          
          {isSearching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent"></div>
            </div>
          )}
        </div>
        <Button 
          type="submit" 
          size="lg"
          className="h-14 px-8 gradient-primary hover:opacity-90 transition-opacity shadow-elevated"
          disabled={isLoading || !symbol.trim()}
          data-testid="button-search"
        >
          Search
        </Button>
      </div>
    </form>
  );
};

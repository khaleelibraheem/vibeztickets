import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";

export function TicketSearch({ onSearch, isSearching }) {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchInput = useDebounce(searchInput, 300);

  const handleSearch = useCallback(() => {
    if (debouncedSearchInput.trim()) {
      onSearch(debouncedSearchInput);
    }
  }, [debouncedSearchInput, onSearch]);

  const clearSearch = () => {
    setSearchInput("");
  };

  return (
    <Card className="sm:max-w-[500px]">
      <CardHeader>
        <CardTitle>Search Ticket</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Input
              placeholder="Enter Ticket ID"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              className="pr-8"
              aria-label="Search tickets"
            />
            {searchInput && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button
            onClick={handleSearch}
            disabled={isSearching || !searchInput.trim()}
          >
            <Search className="h-4 w-4 mr-2" />
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Filter, X } from "lucide-react";
import GrantCard from "@/components/grant-card";
import { Grant } from "@shared/schema";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { parseFundingAmount } from "@/lib/utils";

export default function SearchResults() {
  // Get the search query from the URL parameter
  const [, params] = useRoute<{ query: string }>("/search/:query");
  const searchQuery = params?.query ? decodeURIComponent(params.query) : "";
  
  // State for filters
  const [industryFilter, setIndustryFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [provinceFilter, setProvinceFilter] = useState<string | null>(null);
  const [fundingRange, setFundingRange] = useState<[number, number]>([0, 10000000]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Fetch search results
  const { data: searchResults, isLoading, error } = useQuery<Grant[]>({
    queryKey: ["/api/grants/search", searchQuery],
    queryFn: () => fetch(`/api/grants/search/${encodeURIComponent(searchQuery)}`).then(res => res.json()),
    enabled: searchQuery.length > 0,
  });
  
  // Apply filters to search results
  const filteredResults = searchResults?.filter(grant => {
    // Filter by industry if selected
    if (industryFilter && grant.industry !== industryFilter) {
      return false;
    }
    
    // Filter by type if selected
    if (typeFilter && grant.type !== typeFilter) {
      return false;
    }
    
    // Filter by province if selected
    if (provinceFilter && grant.province !== provinceFilter) {
      return false;
    }
    
    // Filter by funding amount
    const fundingAmount = parseFundingAmount(grant.fundingAmount);
    if (fundingAmount < fundingRange[0] || fundingAmount > fundingRange[1]) {
      return false;
    }
    
    return true;
  });
  
  // Extract all unique industries, types, and provinces for filter options
  const industries = searchResults 
    ? Array.from(new Set(searchResults.map(grant => grant.industry).filter(Boolean) as string[]))
    : [];
  const types = searchResults 
    ? Array.from(new Set(searchResults.map(grant => grant.type)))
    : [];
  const provinces = searchResults 
    ? Array.from(new Set(searchResults.map(grant => grant.province).filter(Boolean) as string[]))
    : [];
  
  // Format the funding range for display
  const formatFundingAmount = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    } else {
      return `$${value}`;
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setIndustryFilter(null);
    setTypeFilter(null);
    setProvinceFilter(null);
    setFundingRange([0, 10000000]);
  };
  
  // Get maximum funding amount from results for slider
  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      const maxAmount = Math.max(...searchResults.map(grant => parseFundingAmount(grant.fundingAmount)));
      setFundingRange([0, maxAmount]);
    }
  }, [searchResults]);
  
  // Count active filters
  const activeFilterCount = [
    industryFilter, 
    typeFilter, 
    provinceFilter
  ].filter(Boolean).length;
  
  return (
    <div className="container mx-auto px-4 py-32">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">
          Search Results for "{searchQuery}"
        </h1>
        
        {/* Mobile filter button */}
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="md:hidden relative">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-gray-900 border-gray-800">
            <SheetHeader>
              <SheetTitle className="text-white">Filters</SheetTitle>
              <SheetDescription>
                Refine your search results
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4 space-y-6">
              {/* Mobile filters content */}
              <div>
                <h3 className="font-medium text-white mb-2">Grant Type</h3>
                <Select 
                  value={typeFilter || "all_types"} 
                  onValueChange={(value) => setTypeFilter(value === "all_types" ? null : value)}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all_types">All Types</SelectItem>
                    {types.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h3 className="font-medium text-white mb-2">Industry</h3>
                <Select 
                  value={industryFilter || "all_industries"} 
                  onValueChange={(value) => setIndustryFilter(value === "all_industries" ? null : value)}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="All Industries" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all_industries">All Industries</SelectItem>
                    {industries.map(industry => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h3 className="font-medium text-white mb-2">Province</h3>
                <Select 
                  value={provinceFilter || "all_provinces"} 
                  onValueChange={(value) => setProvinceFilter(value === "all_provinces" ? null : value)}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="All Provinces" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all_provinces">All Provinces</SelectItem>
                    {provinces.map(province => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h3 className="font-medium text-white mb-4">Funding Amount</h3>
                <Slider
                  defaultValue={fundingRange}
                  min={0}
                  max={10000000}
                  step={10000}
                  value={fundingRange}
                  onValueChange={(val) => setFundingRange(val as [number, number])}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{formatFundingAmount(fundingRange[0])}</span>
                  <span>{formatFundingAmount(fundingRange[1])}</span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={clearFilters}
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Desktop filters sidebar */}
        <div className="hidden md:block w-64 bg-gray-900 p-4 rounded-lg h-fit space-y-6">
          <div>
            <h3 className="font-medium text-white mb-2">Grant Type</h3>
            <Select 
              value={typeFilter || "all_types"} 
              onValueChange={(value) => setTypeFilter(value === "all_types" ? null : value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all_types">All Types</SelectItem>
                {types.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Separator className="bg-gray-800" />
          
          <div>
            <h3 className="font-medium text-white mb-2">Industry</h3>
            <Select 
              value={industryFilter || "all_industries"} 
              onValueChange={(value) => setIndustryFilter(value === "all_industries" ? null : value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="All Industries" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all_industries">All Industries</SelectItem>
                {industries.map(industry => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Separator className="bg-gray-800" />
          
          <div>
            <h3 className="font-medium text-white mb-2">Province</h3>
            <Select 
              value={provinceFilter || "all_provinces"} 
              onValueChange={(value) => setProvinceFilter(value === "all_provinces" ? null : value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="All Provinces" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all_provinces">All Provinces</SelectItem>
                {provinces.map(province => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Separator className="bg-gray-800" />
          
          <div>
            <h3 className="font-medium text-white mb-4">Funding Amount</h3>
            <Slider
              defaultValue={fundingRange}
              min={0}
              max={10000000}
              step={10000}
              value={fundingRange}
              onValueChange={(val) => setFundingRange(val as [number, number])}
              className="mb-2"
            />
            <div className="flex justify-between text-sm text-gray-400">
              <span>{formatFundingAmount(fundingRange[0])}</span>
              <span>{formatFundingAmount(fundingRange[1])}</span>
            </div>
          </div>
          
          <Separator className="bg-gray-800" />
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={clearFilters}
          >
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>
        
        {/* Results area */}
        <div className="flex-1">
          {/* Active filters display */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {industryFilter && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Industry: {industryFilter}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setIndustryFilter(null)} 
                  />
                </Badge>
              )}
              {typeFilter && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Type: {typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setTypeFilter(null)} 
                  />
                </Badge>
              )}
              {provinceFilter && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Province: {provinceFilter}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setProvinceFilter(null)} 
                  />
                </Badge>
              )}
            </div>
          )}
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <span className="ml-2 text-white">Searching grants...</span>
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-center">
              <p className="text-red-400">Error loading search results. Please try again.</p>
            </div>
          ) : filteredResults?.length === 0 ? (
            <div className="bg-gray-900 rounded-lg p-8 text-center">
              <p className="text-gray-400 mb-2">No grants found matching "{searchQuery}"</p>
              <p className="text-gray-500">Try adjusting your search terms or clearing filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResults?.map(grant => (
                <GrantCard 
                  key={grant.id} 
                  grant={grant} 
                />
              ))}
            </div>
          )}
          
          {filteredResults && (
            <p className="text-gray-400 mt-4 text-sm">
              Found {filteredResults.length} grant{filteredResults.length !== 1 ? 's' : ''}
              {activeFilterCount > 0 && ' (filtered)'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
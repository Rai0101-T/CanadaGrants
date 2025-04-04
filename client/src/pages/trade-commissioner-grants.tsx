import { useQuery } from "@tanstack/react-query";
import { Grant } from "@shared/schema";
import { useState } from "react";
import GrantCard from "@/components/grant-card";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function TradeCommissionerGrants() {
  const [filters, setFilters] = useState({
    industry: "all",
    fundingAmount: "any",
    deadline: "any"
  });

  const [searchQuery, setSearchQuery] = useState("");

  const { data: grants, isLoading } = useQuery<Grant[]>({
    queryKey: ["/api/grants/type/federal"],
    // This query fetches federal grants, we'll filter them to just show Trade Commissioner ones on the frontend
  });

  // Filter grants to show only those from the Trade Commissioner Service
  const tradeCommissionerGrants = grants?.filter(
    (grant) => grant.department === "Trade Commissioner Service" || 
               grant.title.toLowerCase().includes("trade commissioner") ||
               grant.description.toLowerCase().includes("trade commissioner")
  );

  // Filter based on selected filters and search query
  const filteredGrants = tradeCommissionerGrants?.filter((grant) => {
    // Filter by industry
    if (filters.industry && filters.industry !== "all" && !grant.industry?.includes(filters.industry)) {
      return false;
    }
    
    // Filter by funding amount
    if (filters.fundingAmount && filters.fundingAmount !== "any") {
      const amount = filters.fundingAmount;
      const grantAmount = grant.fundingAmount.toLowerCase();
      
      if (amount === "under10k" && !grantAmount.includes("under $10k") && !grantAmount.includes("<$10k") && !grantAmount.includes("under 10k")) {
        if (grantAmount.includes("k") || grantAmount.includes("K")) {
          const match = grantAmount.match(/\$?(\d+)k/i);
          if (match && parseInt(match[1]) >= 10) {
            return false;
          }
        }
      } else if (amount === "10k-50k") {
        if (grantAmount.includes("k") || grantAmount.includes("K")) {
          const match = grantAmount.match(/\$?(\d+)k/i);
          if (match && (parseInt(match[1]) < 10 || parseInt(match[1]) > 50)) {
            return false;
          }
        }
      } else if (amount === "50k-100k") {
        if (grantAmount.includes("k") || grantAmount.includes("K")) {
          const match = grantAmount.match(/\$?(\d+)k/i);
          if (match && (parseInt(match[1]) < 50 || parseInt(match[1]) > 100)) {
            return false;
          }
        }
      } else if (amount === "over100k") {
        if (grantAmount.includes("k") || grantAmount.includes("K")) {
          const match = grantAmount.match(/\$?(\d+)k/i);
          if (match && parseInt(match[1]) <= 100) {
            return false;
          }
        }
        if (!grantAmount.includes("million") && !grantAmount.includes("m") && !grantAmount.includes("M")) {
          return false;
        }
      }
    }
    
    // Filter by deadline
    if (filters.deadline && filters.deadline !== "any") {
      const today = new Date();
      const deadlineDate = new Date(grant.deadline);
      
      if (filters.deadline === "thisMonth") {
        const nextMonth = new Date(today);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        if (deadlineDate > nextMonth || deadlineDate < today) {
          return false;
        }
      } else if (filters.deadline === "next3Months") {
        const next3Months = new Date(today);
        next3Months.setMonth(next3Months.getMonth() + 3);
        if (deadlineDate > next3Months || deadlineDate < today) {
          return false;
        }
      } else if (filters.deadline === "future") {
        if (deadlineDate < today) {
          return false;
        }
      }
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        grant.title.toLowerCase().includes(query) ||
        grant.description.toLowerCase().includes(query) ||
        (grant.eligibilityCriteria && grant.eligibilityCriteria.some(criteria => criteria.toLowerCase().includes(query)))
      );
    }
    
    return true;
  });

  // Generate dynamic page title based on filters
  let pageTitle = "Trade Commissioner Service Grants";
  if (filters.industry && filters.industry !== "all") {
    pageTitle = `${filters.industry} - ${pageTitle}`;
  }
  if (filters.fundingAmount && filters.fundingAmount !== "any") {
    const amountMap: { [key: string]: string } = {
      under10k: "Under $10K",
      "10k-50k": "$10K-50K",
      "50k-100k": "$50K-100K",
      over100k: "Over $100K",
    };
    pageTitle = `${amountMap[filters.fundingAmount]} - ${pageTitle}`;
  }

  // Handle filter changes
  const handleFilterChange = (name: string, value: string) => {
    setFilters({ ...filters, [name]: value });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      industry: "all",
      fundingAmount: "any",
      deadline: "any"
    });
    setSearchQuery("");
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-2">{pageTitle}</h1>
      <p className="mb-6 text-muted-foreground">
        Discover specialized funding programs offered by the Trade Commissioner Service to help Canadian businesses expand internationally.
      </p>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search grants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          value={filters.industry}
          onValueChange={(value) => handleFilterChange("industry", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            <SelectItem value="International Trade">International Trade</SelectItem>
            <SelectItem value="Export">Export</SelectItem>
            <SelectItem value="Technology">Technology</SelectItem>
            <SelectItem value="Manufacturing">Manufacturing</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.fundingAmount}
          onValueChange={(value) => handleFilterChange("fundingAmount", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Funding Amount" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Amount</SelectItem>
            <SelectItem value="under10k">Under $10K</SelectItem>
            <SelectItem value="10k-50k">$10K - $50K</SelectItem>
            <SelectItem value="50k-100k">$50K - $100K</SelectItem>
            <SelectItem value="over100k">Over $100K</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.deadline}
          onValueChange={(value) => handleFilterChange("deadline", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Deadline" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Deadline</SelectItem>
            <SelectItem value="thisMonth">This Month</SelectItem>
            <SelectItem value="next3Months">Next 3 Months</SelectItem>
            <SelectItem value="future">Future Deadlines</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active filters */}
      {((filters.industry && filters.industry !== "all") || 
        (filters.fundingAmount && filters.fundingAmount !== "any") || 
        (filters.deadline && filters.deadline !== "any") || 
        searchQuery) && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-medium">Active Filters:</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearFilters}
              className="h-7 px-2"
            >
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.industry && filters.industry !== "all" && (
              <Badge variant="outline" className="p-1.5">
                Industry: {filters.industry}
              </Badge>
            )}
            {filters.fundingAmount && filters.fundingAmount !== "any" && (
              <Badge variant="outline" className="p-1.5">
                Amount: {
                  {
                    "under10k": "Under $10K",
                    "10k-50k": "$10K - $50K",
                    "50k-100k": "$50K - $100K",
                    "over100k": "Over $100K"
                  }[filters.fundingAmount]
                }
              </Badge>
            )}
            {filters.deadline && filters.deadline !== "any" && (
              <Badge variant="outline" className="p-1.5">
                Deadline: {
                  {
                    "thisMonth": "This Month",
                    "next3Months": "Next 3 Months",
                    "future": "Future Deadlines"
                  }[filters.deadline]
                }
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="outline" className="p-1.5">
                Search: {searchQuery}
              </Badge>
            )}
          </div>
        </div>
      )}

      <Separator className="my-4" />

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}

      {/* Grants grid */}
      {!isLoading && (
        <>
          <h2 className="text-xl font-semibold mb-4">
            {filteredGrants?.length} {filteredGrants?.length === 1 ? "Grant" : "Grants"} Available
          </h2>
          
          {filteredGrants?.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-lg font-medium mb-2">No grants match your filters</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search criteria or clearing filters</p>
              <Button onClick={clearFilters}>Clear All Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGrants?.map((grant) => (
                <GrantCard key={grant.id} grant={grant} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
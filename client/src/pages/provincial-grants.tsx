import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Grant } from "@shared/schema";
import GrantCard from "@/components/grant-card";
import ProvincialGrantFilters from "@/components/provincial-grant-filters";
import GrantCarousel from "@/components/grant-carousel";

export default function ProvincialGrants() {
  const [filters, setFilters] = useState({
    province: "all_provinces",
    industry: "all_industries",
    grantAmount: "any_amount",
    deadline: "any_deadline",
  });
  
  // Fetch all provincial grants
  const { data: grants, isLoading, isError } = useQuery<Grant[]>({
    queryKey: ["/api/grants/type/provincial"],
  });
  
  // Apply all filters to grants
  const filteredGrants = useMemo(() => {
    if (!grants) return [];
    
    return grants.filter(grant => {
      // Province filter
      if (filters.province && filters.province !== "all_provinces") {
        // Match province name or code (converted to lowercase for comparison)
        const selectedProvince = filters.province.toLowerCase();
        const grantProvince = grant.province?.toLowerCase() || '';
        
        // Map common province codes/names for comparison
        const provinceMappings: Record<string, string[]> = {
          'alberta': ['alberta', 'ab'],
          'british_columbia': ['british columbia', 'bc', 'b.c.'],
          'manitoba': ['manitoba', 'mb'],
          'new_brunswick': ['new brunswick', 'nb', 'n.b.'],
          'newfoundland': ['newfoundland', 'labrador', 'nl', 'n.l.'],
          'northwest_territories': ['northwest territories', 'nt', 'n.t.'],
          'nova_scotia': ['nova scotia', 'ns', 'n.s.'],
          'nunavut': ['nunavut', 'nu'],
          'ontario': ['ontario', 'on'],
          'pei': ['prince edward island', 'pei', 'p.e.i.'],
          'quebec': ['quebec', 'qc'],
          'saskatchewan': ['saskatchewan', 'sk'],
          'yukon': ['yukon', 'yt', 'y.t.'],
        };
        
        // Check if province matches using the mappings
        const matchesProvince = provinceMappings[selectedProvince]?.some(term => 
          grantProvince.includes(term)
        );
        
        if (!matchesProvince && !grantProvince.includes(selectedProvince)) {
          return false;
        }
      }
      
      // Industry filter
      if (filters.industry && filters.industry !== "all_industries") {
        const industryLower = filters.industry.toLowerCase();
        
        // Check all possible industry-related fields
        const grantIndustryLower = grant.industry?.toLowerCase() || '';
        const categoryLower = grant.category?.toLowerCase() || '';
        
        // Handle industryFocus array properly if present
        let matchesIndustryFocus = false;
        if (Array.isArray(grant.industryFocus)) {
          // Check if any industry in the array matches or contains the selected industry
          matchesIndustryFocus = grant.industryFocus.some(ind => 
            ind.toLowerCase().includes(industryLower) || 
            industryLower.includes(ind.toLowerCase())
          );
        }
        
        // Special case for "Multiple" industry
        if (grantIndustryLower === 'multiple') {
          // If marked as "Multiple", check industryFocus array for confirmation if available
          if (Array.isArray(grant.industryFocus) && grant.industryFocus.length > 0) {
            if (!matchesIndustryFocus) {
              return false;
            }
          }
        }
        // Match if any of the fields contain the industry
        else if (!grantIndustryLower.includes(industryLower) && 
                !categoryLower.includes(industryLower) && 
                !matchesIndustryFocus) {
          return false;
        }
      }
      
      // Grant amount filter
      if (filters.grantAmount && filters.grantAmount !== "any_amount") {
        // Extract numeric portion of funding amount and preserve K/M notation
        // e.g. from "$15K-$15M" or "$1.5M" or "Up to $500K"
        const amountStr = grant.fundingAmount.toLowerCase().replace(/[^0-9\.\-km]/g, '');
        let minAmount = 0;
        let maxAmount = 0;
        
        // Convert K/M notation to actual numbers
        const convertToNumber = (value: string): number => {
          if (value.endsWith('m')) {
            // Convert millions (e.g., 1.5m -> 1,500,000)
            return parseFloat(value.replace('m', '')) * 1000000;
          } else if (value.endsWith('k')) {
            // Convert thousands (e.g., 500k -> 500,000)
            return parseFloat(value.replace('k', '')) * 1000;
          } else {
            // Plain number
            return parseFloat(value) || 0;
          }
        };
        
        // Handle ranges (e.g., 15k-15m)
        if (amountStr.includes('-')) {
          const parts = amountStr.split('-');
          minAmount = convertToNumber(parts[0]);
          maxAmount = convertToNumber(parts[1]);
        } else {
          // Handle single values
          const amount = convertToNumber(amountStr);
          minAmount = maxAmount = amount;
        }
        
        // If we couldn't parse numbers properly, default to showing the grant
        if (isNaN(minAmount) || isNaN(maxAmount)) {
          console.log(`Could not parse amount: ${grant.fundingAmount}`);
          return true;
        }
        
        // Grant should appear if either min or max value falls within the range
        // Or if the range spans the filter category (min below, max above)
        let matchesFilter = false;
        
        switch (filters.grantAmount) {
          case "under_10k":
            // Grant has value under 10K
            matchesFilter = minAmount < 10000;
            break;
          case "10k_50k":
            // Grant's min is below 50K and max is above 10K
            matchesFilter = (minAmount <= 50000 && maxAmount >= 10000);
            break;
          case "50k_100k":
            // Grant's min is below 100K and max is above 50K
            matchesFilter = (minAmount <= 100000 && maxAmount >= 50000);
            break;
          case "100k_500k":
            // Grant's min is below 500K and max is above 100K
            matchesFilter = (minAmount <= 500000 && maxAmount >= 100000);
            break;
          case "over_500k":
            // Grant has value over 500K
            matchesFilter = maxAmount >= 500000;
            break;
        }
        
        if (!matchesFilter) return false;
      }
      
      // Deadline filter
      if (filters.deadline && filters.deadline !== "any_deadline") {
        // Handle "Ongoing" or "No Deadline" grants
        if (grant.deadline === "Ongoing" || grant.deadline === "No Deadline") {
          if (filters.deadline !== "ongoing") return false;
        } else {
          try {
            // Try to parse the deadline as a date
            const deadlineDate = new Date(grant.deadline);
            if (isNaN(deadlineDate.getTime())) {
              // If it's not a valid date, don't filter this grant
              return true;
            }
            
            const today = new Date();
            const thirtyDaysFromNow = new Date(today);
            thirtyDaysFromNow.setDate(today.getDate() + 30);
            const sixtyDaysFromNow = new Date(today);
            sixtyDaysFromNow.setDate(today.getDate() + 60);
            const ninetyDaysFromNow = new Date(today);
            ninetyDaysFromNow.setDate(today.getDate() + 90);
            const endOfYear = new Date(today.getFullYear(), 11, 31);
            
            switch (filters.deadline) {
              case "ongoing":
                return false; // Already handled ongoing deadlines above
              case "30_days":
                if (deadlineDate > thirtyDaysFromNow || deadlineDate < today) return false;
                break;
              case "60_days":
                if (deadlineDate > sixtyDaysFromNow || deadlineDate < today) return false;
                break;
              case "90_days":
                if (deadlineDate > ninetyDaysFromNow || deadlineDate < today) return false;
                break;
              case "this_year":
                if (deadlineDate > endOfYear || deadlineDate < today) return false;
                break;
            }
          } catch (e) {
            // If there's an error parsing the date, don't filter this grant
            console.error("Error parsing date:", grant.deadline);
          }
        }
      }
      
      return true;
    });
  }, [grants, filters]);
  
  // Group grants by provinces for carousel display
  const provinceGroups = useMemo(() => {
    if (!filteredGrants) return {};
    
    return filteredGrants.reduce((acc, grant) => {
      if (grant.province) {
        if (!acc[grant.province]) {
          acc[grant.province] = [];
        }
        acc[grant.province].push(grant);
      }
      return acc;
    }, {} as Record<string, Grant[]>);
  }, [filteredGrants]);
  
  // Get the top provinces with most grants
  const topProvinces = useMemo(() => {
    return Object.entries(provinceGroups)
      .sort(([, grantsA], [, grantsB]) => grantsB.length - grantsA.length)
      .slice(0, 5)
      .map(([province]) => province);
  }, [provinceGroups]);
  
  // Get high value provincial grants
  const highValueGrants = useMemo(() => {
    if (!filteredGrants) return [];
    return filteredGrants.filter(grant => {
      const amountStr = grant.fundingAmount.replace(/[^0-9\-Kk]/g, '');
      let maxAmount = 0;
      
      // Handle K notation (e.g., 15K) and ranges (e.g., 15K-100K)
      if (amountStr.includes('-')) {
        const parts = amountStr.split('-');
        // Parse each part considering K notation
        const min = parseInt(parts[0].replace(/K|k/i, '000'));
        const max = parseInt(parts[1].replace(/K|k/i, '000'));
        maxAmount = Math.max(min, max); // Use the maximum value for high value detection
      } else if (amountStr.toLowerCase().includes('k')) {
        maxAmount = parseInt(amountStr.toLowerCase().replace('k', '')) * 1000;
      } else {
        maxAmount = parseInt(amountStr);
      }
      
      return maxAmount > 200000;
    });
  }, [filteredGrants]);
  
  // Get grants with upcoming deadlines
  const upcomingDeadlines = useMemo(() => {
    if (!filteredGrants) return [];
    const now = new Date();
    
    // Sort by deadline and get upcoming ones (handling special deadline formats)
    return [...filteredGrants]
      .filter(grant => {
        // Skip "Ongoing" or "No Deadline" grants for the upcoming deadlines section
        if (grant.deadline === "Ongoing" || grant.deadline === "No Deadline") {
          return false;
        }
        
        try {
          const deadlineDate = new Date(grant.deadline);
          // Check if it's a valid date and in the future
          return !isNaN(deadlineDate.getTime()) && deadlineDate > now;
        } catch (e) {
          // If there's an error parsing the date, don't include this grant
          return false;
        }
      })
      .sort((a, b) => {
        try {
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        } catch (e) {
          return 0; // In case of parsing errors, don't change the order
        }
      })
      .slice(0, 10);
  }, [filteredGrants]);

  return (
    <div className="bg-black text-white min-h-screen pt-24 px-4 pb-16">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Provincial Grants</h1>
          <p className="text-gray-400 max-w-3xl">
            Explore province-specific funding opportunities across Canada. These grants are provided by provincial governments to support local projects, businesses, and initiatives.
          </p>
          
          <div className="mt-6 mb-6">
            <ProvincialGrantFilters 
              onFilterChange={setFilters}
              className="mb-4" 
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : isError ? (
          <div className="text-center py-10 text-red-500">
            Error loading provincial grants. Please try again later.
          </div>
        ) : filteredGrants.length > 0 ? (
          <div className="space-y-12">
            {/* Check if any filters are applied */}
            {(() => {
              const isNoFilterApplied = 
                filters.province === "all_provinces" && 
                filters.industry === "all_industries" && 
                filters.grantAmount === "any_amount" && 
                filters.deadline === "any_deadline";
              
              if (isNoFilterApplied) {
                // When no filters are applied, show all provincial grants in a grid
                return (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">All Provincial Grants</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {filteredGrants.map((grant) => (
                        <GrantCard key={grant.id} grant={grant} />
                      ))}
                    </div>
                  </div>
                );
              } else {
                // When filters are applied, only show filtered grants
                return (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">
                      {/* Dynamic title based on filters */}
                      {filters.province !== "all_provinces" && 
                        (() => {
                          const provinceName = filters.province.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                          // Handle special cases
                          if (provinceName === "Pei") return "PEI Grants";
                          if (provinceName === "British Columbia") return "BC Grants";
                          return `${provinceName} Grants`;
                        })()}
                      {filters.industry !== "all_industries" && filters.province === "all_provinces" && 
                        `${filters.industry.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Industry Grants`}
                      {filters.grantAmount !== "any_amount" && filters.province === "all_provinces" && 
                       filters.industry === "all_industries" && 
                        (() => {
                          switch (filters.grantAmount) {
                            case "under_10k": return "Small Provincial Grants (Under $10,000)";
                            case "10k_50k": return "Provincial Grants $10,000 - $50,000";
                            case "50k_100k": return "Provincial Grants $50,000 - $100,000";
                            case "100k_500k": return "Provincial Grants $100,000 - $500,000";
                            case "over_500k": return "Large Provincial Grants (Over $500,000)";
                            default: return "Provincial Grants";
                          }
                        })()}
                      {filters.deadline !== "any_deadline" && filters.province === "all_provinces" && 
                       filters.industry === "all_industries" && filters.grantAmount === "any_amount" && 
                        (() => {
                          switch (filters.deadline) {
                            case "ongoing": return "Ongoing Provincial Grants";
                            case "30_days": return "Provincial Grants Closing in 30 Days";
                            case "60_days": return "Provincial Grants Closing in 60 Days";
                            case "90_days": return "Provincial Grants Closing in 90 Days";
                            case "this_year": return "Provincial Grants Closing This Year";
                            default: return "Provincial Grants";
                          }
                        })()}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {filteredGrants.map((grant) => (
                        <GrantCard key={grant.id} grant={grant} />
                      ))}
                    </div>
                  </div>
                );
              }
            })()}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400">
            No provincial grants found matching your filter criteria. Try adjusting your filters.
          </div>
        )}
      </div>
    </div>
  );
}

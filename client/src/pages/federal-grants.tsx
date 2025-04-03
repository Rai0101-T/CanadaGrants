import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Grant } from "@shared/schema";
import GrantCard from "@/components/grant-card";
import FederalGrantFilters from "@/components/federal-grant-filters";
import GrantCarousel from "@/components/grant-carousel";

export default function FederalGrants() {
  const [filters, setFilters] = useState({
    department: "all_departments",
    industry: "all_industries",
    grantAmount: "any_amount",
    deadline: "any_deadline",
  });
  
  // Fetch all federal grants
  const { data: grants, isLoading, isError } = useQuery<Grant[]>({
    queryKey: ["/api/grants/type/federal"],
  });
  
  // Apply all filters to grants
  const filteredGrants = useMemo(() => {
    if (!grants) return [];
    
    return grants.filter(grant => {
      // Department filter
      if (filters.department && filters.department !== "all_departments") {
        // Match by fundingOrganization or category
        const deptLower = filters.department.toLowerCase();
        const fundingOrgLower = grant.fundingOrganization?.toLowerCase() || '';
        const categoryLower = grant.category?.toLowerCase() || '';
        
        // Map department filter values to possible matches in the data
        const deptMappings: Record<string, string[]> = {
          'innovation_canada': ['innovation', 'science and economic development', 'ised'],
          'nrc': ['national research council', 'nrc'],
          'agriculture_canada': ['agriculture', 'agri-food', 'farm'],
          'environment_canada': ['environment', 'climate change', 'environmental'],
          'global_affairs': ['global affairs', 'international', 'foreign'],
          'health_canada': ['health canada', 'health', 'healthcare'],
          'transportation': ['transport canada', 'transportation', 'transit'],
          'heritage_canada': ['heritage', 'culture', 'arts'],
          'natural_resources': ['natural resources', 'energy', 'resource'],
        };
        
        // Check if this grant matches the selected department
        const matchesDept = deptMappings[deptLower]?.some(term => 
          fundingOrgLower.includes(term) || categoryLower.includes(term)
        );
        
        if (!matchesDept && 
            !fundingOrgLower.includes(deptLower) && 
            !categoryLower.includes(deptLower)) {
          return false;
        }
      }
      
      // Industry filter
      if (filters.industry && filters.industry !== "all_industries") {
        const industryLower = filters.industry.toLowerCase();
        
        // Check all possible industry-related fields
        const grantIndustryLower = grant.industry?.toLowerCase() || '';
        const categoryLower = grant.category?.toLowerCase() || '';
        
        // Handle industryFocus array properly
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
          // If marked as "Multiple", always show it for specific industry searches
          // but check industryFocus array for confirmation if available
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
  
  // Group grants by funding amount for carousel display
  const highValueGrants = useMemo(() => {
    if (!filteredGrants) return [];
    
    // Helper function to convert K/M notation to actual numbers
    const convertToNumber = (value: string): number => {
      const cleanValue = value.toLowerCase().trim();
      if (cleanValue.endsWith('m')) {
        // Convert millions (e.g., 1.5m -> 1,500,000)
        return parseFloat(cleanValue.replace('m', '')) * 1000000;
      } else if (cleanValue.endsWith('k')) {
        // Convert thousands (e.g., 500k -> 500,000)
        return parseFloat(cleanValue.replace('k', '')) * 1000;
      } else {
        // Plain number
        return parseFloat(cleanValue) || 0;
      }
    };
    
    return filteredGrants.filter(grant => {
      // Extract numeric portion and preserve K/M notation
      const amountStr = grant.fundingAmount.toLowerCase().replace(/[^0-9\.\-km]/g, '');
      let maxAmount = 0;
      
      // Handle ranges (e.g., 15k-15m)
      if (amountStr.includes('-')) {
        const parts = amountStr.split('-');
        const max = convertToNumber(parts[1]);
        maxAmount = max; // Use the maximum value for high value detection
      } else {
        maxAmount = convertToNumber(amountStr);
      }
      
      // If we couldn't parse the amount, be conservative
      if (isNaN(maxAmount)) {
        return false;
      }
      
      return maxAmount > 500000;
    });
  }, [filteredGrants]);
  
  const competitiveGrants = useMemo(() => {
    if (!filteredGrants) return [];
    return filteredGrants.filter(grant => grant.competitionLevel === "High");
  }, [filteredGrants]);
  
  const newGrants = useMemo(() => {
    if (!filteredGrants) return [];
    // Sort by date and get the 10 most recent
    return [...filteredGrants]
      .sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime())
      .slice(0, 10);
  }, [filteredGrants]);

  return (
    <div className="bg-black text-white min-h-screen pt-24 px-4 pb-16">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Federal Grants</h1>
          <p className="text-gray-400 max-w-3xl">
            Discover federal funding opportunities available across Canada. These grants are provided by the Canadian government to support various projects, businesses, and initiatives nationwide.
          </p>
          
          <div className="mt-6 mb-6">
            <FederalGrantFilters 
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
            Error loading federal grants. Please try again later.
          </div>
        ) : filteredGrants.length > 0 ? (
          <div className="space-y-12">
            {/* Removed High Value Grants Carousel as requested */}
            
            {/* All Filtered Grants with Dynamic Title */}
            <div>
              <h2 className="text-2xl font-bold mb-4">
                {/* Dynamic title based on filters */}
                {filters.department !== "all_departments" && 
                  `${filters.department.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Grants`}
                {filters.industry !== "all_industries" && filters.department === "all_departments" && 
                  `${filters.industry.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Industry Grants`}
                {filters.grantAmount !== "any_amount" && filters.department === "all_departments" && filters.industry === "all_industries" && 
                  (() => {
                    switch (filters.grantAmount) {
                      case "under_10k": return "Small Grants (Under $10,000)";
                      case "10k_50k": return "Grants $10,000 - $50,000";
                      case "50k_100k": return "Grants $50,000 - $100,000";
                      case "100k_500k": return "Grants $100,000 - $500,000";
                      case "over_500k": return "Large Grants (Over $500,000)";
                      default: return "Federal Grants";
                    }
                  })()}
                {filters.deadline !== "any_deadline" && filters.department === "all_departments" && 
                 filters.industry === "all_industries" && filters.grantAmount === "any_amount" && 
                  (() => {
                    switch (filters.deadline) {
                      case "ongoing": return "Ongoing Federal Grants";
                      case "30_days": return "Federal Grants Closing in 30 Days";
                      case "60_days": return "Federal Grants Closing in 60 Days";
                      case "90_days": return "Federal Grants Closing in 90 Days";
                      case "this_year": return "Federal Grants Closing This Year";
                      default: return "Federal Grants";
                    }
                  })()}
                {filters.department === "all_departments" && filters.industry === "all_industries" && 
                 filters.grantAmount === "any_amount" && filters.deadline === "any_deadline" && 
                  "All Federal Grants"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredGrants.map((grant) => (
                  <GrantCard key={grant.id} grant={grant} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400">
            No federal grants found with the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}

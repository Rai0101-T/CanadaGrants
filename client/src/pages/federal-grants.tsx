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
        const grantIndustryLower = grant.industry?.toLowerCase() || '';
        const categoryLower = grant.category?.toLowerCase() || '';
        const industryFocusStr = Array.isArray(grant.industryFocus) 
          ? grant.industryFocus.join(' ').toLowerCase() 
          : '';
        
        // Check multiple fields that might contain industry information
        if (!grantIndustryLower.includes(industryLower) && 
            !categoryLower.includes(industryLower) && 
            !industryFocusStr.includes(industryLower)) {
          return false;
        }
      }
      
      // Grant amount filter
      if (filters.grantAmount && filters.grantAmount !== "any_amount") {
        // Extract numeric portion of funding amount (e.g. from "$15K-$100K")
        const amountStr = grant.fundingAmount.replace(/[^0-9\-Kk]/g, '');
        let amount = 0;
        
        // Handle K notation (e.g., 15K) and ranges (e.g., 15K-100K)
        if (amountStr.includes('-')) {
          const parts = amountStr.split('-');
          // Parse each part considering K notation
          const min = parseInt(parts[0].replace(/K|k/i, '000'));
          const max = parseInt(parts[1].replace(/K|k/i, '000'));
          amount = (min + max) / 2; // Use average for ranges
        } else if (amountStr.toLowerCase().includes('k')) {
          // Handle K notation without range
          amount = parseInt(amountStr.toLowerCase().replace('k', '')) * 1000;
        } else {
          amount = parseInt(amountStr);
        }
        
        // Apply the filter based on the amount
        switch (filters.grantAmount) {
          case "under_10k":
            if (amount >= 10000) return false;
            break;
          case "10k_50k":
            if (amount < 10000 || amount >= 50000) return false;
            break;
          case "50k_100k":
            if (amount < 50000 || amount >= 100000) return false;
            break;
          case "100k_500k":
            if (amount < 100000 || amount >= 500000) return false;
            break;
          case "over_500k":
            if (amount < 500000) return false;
            break;
        }
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
    return filteredGrants.filter(grant => {
      const amountStr = grant.fundingAmount.replace(/[^0-9\-Kk]/g, '');
      let amount = 0;
      
      // Handle K notation (e.g., 15K) and ranges (e.g., 15K-100K)
      if (amountStr.includes('-')) {
        const parts = amountStr.split('-');
        const min = parseInt(parts[0].replace(/K|k/i, '000'));
        const max = parseInt(parts[1].replace(/K|k/i, '000'));
        amount = Math.max(min, max); // Use the maximum value for high value detection
      } else if (amountStr.toLowerCase().includes('k')) {
        amount = parseInt(amountStr.toLowerCase().replace('k', '')) * 1000;
      } else {
        amount = parseInt(amountStr);
      }
      
      return amount > 500000;
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
            {/* High Value Grants Carousel */}
            {highValueGrants.length > 0 && (
              <GrantCarousel
                title="High Value Grants"
                grants={highValueGrants}
              />
            )}
            
            {/* All Filtered Grants */}
            <div>
              <h2 className="text-2xl font-bold mb-4">All Federal Grants</h2>
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

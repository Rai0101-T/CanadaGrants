import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Grant } from "@shared/schema";
import GrantCard from "@/components/grant-card";
import FederalGrantFilters from "@/components/federal-grant-filters";
import GrantCarousel from "@/components/grant-carousel";

export default function PrivateGrants() {
  const [filters, setFilters] = useState({
    department: "",
    industry: "",
    grantAmount: "",
    deadline: "",
  });
  
  // Fetch all federal grants (Since we don't have private grants API yet, we'll reuse federal grants for now)
  const { data: grants, isLoading, isError } = useQuery<Grant[]>({
    queryKey: ["/api/grants/type/federal"],
  });
  
  // Apply all filters to grants
  const filteredGrants = useMemo(() => {
    if (!grants) return [];
    
    return grants.filter(grant => {
      // Department filter
      if (filters.department && filters.department !== "all_departments" && 
          grant.category.toLowerCase() !== filters.department.toLowerCase()) {
        return false;
      }
      
      // Industry filter
      if (filters.industry && filters.industry !== "all_industries" && 
          !grant.industry?.toLowerCase().includes(filters.industry.toLowerCase())) {
        return false;
      }
      
      // Grant amount filter
      if (filters.grantAmount && filters.grantAmount !== "any_amount") {
        const amount = parseInt(grant.fundingAmount.replace(/[^0-9]/g, ''));
        
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
        const deadlineDate = new Date(grant.deadline);
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);
        const sixtyDaysFromNow = new Date();
        sixtyDaysFromNow.setDate(today.getDate() + 60);
        const ninetyDaysFromNow = new Date();
        ninetyDaysFromNow.setDate(today.getDate() + 90);
        const endOfYear = new Date(today.getFullYear(), 11, 31);
        
        switch (filters.deadline) {
          case "ongoing":
            if (grant.deadline !== "Ongoing" && grant.deadline !== "No Deadline") return false;
            break;
          case "30_days":
            if (deadlineDate > thirtyDaysFromNow) return false;
            break;
          case "60_days":
            if (deadlineDate > sixtyDaysFromNow) return false;
            break;
          case "90_days":
            if (deadlineDate > ninetyDaysFromNow) return false;
            break;
          case "this_year":
            if (deadlineDate > endOfYear) return false;
            break;
        }
      }
      
      return true;
    });
  }, [grants, filters]);
  
  // Group grants by funding organization for carousel display
  const organizationGroups = useMemo(() => {
    if (!filteredGrants) return {};
    
    return filteredGrants.reduce((acc, grant) => {
      if (grant.fundingOrganization) {
        if (!acc[grant.fundingOrganization]) {
          acc[grant.fundingOrganization] = [];
        }
        acc[grant.fundingOrganization].push(grant);
      }
      return acc;
    }, {} as Record<string, Grant[]>);
  }, [filteredGrants]);
  
  // Get the top organizations with most grants
  const topOrganizations = useMemo(() => {
    return Object.entries(organizationGroups)
      .sort(([, grantsA], [, grantsB]) => grantsB.length - grantsA.length)
      .slice(0, 5)
      .map(([organization]) => organization);
  }, [organizationGroups]);
  
  // Get high value grants
  const highValueGrants = useMemo(() => {
    if (!filteredGrants) return [];
    return filteredGrants.filter(grant => parseInt(grant.fundingAmount.replace(/[^0-9]/g, '')) > 200000);
  }, [filteredGrants]);

  return (
    <div className="bg-black text-white min-h-screen pt-24 px-4 pb-16">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Private Grants</h1>
          <p className="text-gray-400 max-w-3xl">
            Discover foundation and corporate funding opportunities across Canada. These grants are provided by private organizations, foundations, and corporations to support various projects, businesses, and initiatives.
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
            Error loading private grants. Please try again later.
          </div>
        ) : filteredGrants.length > 0 ? (
          <div className="space-y-12">
            {/* Organization-specific Carousel Sections */}
            {topOrganizations.map(organization => (
              organizationGroups[organization] && organizationGroups[organization].length > 0 && (
                <GrantCarousel
                  key={organization}
                  title={`${organization} Grants`}
                  grants={organizationGroups[organization]}
                />
              )
            ))}
            
            {/* High Value Grants Carousel */}
            {highValueGrants.length > 0 && (
              <GrantCarousel
                title="High Value Private Grants"
                grants={highValueGrants}
              />
            )}
            
            {/* All Filtered Grants */}
            <div>
              <h2 className="text-2xl font-bold mb-4">All Private Grants</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredGrants.map((grant) => (
                  <GrantCard key={grant.id} grant={grant} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400">
            No private grants found matching your filter criteria. Try adjusting your filters.
          </div>
        )}
      </div>
    </div>
  );
}
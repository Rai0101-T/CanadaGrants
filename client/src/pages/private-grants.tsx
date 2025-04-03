import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Grant } from "@shared/schema";
import GrantCard from "@/components/grant-card";
import GrantCarousel from "@/components/grant-carousel";
import PrivateGrantFilters from "@/components/private-grant-filters";

export default function PrivateGrants() {
  const [filters, setFilters] = useState({
    organization: "all_organizations",
    industry: "all_industries",
    grantAmount: "any_amount",
    deadline: "any_deadline",
  });
  
  // Fetch all private grants
  const { data: grants, isLoading, isError } = useQuery<Grant[]>({
    queryKey: ["/api/grants/type/private"],
  });
  
  // Apply all filters to grants
  const filteredGrants = useMemo(() => {
    if (!grants) return [];
    
    return grants.filter(grant => {
      // Organization filter
      if (filters.organization && filters.organization !== "all_organizations") {
        // The organization is stored in the fundingOrganization field or in the category
        const orgLower = filters.organization.toLowerCase();
        const fundingOrgLower = grant.fundingOrganization?.toLowerCase() || '';
        
        if (!fundingOrgLower.includes(orgLower) && 
            !grant.category.toLowerCase().includes(orgLower)) {
          return false;
        }
      }
      
      // Industry filter
      if (filters.industry && filters.industry !== "all_industries" && 
          !(grant.industry?.toLowerCase().includes(filters.industry.toLowerCase()) ||
            grant.category.toLowerCase().includes(filters.industry.toLowerCase()))) {
        return false;
      }
      
      // Grant amount filter
      if (filters.grantAmount && filters.grantAmount !== "any_amount") {
        // Extract numeric portion of funding amount (e.g. from "$50K-250K" or "$10,000 - $50,000")
        const amountStr = grant.fundingAmount.replace(/[^0-9\-]/g, '');
        // If there's a range, take the average
        let amount = 0;
        if (amountStr.includes('-')) {
          const [min, max] = amountStr.split('-').map(n => parseInt(n));
          amount = (min + max) / 2;
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
        // Check if the deadline is "Ongoing" or an actual date
        if (grant.deadline === "Ongoing" || grant.deadline === "No Deadline") {
          if (filters.deadline !== "ongoing") return false;
        } else {
          const deadlineDate = new Date(grant.deadline);
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
              return false; // We already handled "Ongoing" deadlines
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
        }
      }
      
      return true;
    });
  }, [grants, filters]);
  
  // Group grants by funding organization for carousel display
  const organizationGroups = useMemo(() => {
    if (!filteredGrants || filteredGrants.length === 0) return {};
    
    return filteredGrants.reduce((acc, grant) => {
      const orgName = grant.fundingOrganization || grant.category;
      if (orgName) {
        if (!acc[orgName]) {
          acc[orgName] = [];
        }
        acc[orgName].push(grant);
      }
      return acc;
    }, {} as Record<string, Grant[]>);
  }, [filteredGrants]);
  
  // Get high value grants (over $100K)
  const highValueGrants = useMemo(() => {
    if (!filteredGrants) return [];
    return filteredGrants.filter(grant => {
      const amountStr = grant.fundingAmount.replace(/[^0-9\-]/g, '');
      let amount = 0;
      if (amountStr.includes('-')) {
        const [min, max] = amountStr.split('-').map(n => parseInt(n));
        amount = (min + max) / 2;
      } else {
        amount = parseInt(amountStr);
      }
      return amount > 100000;
    });
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
            <PrivateGrantFilters 
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
            {Object.entries(organizationGroups).map(([organization, grants]) => (
              <GrantCarousel
                key={organization}
                title={`${organization} Grants`}
                grants={grants}
              />
            ))}
            
            {/* High Value Grants Carousel */}
            {highValueGrants.length > 0 && (
              <GrantCarousel
                title="High Value Private Grants"
                grants={highValueGrants}
              />
            )}
            
            {/* All Private Grants */}
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
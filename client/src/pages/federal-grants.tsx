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
      
      return true;
    });
  }, [grants, filters]);
  
  // Group grants by funding amount for carousel display
  const highValueGrants = useMemo(() => {
    if (!filteredGrants) return [];
    return filteredGrants.filter(grant => parseInt(grant.fundingAmount.replace(/[^0-9]/g, '')) > 500000);
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

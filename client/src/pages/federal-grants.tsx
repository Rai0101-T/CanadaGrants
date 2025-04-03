import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Grant } from "@shared/schema";
import GrantCard from "@/components/grant-card";
import IndustryFilter from "@/components/industry-filter";
import GrantCarousel from "@/components/grant-carousel";

export default function FederalGrants() {
  const [industryFilter, setIndustryFilter] = useState("");
  
  // Fetch all federal grants
  const { data: grants, isLoading, isError } = useQuery<Grant[]>({
    queryKey: ["/api/grants/type/federal"],
  });
  
  // Filter grants by industry if a filter is selected
  const filteredGrants = useMemo(() => {
    if (!grants) return [];
    if (!industryFilter) return grants;
    
    return grants.filter(grant => 
      grant.industry && grant.industry.toLowerCase().includes(industryFilter.toLowerCase())
    );
  }, [grants, industryFilter]);
  
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
            <IndustryFilter 
              onFilterChange={setIndustryFilter} 
              type="dropdown"
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
            
            {/* Competitive Grants Carousel */}
            {competitiveGrants.length > 0 && (
              <GrantCarousel
                title="Highly Competitive Grants"
                grants={competitiveGrants}
              />
            )}
            
            {/* New Grants Carousel */}
            {newGrants.length > 0 && (
              <GrantCarousel
                title="Upcoming Deadlines"
                grants={newGrants}
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
            No federal grants found for the selected industry.
          </div>
        )}
      </div>
    </div>
  );
}

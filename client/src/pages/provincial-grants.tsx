import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Grant } from "@shared/schema";
import GrantCard from "@/components/grant-card";
import IndustryFilter from "@/components/industry-filter";
import GrantCarousel from "@/components/grant-carousel";

export default function ProvincialGrants() {
  const [industryFilter, setIndustryFilter] = useState("");
  
  // Fetch all provincial grants
  const { data: grants, isLoading, isError } = useQuery<Grant[]>({
    queryKey: ["/api/grants/type/provincial"],
  });
  
  // Filter grants by industry if a filter is selected
  const filteredGrants = useMemo(() => {
    if (!grants) return [];
    if (!industryFilter) return grants;
    
    return grants.filter(grant => 
      grant.industry && grant.industry.toLowerCase().includes(industryFilter.toLowerCase())
    );
  }, [grants, industryFilter]);
  
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
    return filteredGrants.filter(grant => parseInt(grant.fundingAmount.replace(/[^0-9]/g, '')) > 200000);
  }, [filteredGrants]);
  
  // Get grants with upcoming deadlines
  const upcomingDeadlines = useMemo(() => {
    if (!filteredGrants) return [];
    const now = new Date();
    // Sort by deadline and get upcoming ones
    return [...filteredGrants]
      .filter(grant => new Date(grant.deadline) > now)
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
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
          
          <div className="mt-6 mb-2 border-b border-gray-800 pb-2">
            <IndustryFilter onFilterChange={setIndustryFilter} />
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
            {/* Province-specific Carousel Sections */}
            {topProvinces.map(province => (
              provinceGroups[province] && provinceGroups[province].length > 0 && (
                <GrantCarousel
                  key={province}
                  title={`${province} Grants`}
                  grants={provinceGroups[province]}
                />
              )
            ))}
            
            {/* High Value Grants Carousel */}
            {highValueGrants.length > 0 && (
              <GrantCarousel
                title="High Value Provincial Grants"
                grants={highValueGrants}
              />
            )}
            
            {/* Upcoming Deadlines Carousel */}
            {upcomingDeadlines.length > 0 && (
              <GrantCarousel
                title="Approaching Deadlines"
                grants={upcomingDeadlines}
              />
            )}
            
            {/* All Filtered Grants */}
            <div>
              <h2 className="text-2xl font-bold mb-4">All Provincial Grants</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredGrants.map((grant) => (
                  <GrantCard key={grant.id} grant={grant} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400">
            No provincial grants found for the selected industry.
          </div>
        )}
      </div>
    </div>
  );
}

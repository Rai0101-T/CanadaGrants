import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import HeroSection from "@/components/hero-section";
import GrantRow from "@/components/grant-row";
import { Grant } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const { user } = useAuth();
  
  // Fetch featured grants
  const featuredQuery = useQuery<Grant[]>({
    queryKey: ["/api/grants/featured"],
  });

  // Fetch federal grants
  const federalQuery = useQuery<Grant[]>({
    queryKey: ["/api/grants/type/federal"],
  });

  // Fetch provincial grants
  const provincialQuery = useQuery<Grant[]>({
    queryKey: ["/api/grants/type/provincial"],
  });
  
  // Fetch personalized grant recommendations for authenticated users
  const recommendationsQuery = useQuery<Grant[]>({
    queryKey: ["/api/grants/recommendations"],
    enabled: !!user, // Only run this query if user is authenticated
  });

  return (
    <div className="bg-black text-white min-h-screen">
      <HeroSection />

      <div className="container mx-auto px-4 py-8 -mt-24 relative z-30">
        {/* Personalized Recommendations Section (Only for authenticated users) */}
        {user && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Recommended For You</h2>
              <div className="bg-primary/20 px-3 py-1 rounded-md">
                <span className="text-xs text-primary font-semibold">PERSONALIZED</span>
              </div>
            </div>

            {recommendationsQuery.isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : recommendationsQuery.isError ? (
              <div className="text-center py-10 text-red-500">
                Error loading recommendations
              </div>
            ) : recommendationsQuery.data?.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <p>Complete your business profile to get personalized recommendations</p>
              </div>
            ) : (
              <GrantRow grants={recommendationsQuery.data || []} />
            )}
          </section>
        )}
      
        {/* Featured Grants Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Featured Grants</h2>
            <div className="flex">
              <button className="text-xs uppercase font-medium text-gray-200 bg-gray-700 rounded-sm px-3 py-1 mr-2 hover:bg-gray-600">
                Federal
              </button>
              <button className="text-xs uppercase font-medium text-gray-200 bg-gray-700 rounded-sm px-3 py-1 hover:bg-gray-600">
                Provincial
              </button>
            </div>
          </div>

          {featuredQuery.isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : featuredQuery.isError ? (
            <div className="text-center py-10 text-red-500">
              Error loading featured grants
            </div>
          ) : (
            <GrantRow grants={featuredQuery.data || []} />
          )}
        </section>

        {/* Federal Grants Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Federal Grants</h2>
            <a href="/federal-grants" className="text-sm text-gray-300 hover:text-white flex items-center">
              View All <span className="ml-1">→</span>
            </a>
          </div>

          {federalQuery.isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : federalQuery.isError ? (
            <div className="text-center py-10 text-red-500">
              Error loading federal grants
            </div>
          ) : (
            <GrantRow grants={(federalQuery.data || []).slice(0, 6)} />
          )}
        </section>

        {/* Provincial Grants Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Provincial Grants</h2>
            <a href="/provincial-grants" className="text-sm text-gray-300 hover:text-white flex items-center">
              View All <span className="ml-1">→</span>
            </a>
          </div>

          {provincialQuery.isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : provincialQuery.isError ? (
            <div className="text-center py-10 text-red-500">
              Error loading provincial grants
            </div>
          ) : (
            <GrantRow grants={(provincialQuery.data || []).slice(0, 6)} />
          )}
        </section>
      </div>
    </div>
  );
}

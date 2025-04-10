import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import HeroSection from "@/components/hero-section";
import GrantRow from "@/components/grant-row";
import { Grant } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const { user } = useAuth();
  
  // State for toggling grant filters
  const [activeFeaturedFilter, setActiveFeaturedFilter] = useState<'all' | 'federal' | 'provincial'>('all');
  const [activeFederalFilter, setActiveFederalFilter] = useState<'all' | 'industry' | 'region'>('all');
  const [activeProvincialFilter, setActiveProvincialFilter] = useState<'all' | 'industry' | 'region'>('all');
  
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
  
  // Filter grants based on active filters
  const filteredFeaturedGrants = () => {
    if (!featuredQuery.data) return [];
    if (activeFeaturedFilter === 'all') return featuredQuery.data;
    return featuredQuery.data.filter(grant => grant.type === activeFeaturedFilter);
  };

  const filteredFederalGrants = () => {
    if (!federalQuery.data) return [];
    
    const federalGrants = federalQuery.data.slice(0, 6);
    
    if (activeFederalFilter === 'all') return federalGrants;
    
    if (activeFederalFilter === 'industry') {
      // Sort by industry (alphabetical)
      return [...federalGrants].sort((a, b) => {
        return (a.industry || '').localeCompare(b.industry || '');
      });
    }
    
    if (activeFederalFilter === 'region') {
      // Sort by province/region
      return [...federalGrants].sort((a, b) => {
        return (a.province || 'All').localeCompare(b.province || 'All');
      });
    }
    
    return federalGrants;
  };

  const filteredProvincialGrants = () => {
    if (!provincialQuery.data) return [];
    
    const provincialGrants = provincialQuery.data.slice(0, 6);
    
    if (activeProvincialFilter === 'all') return provincialGrants;
    
    if (activeProvincialFilter === 'industry') {
      // Sort by industry (alphabetical)
      return [...provincialGrants].sort((a, b) => {
        return (a.industry || '').localeCompare(b.industry || '');
      });
    }
    
    if (activeProvincialFilter === 'region') {
      // Sort by province
      return [...provincialGrants].sort((a, b) => {
        return (a.province || 'All').localeCompare(b.province || 'All');
      });
    }
    
    return provincialGrants;
  };
  
  // Get personalized recommendations based on business description
  const recommendationsMutation = useMutation({
    mutationFn: async (businessDescription: string) => {
      const res = await apiRequest("POST", "/api/grants/recommend", { businessDescription });
      return await res.json();
    }
  });
  
  // Load recommendations when the user is loaded and has a business description
  useEffect(() => {
    if (user?.isBusiness && user?.businessDescription) {
      recommendationsMutation.mutate(user.businessDescription);
    }
  }, [user]);

  return (
    <div className="bg-black text-white min-h-screen">
      <HeroSection />

      <div className="container mx-auto px-4 py-8 -mt-24 relative z-30">
        {/* Personalized Recommendations Section (visible only to business users) */}
        {user?.isBusiness && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <h2 className="text-2xl font-bold text-white mr-3">Recommendations For You</h2>
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  AI-Matched
                </Badge>
              </div>
            </div>
            
            {!user.businessDescription ? (
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-white font-medium mb-2">Complete your business profile</h3>
                <p className="text-gray-400 mb-4">
                  Add a business description to your profile to get personalized grant recommendations 
                  that match your business needs and goals.
                </p>
                <Button 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => {
                    // First set the session storage
                    sessionStorage.setItem("profileActiveTab", "business");
                    // Then navigate using a more direct approach
                    document.location.href = '/profile';
                  }}
                >
                  Update Profile
                </Button>
              </div>
            ) : recommendationsMutation.isPending ? (
              <div className="flex justify-center items-center h-40">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-10 w-10 text-primary animate-spin mb-2" />
                  <p className="text-gray-400">Finding grants that match your business...</p>
                </div>
              </div>
            ) : recommendationsMutation.isError ? (
              <div className="text-center py-10 text-red-500">
                Error loading grant recommendations
              </div>
            ) : recommendationsMutation.data?.recommendations ? (
              <div>
                <GrantRow grants={recommendationsMutation.data.recommendations} />
                <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-800">
                  <h3 className="text-white font-medium mb-2">How these recommendations work</h3>
                  <p className="text-gray-400 text-sm">
                    These grants were selected based on your business description using AI matching technology. 
                    The relevance score indicates how well each grant matches your business needs.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                No recommendations available yet
              </div>
            )}
          </section>
        )}
        
        {/* Featured Grants Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Featured Grants</h2>
            <div className="flex">
              <button 
                className={cn(
                  "text-xs uppercase font-medium text-gray-200 rounded-sm px-3 py-1 mr-2 transition-colors",
                  activeFeaturedFilter === 'all' 
                    ? "bg-primary hover:bg-primary/90" 
                    : "bg-gray-700 hover:bg-gray-600"
                )}
                onClick={() => setActiveFeaturedFilter('all')}
              >
                All
              </button>
              <button 
                className={cn(
                  "text-xs uppercase font-medium text-gray-200 rounded-sm px-3 py-1 mr-2 transition-colors",
                  activeFeaturedFilter === 'federal' 
                    ? "bg-primary hover:bg-primary/90" 
                    : "bg-gray-700 hover:bg-gray-600"
                )}
                onClick={() => setActiveFeaturedFilter('federal')}
              >
                Federal
              </button>
              <button 
                className={cn(
                  "text-xs uppercase font-medium text-gray-200 rounded-sm px-3 py-1 transition-colors",
                  activeFeaturedFilter === 'provincial' 
                    ? "bg-primary hover:bg-primary/90" 
                    : "bg-gray-700 hover:bg-gray-600"
                )}
                onClick={() => setActiveFeaturedFilter('provincial')}
              >
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
            <GrantRow grants={filteredFeaturedGrants()} />
          )}
        </section>

        {/* Federal Grants Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Federal Grants</h2>
            <div className="flex items-center">
              <div className="mr-3 hidden md:flex">
                <button 
                  className={cn(
                    "text-xs uppercase font-medium text-gray-200 rounded-sm px-3 py-1 mr-2 transition-colors",
                    activeFederalFilter === 'all' 
                      ? "bg-primary hover:bg-primary/90" 
                      : "bg-gray-700 hover:bg-gray-600"
                  )}
                  onClick={() => setActiveFederalFilter('all')}
                >
                  All
                </button>
                <button 
                  className={cn(
                    "text-xs uppercase font-medium text-gray-200 rounded-sm px-3 py-1 mr-2 transition-colors",
                    activeFederalFilter === 'industry' 
                      ? "bg-primary hover:bg-primary/90" 
                      : "bg-gray-700 hover:bg-gray-600"
                  )}
                  onClick={() => setActiveFederalFilter('industry')}
                >
                  By Industry
                </button>
                <button 
                  className={cn(
                    "text-xs uppercase font-medium text-gray-200 rounded-sm px-3 py-1 transition-colors",
                    activeFederalFilter === 'region' 
                      ? "bg-primary hover:bg-primary/90" 
                      : "bg-gray-700 hover:bg-gray-600"
                  )}
                  onClick={() => setActiveFederalFilter('region')}
                >
                  By Region
                </button>
              </div>
              <a href="/federal-grants" className="text-sm text-gray-300 hover:text-white flex items-center">
                View All <span className="ml-1">→</span>
              </a>
            </div>
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
            <GrantRow grants={filteredFederalGrants()} />
          )}
        </section>

        {/* Provincial Grants Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Provincial Grants</h2>
            <div className="flex items-center">
              <div className="mr-3 hidden md:flex">
                <button 
                  className={cn(
                    "text-xs uppercase font-medium text-gray-200 rounded-sm px-3 py-1 mr-2 transition-colors",
                    activeProvincialFilter === 'all' 
                      ? "bg-primary hover:bg-primary/90" 
                      : "bg-gray-700 hover:bg-gray-600"
                  )}
                  onClick={() => setActiveProvincialFilter('all')}
                >
                  All
                </button>
                <button 
                  className={cn(
                    "text-xs uppercase font-medium text-gray-200 rounded-sm px-3 py-1 mr-2 transition-colors",
                    activeProvincialFilter === 'industry' 
                      ? "bg-primary hover:bg-primary/90" 
                      : "bg-gray-700 hover:bg-gray-600"
                  )}
                  onClick={() => setActiveProvincialFilter('industry')}
                >
                  By Industry
                </button>
                <button 
                  className={cn(
                    "text-xs uppercase font-medium text-gray-200 rounded-sm px-3 py-1 transition-colors",
                    activeProvincialFilter === 'region' 
                      ? "bg-primary hover:bg-primary/90" 
                      : "bg-gray-700 hover:bg-gray-600"
                  )}
                  onClick={() => setActiveProvincialFilter('region')}
                >
                  By Province
                </button>
              </div>
              <a href="/provincial-grants" className="text-sm text-gray-300 hover:text-white flex items-center">
                View All <span className="ml-1">→</span>
              </a>
            </div>
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
            <GrantRow grants={filteredProvincialGrants()} />
          )}
        </section>
        
        {/* GrantScribe Feature Section */}
        <section className="mb-12 bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8">
              <div className="inline-block bg-primary/10 px-4 py-2 rounded-full text-primary font-medium mb-4">
                NEW FEATURE
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Introducing GrantScribe</h2>
              <p className="text-gray-300 mb-6">
                Our AI-powered grant writing assistant helps craft compelling grant applications, 
                check for plagiarism, and generate innovative ideas tailored to your business needs 
                and the specific requirements of each grant.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-gray-300">AI-powered application assistance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-gray-300">Plagiarism detection</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-gray-300">Custom idea generation for your business</span>
                </li>
              </ul>
              {user ? (
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-2" 
                  onClick={() => window.location.href = '/grant-scribe'}
                >
                  Start Using GrantScribe
                </Button>
              ) : (
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-2" 
                  onClick={() => window.location.href = '/auth'}
                >
                  Sign Up to Use GrantScribe
                </Button>
              )}
            </div>
            <div className="bg-[url('https://images.unsplash.com/photo-1598018553943-93e826806d68?auto=format&fit=crop&w=600&h=500&q=80')] bg-cover bg-center relative">
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="bg-black/80 p-6 rounded-lg max-w-xs">
                  <h3 className="text-xl font-bold text-white mb-2">Boost Your Success Rate</h3>
                  <p className="text-gray-300 text-sm">
                    Businesses using GrantScribe have reported a 40% higher success rate on their grant applications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

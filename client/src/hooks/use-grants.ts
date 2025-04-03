import { useQuery } from "@tanstack/react-query";
import { Grant } from "@shared/schema";

export function useGrants() {
  // Get all grants
  const allGrantsQuery = useQuery<Grant[]>({
    queryKey: ["/api/grants"],
  });

  // Get featured grants
  const featuredGrantsQuery = useQuery<Grant[]>({
    queryKey: ["/api/grants/featured"],
  });

  // Get federal grants
  const federalGrantsQuery = useQuery<Grant[]>({
    queryKey: ["/api/grants/type/federal"],
  });

  // Get provincial grants
  const provincialGrantsQuery = useQuery<Grant[]>({
    queryKey: ["/api/grants/type/provincial"],
  });

  // Function to search grants
  const searchGrants = (query: string) => {
    return useQuery<Grant[]>({
      queryKey: [`/api/grants/search/${query}`],
      enabled: query.length >= 2,
    });
  };

  // Function to get a grant by ID
  const getGrantById = (id: number) => {
    return useQuery<Grant>({
      queryKey: [`/api/grants/${id}`],
      enabled: !!id,
    });
  };

  return {
    allGrants: allGrantsQuery.data || [],
    featuredGrants: featuredGrantsQuery.data || [],
    federalGrants: federalGrantsQuery.data || [],
    provincialGrants: provincialGrantsQuery.data || [],
    isLoading: 
      allGrantsQuery.isLoading || 
      featuredGrantsQuery.isLoading || 
      federalGrantsQuery.isLoading || 
      provincialGrantsQuery.isLoading,
    isError: 
      allGrantsQuery.isError || 
      featuredGrantsQuery.isError || 
      federalGrantsQuery.isError || 
      provincialGrantsQuery.isError,
    searchGrants,
    getGrantById,
  };
}

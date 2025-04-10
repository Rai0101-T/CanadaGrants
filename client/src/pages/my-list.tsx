import { useQuery } from "@tanstack/react-query";
import { Grant, UserGrant } from "@shared/schema";
import GrantCard from "@/components/grant-card";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";
import { getQueryFn } from "@/lib/queryClient";

export default function MyList() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!isAuthLoading) {
      setAuthChecked(true);
    }
  }, [isAuthLoading]);

  // Only fetch the grants if we have a logged-in user
  const { data: userGrants, isLoading, isError } = useQuery<(UserGrant & { grant: Grant })[]>({
    queryKey: [`/api/mylist/${user?.id}`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user,
  });

  // Wait for auth to complete before rendering
  if (!authChecked) {
    return (
      <div className="bg-black text-white min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to auth page if not authenticated
  if (authChecked && !user) {
    return <Redirect to="/auth" />;
  }

  // Extract just the grant data from the user grants
  const grants = userGrants?.map(userGrant => userGrant.grant) || [];
  
  return (
    <div className="bg-black text-white min-h-screen pt-24 px-4 pb-16">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">My List</h1>
          <p className="text-gray-400 max-w-3xl">
            Your saved grants for future reference. Add grants to this list to keep track of funding opportunities you're interested in.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : isError ? (
          <div className="text-center py-10 text-red-500">
            Error loading your saved grants. Please try again later.
          </div>
        ) : grants && grants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {grants.map((grant) => (
              <GrantCard key={grant.id} grant={grant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium mb-4">Your list is empty</h3>
            <p className="text-gray-400 mb-6">
              Browse grants and click "Add to My List" to save grants for later.
            </p>
            <a 
              href="/" 
              className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-md inline-block"
            >
              Browse Grants
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { Grant } from "@shared/schema";
import GrantCard from "@/components/grant-card";

export default function FederalGrants() {
  const { data: grants, isLoading, isError } = useQuery<Grant[]>({
    queryKey: ["/api/grants/type/federal"],
  });

  return (
    <div className="bg-black text-white min-h-screen pt-24 px-4 pb-16">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Federal Grants</h1>
          <p className="text-gray-400 max-w-3xl">
            Discover federal funding opportunities available across Canada. These grants are provided by the Canadian government to support various projects, businesses, and initiatives nationwide.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : isError ? (
          <div className="text-center py-10 text-red-500">
            Error loading federal grants. Please try again later.
          </div>
        ) : grants && grants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {grants.map((grant) => (
              <GrantCard key={grant.id} grant={grant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400">
            No federal grants found.
          </div>
        )}
      </div>
    </div>
  );
}

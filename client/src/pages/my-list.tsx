import { useQuery } from "@tanstack/react-query";
import { Grant } from "@shared/schema";
import GrantCard from "@/components/grant-card";

export default function MyList() {
  // Dummy user ID (in a real app, this would come from auth)
  const userId = 1;

  const { data: grants, isLoading, isError } = useQuery<Grant[]>({
    queryKey: [`/api/mylist/${userId}`],
  });

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

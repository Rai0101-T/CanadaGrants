import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Grant } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export function useMyList() {
  const queryClient = useQueryClient();
  
  // Dummy user ID (in a real app, this would come from auth)
  const userId = 1;

  // Get user's saved grants (My List)
  const { data: myListGrants, isLoading, isError } = useQuery<Grant[]>({
    queryKey: [`/api/mylist/${userId}`],
  });

  // Add grant to My List
  const addToListMutation = useMutation({
    mutationFn: async (grantId: number) => {
      await apiRequest("POST", "/api/mylist", { userId, grantId });
    },
    onSuccess: () => {
      // Invalidate the My List query to refetch
      queryClient.invalidateQueries({ queryKey: [`/api/mylist/${userId}`] });
    },
  });

  // Remove grant from My List
  const removeFromListMutation = useMutation({
    mutationFn: async (grantId: number) => {
      await apiRequest("DELETE", `/api/mylist/${userId}/${grantId}`);
    },
    onSuccess: () => {
      // Invalidate the My List query to refetch
      queryClient.invalidateQueries({ queryKey: [`/api/mylist/${userId}`] });
    },
  });

  // Check if a grant is in the user's list
  const checkIfInListQuery = (grantId: number) => {
    return useQuery<{isInList: boolean}>({
      queryKey: [`/api/mylist/${userId}/${grantId}`],
      enabled: !!grantId,
    });
  };

  // Helper function to check if a grant is in the user's list
  const isInMyList = (grantId: number): boolean => {
    return !!myListGrants?.some(grant => grant.id === grantId);
  };

  // Add to My List
  const addToMyList = async (userId: number, grantId: number) => {
    await addToListMutation.mutateAsync(grantId);
  };

  // Remove from My List
  const removeFromMyList = async (userId: number, grantId: number) => {
    await removeFromListMutation.mutateAsync(grantId);
  };

  return {
    myListGrants: myListGrants || [],
    isLoading,
    isError,
    isInMyList,
    addToMyList,
    removeFromMyList,
    checkIfInList: checkIfInListQuery,
    isPending: addToListMutation.isPending || removeFromListMutation.isPending,
  };
}

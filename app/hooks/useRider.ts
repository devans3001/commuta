import type { Rider } from "@/lib/type";
import {
  fetchRiderById,
  fetchRiders,
  suspend,
  unSuspend,
} from "@/services/apiRiders";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useRiders() {
  const { data, isLoading, error } = useQuery<Rider[], Error>({
    queryKey: ["riders"],
    queryFn: fetchRiders,
  });

  return { data, isLoading, error };
}

export function useRider(id: string) {
  const { data, isLoading, error } = useQuery<Rider[], Error>({
    queryKey: ["rider", id],
    queryFn: () => fetchRiderById(id),
  });

  return { data, isLoading, error };
}
export function useSuspend(module: string) {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: (id: string|number) => suspend(id, module),
    onSuccess: (data, id) => {
      // Invalidate the specific rider query
      queryClient.invalidateQueries({ queryKey: module === "riders" ? ["rider", id] : ["forum-user"], });
      // Also invalidate the riders list if needed
      // queryClient.invalidateQueries({ queryKey: ["riders"] });
    },
  });

  return { mutate, isPending, error };
}

export function useUnsuspend(module: string) {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: (id: string|number) => unSuspend(id, module),
    onSuccess: (data, id) => {
      // Invalidate the specific rider query
      queryClient.invalidateQueries({
        queryKey: module === "riders" ? ["rider", id] : ["forum-user"],
      });
      // Also invalidate the riders list if needed
      // queryClient.invalidateQueries({ queryKey: ["riders"] });
    },
  });

  return { mutate, isPending, error };
}

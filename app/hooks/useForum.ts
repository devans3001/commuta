import type { ForumActivity, ForumUser } from "@/lib/type";
import { getForumActivity, getForumUser, pause } from "@/services/apiForum";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export function useForumUser() {
  const {data,isLoading,error}= useQuery<ForumUser[], Error>({
    queryKey: ["forum-user"],
    queryFn: getForumUser,
  });

  return { data, isLoading, error };
}
export function useForumActivity() {
  const {data,isLoading,error}= useQuery<ForumActivity[], Error>({
    queryKey: ["forum-activity"],
    queryFn: getForumActivity,
  });

  return { data, isLoading, error };
}


export function useSuspend(module: string) {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: (id: string|number) => pause(id, module),
    onSuccess: (data, id) => {
      // Invalidate the specific rider query
      queryClient.invalidateQueries({ queryKey: module === "forum-communities" ? ["forum-communities"] : ["forum-user"], });
      // Also invalidate the riders list if needed
      // queryClient.invalidateQueries({ queryKey: ["riders"] });
    },
  });

  return { mutate, isPending, error };
}
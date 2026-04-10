import type { ForumActivity, ForumCommunity, ForumUser } from "@/lib/type";
import {
  deleteCommunity,
  getForumActivity,
  getForumUserCommunity,
  pause,
  resume,
} from "@/services/apiForum";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useForumUser(value: string) {
  const { data, isLoading, error } = useQuery<ForumUser[], Error>({
    queryKey: ["forum-user", value],
    queryFn: () => getForumUserCommunity(value) as Promise<ForumUser[]>,
  });

  return { data, isLoading, error };
}
export function useForumActivity() {
  const { data, isLoading, error } = useQuery<ForumActivity[], Error>({
    queryKey: ["forum-activity"],
    queryFn: getForumActivity,
  });

  return { data, isLoading, error };
}
export function useForumCommunity(value: string) {
  const { data, isLoading, error } = useQuery<ForumCommunity[], Error>({
    queryKey: ["forum-community", value],
    queryFn: () => getForumUserCommunity(value) as Promise<ForumCommunity[]>,
  });

  return { data, isLoading, error };
}

export function usePause(module: string) {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: (id: string | undefined) => pause(id, module),
    onSuccess: (data, id) => {
      // Invalidate the specific rider query
      let queryKey;
      if (module === "posts") queryKey = ["forum-activity"];
      else queryKey = ["forum-community",module];
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return { mutate, isPending, error };
}
export function useResume(module: string) {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: (id: string | undefined) => resume(id, module),
    onSuccess: (data, id) => {
      // Invalidate the specific rider query
      let queryKey;
      if (module === "posts") queryKey = ["forum-activity"];
      else queryKey = ["forum-community",module];
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return { mutate, isPending, error };
}

export function useDeleteCommunity() {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: (id: string) => deleteCommunity(id),
    onSuccess: (data, id) => {
      // Invalidate the specific rider query
      
      queryClient.invalidateQueries({ queryKey: ["forum-community","communities"] });
    }
  })
  return { mutate, isPending, error };
}

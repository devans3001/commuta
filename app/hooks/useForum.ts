import type { ForumActivity, ForumUser } from "@/lib/type";
import { getForumActivity, getForumUser } from "@/services/apiForum";
import { useQuery } from "@tanstack/react-query";


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

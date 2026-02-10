import type { Contact } from "@/lib/type";
import { getContacts } from "@/services/apiContacts";
import { useQuery } from "@tanstack/react-query";


export function useContacts() {
  const {data,isLoading,error}= useQuery<Contact[], Error>({
    queryKey: ["contacts"],
    queryFn: getContacts,
  });

  return { data, isLoading, error };
}



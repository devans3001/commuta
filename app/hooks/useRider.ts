import type { Rider } from "@/lib/type";
import { fetchRiderById, fetchRiders } from "@/services/apiRiders";
import { useQuery } from "@tanstack/react-query";

export function useRiders() {
  const {data,isLoading,error}= useQuery<Rider[], Error>({
    queryKey: ["riders"],
    queryFn: fetchRiders,
  });

  return { data, isLoading, error };
}

export function useRider(id:string) {
  const {data,isLoading,error}= useQuery<Rider[], Error>({
    queryKey: ["rider",id],
    queryFn: ()=>fetchRiderById(id),
  });

  return { data, isLoading, error };
}

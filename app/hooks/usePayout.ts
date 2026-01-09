import type { DashboardData } from "@/lib/mockData";
import { getDriverPayout, getPayoutHistory, getSummary } from "@/services/apiPayout";
import { useQuery } from "@tanstack/react-query";




export function usePayout() {
  const {data,isLoading,error}= useQuery<any[], Error>({
    queryKey: ["payouts"],
    queryFn: getDriverPayout,
  });

  return { data, isLoading, error };
}
export function usePayoutHistory() {
  const {data,isLoading,error}= useQuery<any[], Error>({
    queryKey: ["payouts"],
    queryFn: getPayoutHistory,
  });

  return { data, isLoading, error };
}


export function useSummary(period:string) {
  const {data,isLoading,error}= useQuery<DashboardData, Error>({
    queryKey: ["summary"],
    queryFn: ()=>getSummary(period),
  });

  return { data, isLoading, error };
}
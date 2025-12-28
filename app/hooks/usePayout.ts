import type { DashboardData, PayoutDriver } from "@/lib/mockData";
import { getDriverPayout, getSummary } from "@/services/apiPayout";
import { useQuery } from "@tanstack/react-query";




export function useDrivers() {
  const {data,isLoading,error}= useQuery<PayoutDriver[], Error>({
    queryKey: ["drivers"],
    queryFn: getDriverPayout,
  });

  return { data, isLoading, error };
}


export function useSummary() {
  const {data,isLoading,error}= useQuery<DashboardData, Error>({
    queryKey: ["summary"],
    queryFn: getSummary,
  });

  return { data, isLoading, error };
}
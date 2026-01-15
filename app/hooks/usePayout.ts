import type { DashboardData, PayoutDriver } from "@/lib/type";
import { getDriverPayout, getPayoutHistory, getSummary, markDriverPayout } from "@/services/apiPayout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";




export function usePayout() {
  const {data,isLoading,error}= useQuery<any[], Error>({
    queryKey: ["payouts"],
    queryFn: getDriverPayout,
  });

  return { data, isLoading, error };
}

export function useMarkPayment() {

   const queryClient = useQueryClient();
  const { mutate,  isPending, error } = useMutation<
    PayoutDriver[],            // mutation result type
    Error,                     // error type
    { driverId: string; rideIds: number[] } // variables type
  >({
    mutationFn: (params) => markDriverPayout(params),
    onSuccess: () => {
      // Optionally invalidate or refetch queries here
       // ✅ Invalidate and refetch user list or cache updates

      queryClient.invalidateQueries({ queryKey: ["payouts"] });
    },
  });


  return { mutate, isPending, error };
}
export function usePayoutHistory() {
  const {data,isLoading,error}= useQuery<any[], Error>({
    queryKey: ["history"],
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
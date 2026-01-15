import type { Driver, Trip as Trips } from "@/lib/type";
import { fetchDriverById, fetchDrivers, fetchTripById, fetchTrips } from "@/services/apiDrivers";
import { fetchRiderById, fetchRiders } from "@/services/apiRiders";
import { useQuery } from "@tanstack/react-query";

export function useDrivers() {
  const {data,isLoading,error}= useQuery<Driver[], Error>({
    queryKey: ["drivers"],
    queryFn: fetchDrivers,
  });

  return { data, isLoading, error };
}
export function useTrips() {
  const {data,isLoading,error}= useQuery<Trips[], Error>({
    queryKey: ["trips"],
    queryFn: fetchTrips,
  });

  return { data, isLoading, error };
}

export function useDriver(id:string) {
  const {data,isLoading,error}= useQuery<Driver[], Error>({
    queryKey: ["driver",id],
    queryFn: ()=>fetchDriverById(id),
  });

  return { data, isLoading, error };
}


export function useTrip(id:string) {
  const {data,isLoading,error}= useQuery<Trips, Error>({
    queryKey: ["trip",id],
    queryFn: ()=>fetchTripById(id),
  });

  return { data, isLoading, error };
}

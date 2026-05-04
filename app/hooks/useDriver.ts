import type { Driver, Trip as Trips } from "@/lib/type";
import { API_BASE_URL } from "@/services/apiAuth";
import { fetchDriverById, fetchDrivers, fetchTripById, fetchTrips, suspend_unsuspend } from "@/services/apiDrivers";
import { fetchRiderById, fetchRiders } from "@/services/apiRiders";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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


export interface DriverVerification {
  id: string;
  driverId: string;
  idType: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason: string | null;
  rejectedAt: string | null;
  createdAt: string;
  updatedAt: string;
  driverName: string;
  driverEmail: string;
  selfieUrl: string;
  idCardFrontUrl: string;
  idCardBackUrl: string;
}

export interface DriverVerificationDetails extends DriverVerification {
  // any additional fields for details can be added here
  selfie: string;
  idCardFront: string;
  idCardBack: string;
}

export interface DriverVerificationsDetailsResponse {
  status: number;
  error: boolean;
  message: string;
  data: DriverVerificationDetails;
}

interface VerificationsResponse {
  status: number;
  error: boolean;
  message: string;
  data: DriverVerification[];
}

interface UpdateStatusPayload {
  verificationId: number;
  status: "APPROVED" | "REJECTED";
  reason?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("commuta_token"); 
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  let body: T | undefined;

  try {
    body = await res.json();
  } catch {
    throw new Error(`Server returned ${res.status} with no JSON body.`);
  }

  if (!res.ok) {
    const message =
      (body as { message?: string })?.message ??
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return body as T;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

/** Fetch all driver verifications */
export function useDriverVerifications() {
  return useQuery<VerificationsResponse>({
    queryKey: ["driver-verifications"],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/drivers/verification`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          }
        );
        return await handleResponse<VerificationsResponse>(res);
      } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error("An unexpected error occurred while fetching verifications.");
      }
    },
  });
}

/** Fetch a single verification by its id */
export function useDriverVerificationById(id: string) {
  return useQuery<DriverVerificationsDetailsResponse>({
    queryKey: ["driver-verifications", id],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/drivers/verification/details/${id}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          }
        );
        return await handleResponse<DriverVerificationsDetailsResponse>(res);
      } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error("An unexpected error occurred while fetching the verification.");
      }
    },
    enabled: !!id,
  });
}

/** Update verification status (approve / reject ) */
export function useUpdateVerificationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ verificationId, status, reason }: UpdateStatusPayload) => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/drivers/verification/update-status`,
          {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              verificationId,
              status,
              ...(reason ? { reason } : {}),
            }),
          }
        );
        return await handleResponse(res);
      } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error("An unexpected error occurred while updating the status.");
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["driver-verifications"] });
      queryClient.invalidateQueries({
        queryKey: ["driver-verifications", variables.verificationId],
      });
    },
  });
}
export function useSuspendUnsuspendDriver(id:string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ driverId, status,reason }:{ driverId: number; status: "suspend" | "unsuspend"; reason?: string }) => suspend_unsuspend({ driverId, status, reason  }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver-verifications"] });
      queryClient.invalidateQueries({
        queryKey: ["driver", id],
      });
    },
  });
}
import type { Rider } from "@/lib/type";
import { API_BASE_URL } from "./apiAuth";

export async function fetchRiders(): Promise<Rider[]> {
  const token = localStorage.getItem("commuta_token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_BASE_URL}/riders`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  });
  const data = await response.json();

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || "Failed to fetch riders");
  }

  return data.data;
}

export async function fetchRiderById(id: string): Promise<Rider> {
  const token = localStorage.getItem("commuta_token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_BASE_URL}/riders/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || "Failed to fetch rider");
  }

  const data = await response.json();
  return data.data;
}

export async function suspend(id: string | number, module: string): Promise<any> {
  const token = localStorage.getItem("commuta_token");
  if (!token) throw new Error("Not authenticated");
   const payload =
    module === "riders"
      ? {
          "riderId": id,
        }
      : {
          "userId": id,
        };


  const response = await fetch(`${API_BASE_URL}/${module}/suspend`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || `Failed to suspend ${module}`);
  }

  return data.data;
}

export async function unSuspend(id: string | number, module: string): Promise<any> {
  const token = localStorage.getItem("commuta_token");
  if (!token) throw new Error("Not authenticated");

  const payload =
    module === "riders"
      ? {
          "riderId": id,
        }
      : {
          "userId": id,
        };

  const response = await fetch(`${API_BASE_URL}/${module}/unsuspend`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || `Failed to unsuspend ${module}`);
  }

  return data.data;
}

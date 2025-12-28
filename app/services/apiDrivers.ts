import type { Driver, Rider, Trip } from "@/lib/mockData";
import { API_BASE_URL } from "./apiAuth";



export async function fetchDrivers(): Promise<Driver[]> {
  const token = localStorage.getItem("commuta_token");
  if (!token) throw new Error("Not authenticated");

   const response = await fetch(`${API_BASE_URL}/drivers`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
      "Content-Type": "application/json", 
      "Cache-Control": "no-cache",
    
    },
  });
const data = await response.json();

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || "Failed to fetch drivers");
  }

  return data.data;
}


export async function fetchDriverById(id: string): Promise<Driver> {
  const token = localStorage.getItem("commuta_token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_BASE_URL}/drivers/${id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || "Failed to fetch drivers");
  }

  const data = await response.json();
  return data.data;
}

export async function fetchTripById(id: string): Promise<Trip> {
  const token = localStorage.getItem("commuta_token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_BASE_URL}/trips/${id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || "Failed to fetch trip");
  }

  const data = await response.json();
  return data.data;
}


export async function fetchTrips(): Promise<Trip[]> {
  const token = localStorage.getItem("commuta_token");
  if (!token) throw new Error("Not authenticated");

   const response = await fetch(`${API_BASE_URL}/trips`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
      "Content-Type": "application/json", 
      "Cache-Control": "no-cache",
    
    },
  });
const data = await response.json();

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || "Failed to fetch trips");
  }

  return data.data;
}
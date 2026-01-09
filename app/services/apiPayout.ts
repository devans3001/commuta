import type { DashboardData, PayoutDriver } from "@/lib/mockData";
import { API_BASE_URL } from "./apiAuth";

export async function getDriverPayout(): Promise<PayoutDriver[]> {
  const token = localStorage.getItem("commuta_token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_BASE_URL}/payout/drivers-owed`, {
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
    throw new Error(err?.message || "Failed to fetch drivers payout");
  }

  return data.data;
}

export async function getPayoutHistory(): Promise<PayoutDriver[]> {
  const token = localStorage.getItem("commuta_token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_BASE_URL}/payout/history`, {
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
    throw new Error(err?.message || "Failed to fetch drivers history");
  }

  return data.data;
}


export async function getSummary(period:string): Promise<DashboardData> {
  const token = localStorage.getItem("commuta_token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_BASE_URL}/summary?period=${period}`, {
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
    throw new Error(err?.message || "Failed to fetch dashboard summary");
  }

  return data;
}

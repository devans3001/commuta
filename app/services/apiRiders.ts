import type { Rider } from "@/lib/mockData";



export async function fetchRiders(): Promise<Rider[]> {
  const token = localStorage.getItem("commuta_token");
  if (!token) throw new Error("Not authenticated");

   const response = await fetch("https://api.gocommuta.com/v1/admin/riders", {
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
    throw new Error(err?.message || "Failed to fetch riders");
  }

  return data.data;
}


export async function fetchRiderById(id: string): Promise<Rider> {
  const token = localStorage.getItem("commuta_token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`https://api.gocommuta.com/v1/admin/riders/${id}`, {
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
    throw new Error(err?.message || "Failed to fetch rider");
  }

  const data = await response.json();
  return data.data;
}
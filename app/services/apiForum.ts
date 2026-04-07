import type { ForumActivity, ForumUser } from "@/lib/type";
import { API_BASE_URL } from "./apiAuth";

export async function getForumUser(): Promise<ForumUser[]> {
  const token = localStorage.getItem("commuta_token");
  if (!token) throw new Error("Not authenticated");

  try {
    const response = await fetch(`${API_BASE_URL}/forum-users`, {
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
      throw new Error(err?.message || "Failed to fetch forum users");
    }

    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getForumActivity(): Promise<ForumActivity[]> {
  const token = localStorage.getItem("commuta_token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_BASE_URL}/forum-activity`, {
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
    throw new Error(err?.message || "Failed to fetch forum activities");
  }

  return data.data;
}

export async function pause(id: string | undefined, module: string): Promise<any> {
  const token = localStorage.getItem("commuta_token");
  if (!token) throw new Error("Not authenticated");

  // pause/resume  hide/unhide
  const url =
    module === "posts" ? `posts/${id}/hide` : `forum-communities/${id}/pause`;

  const response = await fetch(`${API_BASE_URL}/${url}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
    // body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || `Failed to pause ${module}`);
  }

  return data.data;
}

export async function resume(id: string | undefined, module: string): Promise<any> {
  const token = localStorage.getItem("commuta_token");
  if (!token) throw new Error("Not authenticated");

  // pause/resume  hide/unhide
  const url =
    module === "posts" ? `posts/${id}/unhide` : `forum-communities/${id}/resume`;

  const response = await fetch(`${API_BASE_URL}/${url}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
    // body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || `Failed to resume ${module}`);
  }

  return data.data;
}

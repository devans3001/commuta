export interface LoginPayload {
  emailAddress: string;
  password: string;
}

export interface LoginResponse {
  status: number;
  message: string;
  error: boolean;
  token: string;
}

export const API_BASE_URL = "https://api.gocommuta.com/v1/admin";

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.message || "Login failed");
    }

    const result: LoginResponse = await response.json();

    // Save token in localStorage
    if (result?.token) {
      localStorage.setItem("commuta_token", result.token);
    }


    return result;
  } catch (error: any) {
    console.error("Login Error:", error);
    throw new Error(error?.message || "Unable to login");
  }
}

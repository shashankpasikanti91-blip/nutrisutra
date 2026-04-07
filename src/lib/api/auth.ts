/**
 * Backend auth API client for NutriSutra.
 *
 * Calls /api/auth/* endpoints.
 * Never throws — always returns { success, data | error }.
 */

const API_BASE = "/api/auth";

export interface BackendUser {
  id: string;
  name: string;
  email: string;
  createdAt: number;
  trialEndsAt: number;
}

export interface AuthResponse {
  token: string;
  user: BackendUser;
}

type AuthResult =
  | { success: true; data: AuthResponse }
  | { success: false; error: string; status?: number };

export async function apiRegister(
  name: string,
  email: string,
  password: string,
  suggestedId?: string
): Promise<AuthResult> {
  try {
    const resp = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, suggested_id: suggestedId ?? "" }),
    });
    if (resp.ok) return { success: true, data: await resp.json() };
    const err = await resp.json().catch(() => ({}));
    return { success: false, error: err.detail || "Registration failed.", status: resp.status };
  } catch {
    return { success: false, error: "NETWORK_ERROR" };
  }
}

export async function apiLogin(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const resp = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (resp.ok) return { success: true, data: await resp.json() };
    const err = await resp.json().catch(() => ({}));
    return { success: false, error: err.detail || "Login failed.", status: resp.status };
  } catch {
    return { success: false, error: "NETWORK_ERROR" };
  }
}

export async function apiGetMe(token: string): Promise<BackendUser | null> {
  try {
    const resp = await fetch(`${API_BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (resp.ok) return resp.json();
    return null;
  } catch {
    return null;
  }
}

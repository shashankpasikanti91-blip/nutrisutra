/**
 * Admin API client — owner-only endpoints.
 * Requires the ADMIN_API_KEY stored in .env.
 * Only used from the /app/admin page.
 */

const API_BASE = "/api";
const ADMIN_KEY = "ns_admin_shashank_2026_srpai";

const headers = () => ({
  "Content-Type": "application/json",
  "x-admin-key": ADMIN_KEY,
});

export interface AdminStats {
  total_signups: number;
  total_logins: number;
  total_scans: number;
  total_errors: number;
  unique_users: number;
  today_logins: number;
  today_scans: number;
  recent_events: AdminEvent[];
}

export interface AdminEvent {
  type: string;
  email: string;
  data: Record<string, unknown>;
  ip: string;
  ts: string;
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const resp = await fetch(`${API_BASE}/admin/stats`, { headers: headers() });
  if (!resp.ok) throw new Error("Unauthorized or server error");
  return resp.json();
}

export async function fetchAdminEvents(limit = 200): Promise<AdminEvent[]> {
  const resp = await fetch(`${API_BASE}/admin/events?limit=${limit}`, {
    headers: headers(),
  });
  if (!resp.ok) throw new Error("Unauthorized or server error");
  const data = await resp.json();
  return data.events;
}

export async function testTelegram(): Promise<{ ok: boolean; message: string }> {
  const resp = await fetch(`${API_BASE}/admin/test-telegram`, {
    method: "POST",
    headers: headers(),
  });
  return resp.json();
}

export async function getTelegramSetup(): Promise<{
  chat_id: string | null;
  instruction: string;
}> {
  const resp = await fetch(`${API_BASE}/admin/telegram-setup`, {
    headers: headers(),
  });
  return resp.json();
}

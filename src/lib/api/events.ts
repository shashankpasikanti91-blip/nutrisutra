/**
 * Event reporting client — sends events to the backend for admin tracking
 * and Telegram notifications.
 *
 * Never sends sensitive data like passwords.
 * All calls are fire-and-forget (errors are silently ignored).
 */

const API_BASE = "/api";

export type AppEventType =
  | "signup"
  | "login"
  | "logout"
  | "food_scan"
  | "trial_warning"
  | "trial_expired"
  | "error";

interface EventPayload {
  type: AppEventType;
  email?: string;
  name?: string;
  data?: Record<string, string | number | boolean>;
}

/** Fire-and-forget: reports event to backend. Never throws. */
export async function reportEvent(payload: EventPayload): Promise<void> {
  try {
    await fetch(`${API_BASE}/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Silently ignore — event reporting must never break the app
  }
}

// ── Convenience helpers ──

export const reportSignup = (name: string, email: string) =>
  reportEvent({ type: "signup", email, name });

export const reportLogin = (email: string) =>
  reportEvent({ type: "login", email });

export const reportFoodScan = (
  email: string,
  foodName: string,
  calories: number
) =>
  reportEvent({
    type: "food_scan",
    email,
    data: { food_name: foodName, calories },
  });

export const reportTrialWarning = (email: string, daysLeft: number) =>
  reportEvent({ type: "trial_warning", email, data: { days_left: daysLeft } });

export const reportTrialExpired = (email: string) =>
  reportEvent({ type: "trial_expired", email });

export const reportError = (message: string, email = "") =>
  reportEvent({ type: "error", email, data: { message } });

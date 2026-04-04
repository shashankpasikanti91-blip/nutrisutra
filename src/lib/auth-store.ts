/**
 * Simple localStorage-based auth with 30-day free trial.
 * This is client-side only — suitable for MVP/demo.
 * Migrate to Supabase/Firebase when ready for production.
 */

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: number; // timestamp
  trialEndsAt: number; // timestamp
}

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  createdAt: number;
  trialEndsAt: number;
}

const USERS_KEY = "nutrisutra_users";
const SESSION_KEY = "nutrisutra_session";
const TRIAL_DAYS = 30;

// Simple hash — NOT cryptographically secure, but fine for client-side MVP.
// In production, use a real backend with bcrypt.
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "nutrisutra_salt_2026");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function getUsers(): Record<string, UserProfile> {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function saveUsers(users: Record<string, UserProfile>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ───────────────────────────────────────
// Registration
// ───────────────────────────────────────

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<{ success: true; session: AuthSession } | { success: false; error: string }> {
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedName = name.trim();

  if (!trimmedName || trimmedName.length < 2) {
    return { success: false, error: "Name must be at least 2 characters." };
  }
  if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return { success: false, error: "Please enter a valid email address." };
  }
  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters." };
  }

  const users = getUsers();

  // Check if email already exists
  const existing = Object.values(users).find((u) => u.email === trimmedEmail);
  if (existing) {
    return { success: false, error: "An account with this email already exists. Try logging in." };
  }

  const now = Date.now();
  const id = `user_${now}_${Math.random().toString(36).slice(2, 8)}`;
  const passwordHash = await hashPassword(password);

  const user: UserProfile = {
    id,
    name: trimmedName,
    email: trimmedEmail,
    passwordHash,
    createdAt: now,
    trialEndsAt: now + TRIAL_DAYS * 24 * 60 * 60 * 1000,
  };

  users[id] = user;
  saveUsers(users);

  const session: AuthSession = {
    userId: id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    trialEndsAt: user.trialEndsAt,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return { success: true, session };
}

// ───────────────────────────────────────
// Login
// ───────────────────────────────────────

export async function loginUser(
  email: string,
  password: string
): Promise<{ success: true; session: AuthSession } | { success: false; error: string }> {
  const trimmedEmail = email.trim().toLowerCase();
  const users = getUsers();

  const user = Object.values(users).find((u) => u.email === trimmedEmail);
  if (!user) {
    return { success: false, error: "No account found with this email." };
  }

  const passwordHash = await hashPassword(password);
  if (passwordHash !== user.passwordHash) {
    return { success: false, error: "Incorrect password. Please try again." };
  }

  const session: AuthSession = {
    userId: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    trialEndsAt: user.trialEndsAt,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return { success: true, session };
}

// ───────────────────────────────────────
// Session management
// ───────────────────────────────────────

export function getSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function isLoggedIn(): boolean {
  return getSession() !== null;
}

// ───────────────────────────────────────
// Trial
// ───────────────────────────────────────

export function getTrialDaysLeft(): number {
  const session = getSession();
  if (!session) return 0;
  const remaining = session.trialEndsAt - Date.now();
  return Math.max(0, Math.ceil(remaining / (24 * 60 * 60 * 1000)));
}

export function isTrialExpired(): boolean {
  const session = getSession();
  if (!session) return true;
  return Date.now() > session.trialEndsAt;
}

export function isTrialActive(): boolean {
  return isLoggedIn() && !isTrialExpired();
}

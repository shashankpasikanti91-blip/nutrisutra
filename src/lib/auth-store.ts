/**
 * LocalStorage auth store with 30-day free trial.
 */

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: number; // timestamp
  trialEndsAt: number; // timestamp
}

/** Extended profile data saved per user */
export interface UserProfileData {
  name: string;
  email: string;
  age: number;
  gender: "male" | "female";
  heightCm: number;
  weightKg: number;
  activity: "sedentary" | "light" | "moderate" | "active" | "very_active";
  goal: "weight_loss" | "muscle_gain" | "maintenance" | "diabetic_friendly";
  diet: "non_veg" | "vegetarian" | "vegan" | "eggetarian";
  cuisine: "south_indian" | "north_indian" | "malaysian" | "chinese" | "western" | "mixed";
  units: "metric" | "imperial";
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

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "pasikantishashank24@gmail.com";

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
// Admin / Owner helpers
// ───────────────────────────────────────

export function isAdmin(): boolean {
  const session = getSession();
  if (!session) return false;
  return session.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

// ───────────────────────────────────────
// Owner account auto-seed
// ───────────────────────────────────────

const OWNER_EMAIL = "pasikantishashank24@gmail.com";
const OWNER_NAME = "Shashank";
const OWNER_PASSWORD = "NutriAdmin@2026";

async function ensureOwnerAccount(): Promise<void> {
  const users = getUsers();
  const exists = Object.values(users).find((u) => u.email === OWNER_EMAIL);
  if (exists) return;

  const hash = await hashPassword(OWNER_PASSWORD);
  const now = Date.now();
  const id = "user_owner_shashank";
  const user: UserProfile = {
    id,
    name: OWNER_NAME,
    email: OWNER_EMAIL,
    passwordHash: hash,
    createdAt: now,
    trialEndsAt: now + 10 * 365 * 24 * 60 * 60 * 1000, // never expires (10 years)
  };
  users[id] = user;
  saveUsers(users);
  initializeUserProfile(id, OWNER_NAME, OWNER_EMAIL);
}

// ───────────────────────────────────────
// Demo account auto-seed
// ───────────────────────────────────────

const DEMO_EMAIL = "demo@nutrisutra.com";
const DEMO_PASSWORD = "demo1234";
const DEMO_NAME = "Demo User";

async function ensureDemoAccount(): Promise<void> {
  const users = getUsers();
  const exists = Object.values(users).find((u) => u.email === DEMO_EMAIL);
  if (exists) return;

  const hash = await hashPassword(DEMO_PASSWORD);
  const now = Date.now();
  const id = "user_demo_account";
  const user: UserProfile = {
    id,
    name: DEMO_NAME,
    email: DEMO_EMAIL,
    passwordHash: hash,
    createdAt: now,
    trialEndsAt: now + 365 * 24 * 60 * 60 * 1000, // 1 year
  };
  users[id] = user;
  saveUsers(users);
}

// Seed system accounts on module load
ensureOwnerAccount();
ensureDemoAccount();

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
  const existing = Object.values(users).find((u) => u.email === trimmedEmail);
  if (existing) {
    return { success: false, error: "An account with this email already exists. Try logging in." };
  }

  const now = Date.now();
  const id = `user_${now}_${Math.random().toString(36).slice(2, 8)}`;
  const passwordHash = await hashPassword(password);
  const user: UserProfile = {
    id, name: trimmedName, email: trimmedEmail, passwordHash,
    createdAt: now, trialEndsAt: now + TRIAL_DAYS * 24 * 60 * 60 * 1000,
  };
  users[id] = user;
  saveUsers(users);
  initializeUserProfile(id, trimmedName, trimmedEmail);

  const session: AuthSession = {
    userId: id, email: trimmedEmail, name: trimmedName,
    createdAt: now, trialEndsAt: user.trialEndsAt,
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
    userId: user.id, email: user.email, name: user.name,
    createdAt: user.createdAt, trialEndsAt: user.trialEndsAt,
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

// ───────────────────────────────────────
// User-scoped localStorage key
// ───────────────────────────────────────

/** Returns a localStorage key scoped to the current user.
 *  Falls back to global key if no user is logged in. */
export function userKey(baseKey: string): string {
  const session = getSession();
  if (session) return `${baseKey}_${session.userId}`;
  return baseKey;
}

// ───────────────────────────────────────
// User profile data (per-user)
// ───────────────────────────────────────

const PROFILE_KEY = "nutrisutra_profile";

export function getDefaultProfileData(name: string, email: string): UserProfileData {
  return {
    name,
    email,
    age: 25,
    gender: "male",
    heightCm: 170,
    weightKg: 70,
    activity: "light",
    goal: "maintenance",
    diet: "non_veg",
    cuisine: "south_indian",
    units: "metric",
  };
}

export function getUserProfileData(): UserProfileData {
  try {
    const raw = localStorage.getItem(userKey(PROFILE_KEY));
    if (raw) return JSON.parse(raw);
  } catch {}
  const session = getSession();
  return getDefaultProfileData(session?.name || "User", session?.email || "");
}

export function saveUserProfileData(data: UserProfileData): void {
  localStorage.setItem(userKey(PROFILE_KEY), JSON.stringify(data));
  // Also update the session name if it changed
  const session = getSession();
  if (session && data.name !== session.name) {
    session.name = data.name;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    // Also update in users store
    const users = getUsers();
    if (users[session.userId]) {
      users[session.userId].name = data.name;
      saveUsers(users);
    }
  }
}

/** Called on registration to initialize the user's profile with defaults */
export function initializeUserProfile(userId: string, name: string, email: string): void {
  const key = `${PROFILE_KEY}_${userId}`;
  const defaults = getDefaultProfileData(name, email);
  localStorage.setItem(key, JSON.stringify(defaults));
}

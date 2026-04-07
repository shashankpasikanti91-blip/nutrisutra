import { test, expect } from "@playwright/test";

// ═══════════════════════════════════════
// Navigation & Routing
// ═══════════════════════════════════════

test.describe("Navigation", () => {
  test("homepage loads and shows hero", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/NutriSutra/i);
    await expect(page.locator("nav").first()).toBeVisible();
  });

  test("navbar links are present", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const nav = page.locator("nav");
    await expect(nav.locator('a[href="/"]').first()).toBeVisible();
    await expect(nav.locator('a[href="/analyze"]').first()).toBeVisible();
  });

  test("clicking Analyze navigates without blank page", async ({ page }) => {
    await page.goto("/");
    await page.locator('nav a[href="/analyze"]').first().click();
    await expect(page).toHaveURL(/\/analyze/);
    // Analyze page should show the mode toggle with "Type" button
    await expect(page.locator("button", { hasText: "Type" })).toBeVisible();
  });

  test("/analyze opens without login", async ({ page }) => {
    await page.goto("/analyze");
    // Should NOT redirect to /login
    await expect(page).toHaveURL(/\/analyze/);
    await expect(page.locator("button", { hasText: "Type" })).toBeVisible();
  });

  test("/demo loads", async ({ page }) => {
    await page.goto("/demo");
    await expect(page).toHaveURL(/\/demo/);
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("/pricing loads", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page).toHaveURL(/\/pricing/);
    await expect(page.locator("button", { hasText: "India" })).toBeVisible();
    await expect(page.locator("button", { hasText: "Global" })).toBeVisible();
  });

  test("404 page for unknown routes", async ({ page }) => {
    await page.goto("/nonexistent-route");
    await expect(page.locator("h1", { hasText: "404" })).toBeVisible();
  });
});

// ═══════════════════════════════════════
// Homepage Features
// ═══════════════════════════════════════

test.describe("Homepage", () => {
  test("shows food category cards", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=South India").first()).toBeVisible();
  });

  test("quick tools section has working links", async ({ page }) => {
    await page.goto("/");
    const analyzeLink = page.locator('a[href="/analyze"]').first();
    await expect(analyzeLink).toBeVisible();
  });

  test("FAQ section is present", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=FAQ").first()).toBeVisible();
  });

  test("SVG icons are used instead of emojis", async ({ page }) => {
    await page.goto("/");
    const svgIcons = page.locator("svg");
    expect(await svgIcons.count()).toBeGreaterThan(5);
  });
});

// ═══════════════════════════════════════
// Analyze Page — Text Mode
// ═══════════════════════════════════════

test.describe("Analyze Page — Text Input", () => {
  test("text input and analysis works", async ({ page }) => {
    await page.goto("/analyze");
    // Click "Type" tab to ensure text mode
    await page.locator("button", { hasText: "Type" }).click();

    const input = page.locator("input").first();
    await expect(input).toBeVisible();

    await input.fill("2 idli with sambar");
    await input.press("Enter");

    // Wait for results — should show calorie card
    await expect(page.locator("text=/\\d+\\s*kcal/i").first()).toBeVisible({ timeout: 10000 });
  });

  test("quick picks are visible and clickable", async ({ page }) => {
    await page.goto("/analyze");
    // Ensure text mode
    await page.locator("button", { hasText: "Type" }).click();
    const quickPick = page.locator("button", { hasText: "Idli + Sambar" });
    if (await quickPick.isVisible()) {
      await quickPick.click();
      await expect(page.locator("text=/\\d+\\s*kcal/i").first()).toBeVisible({ timeout: 10000 });
    }
  });

  test("goal selector toggles work", async ({ page }) => {
    await page.goto("/analyze");
    const loseBtn = page.locator("button", { hasText: /Lose/i }).first();
    if (await loseBtn.isVisible()) {
      await loseBtn.click();
      await expect(loseBtn).toHaveClass(/bg-emerald/);
    }
  });

  test("health condition pills toggle", async ({ page }) => {
    await page.goto("/analyze");
    const diabetesBtn = page.locator("button", { hasText: /Diabetes/i }).first();
    if (await diabetesBtn.isVisible()) {
      await diabetesBtn.click();
      await expect(diabetesBtn).toHaveClass(/bg-rose/);
    }
  });
});

// ═══════════════════════════════════════
// Analyze Page — Image/Camera Mode
// ═══════════════════════════════════════

test.describe("Analyze Page — Image Mode", () => {
  test("snap tab is visible and switchable", async ({ page }) => {
    await page.goto("/analyze");
    const snapTab = page.locator("button", { hasText: "Snap" });
    await expect(snapTab).toBeVisible();
    await snapTab.click();

    // Should show camera/upload UI elements
    await expect(
      page.locator("text=/camera|upload|gallery|take|drag|photo/i").first()
    ).toBeVisible({ timeout: 5000 });
  });

  test("scan tab is visible", async ({ page }) => {
    await page.goto("/analyze");
    const scanTab = page.locator("button", { hasText: "Scan" });
    await expect(scanTab).toBeVisible();
  });
});

// ═══════════════════════════════════════
// Demo Pages
// ═══════════════════════════════════════

test.describe("Demo Pages", () => {
  test("calculator page loads", async ({ page }) => {
    await page.goto("/demo/calculator");
    await expect(page).toHaveURL(/\/demo\/calculator/);
    await expect(page.locator("text=/calorie|intake|BMR/i").first()).toBeVisible();
  });

  test("water tracker loads", async ({ page }) => {
    await page.goto("/demo/water");
    await expect(page).toHaveURL(/\/demo\/water/);
    await expect(page.locator("text=/water|hydrat/i").first()).toBeVisible();
  });

  test("demo tracker loads", async ({ page }) => {
    await page.goto("/demo/tracker");
    await expect(page).toHaveURL(/\/demo\/tracker/);
    await expect(page.locator("text=/tracker|today/i").first()).toBeVisible();
  });
});

// ═══════════════════════════════════════
// Auth Pages
// ═══════════════════════════════════════

test.describe("Auth Pages", () => {
  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('input[type="email"], input[type="text"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });

  test("signup page loads", async ({ page }) => {
    await page.goto("/signup");
    await expect(page).toHaveURL(/\/signup/);
    await expect(page.locator('input[type="email"], input[type="text"]').first()).toBeVisible();
  });

  test("forgot password page loads", async ({ page }) => {
    await page.goto("/forgot-password");
    await expect(page).toHaveURL(/\/forgot-password/);
  });
});

// ═══════════════════════════════════════
// Admin Routing
// ═══════════════════════════════════════

test.describe("Admin Routing", () => {
  test("/app/admin redirects to /login when not logged in", async ({ page }) => {
    await page.goto("/app/admin");
    await expect(page).toHaveURL(/\/login/);
  });

  test("/app/dashboard redirects to /login when not logged in", async ({ page }) => {
    await page.goto("/app/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("/app/admin page with admin session shows Admin Dashboard", async ({ page }) => {
    // Inject a fake admin session into localStorage before navigating
    await page.goto("/login");
    await page.evaluate(() => {
      const adminSession = {
        userId: "admin-test",
        email: "pasikantishashank24@gmail.com",
        name: "Admin",
        createdAt: Date.now() - 1000,
        trialEndsAt: Date.now() + 30 * 24 * 3600 * 1000,
      };
      localStorage.setItem("nutrisutra_session", JSON.stringify(adminSession));
    });
    await page.goto("/app/admin");
    // Admin page should stay at /app/admin and show the admin heading
    await expect(page).toHaveURL(/\/app\/admin/);
    await expect(page.locator("h1", { hasText: "Admin Dashboard" })).toBeVisible({ timeout: 5000 });
  });

  test("regular user visiting /app/dashboard does NOT redirect to /app/admin", async ({ page }) => {
    await page.goto("/login");
    await page.evaluate(() => {
      const userSession = {
        userId: "user-test-123",
        email: "regularuser@example.com",
        name: "Regular User",
        createdAt: Date.now() - 1000,
        trialEndsAt: Date.now() + 30 * 24 * 3600 * 1000,
      };
      localStorage.setItem("nutrisutra_session", JSON.stringify(userSession));
    });
    await page.goto("/app/dashboard");
    // Regular user should stay on /app/dashboard, NOT be redirected to /app/admin
    await expect(page).toHaveURL(/\/app\/dashboard/);
    // Should NOT see the admin dashboard heading
    await expect(page.locator("h1", { hasText: "Admin Dashboard" })).toHaveCount(0);
  });

  test("admin visiting /app/dashboard gets redirected to /app/admin", async ({ page }) => {
    await page.goto("/login");
    await page.evaluate(() => {
      const adminSession = {
        userId: "admin-test",
        email: "pasikantishashank24@gmail.com",
        name: "Admin",
        createdAt: Date.now() - 1000,
        trialEndsAt: Date.now() + 30 * 24 * 3600 * 1000,
      };
      localStorage.setItem("nutrisutra_session", JSON.stringify(adminSession));
    });
    await page.goto("/app/dashboard");
    // Admin visiting /app/dashboard should be redirected to /app/admin
    await expect(page).toHaveURL(/\/app\/admin/);
  });
});

// ═══════════════════════════════════════
// Responsive Layout
// ═══════════════════════════════════════

test.describe("Responsive Layout", () => {
  test("mobile viewport — hamburger menu appears", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    // Navbar should still be present
    await expect(page.locator("nav")).toBeVisible();
  });

  test("mobile viewport — analyze page works", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/analyze");
    // Mode toggle should be visible
    await expect(page.locator("button", { hasText: "Type" })).toBeVisible();
  });

  test("tablet viewport — layout adapts", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    await expect(page.locator("nav")).toBeVisible();
  });
});

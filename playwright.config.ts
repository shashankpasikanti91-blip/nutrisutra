import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: "https://localhost:8080",
    ignoreHTTPSErrors: true,
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run dev",
    url: "https://localhost:8080",
    ignoreHTTPSErrors: true,
    reuseExistingServer: true,
    timeout: 30000,
  },
});

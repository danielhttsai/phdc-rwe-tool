// Playwright config for the built static site. Serves docs/ with Python's stdlib
// http.server (no extra deps) and runs the smoke tests against it.
const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 30000,
  fullyParallel: true,
  use: {
    baseURL: "http://localhost:8080",
  },
  webServer: {
    command: "python -m http.server 8080 --directory docs",
    port: 8080,
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});

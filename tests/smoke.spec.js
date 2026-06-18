// Browser smoke tests: load the built site and assert it actually runs — panels
// activate, the pure-JS ② charts render, and there are zero console/page errors.
// Catches runtime breakage that the static text checks in
// backend/test_frontend_structure.py cannot. Kept network-light by exercising
// only the JS-only charts (no Pyodide-backed ③ analyze).
const { test, expect } = require("@playwright/test");

// methods whose ② "play" chart is pure client-side JS (no backend needed)
const JS_CHART_METHODS = ["nma", "gbtm", "causalml"];

function trackErrors(page) {
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
}

test("home loads with the full method grid and no errors", async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto("/");
  await expect(page.locator("#home")).toHaveClass(/active/);
  // one card per dropdown method (dynamic, so adding a method never breaks this)
  const methodCount = await page.locator("#methodSelect option").count();
  await expect(page.locator("#homeGrid .home-card")).toHaveCount(methodCount);
  expect(methodCount).toBeGreaterThanOrEqual(29);
  expect(errors, errors.join("\n")).toEqual([]);
});

test("deep link restores a method + sub-tab", async ({ page }) => {
  await page.goto("/#m=ccw&t=assume");
  await expect(page.locator("#ccwassume")).toHaveClass(/active/);
});

test("JS-chart methods render their ② chart", async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto("/");
  for (const m of JS_CHART_METHODS) {
    await page.selectOption("#methodSelect", m);
    await page.locator('.subtab[data-sub="play"]').click();
    await expect(page.locator(`#${m}play .plotly`).first()).toBeVisible({ timeout: 15000 });
  }
  expect(errors, errors.join("\n")).toEqual([]);
});

test("all six sub-tabs activate for a sample method", async ({ page }) => {
  await page.goto("/#m=gbtm&t=learn");
  // skip ③ analyze (it would kick off the Pyodide backend); the rest are static/JS
  for (const s of ["learn", "play", "assume", "ml", "whatif"]) {
    await page.locator(`.subtab[data-sub="${s}"]`).click();
    await expect(page.locator(`#gbtm${s}`)).toHaveClass(/active/);
  }
});

test("the self-check quiz reveals the answer", async ({ page }) => {
  await page.goto("/#m=iv&t=learn");
  const quiz = page.locator("#learn .quiz");
  await expect(quiz).toBeVisible();
  await quiz.locator(".quiz-opt").first().click();
  await expect(quiz.locator(".quiz-opt.correct").first()).toBeVisible();
  await expect(quiz.locator(".quiz-explain").first()).toBeVisible();
});

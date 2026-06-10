import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { chromium, devices } from "playwright";

const profiles = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
  phone: devices["iPhone 15"]
};

export function resolveProfile(name) {
  const profile = profiles[name];
  if (!profile) throw new Error(`Unknown profile "${name}". Use: ${Object.keys(profiles).join(", ")}`);
  return profile;
}

export async function captureResponsiveScreenshots({
  url,
  outDir = "artifacts/screenshots",
  profiles: names = ["desktop", "phone"],
  browserType = chromium,
  waitUntil = "load",
  settleMs = 250,
  fullPage = false,
  scale = "css"
}) {
  if (!url) throw new Error("A URL is required.");
  await mkdir(outDir, { recursive: true });
  const browser = await browserType.launch();
  try {
    const shots = [];
    for (const name of names) {
      const context = await browser.newContext(resolveProfile(name));
      try {
        const page = await context.newPage();
        await page.goto(url, { waitUntil });
        if (settleMs) await page.waitForTimeout(settleMs);
        const path = join(outDir, `${name}.png`);
        await page.screenshot({ path, fullPage, scale });
        shots.push({ profile: name, path, options: resolveProfile(name) });
      } finally {
        await context.close();
      }
    }
    return shots;
  } finally {
    await browser.close();
  }
}

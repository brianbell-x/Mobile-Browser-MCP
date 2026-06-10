#!/usr/bin/env node
import { parseArgs } from "node:util";
import { captureResponsiveScreenshots } from "./mobile-renderer.js";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    out: { type: "string", short: "o", default: "artifacts/screenshots" },
    profiles: { type: "string", short: "p", default: "desktop,phone" },
    waitUntil: { type: "string", default: "load" },
    settleMs: { type: "string", default: "250" },
    help: { type: "boolean", short: "h" }
  }
});

if (values.help || !positionals[0]) {
  console.log("Usage: mobile-review <url> [-o artifacts/screenshots] [-p desktop,phone] [--waitUntil load] [--settleMs 250]");
  process.exit(values.help ? 0 : 1);
}

const shots = await captureResponsiveScreenshots({
  url: positionals[0],
  outDir: values.out,
  profiles: values.profiles.split(",").map(value => value.trim()).filter(Boolean),
  waitUntil: values.waitUntil,
  settleMs: Number(values.settleMs)
});

console.log(JSON.stringify(shots.map(({ profile, path, options }) => ({ profile, path, viewport: options.viewport, isMobile: options.isMobile, hasTouch: options.hasTouch, deviceScaleFactor: options.deviceScaleFactor })), null, 2));

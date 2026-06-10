import assert from "node:assert/strict";
import test from "node:test";

test("phone profile uses mobile browser signals beyond viewport size", async () => {
  const { resolveProfile } = await import("../src/mobile-renderer.js");
  const phone = resolveProfile("phone");
  assert.equal(phone.isMobile, true);
  assert.equal(phone.hasTouch, true);
  assert.match(phone.userAgent, /Mobile|Android|iPhone/);
  assert.ok(phone.viewport.width <= 430);
  assert.ok(phone.deviceScaleFactor > 1);
});

test("capture uses separate contexts and deterministic screenshot names", async () => {
  const calls = [];
  const browserType = {
    launch: async () => ({
      newContext: async options => {
        calls.push(["context", options]);
        return {
          newPage: async () => ({
            goto: async (url, options) => calls.push(["goto", url, options]),
            waitForTimeout: async ms => calls.push(["settle", ms]),
            screenshot: async options => calls.push(["screenshot", options])
          }),
          close: async () => calls.push(["context-close"])
        };
      },
      close: async () => calls.push(["browser-close"])
    })
  };
  const { captureResponsiveScreenshots } = await import("../src/mobile-renderer.js");
  const shots = await captureResponsiveScreenshots({
    url: "http://127.0.0.1:4321",
    outDir: "C:/tmp/mobile-review",
    profiles: ["desktop", "phone"],
    browserType,
    settleMs: 1
  });
  assert.deepEqual(shots.map(shot => shot.profile), ["desktop", "phone"]);
  assert.equal(calls.filter(([type]) => type === "context").length, 2);
  assert.equal(calls.find(([type]) => type === "context")[1].isMobile, false);
  assert.equal(calls.filter(([type]) => type === "context")[1][1].isMobile, true);
  assert.ok(calls.some(([type, options]) => type === "screenshot" && options.path.endsWith("phone.png")));
  assert.ok(calls.every(([type, options]) => type !== "screenshot" || options.fullPage === false));
  assert.ok(calls.every(([type, options]) => type !== "screenshot" || options.scale === "css"));
  assert.equal(calls.at(-1)[0], "browser-close");
});

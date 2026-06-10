import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("demo fixture exposes visibly different desktop and phone layouts", async () => {
  const html = await readFile("examples/responsive-site.html", "utf8");
  assert.match(html, /DESKTOP LAYOUT/);
  assert.match(html, /PHONE LAYOUT/);
  assert.match(html, /@media \(max-width: 640px\)/);
});

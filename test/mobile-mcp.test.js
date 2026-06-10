import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("mobile MCP wrapper uses Playwright's existing MCP entry with iPhone emulation", async () => {
  const { getMobileMcpCommand } = await import("../src/mobile-mcp.js");
  const command = getMobileMcpCommand();
  assert.match(command.command, /node(\.exe)?$/i);
  assert.match(command.args[0].replaceAll("\\", "/"), /node_modules\/playwright-core\/lib\/entry\/mcp\.js$/);
  assert.equal(existsSync(command.args[0]), true);
  assert.deepEqual(command.args.slice(1, 7), ["--device", "iPhone 15", "--caps", "vision,devtools", "--output-dir", "artifacts/mobile-agent"]);
  assert.equal(command.dependencies.length, 0);
});

test("package and docs expose the mobile MCP workflow to agents", async () => {
  const [pkg, docs] = await Promise.all([
    readFile("package.json", "utf8").then(JSON.parse),
    readFile("AGENTS.md", "utf8")
  ]);
  assert.equal(pkg.scripts["mobile:mcp"], "node src/mobile-mcp.js");
  assert.equal(pkg.scripts.review, undefined);
  assert.equal(pkg.scripts.demo, undefined);
  assert.equal(pkg.bin["mobile-review"], undefined);
  assert.match(docs, /mobile:mcp/);
  assert.match(docs, /iPhone 15/);
  assert.match(docs, /Claude Code/);
  assert.doesNotMatch(docs, /desktop/i);
  assert.doesNotMatch(docs, /review --/);
});

#!/usr/bin/env node
import { spawn } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const entry = fileURLToPath(new URL("../node_modules/playwright-core/lib/entry/mcp.js", import.meta.url));
const defaults = ["--device", "iPhone 15", "--caps", "vision,devtools", "--output-dir", "artifacts/mobile-agent", "--isolated"];

export function getMobileMcpCommand(extraArgs = []) {
  return { command: process.execPath, args: [entry, ...defaults, ...extraArgs], dependencies: [] };
}

export function runMobileMcp(extraArgs = process.argv.slice(2)) {
  const { command, args } = getMobileMcpCommand(extraArgs);
  const child = spawn(command, args, { stdio: "inherit" });
  for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
  child.on("exit", code => process.exit(code ?? 1));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) runMobileMcp();

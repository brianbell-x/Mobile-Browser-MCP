# Agent Integration

Use `mobile:mcp` when an agent needs to inspect and operate a mobile UX directly.

```json
{
  "mcpServers": {
    "mobile-browser": {
      "command": "node",
      "args": ["C:/dev/mobile-first-testing/src/mobile-mcp.js"]
    }
  }
}
```

Claude Code from this repo:

```powershell
claude mcp add mobile-browser node C:/dev/mobile-first-testing/src/mobile-mcp.js
```

Direct command:

```powershell
npm run mobile:mcp
```

The wrapper starts Playwright MCP with `--device "iPhone 15"` and `--caps vision,devtools`, so agents get navigation, snapshots, click/type/scroll actions, screenshots, and devtools context in a real mobile-emulated browser. Keep `npm run review -- <url> --out <dir>` for batch desktop-versus-phone proof screenshots.

## Decision

The most efficient path is Playwright MCP through this wrapper. It uses the Playwright dependency already installed here and exposes standard MCP browser tools without adding Browser Use, Python, Rust runtime components, cloud accounts, or Anthropic Chrome extension requirements.

Browser Use remains useful when the workflow needs its persistent CLI daemon, cloud browsers, proxies, CAPTCHA support, or its autonomous retry agent. For local mobile UX/UI testing, it adds more moving parts than needed.

Claude in Chrome is useful for a human-visible desktop Chrome workflow with shared login state, but it is closed, beta, account-bound, and not a phone-emulated browser surface. It is a complement for authenticated desktop checks, not the base layer for mobile UI testing.

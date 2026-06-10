# Mobile Browser MCP

Render a web app as a real mobile browser context, not only a smaller desktop viewport.

## Usage

Start the MCP server:

```powershell
npm run mobile:mcp
```

Or point your MCP client directly at the entrypoint:

```json
{ "command": "node", "args": ["/path/to/mobile-first-testing/src/mobile-mcp.js"] }
```

See `AGENTS.md` for Claude Code, Browser Use, and Claude in Chrome integration details.

## Capture screenshots

```powershell
npm install
npm run review -- http://localhost:3000 --out path/to/output
```

Writes two files:

- `desktop.png` — 1440x900 desktop context
- `phone.png` — Playwright iPhone 15 context with mobile UA, touch, DPR, and `isMobile: true`

The renderer API is `captureResponsiveScreenshots()` in `src/mobile-renderer.js`.

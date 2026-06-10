# Mobile First Testing

Render a web app as a real mobile browser context, not only a smaller desktop viewport.

Interactive mobile browser for agents:

```powershell
npm run mobile:mcp
```

MCP clients can run the direct entrypoint:

```json
{ "command": "node", "args": ["C:/dev/mobile-first-testing/src/mobile-mcp.js"] }
```

See `docs/agent-integration.md` for Claude Code, Browser Use, and Claude in Chrome tradeoffs.

```powershell
npm install
npm run review -- http://localhost:3000 --out artifacts/my-app
```

The default capture writes:

- `desktop.png`: 1440x900 desktop context
- `phone.png`: Playwright iPhone 15 context with mobile UA, touch, DPR, and `isMobile: true`

Run the proof fixture:

```powershell
npm run demo
```

Current proof screenshots are in:

- `artifacts/proof/desktop.png`
- `artifacts/proof/phone.png`

The renderer API is `captureResponsiveScreenshots()` in `src/mobile-renderer.js`.

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { captureResponsiveScreenshots } from "../src/mobile-renderer.js";

const page = await readFile(new URL("./responsive-site.html", import.meta.url));
const server = createServer((_, res) => {
  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(page);
});

await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
try {
  const { port } = server.address();
  const shots = await captureResponsiveScreenshots({ url: `http://127.0.0.1:${port}`, outDir: "artifacts/proof" });
  console.log(JSON.stringify(shots.map(({ profile, path, options }) => ({ profile, path, viewport: options.viewport, isMobile: options.isMobile })), null, 2));
} finally {
  server.close();
}

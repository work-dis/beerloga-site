import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import net from "node:net";
import { after, before, test } from "node:test";

const routes = [
  "/",
  "/assortment",
  "/assortment/beer",
  "/assortment/non-alcoholic",
  "/assortment/snacks",
  "/stores",
  "/about",
  "/contacts",
  "/privacy",
];

let server;
let baseUrl;
let serverOutput = "";

async function getAvailablePort() {
  return new Promise((resolve, reject) => {
    const socket = net.createServer();
    socket.unref();
    socket.once("error", reject);
    socket.listen(0, "127.0.0.1", () => {
      const address = socket.address();
      socket.close(() => resolve(address.port));
    });
  });
}

async function render(path) {
  return fetch(`${baseUrl}${path}`, {
    headers: { accept: "text/html" },
  });
}

before(async () => {
  const port = await getAvailablePort();
  baseUrl = `http://127.0.0.1:${port}`;
  server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", String(port)], {
    cwd: new URL("..", import.meta.url),
    env: { ...process.env, NODE_ENV: "production" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.stdout.on("data", (chunk) => {
    serverOutput += chunk;
  });
  server.stderr.on("data", (chunk) => {
    serverOutput += chunk;
  });

  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Next.js server exited early:\n${serverOutput}`);
    }
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Next.js server did not become ready:\n${serverOutput}`);
});

after(async () => {
  if (!server || server.exitCode !== null) return;
  server.kill("SIGTERM");
  await new Promise((resolve) => server.once("exit", resolve));
});

test("all required pages render with one H1 and unique metadata", async () => {
  const titles = new Set();
  for (const route of routes) {
    const response = await render(route);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert.match(html, /<html[^>]+lang="ru"/i, route);
    assert.equal((html.match(/<h1\b/gi) ?? []).length, 1, route);
    const title = html.match(/<title>(.*?)<\/title>/i)?.[1];
    assert.ok(title, `missing title for ${route}`);
    assert.ok(!titles.has(title), `duplicate title: ${title}`);
    titles.add(title);
    assert.match(html, /rel="canonical"/i, route);
    assert.match(html, /property="og:title"/i, route);
  }
});

test("beer page contains persistent legal warning and no sales CTA", async () => {
  const response = await render("/assortment/beer");
  const html = await response.text();
  assert.match(html, /data-testid="beer-advertising-section"/);
  assert.match(html, /data-testid="beer-legal-warning"/);
  assert.match(html, /ЧРЕЗМЕРНОЕ УПОТРЕБЛЕНИЕ ПИВА ВРЕДИТ ЗДОРОВЬЮ/);
  assert.match(html, />18\+</);
  assert.doesNotMatch(html, />\s*(Купить|Заказать|В корзину|Доставка)\s*</i);
  assert.doesNotMatch(html, /слабоалкоголь|сидр|медовух|вино|лик[её]р/i);
});

test("site exposes no cart or checkout routes and internal routes are healthy", async () => {
  for (const forbidden of ["/cart", "/checkout"]) {
    const response = await render(forbidden);
    assert.equal(response.status, 404, forbidden);
  }
  for (const route of routes) {
    const response = await render(route);
    assert.equal(response.status, 200, route);
  }
});

test("stores page uses only permitted structured data types", async () => {
  const response = await render("/stores");
  const html = await response.text();
  assert.match(html, /LocalBusiness/);
  assert.match(html, /PostalAddress/);
  assert.match(html, /OpeningHoursSpecification/);
  assert.doesNotMatch(html, /&quot;@type&quot;:&quot;(Product|Offer)&quot;/);
});

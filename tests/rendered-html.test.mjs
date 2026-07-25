import assert from "node:assert/strict";
import test from "node:test";

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

async function getWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  return (await import(workerUrl.href)).default;
}

async function render(worker, path) {
  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("all required pages render with one H1 and unique metadata", async () => {
  const worker = await getWorker();
  const titles = new Set();
  for (const route of routes) {
    const response = await render(worker, route);
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
  const worker = await getWorker();
  const response = await render(worker, "/assortment/beer");
  const html = await response.text();
  assert.match(html, /data-testid="beer-advertising-section"/);
  assert.match(html, /data-testid="beer-legal-warning"/);
  assert.match(html, /ЧРЕЗМЕРНОЕ УПОТРЕБЛЕНИЕ ПИВА ВРЕДИТ ЗДОРОВЬЮ/);
  assert.match(html, />18\+</);
  assert.doesNotMatch(html, />\s*(Купить|Заказать|В корзину|Доставка)\s*</i);
  assert.doesNotMatch(html, /слабоалкоголь|сидр|медовух|вино|лик[её]р/i);
});

test("site exposes no cart or checkout routes and internal routes are healthy", async () => {
  const worker = await getWorker();
  for (const forbidden of ["/cart", "/checkout"]) {
    const response = await render(worker, forbidden);
    assert.equal(response.status, 404, forbidden);
  }
  for (const route of routes) {
    const response = await render(worker, route);
    assert.equal(response.status, 200, route);
  }
});

test("stores page uses only permitted structured data types", async () => {
  const worker = await getWorker();
  const response = await render(worker, "/stores");
  const html = await response.text();
  assert.match(html, /LocalBusiness/);
  assert.match(html, /PostalAddress/);
  assert.match(html, /OpeningHoursSpecification/);
  assert.doesNotMatch(html, /&quot;@type&quot;:&quot;(Product|Offer)&quot;/);
});

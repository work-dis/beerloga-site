import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const rawLine of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator < 0) continue;
    const key = line.slice(0, separator).trim();
    if (process.env[key]) continue;
    let value = line.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadEnv(path.join(root, ".env.local"));

const baseUrl =
  process.env.CRM_BASE_URL ??
  process.env.CRM_API_URL ??
  process.env.CLOUDSHOP_API_URL;
const catalogPath = process.env.CRM_CATALOG_PATH ?? "product";
const token = process.env.CRM_API_TOKEN ?? process.env.CLOUDSHOP_API_KEY;
const authHeader =
  process.env.CRM_AUTH_HEADER ?? "X-CloudShop-API-Access-Token";
const timeoutMs = Number(process.env.INTEGRATION_REQUEST_TIMEOUT_MS ?? 20_000);

if (!baseUrl || !token) {
  throw new Error(
    "CloudShop is not configured. Set CRM_BASE_URL and CRM_API_TOKEN in .env.local.",
  );
}

const normalize = (value) =>
  String(value ?? "")
    .toLocaleLowerCase("ru-BY")
    .replaceAll("ё", "е")
    .replace(/\s+/g, " ")
    .trim();

const nonBeerAlcohol =
  /(сидр|медовух|вино|винн|лик[её]р|водк|коньяк|виски|джин|шампан|настойк|вермут|текил|бренди)/i;
const nonAlcoholic =
  /(безалкогол|вода|сок|нектар|лимонад|квас|кола|coca.?cola|спрайт|sprite|пепси|pepsi|миринда|7\s?ап|чай|lipton|бонаква|bon.?aqua|энергетик|energy|лит энерджи)/i;
const beer =
  /(пиво|пивн|лагер|эль|стаут|портер|пилсн|pils|ipa|weiss|вайс|бланш|beer|туборг|tuborg)/i;
const draftBeerLocation =
  /(кег|екельчика|гродненская|брест)/i;
const snack =
  /(чипс|сн[еэ]к|сухар|гренк|рыб|кальмар|кревет|анчоус|арахис|фисташ|семеч|орех|джерк|соломк|палочк|кольца|мясн|куриц|свинин|говядин|колбас|печень|мармелад|конфет|драже|жвач|резинк|батончик|морожен|лапша|вермишель)/i;

function classify(item) {
  const name = normalize(item.options?.name);
  const tags = normalize((item.tags ?? []).join(" "));
  const text = `${name} ${tags}`;

  if (nonBeerAlcohol.test(text)) return "other";
  if (nonAlcoholic.test(text) && !/напиток пивн/i.test(text)) {
    return "non-alcoholic";
  }
  if (
    /пиво/i.test(tags) ||
    beer.test(text) ||
    (draftBeerLocation.test(name) &&
      Number(item.price) >= 3 &&
      Number(item.price) <= 12)
  ) {
    return "beer";
  }
  if (
    /сыр/i.test(tags) ||
    /^(сыр|чечил|сулугуни)/i.test(name) ||
    /сыр (спагетти|косичка|копчен|палочк|шарик)/i.test(name)
  ) {
    return "cheese";
  }
  if (snack.test(text) || /сн[еэ]к|чипс/i.test(tags)) return "snacks";
  return "other";
}

function extractVolume(name, category, stock) {
  if (category === "beer" && draftBeerLocation.test(name)) return "1 л";

  const match = normalize(name).match(
    /(?:^|\s)(\d+(?:[.,]\d+)?)\s*(мл|л|литр(?:а|ов)?|г|гр|кг)(?:\b|$)/i,
  );
  if (match) {
    const unit = match[2].startsWith("литр") ? "л" : match[2] === "гр" ? "г" : match[2];
    return `${match[1].replace(".", ",")} ${unit}`;
  }

  const hasFractionalStock = Object.values(stock ?? {}).some(
    (value) => Number(value) > 0 && !Number.isInteger(Number(value)),
  );
  if (hasFractionalStock) return category === "beer" ? "1 л" : "1 кг";
  return undefined;
}

function slugify(value, id) {
  const slug = normalize(value)
    .replace(/[^a-zа-я0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
  return `${slug || "product"}-${String(id).slice(-8)}`;
}

async function fetchPage(offset) {
  const url = new URL(catalogPath.replace(/^\//, ""), baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
  url.searchParams.set("limit", "1000");
  url.searchParams.set("offset", String(offset));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      headers: {
        [authHeader]: token,
        Accept: "application/json",
      },
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`CloudShop returned ${response.status} ${response.statusText}.`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("CloudShop returned an unexpected catalog format.");
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}

const sourceProducts = [];
for (let offset = 0; ; offset += 1000) {
  const page = await fetchPage(offset);
  sourceProducts.push(...page);
  if (page.length < 1000) break;
}

const configuredStockIds = (process.env.CLOUDSHOP_STOCK_IDS ?? "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const discoveredStockIds = [
  ...new Set(sourceProducts.flatMap((item) => Object.keys(item.stock ?? {}))),
].sort();
const stockIds = configuredStockIds.length
  ? configuredStockIds
  : discoveredStockIds.slice(0, 3);
const storeIds = ["center", "east", "south"];

const syncedAt = new Date().toISOString().slice(0, 10);
const products = sourceProducts
  .filter((item) => {
    const name = String(item.options?.name ?? "").trim();
    return name && Object.values(item.stock ?? {}).some((value) => Number(value) > 0);
  })
  .map((item) => {
    const name = String(item.options.name).trim();
    const category = classify(item);
    const storeAvailability = Object.fromEntries(
      storeIds.map((storeId, index) => [
        storeId,
        Number(item.stock?.[stockIds[index]] ?? 0) > 0,
      ]),
    );
    const updatedAt = String(item.updated_at ?? syncedAt)
      .replace(" ", "T")
      .slice(0, 10);
    const volume = extractVolume(name, category, item.stock);
    const price = Number(item.price);

    return {
      id: String(item.id),
      slug: slugify(name, item.id),
      name,
      category,
      ...(volume ? { volume } : {}),
      ...(Number.isFinite(price) && price > 0 ? { price } : {}),
      currency: "BYN",
      storeAvailability,
      updatedAt,
    };
  })
  .sort((a, b) => {
    const categoryOrder = [
      "beer",
      "non-alcoholic",
      "snacks",
      "cheese",
      "other",
    ];
    return (
      categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category) ||
      a.name.localeCompare(b.name, "ru-BY")
    );
  });

const output = `import type { Product } from "./types";

// Generated from CloudShop on ${syncedAt}. Do not edit manually.
export const products: Product[] = ${JSON.stringify(products, null, 2)};

export const beerProducts = products.filter((product) => product.category === "beer");
export const nonAlcoholicProducts = products.filter(
  (product) => product.category === "non-alcoholic",
);
export const snackProducts = products.filter((product) =>
  ["snacks", "cheese", "other"].includes(product.category),
);
`;

fs.writeFileSync(path.join(root, "src/data/products.ts"), output);

const counts = products.reduce((result, product) => {
  result[product.category] = (result[product.category] ?? 0) + 1;
  return result;
}, {});
console.log(
  `CloudShop sync complete: ${products.length} available products from ${sourceProducts.length} total.`,
);
console.log(counts);

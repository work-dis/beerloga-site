import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outputDirectory = path.join(root, "public", "images", "products");
const manifestPath = path.join(root, "src", "data", "product-images.json");
const allowedCategories = new Set(["non-alcoholic", "snacks", "cheese"]);
const userAgent =
  "BeerlogaCatalog/1.0 (https://beerloga-brest.magi522.chatgpt.site)";

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

function normalizeBarcode(value) {
  const digits = String(value ?? "").replace(/\D/g, "").replace(/^0+/, "");
  if (!digits) return "";
  if (digits.length <= 7) return digits.padStart(8, "0");
  if (digits.length >= 9 && digits.length <= 12) {
    return digits.padStart(13, "0");
  }
  return digits;
}

function chunk(values, size) {
  const result = [];
  for (let index = 0; index < values.length; index += size) {
    result.push(values.slice(index, index + size));
  }
  return result;
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

loadEnv(path.join(root, ".env.local"));

const baseUrl =
  process.env.CRM_BASE_URL ??
  process.env.CRM_API_URL ??
  process.env.CLOUDSHOP_API_URL;
const catalogPath = process.env.CRM_CATALOG_PATH ?? "product";
const token = process.env.CRM_API_TOKEN ?? process.env.CLOUDSHOP_API_KEY;
const authHeader =
  process.env.CRM_AUTH_HEADER ?? "X-CloudShop-API-Access-Token";

if (!baseUrl || !token) {
  throw new Error("CloudShop credentials are missing in .env.local.");
}

const { products: currentProducts } = await import(
  new URL("../src/data/products.ts", import.meta.url)
);
const categoryById = new Map(
  currentProducts.map((product) => [product.id, product.category]),
);

const cloudshopProducts = [];
for (let offset = 0; ; offset += 1000) {
  const url = new URL(
    catalogPath.replace(/^\//, ""),
    baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`,
  );
  url.searchParams.set("limit", "1000");
  url.searchParams.set("offset", String(offset));
  const response = await fetch(url, {
    headers: { [authHeader]: token, Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`CloudShop returned ${response.status}.`);
  }
  const page = await response.json();
  if (!Array.isArray(page)) {
    throw new Error("CloudShop returned an unexpected catalog format.");
  }
  cloudshopProducts.push(...page);
  if (page.length < 1000) break;
}

const eligibleBarcodes = [
  ...new Set(
    cloudshopProducts
      .filter((product) => {
        const available = Object.values(product.stock ?? {}).some(
          (value) => Number(value) > 0,
        );
        return available && allowedCategories.has(categoryById.get(String(product.id)));
      })
      .map((product) => normalizeBarcode(product.barcode))
      .filter((barcode) => barcode.length >= 8 && barcode.length <= 14),
  ),
];

console.log(
  `Looking up ${eligibleBarcodes.length} eligible barcodes in Open Food Facts.`,
);

const openFoodFactsProducts = [];
const batches = chunk(eligibleBarcodes, 50);
for (const [index, barcodes] of batches.entries()) {
  const url = new URL("https://world.openfoodfacts.org/api/v2/search");
  url.searchParams.set("code", barcodes.join(","));
  url.searchParams.set("fields", "code,product_name,image_front_url");
  url.searchParams.set("page_size", "50");
  url.searchParams.set("sort_by", "nothing");

  let response;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    response = await fetch(url, {
      headers: { "User-Agent": userAgent, Accept: "application/json" },
    });
    if (response.ok) break;
    if (![429, 502, 503, 504].includes(response.status) || attempt === 4) {
      throw new Error(`Open Food Facts returned ${response.status}.`);
    }
    await delay(attempt * 8_000);
  }
  const data = await response.json();
  openFoodFactsProducts.push(...(data.products ?? []));
  console.log(`Open Food Facts batch ${index + 1}/${batches.length} complete.`);
  if (index < batches.length - 1) await delay(7_000);
}

fs.mkdirSync(outputDirectory, { recursive: true });

const imageCandidates = new Map();
for (const product of openFoodFactsProducts) {
  const barcode = normalizeBarcode(product.code);
  if (barcode && product.image_front_url) {
    imageCandidates.set(barcode, product.image_front_url);
  }
}

const images = {};
const candidates = [...imageCandidates.entries()];
let cursor = 0;
let downloaded = 0;

async function worker() {
  while (cursor < candidates.length) {
    const current = cursor++;
    const [barcode, imageUrl] = candidates[current];
    const filename = `${barcode}.webp`;
    const target = path.join(outputDirectory, filename);
    try {
      if (!fs.existsSync(target)) {
        const response = await fetch(imageUrl, {
          headers: { "User-Agent": userAgent },
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const contentType = response.headers.get("content-type") ?? "";
        if (!contentType.startsWith("image/")) {
          throw new Error(`Unexpected content type ${contentType}`);
        }
        const source = Buffer.from(await response.arrayBuffer());
        await sharp(source)
          .rotate()
          .resize({
            width: 600,
            height: 600,
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({ quality: 82 })
          .toFile(target);
        downloaded += 1;
      }
      images[barcode] = `/images/products/${filename}`;
    } catch (error) {
      console.warn(`Skipped ${barcode}: ${error.message}`);
    }
  }
}

await Promise.all(Array.from({ length: 6 }, () => worker()));

fs.writeFileSync(
  manifestPath,
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      source: "https://world.openfoodfacts.org/",
      license: "CC BY-SA",
      images,
    },
    null,
    2,
  )}\n`,
);

console.log(
  `Image sync complete: ${Object.keys(images).length} matched, ${downloaded} downloaded.`,
);

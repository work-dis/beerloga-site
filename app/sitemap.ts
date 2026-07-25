import type { MetadataRoute } from "next";
import { SITE_URL } from "@/src/lib/metadata";

const routes = [
  "",
  "/assortment",
  "/assortment/beer",
  "/assortment/non-alcoholic",
  "/assortment/snacks",
  "/stores",
  "/about",
  "/contacts",
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date("2026-07-26"),
    changeFrequency: route.startsWith("/assortment") ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/stores" ? 0.9 : 0.7,
  }));
}

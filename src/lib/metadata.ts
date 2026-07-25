import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://beerloga.by";

export function createMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const url = new URL(path, SITE_URL).toString();
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "БИРЛОГА",
      locale: "ru_BY",
      type: "website",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "БИРЛОГА" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
  };
}

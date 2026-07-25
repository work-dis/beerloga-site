import type { Metadata, Viewport } from "next";
import { Manrope, PT_Serif } from "next/font/google";
import { Footer, Header, MobileActionBar } from "@/src/components/SiteChrome";
import { SITE_URL } from "@/src/lib/metadata";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["cyrillic", "latin"],
  display: "swap",
});

const ptSerif = PT_Serif({
  variable: "--font-serif",
  subsets: ["cyrillic", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "БИРЛОГА — магазины напитков и закусок в Бресте",
    template: "%s | БИРЛОГА",
  },
  description:
    "Информационный сайт физических магазинов напитков и закусок БИРЛОГА в Бресте.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#121212",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className={`${manrope.variable} ${ptSerif.variable}`}>
        <a className="skip-link" href="#main-content">
          Перейти к содержанию
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <MobileActionBar />
      </body>
    </html>
  );
}

import { PageIntro } from "@/src/components/PageIntro";
import { StoreGrid } from "@/src/components/StoreCards";
import { stores } from "@/src/data/stores";
import { createMetadata } from "@/src/lib/metadata";

export const metadata = createMetadata(
  "Магазины в Бресте",
  "Адреса, телефоны, режим работы и маршруты к физическим магазинам БИРЛОГА в Бресте.",
  "/stores",
);

const structuredData = {
  "@context": "https://schema.org",
  "@graph": stores.map((store) => ({
    "@type": ["LocalBusiness", "Store"],
    name: `БИРЛОГА — ${store.name}`,
    telephone: store.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: store.address,
      addressLocality: "Брест",
      addressCountry: "BY",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: store.opens,
      closes: store.closes,
    },
  })),
};

export default function StoresPage() {
  return (
    <div className="container">
      <PageIntro
        eyebrow="Физические торговые объекты"
        title="Магазины в Бресте"
        description="Выберите удобный адрес, уточните режим работы и постройте маршрут."
      />
      <p className="demo-banner">
        Контакты сверены по открытым справочникам 26 июля 2026 года. В праздники
        режим работы может отличаться — уточняйте его по телефону.
      </p>
      <section className="section section--catalog" aria-labelledby="store-list-title">
        <h2 id="store-list-title" className="sr-only">Список магазинов</h2>
        <StoreGrid />
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </div>
  );
}

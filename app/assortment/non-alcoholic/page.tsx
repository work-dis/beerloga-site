import { CatalogClient } from "@/src/components/CatalogClient";
import { PageIntro } from "@/src/components/PageIntro";
import { nonAlcoholicProducts } from "@/src/data/products";
import { createMetadata } from "@/src/lib/metadata";

export const metadata = createMetadata(
  "Безалкогольные напитки",
  "Справочная информация о безалкогольных напитках в физических магазинах БИРЛОГА.",
  "/assortment/non-alcoholic",
);

export default function NonAlcoholicPage() {
  return (
    <div className="container">
      <PageIntro
        eyebrow="Безалкогольное"
        title="Безалкогольные напитки"
        description="Демонстрационный ассортимент и наличие в выбранном магазине."
      />
      <section className="section section--catalog">
        <CatalogClient products={nonAlcoholicProducts} />
      </section>
    </div>
  );
}

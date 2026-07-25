import { CatalogClient } from "@/src/components/CatalogClient";
import { PageIntro } from "@/src/components/PageIntro";
import { snackProducts } from "@/src/data/products";
import { createMetadata } from "@/src/lib/metadata";

export const metadata = createMetadata(
  "Снеки и закуски",
  "Справочная информация о снеках, сырах и прочих товарах в физических магазинах БИРЛОГА.",
  "/assortment/snacks",
);

export default function SnacksPage() {
  return (
    <div className="container">
      <PageIntro
        eyebrow="Снеки и закуски"
        title="Снеки, сыры и прочее"
        description="Демонстрационный ассортимент и наличие в выбранном магазине."
      />
      <section className="section section--catalog">
        <CatalogClient products={snackProducts} allowCategory />
      </section>
    </div>
  );
}

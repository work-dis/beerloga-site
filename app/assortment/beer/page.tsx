import { BeerAdvertisingSection } from "@/src/components/BeerLegal";
import { CatalogClient } from "@/src/components/CatalogClient";
import { beerProducts } from "@/src/data/products";
import { createMetadata } from "@/src/lib/metadata";

export const metadata = createMetadata(
  "Ассортимент пива 18+",
  "Справочная информация о демонстрационном ассортименте пива 18+, ценах и наличии в физических магазинах БИРЛОГА.",
  "/assortment/beer",
);

export default function BeerPage() {
  return (
    <div className="container beer-page">
      <BeerAdvertisingSection />
      <section className="section section--catalog" aria-labelledby="beer-catalog-title">
        <h2 id="beer-catalog-title" className="catalog-title">
          Каталог
        </h2>
        <CatalogClient products={beerProducts} />
      </section>
    </div>
  );
}

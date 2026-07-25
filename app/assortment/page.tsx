import { CatalogClient } from "@/src/components/CatalogClient";
import { CategoryNavigation } from "@/src/components/CategoryNavigation";
import { PageIntro } from "@/src/components/PageIntro";
import { products } from "@/src/data/products";
import { createMetadata } from "@/src/lib/metadata";

export const metadata = createMetadata(
  "Ассортимент напитков и закусок",
  "Нейтральная справочная информация об ассортименте физических магазинов БИРЛОГА в Бресте.",
  "/assortment",
);

export default function AssortmentPage() {
  return (
    <>
      <div className="container">
        <PageIntro
          eyebrow="Каталог без онлайн-заказа"
          title="Ассортимент напитков и закусок"
          description="Поиск по демонстрационному ассортименту, ценам и наличию в выбранном физическом магазине."
        />
      </div>
      <CategoryNavigation />
      <section className="section section--catalog">
        <div className="container">
          <CatalogClient products={products} allowCategory />
        </div>
      </section>
    </>
  );
}

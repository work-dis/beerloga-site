import { CalendarClock, Phone } from "lucide-react";
import type { Product } from "@/src/data/types";
import { stores } from "@/src/data/stores";

const categoryLabels = {
  beer: "Пиво 18+",
  "non-alcoholic": "Безалкогольное",
  snacks: "Снеки",
  cheese: "Сыры",
  other: "Прочее",
};

export function ProductCard({
  product,
  storeId = "center",
}: {
  product: Product;
  storeId?: string;
}) {
  const available = product.storeAvailability[storeId] ?? false;
  const selectedStore = stores.find((store) => store.id === storeId) ?? stores[0];
  return (
    <article className="product-card">
      <div className={`product-visual product-visual--${product.category}`}>
        <span className="product-visual__package" aria-hidden="true">
          {product.name.slice(0, 1)}
        </span>
        <span className="sr-only">
          Нейтральное изображение упаковки товара «{product.name}»
        </span>
      </div>
      <div className="product-card__body">
        <p className="eyebrow">{categoryLabels[product.category]}</p>
        <h3>{product.name}</h3>
        <dl className="product-facts">
          {product.producer && (
            <>
              <dt>Производитель</dt>
              <dd>{product.producer}</dd>
            </>
          )}
          {product.country && (
            <>
              <dt>Страна</dt>
              <dd>{product.country}</dd>
            </>
          )}
          {product.style && (
            <>
              <dt>Вид</dt>
              <dd>{product.style}</dd>
            </>
          )}
          {typeof product.abv === "number" && (
            <>
              <dt>Крепость</dt>
              <dd>{product.abv.toLocaleString("ru-BY")}%</dd>
            </>
          )}
          {product.volume && (
            <>
              <dt>Объём</dt>
              <dd>{product.volume}</dd>
            </>
          )}
        </dl>
        {typeof product.price === "number" && (
          <p className="price">
            {product.price.toFixed(2).replace(".", ",")} <span>руб.</span>
          </p>
        )}
        <p className={`stock ${available ? "stock--yes" : "stock--no"}`}>
          <span aria-hidden="true" />
          {available
            ? `Есть в наличии: ${selectedStore.name}`
            : `Нет в наличии: ${selectedStore.name}`}
        </p>
        <p className="updated">
          <CalendarClock aria-hidden="true" />
          Обновлено {new Date(product.updatedAt).toLocaleDateString("ru-BY")}
        </p>
        <a
          className="button button--outline button--full"
          href={`tel:${selectedStore.phone.replace(/\D/g, "")}`}
        >
          <Phone aria-hidden="true" />
          Уточнить наличие
        </a>
      </div>
    </article>
  );
}

export function ProductGrid({
  products,
  storeId,
}: {
  products: Product[];
  storeId?: string;
}) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} storeId={storeId} />
      ))}
    </div>
  );
}

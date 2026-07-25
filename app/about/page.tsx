import { PageIntro } from "@/src/components/PageIntro";
import { createMetadata } from "@/src/lib/metadata";

export const metadata = createMetadata(
  "О компании",
  "Информация о назначении сети физических магазинов БИРЛОГА в Бресте.",
  "/about",
);

export default function AboutPage() {
  return (
    <div className="container">
      <PageIntro
        eyebrow="О компании"
        title="БИРЛОГА — информационный сайт сети магазинов"
        description="Сайт помогает найти физический магазин и заранее посмотреть справочную информацию об ассортименте."
      />
      <section className="section prose-grid">
        <article>
          <h2>Что доступно на сайте</h2>
          <p>
            Адреса, режим работы, телефоны, маршруты, категории товаров,
            ориентировочные цены и наличие в выбранном магазине.
          </p>
        </article>
        <article>
          <h2>Чего на сайте нет</h2>
          <p>
            Нет корзины, онлайн-заказа, оплаты, доставки, бронирования или личного
            кабинета. Продажа производится только в физических торговых объектах.
          </p>
        </article>
        <article>
          <h2>Актуальность информации</h2>
          <p>
            Данные обновляются вручную. Перед поездкой наличие и цену следует
            уточнить по телефону выбранного магазина.
          </p>
        </article>
      </section>
    </div>
  );
}

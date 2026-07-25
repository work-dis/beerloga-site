import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, ShieldCheck } from "lucide-react";
import { CategoryNavigation } from "@/src/components/CategoryNavigation";
import { ProductGrid } from "@/src/components/ProductCards";
import { StoreGrid } from "@/src/components/StoreCards";
import { beerProducts, nonAlcoholicProducts, snackProducts } from "@/src/data/products";
import { createMetadata } from "@/src/lib/metadata";

export const metadata = createMetadata(
  "БИРЛОГА — магазины напитков и закусок в Бресте",
  "Адреса, режим работы и актуальный ассортимент физических магазинов напитков и закусок БИРЛОГА в Бресте.",
  "/",
);

export default function Home() {
  const featured = [beerProducts[2], nonAlcoholicProducts[0], snackProducts[0]];
  return (
    <>
      <section className="hero">
        <Image
          className="hero__image"
          src="/images/store-interior.webp"
          alt="Пустой интерьер магазина напитков и закусок"
          fill
          priority
          unoptimized
          sizes="100vw"
        />
        <div className="hero__shade" aria-hidden="true" />
        <div className="container hero__content">
          <p className="eyebrow">Сеть физических магазинов · Брест</p>
          <h1>БИРЛОГА — магазины напитков и закусок в Бресте</h1>
          <p>Адреса, режим работы и актуальный ассортимент магазинов</p>
          <div className="hero__actions">
            <Link className="button button--accent" href="/stores">
              <MapPin aria-hidden="true" />
              Выбрать магазин
            </Link>
            <Link className="button button--outline" href="/assortment">
              Посмотреть ассортимент
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <p className="hero__notice">
            <ShieldCheck aria-hidden="true" />
            Информация без онлайн-заказа, доставки и оплаты
          </p>
        </div>
      </section>

      <CategoryNavigation />

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Справочная информация</p>
              <h2>Часть ассортимента</h2>
            </div>
            <Link className="text-link" href="/assortment">
              Весь ассортимент <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <ProductGrid products={featured} />
          <p className="legal-inline">
            Цены и наличие обновляются по данным CloudShop; перед поездкой их
            можно уточнить в выбранном магазине. Продажа осуществляется только в
            физических торговых объектах.
          </p>
        </div>
      </section>

      <section className="section section--surface">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Брест</p>
              <h2>Наши магазины</h2>
            </div>
            <Link className="text-link" href="/stores">
              Все магазины <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <StoreGrid limit={3} />
        </div>
      </section>

      <section className="section">
        <div className="container info-band">
          <div>
            <p className="eyebrow">Важно знать</p>
            <h2>Информационный сайт сети магазинов</h2>
          </div>
          <p>
            Здесь можно посмотреть категории товаров, ориентировочные цены,
            наличие, адреса и контакты. Оформить заказ, оплатить товар или заказать
            доставку на сайте нельзя.
          </p>
        </div>
      </section>
    </>
  );
}

import { ShieldAlert } from "lucide-react";

export function BeerLegalWarning() {
  return (
    <div className="beer-warning" data-testid="beer-legal-warning" role="note">
      <ShieldAlert aria-hidden="true" />
      <div>
        <strong>18+</strong>
        <p>ЧРЕЗМЕРНОЕ УПОТРЕБЛЕНИЕ ПИВА ВРЕДИТ ЗДОРОВЬЮ</p>
      </div>
    </div>
  );
}

export function BeerAdvertisingSection() {
  return (
    <section
      className="beer-advertising"
      data-testid="beer-advertising-section"
      aria-labelledby="beer-page-title"
    >
      <div className="beer-advertising__copy">
        <p className="eyebrow">Информационный каталог · 18+</p>
        <h1 id="beer-page-title">Ассортимент пива 18+</h1>
        <p>
          Нейтральная справочная информация о товарах, ценах и наличии в
          выбранном физическом магазине. Онлайн-заказ отсутствует.
        </p>
      </div>
      <BeerLegalWarning />
    </section>
  );
}

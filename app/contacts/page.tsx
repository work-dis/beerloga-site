import { Mail, MapPin, Phone } from "lucide-react";
import { PageIntro } from "@/src/components/PageIntro";
import { createMetadata } from "@/src/lib/metadata";

export const metadata = createMetadata(
  "Контакты",
  "Телефоны и адреса физических магазинов БИРЛОГА в Бресте.",
  "/contacts",
);

export default function ContactsPage() {
  return (
    <div className="container">
      <PageIntro
        eyebrow="Контакты"
        title="Связаться с БИРЛОГОЙ"
        description="Позвоните в магазин или выберите адрес для построения маршрута."
      />
      <section className="section contact-grid">
        <a href="tel:+375295034751">
          <Phone aria-hidden="true" />
          <span>Жукова и Гродненская</span>
          <strong>+375 29 503-47-51</strong>
        </a>
        <a href="tel:+375298228991">
          <Phone aria-hidden="true" />
          <span>Екельчика</span>
          <strong>+375 29 822-89-91</strong>
        </a>
        <article>
          <Mail aria-hidden="true" />
          <span>Электронная почта</span>
          <strong>Публичный email не опубликован</strong>
        </article>
        <a href="/stores">
          <MapPin aria-hidden="true" />
          <span>Адреса</span>
          <strong>Посмотреть магазины</strong>
        </a>
      </section>
    </div>
  );
}

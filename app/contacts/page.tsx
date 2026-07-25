import { Mail, MapPin, Phone } from "lucide-react";
import { PageIntro } from "@/src/components/PageIntro";
import { createMetadata } from "@/src/lib/metadata";

export const metadata = createMetadata(
  "Контакты",
  "Демонстрационные контакты сети физических магазинов БИРЛОГА в Бресте.",
  "/contacts",
);

export default function ContactsPage() {
  return (
    <div className="container">
      <PageIntro
        eyebrow="Контакты"
        title="Связаться с БИРЛОГОЙ"
        description="Контакты ниже демонстрационные и должны быть заменены перед публикацией."
      />
      <section className="section contact-grid">
        <a href="tel:+375000000000">
          <Phone aria-hidden="true" />
          <span>Телефон</span>
          <strong>+375 00 000-00-00</strong>
        </a>
        <a href="mailto:info@example.by">
          <Mail aria-hidden="true" />
          <span>Электронная почта</span>
          <strong>info@example.by</strong>
        </a>
        <a href="/stores">
          <MapPin aria-hidden="true" />
          <span>Адреса</span>
          <strong>Посмотреть магазины</strong>
        </a>
      </section>
    </div>
  );
}

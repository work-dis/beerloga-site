import Image from "next/image";
import { Clock3, MapPin, Navigation, Phone } from "lucide-react";
import { stores } from "@/src/data/stores";

export function StoreGrid({ limit }: { limit?: number }) {
  const visibleStores = typeof limit === "number" ? stores.slice(0, limit) : stores;
  return (
    <div className="store-grid">
      {visibleStores.map((store) => (
        <article className="store-card" key={store.id}>
          <div className="store-card__image">
            <Image
              src={store.image ?? "/images/store-interior.webp"}
              alt={`Пустой интерьер: ${store.name}`}
              fill
              unoptimized
              sizes="(max-width: 767px) 100vw, 33vw"
            />
          </div>
          <div className="store-card__body">
            <h3>{store.name}</h3>
            <p>
              <MapPin aria-hidden="true" />
              {store.address}
            </p>
            <p>
              <Clock3 aria-hidden="true" />
              {store.openingHours}
            </p>
            <p className="availability">
              <span aria-hidden="true" />
              Статус уточняется по телефону
            </p>
            <div className="store-card__actions">
              <a className="button button--outline" href={`tel:${store.phone.replace(/\D/g, "")}`}>
                <Phone aria-hidden="true" />
                Позвонить
              </a>
              <a
                className="button button--outline"
                href={store.mapUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Navigation aria-hidden="true" />
                Построить маршрут
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

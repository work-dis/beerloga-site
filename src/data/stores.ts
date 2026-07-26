import type { Store } from "./types";

export const stores: Store[] = [
  {
    id: "center",
    name: "Магазин на Жукова",
    address: "г. Брест, ул. Жукова, 5/1",
    phone: "+375 29 503-47-51",
    openingHours: "Ежедневно, 12:00–01:00",
    opens: "12:00",
    closes: "01:00",
    mapUrl: "https://yandex.by/maps/?text=Брест%2C%20улица%20Жукова%2C%205%2F1",
    image: "/images/store-interior.webp",
  },
  {
    id: "east",
    name: "Магазин на Гродненской",
    address: "г. Брест, ул. Гродненская, 32/1",
    phone: "+375 29 503-47-51",
    openingHours: "Ежедневно, 10:00–22:00",
    opens: "10:00",
    closes: "22:00",
    mapUrl: "https://yandex.by/maps/org/birloga/14529082097/",
    image: "/images/store-interior.webp",
  },
  {
    id: "south",
    name: "Магазин на Екельчика",
    address: "г. Брест, ул. Екельчика, 17А",
    phone: "+375 29 822-89-91",
    openingHours: "Ежедневно, 10:00–23:00",
    opens: "10:00",
    closes: "23:00",
    mapUrl: "https://yandex.by/maps/org/birloga/86173104598/",
    image: "/images/store-interior.webp",
  },
];

import type { Store } from "./types";

// TODO: Все адреса, телефоны, координаты и ссылки ниже демонстрационные.
// Перед публикацией их необходимо заменить подтверждёнными данными магазинов.
export const stores: Store[] = [
  {
    id: "center",
    name: "Магазин в центре",
    address: "г. Брест, демонстрационный адрес, 17А",
    phone: "+375 00 000-00-00",
    openingHours: "Ежедневно, 10:00–22:00",
    coordinates: { latitude: 52.0976, longitude: 23.7341 },
    mapUrl: "https://maps.google.com/?q=Brest%2CBelarus",
    image: "/images/store-interior.webp",
  },
  {
    id: "east",
    name: "Магазин на востоке",
    address: "г. Брест, демонстрационный адрес, 83",
    phone: "+375 00 000-00-01",
    openingHours: "Ежедневно, 10:00–22:00",
    coordinates: { latitude: 52.105, longitude: 23.77 },
    mapUrl: "https://maps.google.com/?q=Brest%2CBelarus",
    image: "/images/store-interior.webp",
  },
  {
    id: "south",
    name: "Магазин на юге",
    address: "г. Брест, демонстрационный адрес, 332/3",
    phone: "+375 00 000-00-02",
    openingHours: "Ежедневно, 09:00–22:00",
    coordinates: { latitude: 52.075, longitude: 23.73 },
    mapUrl: "https://maps.google.com/?q=Brest%2CBelarus",
    image: "/images/store-interior.webp",
  },
];

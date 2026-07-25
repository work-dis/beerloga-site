export type ProductCategory =
  | "beer"
  | "non-alcoholic"
  | "snacks"
  | "cheese"
  | "other";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  producer?: string;
  country?: string;
  style?: string;
  abv?: number;
  volume?: string;
  price?: number;
  currency: "BYN";
  image?: string;
  storeAvailability: Record<string, boolean>;
  updatedAt: string;
};

export type Store = {
  id: string;
  name: string;
  address: string;
  phone: string;
  openingHours: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  mapUrl: string;
  image?: string;
};

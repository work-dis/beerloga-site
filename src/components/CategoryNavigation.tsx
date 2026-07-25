import {
  Beer,
  Box,
  Milk,
  Package,
  Sandwich,
} from "lucide-react";
import Link from "next/link";

const categories = [
  { href: "/assortment/beer", label: "Пиво 18+", icon: Beer },
  { href: "/assortment/non-alcoholic", label: "Безалкогольное", icon: Milk },
  { href: "/assortment/snacks", label: "Снеки", icon: Package },
  { href: "/assortment/snacks?category=cheese", label: "Сыры", icon: Sandwich },
  { href: "/assortment", label: "Прочее", icon: Box },
];

export function CategoryNavigation() {
  return (
    <nav className="category-strip" aria-label="Категории ассортимента">
      <div className="container category-strip__scroller">
        {categories.map(({ href, label, icon: Icon }) => (
          <Link key={label} href={href}>
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

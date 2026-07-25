"use client";

import Link from "next/link";
import {
  MapPin,
  Menu,
  Phone,
  Search,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";

const navigation = [
  { href: "/stores", label: "Магазины" },
  { href: "/assortment", label: "Ассортимент" },
  { href: "/about", label: "О нас" },
  { href: "/contacts", label: "Контакты" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    firstLink.current?.focus();
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open]);

  function closeMenu() {
    setOpen(false);
    window.setTimeout(() => menuButton.current?.focus(), 0);
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <button
          ref={menuButton}
          className="icon-button menu-button"
          type="button"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <Logo />
        <nav className="desktop-nav" aria-label="Основная навигация">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <a className="phone-link" href="tel:+375000000000">
            <Phone aria-hidden="true" />
            <span>+375 00 000-00-00</span>
          </a>
          <Link className="button button--accent button--compact" href="/stores">
            <MapPin aria-hidden="true" />
            Выбрать магазин
          </Link>
        </div>
      </div>
      <nav
        id="mobile-menu"
        className={`mobile-menu ${open ? "mobile-menu--open" : ""}`}
        aria-label="Мобильная навигация"
        hidden={!open}
      >
        <div className="container mobile-menu__inner">
          {navigation.map((item, index) => (
            <Link
              ref={index === 0 ? firstLink : undefined}
              key={item.href}
              href={item.href}
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ))}
          <a href="tel:+375000000000" onClick={closeMenu}>
            Позвонить
          </a>
        </div>
      </nav>
    </header>
  );
}

export function MobileActionBar() {
  return (
    <nav className="mobile-action-bar" aria-label="Быстрые действия">
      <a href="tel:+375000000000">
        <Phone aria-hidden="true" />
        <span>Позвонить</span>
      </a>
      <Link href="/stores">
        <MapPin aria-hidden="true" />
        <span>Маршрут</span>
      </Link>
      <Link href="/assortment">
        <Search aria-hidden="true" />
        <span>Ассортимент</span>
      </Link>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Logo />
          <p className="footer-note">
            Информационный сайт. Продажа осуществляется только в физических
            торговых объектах.
          </p>
        </div>
        <nav aria-label="Разделы сайта">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link href="/privacy">Политика конфиденциальности</Link>
        </nav>
        <div className="footer-contact">
          <a href="tel:+375000000000">+375 00 000-00-00</a>
          <a href="mailto:info@example.by">info@example.by</a>
          <p>Контакты демонстрационные</p>
        </div>
      </div>
    </footer>
  );
}

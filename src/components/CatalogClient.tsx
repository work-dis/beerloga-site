"use client";

import { Filter, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ProductGrid } from "./ProductCards";
import { stores } from "@/src/data/stores";
import type { Product } from "@/src/data/types";

type CatalogClientProps = {
  products: Product[];
  allowCategory?: boolean;
};

function normalize(value: string) {
  return value
    .toLocaleLowerCase("ru-BY")
    .replaceAll("ё", "е")
    .trim()
    .replace(/\s+/g, " ");
}

function initialParam(name: string) {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get(name) ?? "";
}

export function CatalogClient({
  products,
  allowCategory = false,
}: CatalogClientProps) {
  const [query, setQuery] = useState(() => initialParam("q"));
  const [category, setCategory] = useState(() => initialParam("category"));
  const [country, setCountry] = useState(() => initialParam("country"));
  const [strength, setStrength] = useState(() => initialParam("strength"));
  const [volume, setVolume] = useState(() => initialParam("volume"));
  const [storeId, setStoreId] = useState(
    () => initialParam("store") || stores[0].id,
  );
  const [filtersOpen, setFiltersOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);

  const readParams = useCallback(() => {
    setQuery(initialParam("q"));
    setCategory(initialParam("category"));
    setCountry(initialParam("country"));
    setStrength(initialParam("strength"));
    setVolume(initialParam("volume"));
    setStoreId(initialParam("store") || stores[0].id);
  }, []);

  useEffect(() => {
    window.addEventListener("popstate", readParams);
    return () => window.removeEventListener("popstate", readParams);
  }, [readParams]);

  useEffect(() => {
    rootRef.current?.setAttribute("data-hydrated", "true");
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (allowCategory && category) params.set("category", category);
    if (country) params.set("country", country);
    if (strength) params.set("strength", strength);
    if (volume) params.set("volume", volume);
    if (storeId !== stores[0].id) params.set("store", storeId);
    const next = params.size ? `${window.location.pathname}?${params}` : window.location.pathname;
    window.history.replaceState(null, "", next);
  }, [allowCategory, category, country, query, storeId, strength, volume]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (filtersOpen && !dialog.open) dialog.showModal();
    if (!filtersOpen && dialog.open) dialog.close();
  }, [filtersOpen]);

  const countries = useMemo(
    () => [...new Set(products.map((product) => product.country).filter(Boolean))].sort(),
    [products],
  );
  const volumes = useMemo(
    () => [...new Set(products.map((product) => product.volume).filter(Boolean))].sort(),
    [products],
  );

  const filtered = useMemo(() => {
    const normalizedQuery = normalize(query);
    return products.filter((product) => {
      const haystack = normalize(
        [product.name, product.producer, product.country, product.style]
          .filter(Boolean)
          .join(" "),
      );
      const matchQuery = !normalizedQuery || haystack.includes(normalizedQuery);
      const matchCategory = !category || product.category === category;
      const matchCountry = !country || product.country === country;
      const matchVolume = !volume || product.volume === volume;
      const matchStrength =
        !strength ||
        (strength === "zero" && product.abv === 0) ||
        (strength === "light" &&
          typeof product.abv === "number" &&
          product.abv > 0 &&
          product.abv < 5) ||
        (strength === "strong" &&
          typeof product.abv === "number" &&
          product.abv >= 5);
      return matchQuery && matchCategory && matchCountry && matchVolume && matchStrength;
    });
  }, [category, country, products, query, strength, volume]);

  function reset() {
    setQuery("");
    setCategory("");
    setCountry("");
    setStrength("");
    setVolume("");
    setStoreId(stores[0].id);
  }

  function closeFilters() {
    setFiltersOpen(false);
    window.setTimeout(() => filterButtonRef.current?.focus(), 0);
  }

  const controls = (
    <>
      {allowCategory && (
        <label>
          <span>Категория</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">Все категории</option>
            <option value="beer">Пиво 18+</option>
            <option value="non-alcoholic">Безалкогольное</option>
            <option value="snacks">Снеки</option>
            <option value="cheese">Сыры</option>
            <option value="other">Прочее</option>
          </select>
        </label>
      )}
      <label>
        <span>Страна</span>
        <select value={country} onChange={(event) => setCountry(event.target.value)}>
          <option value="">Все страны</option>
          {countries.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </label>
      <label>
        <span>Крепость</span>
        <select value={strength} onChange={(event) => setStrength(event.target.value)}>
          <option value="">Любая</option>
          <option value="zero">0%</option>
          <option value="light">До 5%</option>
          <option value="strong">5% и выше</option>
        </select>
      </label>
      <label>
        <span>Объём</span>
        <select value={volume} onChange={(event) => setVolume(event.target.value)}>
          <option value="">Любой</option>
          {volumes.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </label>
      <label>
        <span>Магазин</span>
        <select value={storeId} onChange={(event) => setStoreId(event.target.value)}>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>{store.name}</option>
          ))}
        </select>
      </label>
    </>
  );

  return (
    <div ref={rootRef} className="catalog-client" data-testid="catalog-client">
      <div className="catalog-toolbar">
        <label className="search-field">
          <span>Поиск по названию</span>
          <span className="search-field__control">
            <Search aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Например, пшеничное"
            />
          </span>
        </label>
        <button
          ref={filterButtonRef}
          className="button button--outline mobile-filter-button"
          type="button"
          onClick={() => setFiltersOpen(true)}
          aria-haspopup="dialog"
        >
          <Filter aria-hidden="true" />
          Фильтры
        </button>
        <div className="desktop-filters">{controls}</div>
        <button className="button button--ghost reset-button" type="button" onClick={reset}>
          <RotateCcw aria-hidden="true" />
          Сбросить
        </button>
      </div>

      <dialog
        ref={dialogRef}
        className="filter-dialog"
        aria-labelledby="filter-dialog-title"
        onCancel={(event) => {
          event.preventDefault();
          closeFilters();
        }}
        onClose={() => {
          setFiltersOpen(false);
          filterButtonRef.current?.focus();
        }}
      >
        <div className="filter-dialog__head">
          <h2 id="filter-dialog-title">
            <SlidersHorizontal aria-hidden="true" />
            Фильтры
          </h2>
          <button className="icon-button" type="button" onClick={closeFilters} aria-label="Закрыть фильтры">
            <X aria-hidden="true" />
          </button>
        </div>
        <div className="filter-dialog__controls">{controls}</div>
        <div className="filter-dialog__actions">
          <button className="button button--ghost" type="button" onClick={reset}>
            Сбросить
          </button>
          <button className="button button--accent" type="button" onClick={closeFilters}>
            Показать {filtered.length}
          </button>
        </div>
      </dialog>

      <div className="catalog-results">
        <p className="result-count" aria-live="polite">
          Найдено: <strong>{filtered.length}</strong>
        </p>
        {filtered.length > 0 ? (
          <ProductGrid products={filtered} storeId={storeId} />
        ) : (
          <div className="empty-state">
            <Search aria-hidden="true" />
            <h2>Ничего не найдено</h2>
            <p>Измените запрос или сбросьте выбранные фильтры.</p>
            <button className="button button--accent" type="button" onClick={reset}>
              Очистить фильтры
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

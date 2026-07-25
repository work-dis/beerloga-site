import { expect, test } from "@playwright/test";

const controlViewports = [
  { width: 320, height: 568 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
];

test("warning occupies at least 10% of the defined advertising block", async ({
  page,
}) => {
  for (const viewport of controlViewports) {
    await page.setViewportSize(viewport);
    await page.goto("/assortment/beer");
    const advertising = await page
      .getByTestId("beer-advertising-section")
      .boundingBox();
    const warning = await page.getByTestId("beer-legal-warning").boundingBox();
    expect(advertising, JSON.stringify(viewport)).not.toBeNull();
    expect(warning, JSON.stringify(viewport)).not.toBeNull();
    const ratio =
      (warning!.width * warning!.height) /
      (advertising!.width * advertising!.height);
    expect(ratio, `${viewport.width}×${viewport.height}: ${ratio}`).toBeGreaterThanOrEqual(
      0.1,
    );
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, JSON.stringify(viewport)).toBeLessThanOrEqual(1);
  }
});

test("search, URL sync, empty state, reset and store selection work", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("/assortment/beer");
  await expect(page.getByTestId("catalog-client")).toHaveAttribute(
    "data-hydrated",
    "true",
  );
  const search = page.getByLabel("Поиск по названию");
  await search.fill("   ПШЕНИЧНОЕ   ");
  await expect(page.getByText("Найдено:").locator("strong")).toHaveText("1");
  await expect(page).toHaveURL(/q=%D0%9F%D0%A8%D0%95%D0%9D%D0%98%D0%A7%D0%9D%D0%9E%D0%95/i);

  await search.fill("отсутствующий товар");
  await expect(page.getByRole("heading", { name: "Ничего не найдено" })).toBeVisible();
  await expect(page.getByTestId("beer-legal-warning")).toBeVisible();
  await page.getByRole("button", { name: "Очистить фильтры" }).click();
  await expect(page.getByText("Найдено:").locator("strong")).toHaveText("4");

  const store = page.locator(".desktop-filters").getByLabel("Магазин");
  await store.selectOption("south");
  await expect(page).toHaveURL(/store=south/);
});

test("mobile menu and filter dialog return focus", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/assortment/beer");

  const menu = page.getByRole("button", { name: "Открыть меню" });
  await menu.click();
  await expect(page.getByRole("navigation", { name: "Мобильная навигация" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();

  const filters = page.getByRole("button", { name: "Фильтры" });
  await filters.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Закрыть фильтры" }).click();
  await expect(filters).toBeFocused();
});

test("interactive elements do not expose forbidden sales calls to action", async ({
  page,
}) => {
  for (const path of ["/", "/assortment", "/assortment/beer"]) {
    await page.goto(path);
    const labels = await page.locator("a,button").allTextContents();
    expect(labels.join(" ")).not.toMatch(/\b(Купить|Заказать|В корзину|Оплатить)\b/i);
  }
});

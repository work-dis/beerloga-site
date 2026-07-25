import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container not-found">
      <p className="eyebrow">Ошибка 404</p>
      <h1>Страница не найдена</h1>
      <p>Возможно, адрес изменился или был введён с ошибкой.</p>
      <Link className="button button--accent" href="/">Вернуться на главную</Link>
    </div>
  );
}

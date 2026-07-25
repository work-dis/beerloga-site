import Link from "next/link";

export function Logo() {
  return (
    <Link className="brand" href="/" aria-label="БИРЛОГА — на главную">
      <span className="brand__name">БИРЛОГА</span>
      <span className="brand__tagline">напитки и закуски</span>
    </Link>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/", label: "Start" },
  { href: "/shop", label: "Shop" },
  { href: "/konfigurator", label: "Mix & Match" },
  { href: "/standorte", label: "Standorte" },
  { href: "/ueber-uns", label: "Über uns" },
];

// Seiten mit dunklem Hero -> Header startet transparent
const TRANSPARENT = ["/", "/ueber-uns"];

export function SiteHeader() {
  const pathname = usePathname();
  const startSolid = !TRANSPARENT.includes(pathname);
  const [solid, setSolid] = useState(startSolid);
  const [open, setOpen] = useState(false);

  // transparent -> solide beim Scrollen (>40px); feste Seiten immer solide
  useEffect(() => {
    if (startSolid) {
      setSolid(true);
      return;
    }
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [startSolid, pathname]);

  // Menü bei Seitenwechsel schließen
  useEffect(() => {
    setOpen(false);
    document.body.style.overflow = "";
  }, [pathname]);

  const close = () => {
    setOpen(false);
    document.body.style.overflow = "";
  };

  return (
    <header className={`site-head${solid ? " is-solid" : ""}`}>
      <Link href="/" className="brand" onClick={close}>
        RIEGEL <span className="sep">·</span> <b>INTERIOR</b>
      </Link>
      <button
        className={`nav-toggle${open ? " open" : ""}`}
        aria-label="Menü"
        aria-expanded={open}
        onClick={() => {
          const next = !open;
          setOpen(next);
          document.body.style.overflow = next ? "hidden" : "";
        }}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <nav className={`nav${open ? " open" : ""}`}>
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={pathname === l.href ? "active" : ""}
            onClick={close}
          >
            {l.label}
          </Link>
        ))}
        <Link href="/shop" className="nav-shop" onClick={close}>
          Jetzt entdecken
        </Link>
      </nav>
    </header>
  );
}

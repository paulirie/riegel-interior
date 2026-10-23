# Riegel Interior — Website (Entwurf)

Entwurf einer neuen Website für **Riegel Interior**, das Einrichtungshaus der Familie Riegel
(Wesel · Recklinghausen · Haltern am See). Ersetzen soll sie den bestehenden Auftritt unter
riegel-interior.de.

## Stack

- **Next.js 16** (App Router, Turbopack) · React 19 · TypeScript
- **Kein Tailwind** — das Designsystem (`luxe.css` aus dem Design-Handoff) liegt vollständig
  in [`src/app/globals.css`](src/app/globals.css)
- Schriften: Cormorant Garamond (Serif) + Jost (Sans) über `next/font`
- Bilder über `next/image`; Quelldateien als optimierte JPEGs in `public/img/`

Gestaltung: editorial, warm-monochrom, kantig (`border-radius: 0`), Scroll-Reveal über
`[data-reveal]` / `.reveal-lines` und einen IntersectionObserver.

## Entwicklung

```bash
npm install
npm run dev     # http://localhost:3100
```

```bash
npm run build   # Produktions-Build
```

## Seiten

| Route | Inhalt |
| --- | --- |
| `/` | Startseite: Hero, Philosophie, Manufaktur-Video, Kategorien, Mix & Match, Hölzer, Standorte, Instagram |
| `/shop` | Produktraster mit Filter und ausklappbaren Details |
| `/konfigurator` | Mix & Match — Tischplatte, Ölung, Gestell, Spachtelung; Preis wird live berechnet |
| `/standorte` | Flagship Wesel plus Recklinghausen und Haltern am See |
| `/ueber-uns` | Geschichte, Manufaktur, Werte, Generationen |

## Aufbau

```
src/
  app/            Routen (App Router) + globals.css
  components/     SiteHeader, SiteFooter, ScrollReveal, ImageSlot,
                  Configurator, ShopGrid, ManufakturVideo
  data/            site.ts — Produktdaten und Shop-Filter
public/img/       Fotos der Standorte und des Sortiments
```

`ImageSlot` rendert ohne `src` eine Platzhalterfläche und mit `src` das Foto über `next/image` —
so lassen sich fehlende Bilder sofort erkennen.

## Offene Punkte vor dem Go-live

- **Shop-Daten** in `src/data/site.ts` sind Beispielwerte — echte Artikel, Preise und Maße fehlen.
- **Foto Haltern am See** fehlt; dort steht ein Platzhalter aus dem Archiv (`TODO` im Code).
- **Impressum, Datenschutz und AGB** existieren noch nicht; der Footer führt sie bisher nur als Text.

## Bilder

Die Fotos sind Eigentum von Riegel Interior und nur für dieses Projekt bestimmt.
Neue Aufnahmen werden so auf Web-Größe gebracht:

```bash
sips -s format jpeg -Z 1800 -s formatOptions 58 original.JPG --out public/img/name.jpg
```

WebP erzeugt `next/image` beim Ausliefern (macOS' `sips` kann das nicht).

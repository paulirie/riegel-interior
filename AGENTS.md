<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Riegel Interior — Regeln für das Sortiment

### Jedes neue Produkt braucht seinen Standort aus der Anzeige

Die Quelle für das Sortiment ist das Kleinanzeigen-Profil `riegel-interior`.
Wenn ein Produkt nach `src/data/site.ts` kommt, wird der Standort **aus dem
Text der Anzeige gelesen**, nicht geschätzt und nicht von der Übersichtsseite
übernommen — die Übersicht zeigt oft den Firmensitz, nicht den Markt.

Im Anzeigentext steht er in den ersten Zeilen, in wechselnder Form:

```
**Sofort verfügbar in Wesel**
**Sofort verfügbar in Schermbeck**
Verfügbar im Lagerverkauf Schermbeck
✨ Sofort verfügbar bei RIEGEL INTERIOR in Haltern am SEE ✨
VERFÜGBAR bei Riegel Interior in Recklinghausen und Haltern am SEE
**Bestellbar in Wesel**
```

Daraus wird gesetzt:

| Im Anzeigentext | `loc` in site.ts |
|---|---|
| Wesel | `"Wesel"` |
| Schermbeck, Lagerverkauf Schermbeck | `"Lagerverkauf Schermbeck"` |
| Haltern, Haltern am See | `"Haltern am See"` |
| Recklinghausen **und** Haltern | `"Haltern am See"` — Recklinghausen gibt es nicht mehr |
| Dorsten, Düsseldorf, sonstiges | **kein `loc`** — lieber keinen Markt nennen als den falschen |

Steht dort „Bestellbar" statt „Sofort verfügbar", kommt zusätzlich
`bestell: true` dazu.

### Telefonnummer und Verlinkung folgen daraus von selbst

Nichts davon wird in der Produktkarte hart geschrieben. `src/data/kontakt.ts`
hält die drei Märkte mit Nummer und Sprungmarke; `marktFuer(loc)` liefert den
richtigen. Die Karte zeigt dann:

* **„Steht in <Markt>"** — der Markt verlinkt auf `/standorte#wesel`,
  `#schermbeck` oder `#haltern`.
* **„Ganze Anzeige ansehen"** als kräftiger Hauptknopf auf `p.url`.
* **„Anrufen · <Nummer des Marktes>"** als heller Knopf daneben. Sobald in
  `kontakt.ts` eine WhatsApp-Nummer eingetragen ist, wird daraus von selbst
  der WhatsApp-Knopf.

`src/data/kontakt.ts` ist die **einzige** Stelle, an der eine Telefonnummer,
eine Mailadresse oder eine Sprungmarke steht — Produktkarte, Standorte-Seite
und Fußzeile holen sie alle von dort. Wer einen Markt hinzufügt oder eine
Nummer ändert, ändert `kontakt.ts` und setzt den passenden Anker auf
`src/app/standorte/page.tsx`. Eine Nummer gehört nie in `site.ts` und nie in
eine Komponente.

Gegenprobe, muss leer bleiben:

```
grep -rn "0281 147\|02364 50\|tel:+49\|riegel-interior.com" src/ | grep -v src/data/kontakt.ts
```

### Was nicht erfunden wird

* **Hersteller und Modellbezeichnungen** nur, wenn die Anzeige sie nennt.
* **Preis** nur, wenn die Anzeige ihn nennt; sonst `price: null`
  („Preis auf Anfrage").
* Es gibt **keine Online-Bestellung** und **keine Nutzerkonten**. Kein
  Warenkorb, kein Merkzettel, kein „Vorbestellen".


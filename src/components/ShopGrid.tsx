"use client";

import { useState } from "react";
import Link from "next/link";
import { PRODUCTS, FILTERS } from "@/data/site";
import { ImageSlot } from "./ImageSlot";
import { MAIL, marktFuer, type Markt } from "@/data/kontakt";

/**
 * Zweite Schaltfläche der Karte: der direkte Draht in den Markt, in dem das
 * Stück steht.
 *
 * Solange für diesen Markt keine WhatsApp-Nummer bestätigt ist, steht dort
 * "Anrufen" mit seiner Telefonnummer. Sobald in kontakt.ts eine eingetragen
 * ist, wird daraus der WhatsApp-Knopf mit vorausgefüllter Nachricht — damit
 * nicht jeder mit "Hallo?" anfangen muss.
 *
 * Ohne Markt wird KEINE Marktnummer angeboten. Die Karte verschweigt dann
 * ja gerade den Standort; eine Nummer dazuzulegen hieße, jemanden in einen
 * Markt zu schicken, in dem das Stück nicht steht. Stattdessen die Mail.
 */
function frageCta(name: string, markt: Markt | null) {
  const frage = `Hallo! Ich interessiere mich für „${name}“${
    markt ? ` (${markt.kurz})` : ""
  }. Ist das Stück noch da?`;
  if (!markt) {
    return {
      label: "Per Mail fragen",
      aria: `Per Mail nach „${name}“ fragen`,
      href: `mailto:${MAIL}?subject=${encodeURIComponent(`Anfrage: ${name}`)}`,
      extern: false,
    };
  }
  if (markt.whatsapp) {
    return {
      label: `Per WhatsApp fragen · ${markt.kurz}`,
      aria: `${markt.kurz} per WhatsApp wegen „${name}“ fragen (öffnet in neuem Tab)`,
      href: `https://wa.me/${markt.whatsapp}?text=${encodeURIComponent(frage)}`,
      extern: true,
    };
  }
  return {
    label: `Anrufen · ${markt.nummer}`,
    aria: `${markt.kurz} anrufen wegen „${name}“, ${markt.nummer}`,
    href: `tel:${markt.tel}`,
    extern: false,
  };
}

export function ShopGrid() {
  const [active, setActive] = useState("all");
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const shown = PRODUCTS.filter((p) => active === "all" || p.cat === active);

  return (
    <>
      <div className="filters">
        <div className="filters__row">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              className={`chip${active === f.id ? " active" : ""}`}
              onClick={() => setActive(f.id)}
            >
              {f.label} <span className="chip__n">{f.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="wrap">
        {/* key am Raster: beim Filterwechsel montiert React neu, dadurch
            läuft die gestaffelte Einblendung erneut. */}
        <div className="shop-grid" key={active}>
          {shown.map((p, i) => {
            const isOpen = !!open[p.id];
            return (
              <article
                className="prod"
                key={p.id}
                data-cat={p.cat}
                /* nur die ersten Reihen staffeln — sonst wartet Karte 190
                   zwölf Sekunden auf ihren Auftritt */
                style={{ "--i": Math.min(i, 11) } as React.CSSProperties}
              >
                <div className="prod__stage">
                  <ImageSlot
                    src={p.img}
                    alt={`${p.name} — ${p.sub}, bei Riegel Interior`}
                    sizes="(max-width: 620px) 92vw, (max-width: 1000px) 46vw, 31vw"
                    priority={i < 3}
                  />
                  {/* Jede Karte sagt, woran man ist: Abverkauf und Co. laut,
                      der Normalfall leise. */}
                  {p.flag ? (
                    <span className="prod__flag">{p.flag}</span>
                  ) : (
                    <span className="prod__flag prod__flag--quiet">
                      {p.bestell ? "Auf Anfrage" : "Im Markt verfügbar"}
                    </span>
                  )}
                </div>

                <div className="prod__body">
                  {p.brand && <p className="prod__brand">{p.brand}</p>}
                  <div className="prod__row">
                    <h3 className="prod__name">{p.name}</h3>
                    <span className="prod__price">
                      {p.price ? (
                        <>
                          {p.was && <s>{p.was} €</s>}
                          {p.price} €
                        </>
                      ) : (
                        <em className="prod__ask">Preis auf Anfrage</em>
                      )}
                    </span>
                  </div>
                  {p.sub && <p className="prod__sub">{p.sub}</p>}

                  <button
                    type="button"
                    className="prod__toggle"
                    aria-expanded={isOpen}
                    aria-controls={`detail-${p.id}`}
                    onClick={() => setOpen((o) => ({ ...o, [p.id]: !o[p.id] }))}
                  >
                    {isOpen ? "Weniger anzeigen " : "Mehr erfahren "}
                    <span className="ic" aria-hidden="true">+</span>
                    <span className="sr-only">zu {p.name}</span>
                  </button>
                  <div className="prod__detail" id={`detail-${p.id}`}>
                    <div>
                      <dl>
                        {/* Eckdaten aus der Anzeige; fehlt die Liste, bleibt
                            wenigstens das Maß aus dem Titel. */}
                        {(p.specs?.length
                          ? p.specs
                          : p.masse
                            ? [{ k: "Maße", v: p.masse }]
                            : []
                        ).map((s) => (
                          <div
                            key={s.k}
                            className={`spec${s.k === "Maße" ? " spec--maße" : ""}`}
                          >
                            <dt>{s.k}</dt>
                            <dd>{s.v}</dd>
                          </div>
                        ))}
                        {p.note && (
                          <div className="spec">
                            <dt>Hinweis</dt>
                            <dd>{p.note}</dd>
                          </div>
                        )}
                      </dl>
                      {/* Erst sagen, wo das Stück steht — der Markt führt zu
                          seiner Seite. Dann die beiden Wege: die ganze Anzeige
                          ansehen, oder genau diesen Markt anrufen. */}
                      {(() => {
                        const markt = marktFuer(p.loc);
                        const cta = frageCta(p.name, markt);
                        return (
                          <>
                            {markt && (
                              <p className="prod__ort">
                                {p.bestell ? "Bestellbar über " : "Steht in "}
                                <Link href={markt.anker}>{markt.kurz}</Link>
                              </p>
                            )}
                            <div className="prod__cta">
                              {p.url && (
                                <a
                                  className="btn btn--sm btn--solid prod__cta-main"
                                  href={p.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`Ganze Anzeige für „${p.name}“ ansehen (öffnet in neuem Tab)`}
                                >
                                  Ganze Anzeige ansehen{" "}
                                  <span className="arr" aria-hidden="true">↗</span>
                                </a>
                              )}
                              {/* Die drei Stücke von den Preisschildern haben keine
                                  Anzeige. Dann ist der Anruf die Haupthandlung und
                                  bekommt auch deren Gewicht — nie ein einzelner
                                  heller Knopf, der aussieht, als fehle etwas. */}
                              <a
                                className={
                                  p.url
                                    ? "btn btn--sm prod__cta-side"
                                    : "btn btn--sm btn--solid prod__cta-main"
                                }
                                href={cta.href}
                                aria-label={cta.aria}
                                {...(cta.extern
                                  ? { target: "_blank", rel: "noopener noreferrer" }
                                  : {})}
                              >
                                {cta.label}
                              </a>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
}

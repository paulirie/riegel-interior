"use client";

import { useState } from "react";
import Link from "next/link";
import { PRODUCTS, FILTERS } from "@/data/site";
import { ImageSlot } from "./ImageSlot";
import { WHATSAPP, telFuer } from "@/data/kontakt";

/**
 * Erste Schaltfläche der Karte.
 *
 * Solange keine WhatsApp-Nummer bestätigt ist, steht dort "Anrufen" mit der
 * Nummer des Marktes, in dem das Stück steht. Sobald WHATSAPP.e164 gesetzt
 * ist, wird daraus von selbst der WhatsApp-Knopf mit vorausgefüllter
 * Nachricht — damit nicht jeder mit "Hallo?" anfangen muss.
 */
function frageCta(name: string, loc?: string) {
  if (WHATSAPP.e164) {
    const text = `Hallo! Ich interessiere mich für „${name}“${
      loc ? ` (${loc})` : ""
    }. Ist das Stück noch da?`;
    return {
      label: "Per WhatsApp fragen",
      href: `https://wa.me/${WHATSAPP.e164}?text=${encodeURIComponent(text)}`,
      extern: true,
    };
  }
  const t = telFuer(loc);
  return { label: `Anrufen · ${t.nummer}`, href: `tel:${t.tel}`, extern: false };
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
                        <em className="prod__ask">Preis im Markt</em>
                      )}
                    </span>
                  </div>
                  {p.sub && <p className="prod__sub">{p.sub}</p>}

                  <button
                    className="prod__toggle"
                    aria-expanded={isOpen}
                    onClick={() => setOpen((o) => ({ ...o, [p.id]: !o[p.id] }))}
                  >
                    {isOpen ? "Weniger anzeigen " : "Mehr erfahren "}
                    <span className="ic">+</span>
                  </button>
                  <div className="prod__detail">
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
                        {p.loc && (
                          <div className="spec">
                            <dt>Steht in</dt>
                            <dd>
                              {p.loc}
                              {p.bestell && " · wird im Markt bestellt"}
                            </dd>
                          </div>
                        )}
                        {p.note && (
                          <div className="spec">
                            <dt>Hinweis</dt>
                            <dd>{p.note}</dd>
                          </div>
                        )}
                      </dl>
                      <div className="prod__cta">
                        {(() => {
                          const cta = frageCta(p.name, p.loc);
                          return (
                            <a
                              className="btn btn--sm btn--block btn--solid"
                              href={cta.href}
                              {...(cta.extern
                                ? { target: "_blank", rel: "noopener noreferrer" }
                                : {})}
                            >
                              {cta.label}
                            </a>
                          );
                        })()}
                        <Link href="/standorte" className="btn btn--sm btn--block">
                          Weg zum Markt
                        </Link>
                      </div>
                      {p.url && (
                        <a
                          className="prod__ad"
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Anzeige mit allen Fotos ansehen <span className="arr">↗</span>
                        </a>
                      )}
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

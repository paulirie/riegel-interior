"use client";

import { useState } from "react";
import Link from "next/link";
import { PRODUCTS, FILTERS } from "@/data/site";
import { ImageSlot } from "./ImageSlot";

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
                  {p.flag && <span className="prod__flag">{p.flag}</span>}
                  {!p.flag && p.bestell && (
                    <span className="prod__flag prod__flag--quiet">Bestellware</span>
                  )}
                  <button className="prod__fav" aria-label={`${p.name} merken`}>
                    ♡
                  </button>
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
                        {p.masse && (
                          <div className="spec spec--maße">
                            <dt>Maße</dt>
                            <dd>{p.masse}</dd>
                          </div>
                        )}
                        {p.loc && (
                          <div className="spec">
                            <dt>Steht in</dt>
                            <dd>
                              {p.loc}
                              {p.bestell && " · auf Bestellung"}
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
                        <Link
                          href="/standorte"
                          className="btn btn--sm btn--block btn--solid"
                        >
                          Vorbestellen
                        </Link>
                        <Link href="/standorte" className="btn btn--sm btn--block">
                          Im Markt ansehen
                        </Link>
                      </div>
                      {p.url && (
                        <a
                          className="prod__ad"
                          href={p.url}
                          target="_blank"
                          rel="noopener"
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

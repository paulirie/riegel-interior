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
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="wrap">
        {/* key am Grid: beim Filterwechsel werden die Karten neu gemountet,
            dadurch läuft die gestaffelte Einblendung erneut. */}
        <div className="shop-grid" key={active}>
          {shown.map((p, i) => {
            const isOpen = !!open[p.id];
            return (
              <article
                className="prod"
                key={p.id}
                data-cat={p.cat}
                style={{ "--i": i } as React.CSSProperties}
              >
                <div className="prod__stage">
                  <ImageSlot
                    src={p.img}
                    alt={`${p.name} — ${p.sub}, bei Riegel Interior`}
                    sizes="(max-width: 620px) 92vw, (max-width: 1000px) 46vw, 31vw"
                    priority={i < 3}
                  />
                  {p.was && <span className="prod__flag">Abverkauf</span>}
                  {!p.was && p.unikat && (
                    <span className="prod__flag prod__flag--quiet">Einzelstück</span>
                  )}
                  <button className="prod__fav" aria-label={`${p.name} merken`}>
                    ♡
                  </button>
                </div>

                <div className="prod__body">
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
                  <p className="prod__sub">{p.sub}</p>

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
                        {p.material && (
                          <div className="spec">
                            <dt>Material</dt>
                            <dd>{p.material}</dd>
                          </div>
                        )}
                        {p.extra && (
                          <div className="spec">
                            <dt>Hinweis</dt>
                            <dd>{p.extra}</dd>
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

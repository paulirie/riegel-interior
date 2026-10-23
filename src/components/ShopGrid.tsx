"use client";

import { useState } from "react";
import Link from "next/link";
import { PRODUCTS, FILTERS } from "@/data/site";
import { ImageSlot } from "./ImageSlot";

export function ShopGrid() {
  const [active, setActive] = useState("all");
  const [open, setOpen] = useState<Record<string, boolean>>({});

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
        <div className="shop-grid">
          {PRODUCTS.map((p) => {
            const hidden = active !== "all" && p.cat !== active;
            const isOpen = !!open[p.id];
            return (
              <article
                key={p.id}
                className={`prod${hidden ? " hide" : ""}`}
                data-cat={p.cat}
              >
                <div className="prod__stage">
                  <span className="prod__cat">{p.sub}</span>
                  <button className="prod__fav" aria-label="Merken">
                    ♡
                  </button>
                  <div className="prod__turn">
                    <ImageSlot
                      label="Freigestelltes Foto (PNG, transparent)"
                      fit="contain"
                    />
                  </div>
                  <span className="prod__shadow"></span>
                </div>

                <div className="prod__body">
                  <div className="prod__row">
                    <h3 className="prod__name">{p.name}</h3>
                    <span className="prod__price">
                      {p.from && <small>ab</small>}
                      {p.price} €
                    </span>
                  </div>
                  <div className="prod__swatches">
                    {p.colors.map((c, i) => (
                      <span key={i} className="sw" style={{ background: c }}></span>
                    ))}
                    <span className="more">{p.colors.length} Ausführungen</span>
                  </div>

                  <button
                    className="prod__toggle"
                    aria-expanded={isOpen}
                    onClick={() =>
                      setOpen((o) => ({ ...o, [p.id]: !o[p.id] }))
                    }
                  >
                    {isOpen ? "Weniger anzeigen " : "Mehr erfahren "}
                    <span className="ic">+</span>
                  </button>
                  <div className="prod__detail">
                    <div>
                      <dl>
                        <div className="spec spec--maße">
                          <dt>Maße</dt>
                          <dd>{p.masse}</dd>
                        </div>
                        <div className="spec">
                          <dt>Material</dt>
                          <dd>{p.material}</dd>
                        </div>
                        <div className="spec">
                          <dt>Ausführungen</dt>
                          <dd>{p.cnames}</dd>
                        </div>
                        <div className="spec">
                          <dt>Hinweis</dt>
                          <dd>{p.extra}</dd>
                        </div>
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

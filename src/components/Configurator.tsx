"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";

const WOODS = [
  { val: "Eiche", price: 1290, tone: "#c8a878" },
  { val: "Suar", price: 1690, tone: "#b58f5e" },
  { val: "Teak", price: 1490, tone: "#a87f4f" },
];
const SIZES = [
  { val: "180 cm", mult: 1, sub: "4–6 Personen" },
  { val: "200 cm", mult: 1.12, sub: "6–8 Personen" },
  { val: "220 cm", mult: 1.24, sub: "8 Personen" },
  { val: "260 cm", mult: 1.45, sub: "10 Personen" },
];
const EDGES = [
  { val: "Baumkante" },
  { val: "Schweizer Schliff" },
];
const OILS = [
  { val: "Natur", tone: "#c8a878" },
  { val: "Cognac", tone: "#9a6a3c" },
  { val: "Smoked", tone: "#5d4a34" },
  { val: "Graphit", tone: "#2f2823" },
];
const FORMS = [
  { val: "U-Gestell", form: "u", price: 0 },
  { val: "A-Gestell", form: "a", price: 40 },
  { val: "Mittelfuß", form: "spider", price: 120 },
  { val: "4-Bein", form: "vier", price: -40 },
];
const STEELS = [
  { val: "Schwarz matt", steel: "#1a1a1a" },
  { val: "Anthrazit", steel: "#3a3d40" },
  { val: "Edelstahl", steel: "inox" },
  { val: "Weiß", steel: "#eceae6" },
];
const FILLS = [
  { val: "Schwarz", knot: "#1a1a1a" },
  { val: "Natur", knot: "#8a6a45" },
  { val: "Transparent", knot: "#cdbfa6" },
  { val: "Gold", knot: "#b08d3c" },
  { val: "Weiß", knot: "#efe9df" },
];

const formKey: Record<string, string> = {
  "U-Gestell": "u",
  "A-Gestell": "a",
  Mittelfuß: "spider",
  "4-Bein": "vier",
};

const fmt = (n: number) => n.toLocaleString("de-DE");

export function Configurator() {
  const [s, setS] = useState({
    wood: "Eiche", woodPrice: 1290, size: "180 cm", mult: 1, edge: "Baumkante",
    oil: "Natur", tone: "#c8a878", form: "U-Gestell", formPrice: 0,
    steel: "Schwarz matt", steelVal: "#1a1a1a", fill: "Schwarz", knot: "#1a1a1a",
  });

  const price = Math.round((s.woodPrice * s.mult + s.formPrice) / 10) * 10;
  const summaryList = [
    s.wood, s.size, s.edge, s.oil, s.form + " " + s.steel, "Spachtelung " + s.fill,
  ].join(" · ");

  const topStyle = { "--top": s.tone, "--knot": s.knot } as CSSProperties;
  const baseStyle = (
    s.steel === "Edelstahl" ? {} : { "--steel": s.steelVal }
  ) as CSSProperties;

  return (
    <>
      {/* ── LIVE-VORSCHAU ── */}
      <div className="stage">
        <div className="stage__label">
          <p className="eyebrow">{s.wood} · {s.edge} · {s.size}</p>
        </div>
        <span className="vis-tag" style={{ top: "30%", left: "8%" }}>
          {s.wood} · {s.oil}
        </span>
        <span className="vis-tag" style={{ bottom: "24%", right: "8%" }}>
          Gestell · {s.steel}
        </span>
        <div className="table-vis">
          <div
            className={`tabletop${s.edge === "Baumkante" ? " edge-baumkante" : ""}`}
            style={topStyle}
          >
            <div className="knots">
              <span className="knot k1"></span>
              <span className="knot k2"></span>
              <span className="knot k3"></span>
            </div>
          </div>
          <div
            className={`base form-${formKey[s.form]}${s.steel === "Edelstahl" ? " steel-inox" : ""}`}
            style={baseStyle}
          >
            <span className="leg tl"></span><span className="leg tr"></span>
            <span className="leg l"></span><span className="leg r"></span>
            <span className="leg fl"></span><span className="leg fr"></span>
            <span className="leg al"></span><span className="leg ar"></span><span className="leg cross"></span>
            <span className="leg col"></span><span className="leg foot"></span><span className="leg cap"></span>
            <span className="leg v1"></span><span className="leg v2"></span><span className="leg v3"></span><span className="leg v4"></span>
          </div>
        </div>
        <p className="stage__hint">Live-Vorschau · Darstellung schematisch</p>
      </div>

      {/* ── PANEL ── */}
      <div className="panel">
        <div className="panel__intro">
          <p className="eyebrow">Mix &amp; Match · Manufaktur</p>
          <h1 style={{ fontSize: "clamp(34px,4.2vw,56px)" }}>
            Dein Tisch,<br />Schritt für Schritt.
          </h1>
          <p className="mt-s measure-s">
            Vier Entscheidungen — und dein Massivholztisch ist einzigartig. Wir
            fertigen ihn in unserer eigenen Manufaktur.
          </p>
        </div>

        <div className="steps">
          {/* 1 Tischplatte */}
          <section className="step">
            <div className="step__head">
              <span className="step__n">01</span>
              <span className="step__t">Tischplatte</span>
              <span className="step__val">{s.wood} · {s.size}</span>
            </div>
            <div className="opts">
              {WOODS.map((w) => (
                <button
                  key={w.val}
                  className={`opt${s.wood === w.val ? " sel" : ""}`}
                  onClick={() =>
                    setS((p) => ({
                      ...p, wood: w.val, woodPrice: w.price,
                      tone: p.oil === "Natur" ? w.tone : p.tone,
                    }))
                  }
                >
                  {w.val}
                </button>
              ))}
            </div>
            <div className="opts size-opts mt-s" style={{ marginTop: 14 }}>
              {SIZES.map((sz) => (
                <button
                  key={sz.val}
                  className={`opt${s.size === sz.val ? " sel" : ""}`}
                  onClick={() => setS((p) => ({ ...p, size: sz.val, mult: sz.mult }))}
                >
                  <b>{sz.val}</b>
                  <span>{sz.sub}</span>
                </button>
              ))}
            </div>
            <div className="opts mt-s" style={{ marginTop: 14 }}>
              {EDGES.map((e) => (
                <button
                  key={e.val}
                  className={`opt${s.edge === e.val ? " sel" : ""}`}
                  onClick={() => setS((p) => ({ ...p, edge: e.val }))}
                >
                  {e.val}
                </button>
              ))}
            </div>
          </section>

          {/* 2 Ölung */}
          <section className="step">
            <div className="step__head">
              <span className="step__n">02</span>
              <span className="step__t">Ölung &amp; Finish</span>
              <span className="step__val">{s.oil}</span>
            </div>
            <div className="opts">
              {OILS.map((o) => (
                <button
                  key={o.val}
                  className={`opt${s.oil === o.val ? " sel" : ""}`}
                  onClick={() => setS((p) => ({ ...p, oil: o.val, tone: o.tone }))}
                >
                  <span className="dot" style={{ background: o.tone }}></span>
                  {o.val}
                </button>
              ))}
            </div>
          </section>

          {/* 3 Gestell */}
          <section className="step">
            <div className="step__head">
              <span className="step__n">03</span>
              <span className="step__t">Tischgestell</span>
              <span className="step__val">{s.form} · {s.steel}</span>
            </div>
            <div className="opts">
              {FORMS.map((f) => (
                <button
                  key={f.val}
                  className={`opt${s.form === f.val ? " sel" : ""}`}
                  onClick={() => setS((p) => ({ ...p, form: f.val, formPrice: f.price }))}
                >
                  {f.val}
                </button>
              ))}
            </div>
            <div className="opts mt-s" style={{ marginTop: 14 }}>
              {STEELS.map((st) => (
                <button
                  key={st.val}
                  className={`opt${s.steel === st.val ? " sel" : ""}`}
                  onClick={() => setS((p) => ({ ...p, steel: st.val, steelVal: st.steel }))}
                >
                  <span
                    className="dot"
                    style={{
                      background:
                        st.steel === "inox"
                          ? "linear-gradient(135deg,#e9ecee,#aeb4b7)"
                          : st.steel,
                    }}
                  ></span>
                  {st.val}
                </button>
              ))}
            </div>
          </section>

          {/* 4 Spachtelung */}
          <section className="step">
            <div className="step__head">
              <span className="step__n">04</span>
              <span className="step__t">Spachtelung</span>
              <span className="step__val">{s.fill}</span>
            </div>
            <p style={{ margin: "-8px 0 14px", color: "var(--stone)", fontSize: 13 }}>
              Astlöcher &amp; Risse — in der Farbe deiner Wahl gefüllt.
            </p>
            <div className="opts">
              {FILLS.map((f) => (
                <button
                  key={f.val}
                  className={`opt${s.fill === f.val ? " sel" : ""}`}
                  onClick={() => setS((p) => ({ ...p, fill: f.val, knot: f.knot }))}
                >
                  <span className="dot" style={{ background: f.knot }}></span>
                  {f.val}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="summary">
          <div className="summary__price">
            <div className="lab">Richtpreis</div>
            <div className="val">{fmt(price)} €</div>
          </div>
          <div className="summary__list">{summaryList}</div>
          <Link
            href="/standorte"
            className="btn"
            style={{ borderColor: "rgba(250,248,244,.5)", color: "var(--bone)" }}
          >
            Anfrage senden <span className="arr">→</span>
          </Link>
        </div>
      </div>
    </>
  );
}

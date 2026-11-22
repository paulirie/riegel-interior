"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { TablePlan } from "./TablePlan";

/* Alle Optionen und Preise hier stammen aus zwei eigenen Quellen:
 *
 * 1. Das Inserat "Esstisch Eiche — Tisch nach Wunsch, über 5.000 Varianten":
 *    Platten aus Eiche von 80 × 80 bis 300 × 100 cm, schweizer Kante, gerade
 *    Kante oder Baumkante, geschliffen oder gebürstet, farbliche Behandlung in
 *    über 10 Farbtönen, große Auswahl an Untergestellen. Beispielpreis dort:
 *    Platte 120 × 70 cm massive Eiche ab 350 €.
 * 2. Die Preisschilder im Weseler Markt (eigene Fotos): Tischplatte Schweizer
 *    Schnitte Eiche vollmassiv 140 cm 450 €, 200 cm 855 €, 240 cm 995 €;
 *    Untergestell U-100-100 279 €, Trapez 40-100 279 €, X-Balken-Set 279 €.
 *
 * Nur Eiche — Suar und Teak gibt es als fertige Stücke, nicht nach Maß.
 * Nichts hier hinzuerfinden: was kein Schild und kein Inserat deckt, gehört
 * nicht in den Konfigurator.
 */
const SIZES = [
  { val: "120 × 70 cm", price: 350, sub: "ab · 4 Personen" },
  { val: "140 cm", price: 450, sub: "4–6 Personen" },
  { val: "200 cm", price: 855, sub: "6–8 Personen" },
  { val: "240 cm", price: 995, sub: "8–10 Personen" },
  { val: "bis 300 × 100 cm", price: null, sub: "auf Anfrage" },
];
const EDGES = [{ val: "Baumkante" }, { val: "Schweizer Kante" }, { val: "Gerade Kante" }];
/* Geschliffen oder gebürstet laut Inserat; die Farbtöne sind Beispiele aus
   über zehn, die im Markt zur Auswahl stehen. */
const FINISH = [{ val: "Geschliffen" }, { val: "Gebürstet" }];
/* Die Töne sind an unseren eigenen Fotos abgenommen: die Eiche im Markt
   ist hell und leicht gräulich, nicht rotbraun. */
const TONES = [
  { val: "Natur", tone: "#c9b394" },
  { val: "Hell gebeizt", tone: "#ddceb4" },
  { val: "Mittel gebeizt", tone: "#9b836a" },
  { val: "Dunkel gebeizt", tone: "#5f5141" },
];
const FORMS = [
  { val: "U-Gestell", form: "u", price: 279 },
  { val: "X-Gestell", form: "a", price: 279 },
];

/* Geometrie der Zeichnung. Länge steht auf den Preisschildern. Die Tiefe
   steht nur bei "120 × 70" und "bis 300 × 100" — für 140/200/240 gibt es
   keinen Punktwert, deshalb zeichnet die Werkzeichnung dort 85 cm (das
   Inserat deckt 80 × 80 bis 300 × 100), zeigt aber KEINE Tiefen-Maßzahl,
   sondern den Hinweis "Tiefe 80–100 cm nach Wahl". Erfunden wird nichts. */
const GEO: Record<string, { len: number; dep: number; depLabel: string | null; open: boolean }> = {
  "120 × 70 cm":      { len: 120, dep: 70,  depLabel: "70 cm",  open: false },
  "140 cm":           { len: 140, dep: 85,  depLabel: null,     open: false },
  "200 cm":           { len: 200, dep: 85,  depLabel: null,     open: false },
  "240 cm":           { len: 240, dep: 85,  depLabel: null,     open: false },
  "bis 300 × 100 cm": { len: 300, dep: 100, depLabel: "100 cm", open: true  },
};

const fmt = (n: number) => n.toLocaleString("de-DE");

export function Configurator() {
  const [s, setS] = useState<{
    size: string; platte: number | null; edge: string; finish: string;
    ton: string; tone: string; form: string; formPrice: number;
  }>({
    size: "200 cm", platte: 855, edge: "Baumkante", finish: "Geschliffen",
    ton: "Natur", tone: "#c9b394", form: "U-Gestell", formPrice: 279,
  });

  /* Kein Preis für die größte Platte — dort steht "auf Anfrage" statt einer
     erfundenen Zahl. */
  const price = s.platte === null ? null : s.platte + s.formPrice;
  const summaryList = [
    "Eiche massiv", s.size, s.edge, s.finish, s.ton, s.form + " · Stahl schwarz",
  ].join(" · ");

  const g = GEO[s.size];
  const vec = {
    len: g.len,
    dep: g.dep,
    raw: s.edge === "Baumkante" ? 1 : 0,
    swiss: s.edge === "Schweizer Kante" ? 1 : 0,
    frm: s.form === "X-Gestell" ? 1 : 0,
  };

  /* is-arm schaltet die Ausgangslage der Einmal-Animation, is-seen startet
     sie, is-live hält das Streiflicht nur, solange die Bühne im Bild ist. */
  const stageRef = useRef<HTMLDivElement>(null);
  const [cls, setCls] = useState("");
  useEffect(() => {
    setCls("is-arm");
    const node = stageRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (es) =>
        setCls((prev) => {
          const seen = prev.includes("is-seen") || es[0].isIntersecting;
          return ["is-arm", seen && "is-seen", es[0].isIntersecting && "is-live"]
            .filter(Boolean).join(" ");
        }),
      { threshold: 0.04 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* ── LIVE-VORSCHAU ── */}
      <div ref={stageRef} className={`stage ${cls}`}>
        <div className="stage__label">
          <p className="eyebrow">Eiche massiv · {s.edge} · {s.size}</p>
          {g.depLabel === null && (
            <p className="eyebrow" style={{ marginTop: 6, letterSpacing: ".2em", opacity: .62 }}>
              Tiefe 80–100 cm nach Wahl
            </p>
          )}
        </div>
        <TablePlan
          v={vec}
          open={g.open}
          finish={s.finish}
          tone={s.tone}
          edge={s.edge}
          depLabel={g.depLabel}
        />
        <span className="vis-tag vis-tag--base">{s.form} · Stahl schwarz</span>
        <p className="stage__hint">Live-Vorschau · Darstellung schematisch</p>
      </div>

      {/* ── PANEL ── */}
      <div className="panel">
        <div className="panel__intro">
          <p className="eyebrow">Mix &amp; Match · Tische nach Maß</p>
          <h1 style={{ fontSize: "clamp(34px,4.2vw,56px)" }}>
            Dein Tisch,<br />Schritt für Schritt.
          </h1>
          <p className="mt-s measure-s">
            Platte und Gestell stellst du dir selbst zusammen — über 5.000
            Kombinationen sind möglich. Hier bekommst du ein Gefühl dafür; gewählt
            und bestellt wird bei uns in Wesel.
          </p>
        </div>

        <div className="steps">
          {/* 1 Tischplatte */}
          <section className="step">
            <div className="step__head">
              <span className="step__n">01</span>
              <span className="step__t">Tischplatte Eiche</span>
              <span className="step__val">{s.size}</span>
            </div>
            <p style={{ margin: "-8px 0 14px", color: "var(--stone)", fontSize: 13 }}>
              Vollmassive Eiche, 4 cm stark. Andere Hölzer führen wir als fertige
              Stücke, nicht nach Maß.
            </p>
            <div className="opts size-opts">
              {SIZES.map((sz) => (
                <button
                  key={sz.val}
                  className={`opt${s.size === sz.val ? " sel" : ""}`}
                  onClick={() => setS((p) => ({ ...p, size: sz.val, platte: sz.price }))}
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

          {/* 2 Oberfläche */}
          <section className="step">
            <div className="step__head">
              <span className="step__n">02</span>
              <span className="step__t">Oberfläche</span>
              <span className="step__val">{s.finish} · {s.ton}</span>
            </div>
            <div className="opts">
              {FINISH.map((f) => (
                <button
                  key={f.val}
                  className={`opt${s.finish === f.val ? " sel" : ""}`}
                  onClick={() => setS((p) => ({ ...p, finish: f.val }))}
                >
                  {f.val}
                </button>
              ))}
            </div>
            <p style={{ margin: "14px 0 10px", color: "var(--stone)", fontSize: 13 }}>
              Farblich behandeln können wir die Platte auch — vier Beispiele von
              über zehn Farbtönen:
            </p>
            <div className="opts">
              {TONES.map((t) => (
                <button
                  key={t.val}
                  className={`opt${s.ton === t.val ? " sel" : ""}`}
                  onClick={() => setS((p) => ({ ...p, ton: t.val, tone: t.tone }))}
                >
                  <span className="dot" style={{ background: t.tone }}></span>
                  {t.val}
                </button>
              ))}
            </div>
          </section>

          {/* 3 Gestell */}
          <section className="step">
            <div className="step__head">
              <span className="step__n">03</span>
              <span className="step__t">Tischgestell</span>
              <span className="step__val">{s.form}</span>
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
            <p style={{ margin: "14px 0 0", color: "var(--stone)", fontSize: 13 }}>
              Stahl, schwarz pulverbeschichtet, je 279 €. Ein Trapez-Gestell gibt
              es zum selben Preis, weitere Gestelle stehen im Markt.
            </p>
          </section>
        </div>

        <div className="summary">
          <div className="summary__price">
            <div className="lab">Richtpreis</div>
            <div className="val">{price === null ? "auf Anfrage" : `${fmt(price)} €`}</div>
          </div>
          <div className="summary__list">{summaryList}</div>
          <p style={{ margin: "10px 0 16px", fontSize: 12, opacity: 0.7 }}>
            Platte plus Gestell, nach unseren Preisschildern. Kein Angebot — den
            endgültigen Preis machen wir im Markt.
          </p>
          <Link
            href="/standorte"
            className="btn"
            style={{ borderColor: "rgba(250,248,244,.5)", color: "var(--bone)" }}
          >
            Im Markt besprechen <span className="arr">→</span>
          </Link>
        </div>
      </div>
    </>
  );
}

"use client";

import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import * as G from "./tableGeometry";

/* cubic-bezier(.22,.61,.36,1) — dieselbe Kurve, die --ease in CSS fährt.
   Newton auf x, dann y auswerten. Mit fester Dauer und performance.now()
   läuft der Tween auf einem 120-Hz-Schirm genauso lang wie auf 60 Hz. */
function mkBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const fx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const dfx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 6; i++) {
      const e = fx(t) - x, d = dfx(t);
      if (Math.abs(e) < 1e-5 || d === 0) break;
      t -= e / d;
    }
    t = Math.max(0, Math.min(1, t));
    return ((ay * t + by) * t + cy) * t;
  };
}
const ease = mkBezier(0.22, 0.61, 0.36, 1);
const DUR = 680;

/* Ein Gestellrahmen, quer unter dem Plattenende. Beide Rahmen sind
   identisch aufgebaut, nur ihr x unterscheidet sich.

   Der Flachstahl ist materialstark; seine Rückseite liegt um TKX weiter
   hinten. In dieser Projektion ist das ein reiner Versatz nach rechts —
   also kann die Rückseite ein <use> desselben Rahmens sein, dunkler und
   davor gezeichnet. Ein Satz Pfade, zwei sichtbare Flächen, und der Tween
   muss nur die vordere anfassen. */
function Frame({ i, b, o }: { i: number; b: G.Base; o: number }) {
  return (
    <g data-k={"frw" + i} opacity={o}>
      <use href={`#plan-fr${i}`} transform={`translate(${G.TKDX} 0)`} className="plan__frame--deep" />
      <g id={`plan-fr${i}`} data-k={"fr" + i} transform={G.planeSide(b.xs[i])} className="plan__frame">
        <path data-k={"kufe" + i} className="plan__steel" d={G.kufePath(b)} opacity={b.kufeO} />
        <path data-k={"foot" + i + "a"} className="plan__steel" d={G.footPath(b.legs[0])} opacity={b.footO} />
        <path data-k={"foot" + i + "b"} className="plan__steel" d={G.footPath(b.legs[1])} opacity={b.footO} />
        <path data-k={"leg" + i + "a"} className="plan__steel" d={G.legPath(b.legs[0])} />
        <path data-k={"leg" + i + "b"} className="plan__steel" d={G.legPath(b.legs[1])} />
        <path data-k={"bar" + i} className="plan__steel" d={G.barPath(b)} opacity={b.barO} />
        <path data-k={"rail" + i} className="plan__steel plan__steel--rail" d={G.railPath(b)} />
      </g>
    </g>
  );
}

/* Der Kreuzfuß in der Mitte. Eigene Gruppe, eigene Deckkraft: beim Wechsel
   blenden die beiden Endrahmen aus, während er einblendet. */
function Mitte({ sp, o }: { sp: G.Spider; o: number }) {
  return (
    <g data-k="mid" className="plan__frame" opacity={o}>
      {sp.arme.map((d, i) => (
        <path key={i} data-k={"sparm" + i} className="plan__steel" d={d} />
      ))}
      {sp.kreuz.map((d, i) => (
        <path key={i} data-k={"spkr" + i} className="plan__steel plan__steel--rail" d={d} />
      ))}
    </g>
  );
}

export function TablePlan({
  v, open, finish, tone, edge, depLabel,
}: {
  v: G.Vec; open: boolean; finish: string; tone: string;
  edge: string; depLabel: string | null;
}) {
  /* Der Anfangszustand wird einmal festgehalten: daraus rendern Server und
     erster Paint eine fertige Zeichnung. Weil diese Strings über alle
     Rerender identisch bleiben, schreibt React die Attribute danach nie
     wieder — der Tween ist Alleinbesitzer von d, cx, cy, rx, ry, opacity
     und transform. */
  const seed = useRef<G.Vec>(v).current;
  const planRef = useRef<SVGSVGElement>(null);
  const detRef = useRef<SVGSVGElement>(null);
  const cur = useRef<G.Vec>({ ...v });
  const vRef = useRef(v);
  const openRef = useRef(open);
  vRef.current = v;
  openRef.current = open;

  const s0 = useMemo(() => ({
    deck: G.deck(seed), cham: G.chamfer(seed), band: G.band(seed), end: G.endFace(seed),
    fries: G.fries(seed), mitre: G.mitre(seed),
    shade: G.shade(seed), base: G.base(seed), sp: G.spider(seed),
    dimL: G.dimLen(seed), dimD: G.dimDep(seed), det: G.detail(seed),
  }), [seed]);

  useEffect(() => {
    const plan = planRef.current;
    if (!plan) return;
    const det = detRef.current;
    const cache = new Map<string, SVGElement>();
    const el = (k: string) => {
      const hit = cache.get(k);
      if (hit) return hit;
      const f = plan.querySelector<SVGElement>(`[data-k="${k}"]`)
        ?? (det ? det.querySelector<SVGElement>(`[data-k="${k}"]`) : null);
      if (f) cache.set(k, f);
      return f;
    };
    const setD = (k: string, d: string) => { const e = el(k); if (e) e.setAttribute("d", d); };
    const setA = (k: string, a: Record<string, string | number>) => {
      const e = el(k);
      if (e) for (const n in a) e.setAttribute(n, String(a[n]));
    };

    const draw = (w: G.Vec) => {
      const dk = G.deck(w);
      setD("clip", dk); setD("deck", dk); setD("ink", dk);
      setD("cham", G.chamfer(w)); setD("band", G.band(w)); setD("end", G.endFace(w));
      setD("fries", G.fries(w)); setD("mitre", G.mitre(w));
      /* Die Baumkante hat keinen Fries: der Ring blendet mit raw aus. */
      const fo = Math.round((1 - w.raw) * 100) / 100;
      setA("fries", { opacity: fo }); setA("mitre", { opacity: fo });
      setA("shade", G.shade(w));

      const b = G.base(w);
      const endO = Math.round((1 - w.mid) * 100) / 100;
      const midO = Math.round(w.mid * 100) / 100;
      setA("mid", { opacity: midO });
      if (midO > 0) {
        const sp = G.spider(w);
        sp.arme.forEach((d, k) => setD("sparm" + k, d));
        sp.kreuz.forEach((d, k) => setD("spkr" + k, d));
      }
      for (let i = 0; i < 2; i++) {
        setA("frw" + i, { opacity: endO });
        const fr = el("fr" + i);
        if (fr) fr.setAttribute("transform", G.planeSide(b.xs[i]));
        setD("rail" + i, G.railPath(b));
        setD("kufe" + i, G.kufePath(b));
        setA("kufe" + i, { opacity: b.kufeO });
        setD("bar" + i, G.barPath(b));
        setA("bar" + i, { opacity: b.barO });
        setD("leg" + i + "a", G.legPath(b.legs[0]));
        setD("leg" + i + "b", G.legPath(b.legs[1]));
        setD("foot" + i + "a", G.footPath(b.legs[0]));
        setD("foot" + i + "b", G.footPath(b.legs[1]));
        setA("foot" + i + "a", { opacity: b.footO });
        setA("foot" + i + "b", { opacity: b.footO });
      }
      const rt = el("root");
      if (rt) rt.setAttribute("transform", `translate(${G.centerDx(w)} 0)`);
      setA("flag", G.flagPos(w));

      const dl = G.dimLen(w);
      setD("dimH", dl.help); setD("dimL", dl.line); setD("dimT", dl.ticks);
      const dn = el("dimN");
      if (dn) {
        dn.setAttribute("x", String(dl.tx));
        dn.setAttribute("y", String(dl.ty));
        dn.textContent = (openRef.current ? "bis " : "") + Math.round(w.len) + " cm";
      }
      const dd = G.dimDep(w);
      setD("depL", dd.line); setD("depT", dd.ticks);
      setA("depN", { x: dd.tx, y: dd.ty });

      const dt = G.detail(w);
      setD("xclip", dt.deck); setD("xdeck", dt.deck); setD("xink", dt.deck);
      setD("xcham", dt.cham); setD("xband", dt.band); setD("xbclip", dt.band);
      setD("xsaw", dt.saw);
      setA("xsaw", { opacity: Math.round(w.raw * 100) / 100 });
    };

    const t: G.Vec = { ...vRef.current };
    /* prefers-reduced-motion erreicht kein CSS-Block hier: der Tween fragt
       selbst und springt dann auf den Zielwert. */
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) { cur.current = t; draw(t); return; }

    const a: G.Vec = { ...cur.current };
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min((now - t0) / DUR, 1), e = ease(k);
      const w: G.Vec = {
        len: a.len + (t.len - a.len) * e,
        dep: a.dep + (t.dep - a.dep) * e,
        raw: a.raw + (t.raw - a.raw) * e,
        swiss: a.swiss + (t.swiss - a.swiss) * e,
        top: a.top + (t.top - a.top) * e,
        bot: a.bot + (t.bot - a.bot) * e,
        kufe: a.kufe + (t.kufe - a.kufe) * e,
        bar: a.bar + (t.bar - a.bar) * e,
        mid: a.mid + (t.mid - a.mid) * e,
      };
      cur.current = w;
      draw(w);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // Abhängigkeiten sind absichtlich die Zahlen, nicht das Objekt v:
    // ein Objektliteral hätte bei jedem Rerender eine neue Identität und
    // würde die Schleife ständig neu starten.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v.len, v.dep, v.raw, v.swiss, v.top, v.bot, v.kufe, v.bar, v.mid, open]);

  const fin = finish === "Gebürstet" ? "brushed" : "sanded";

  return (
    <>
      <svg
        ref={planRef}
        className="plan"
        viewBox={`0 0 ${G.VB.w} ${G.VB.h}`}
        preserveAspectRatio="xMidYMid meet"
        data-finish={fin}
        data-open={open ? "true" : "false"}
        role="img"
        aria-label={`Schematische Werkzeichnung: Tischplatte Eiche, ${v.len} Zentimeter, ${edge}, ${finish}`}
        style={{ "--top": tone, "--len": String(v.len) } as CSSProperties}
      >
        <defs>
          <clipPath id="plan-deck"><path data-k="clip" d={s0.deck} /></clipPath>
          <linearGradient id="plan-sheen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fffdf7" stopOpacity="0" />
            <stop offset=".5" stopColor="#fffdf7" stopOpacity="1" />
            <stop offset="1" stopColor="#fffdf7" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="plan-shade">
            <stop offset="0" stopColor="#0c0b0a" stopOpacity=".34" />
            <stop offset="1" stopColor="#0c0b0a" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g data-k="root" transform={`translate(${G.centerDx(seed)} 0)`}>
        {/* Bodenebene: der Schatten liegt in derselben Ebene wie die
            Maßlinie, ist also automatisch richtig verkürzt. */}
        <g transform={G.planeTop(0)}>
          <ellipse data-k="shade" fill="url(#plan-shade)" {...s0.shade} />
        </g>

        {/* Zwei Rahmen quer unter den Plattenenden — oder ein Kreuzfuß in
            der Mitte. Beim Wechsel blendet das eine ins andere. */}
        <Frame i={0} b={s0.base} o={1 - seed.mid} />
        <Frame i={1} b={s0.base} o={1 - seed.mid} />
        <Mitte sp={s0.sp} o={seed.mid} />

        {/* Platte */}
        <g className="plan__faces">
          <path data-k="end" className="plan__end" d={s0.end} />
          <path data-k="band" className="plan__band" d={s0.band} />
          <path data-k="cham" className="plan__cham" d={s0.cham} />
          <path data-k="deck" className="plan__deck" d={s0.deck} />
          {/* Der Clip-Pfad liegt in viewBox-Koordinaten, die Kinder rechnen in
              Zentimetern: deshalb trägt die äußere Gruppe den Clip und erst die
              innere die Ebenen-Matrix. Beides an einem Element wäre falsch. */}
          <g clipPath="url(#plan-deck)">
            <g transform={G.planeTop(G.TOPZ)} className="plan__lams">
              {G.LAMS.map((l, i) => (
                <rect key={i} className={"plan__lam plan__lam--" + (l.o < 0 ? "d" : "l")}
                  x={l.x} y={l.y} width={l.w} height={G.LAM_H}
                  fillOpacity={Math.abs(l.o)} />
              ))}
              {G.LAM_SEAMS.map((d, i) => <path key={i} className="plan__seam" d={d} />)}
              {G.LAM_ROWLINES.map((d, i) => <path key={i} className="plan__seam" d={d} />)}
              {G.KNOTS.map((k, i) => (
                <ellipse key={i} className="plan__knot" cx={k.x} cy={k.y} rx={k.rx} ry={k.ry} />
              ))}
            </g>
            {/* Friesleiste ringsum — rechnet in viewBox-Koordinaten */}
            <path data-k="fries" className="plan__fries" fillRule="evenodd" d={s0.fries} />
            <path data-k="mitre" className="plan__seam" d={s0.mitre} />
            <g transform={G.planeTop(G.TOPZ)}>
              <g className="plan__brush">
                {G.MBRUSH.map((y) => <path key={y} className="plan__grain" d={G.mLine(y)} />)}
              </g>
              <g className="plan__sheenwrap">
                <rect className="plan__sheen" x={-20} y={-14} width={70} height={126}
                  fill="url(#plan-sheen)" />
              </g>
            </g>
          </g>
        </g>
        <path data-k="ink" className="plan__ink" d={s0.deck} />

        {/* Maße — nur was ein Schild oder das Inserat deckt */}
        <g className="plan__dim">
          <path data-k="dimH" className="plan__help" d={s0.dimL.help} />
          <path data-k="dimL" className="plan__dimline" d={s0.dimL.line} />
          <path data-k="dimT" className="plan__dimline" d={s0.dimL.ticks} />
          <text data-k="dimN" x={s0.dimL.tx} y={s0.dimL.ty} textAnchor="middle">
            {(open ? "bis " : "") + Math.round(seed.len) + " cm"}
          </text>
        </g>
        <g className="plan__dim" style={{ opacity: depLabel ? 1 : 0 }}>
          <path data-k="depL" className="plan__dimline" d={s0.dimD.line} />
          <path data-k="depT" className="plan__dimline" d={s0.dimD.ticks} />
          <text data-k="depN" x={s0.dimD.tx} y={s0.dimD.ty} textAnchor="middle">
            {depLabel ?? ""}
          </text>
        </g>
        {open && (
          <text data-k="flag" className="plan__flag" {...G.flagPos(seed)}>nach Maß</text>
        )}
        </g>
      </svg>

      {/* Detailfenster: eigenes SVG, eigener Maßstab, Typografie in echten px */}
      <figure className="detail">
        <svg
          ref={detRef}
          className="detail__svg"
          viewBox={`0 0 ${G.DVB.w} ${G.DVB.h}`}
          preserveAspectRatio="xMidYMid meet"
          data-finish={fin}
          style={{ "--top": tone } as CSSProperties}
        >
          <defs>
            <clipPath id="det-deck"><path data-k="xclip" d={s0.det.deck} /></clipPath>
            <clipPath id="det-band"><path data-k="xbclip" d={s0.det.band} /></clipPath>
          </defs>
          <path data-k="xband" className="plan__band" d={s0.det.band} />
          {/* Sägeriefen der Baumkante, an der Stirnfläche geclippt */}
          <g clipPath="url(#det-band)">
            <path data-k="xsaw" className="plan__saw" d={s0.det.saw} opacity={0} />
          </g>
          <path data-k="xcham" className="plan__cham" d={s0.det.cham} />
          <path data-k="xdeck" className="plan__deck" d={s0.det.deck} />
          <g clipPath="url(#det-deck)">
            <g className="plan__brush">
              {G.DBRUSH.map((y) => <path key={y} className="plan__grain" d={G.dLine(y)} />)}
            </g>
            {G.DGRAIN.map((y) => <path key={y} className="plan__grain" d={G.dLine(y)} />)}
          </g>
          <path data-k="xink" className="plan__ink2" d={s0.det.deck} />
          <path className="plan__dimline" d={G.DBRACKET} />
        </svg>
        <figcaption>
          <b>Detail Kante · achtfach</b>
          {edge} · Stirnfläche 4 cm<br />
          {finish === "Gebürstet"
            ? "Gebürstet · offenporig, Faser fühlbar"
            : "Geschliffen · glatt und matt"}
        </figcaption>
      </figure>
    </>
  );
}

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
const DUR = 620;

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

  const s0 = useMemo(() => {
    const b = G.base(seed);
    return {
      deck: G.deck(seed), cham: G.chamfer(seed), band: G.band(seed), end: G.endFace(seed),
      grain: Array.from({ length: G.GRAIN_LINES }, (_, k) => G.grain(seed, k)),
      knots: G.KNOTS.map((k) => G.knot(seed, k)),
      shade: G.shade(seed),
      posts: b.posts.map((q) => G.postPath(q)),
      feet: b.posts.map((q) => G.rectPath(q.xF - b.footL / 2, b.yc - b.footD / 2, b.footL, b.footD)),
      brace: G.bracePath(b), braceO: b.braceO, yc: b.yc,
      dimL: G.dimLen(seed), dimD: G.dimDep(seed), det: G.detail(seed),
    };
  }, [seed]);

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
      for (let k = 0; k < G.GRAIN_LINES; k++) setD("g" + k, G.grain(w, k));
      G.KNOTS.forEach((kn, i) => setA("k" + i, G.knot(w, kn)));
      setA("shade", G.shade(w));

      const b = G.base(w);
      b.posts.forEach((q, i) => setD("post" + i, G.postPath(q)));
      b.posts.forEach((q, i) =>
        setD("foot" + i, G.rectPath(q.xF - b.footL / 2, b.yc - b.footD / 2, b.footL, b.footD)));
      setD("brace", G.bracePath(b));
      setA("brace", { opacity: Math.round(b.braceO * 100) / 100 });
      const rt = el("root");
      if (rt) rt.setAttribute("transform", `translate(${G.centerDx(w)} 0)`);
      setA("flag", G.flagPos(w));
      const bp = el("basePlane");
      if (bp) bp.setAttribute("transform", G.planeFront(w.dep / 2 - 5));

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
      setD("xcham", dt.cham); setD("xband", dt.band);
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
        frm: a.frm + (t.frm - a.frm) * e,
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
  }, [v.len, v.dep, v.raw, v.swiss, v.frm, open]);

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
        {/* Bodenebene: Schatten und Fußplatten liegen in derselben Ebene wie
            die Maßlinie, sind also automatisch richtig verkürzt. */}
        <g transform={G.planeTop(0)}>
          <ellipse data-k="shade" fill="url(#plan-shade)" {...s0.shade} />
          <path data-k="foot0" className="plan__steel" d={s0.feet[0]} />
          <path data-k="foot1" className="plan__steel" d={s0.feet[1]} />
        </g>

        {/* Gestell in der Mittelebene der Platte */}
        <g data-k="basePlane" transform={G.planeFront(s0.yc - 5)}>
          <path data-k="post0" className="plan__steel" d={s0.posts[0]} />
          <path data-k="post1" className="plan__steel" d={s0.posts[1]} />
          <path data-k="brace" className="plan__steel" d={s0.brace} opacity={s0.braceO} />
        </g>

        {/* Platte */}
        <g className="plan__faces">
          <path data-k="end" className="plan__end" d={s0.end} />
          <path data-k="band" className="plan__band" d={s0.band} />
          <path data-k="cham" className="plan__cham" d={s0.cham} />
          <path data-k="deck" className="plan__deck" d={s0.deck} />
          {/* Der Clip-Pfad liegt in viewBox-Koordinaten, die Kinder rechnen in
              Zentimetern: deshalb trägt die äußere Gruppe den Clip und erst die
              innere die Ebenen-Matrix. Beides an einem Element wäre falsch. */}
          <g clipPath="url(#plan-deck)"><g transform={G.planeTop(G.TOPZ)}>
            <g className="plan__brush">
              {G.MBRUSH.map((y) => <path key={y} className="plan__grain" d={G.mLine(y)} />)}
            </g>
            {s0.grain.map((d, i) => <path key={i} data-k={"g" + i} className="plan__grain" d={d} />)}
            {s0.knots.map((k, i) => (
              <ellipse key={i} data-k={"k" + i} className="plan__knot"
                cx={k.cx} cy={k.cy} rx={[3.4, 2.4, 2][i]} ry={[2, 1.5, 1.3][i]} />
            ))}
            <g className="plan__sheenwrap">
              <rect className="plan__sheen" x={-20} y={-14} width={70} height={126}
                fill="url(#plan-sheen)" />
            </g>
          </g></g>
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
          </defs>
          <path data-k="xband" className="plan__band" d={s0.det.band} />
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

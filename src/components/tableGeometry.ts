/* ─────────────────────────────────────────────────────────────────────────
   Werkzeichnung des Tisches. Die Geometrie ist eine reine Funktion des
   Zustands: alles rechnet in Zentimetern, p() projiziert am Ende in
   viewBox-Einheiten. Animiert werden deshalb nie Pfade, sondern Zahlen.

   EINE Projektion für die ganze Zeichnung (Kavalier-Schrägbild, Blick von
   vorn rechts oben): die Tiefe y läuft nach hinten und erscheint als
   Versatz nach rechts (SX) und nach oben (SY). Deckfläche, Stirnfläche mit
   ihren 4 cm und das Hirnholz am rechten Ende sind gleichzeitig zu sehen.

   Der Maßstab ist konstant: 1 cm = K Einheiten, über alle Plattengrößen.
   Eine 240er Platte ist auf dem Schirm deshalb wirklich doppelt so lang
   wie eine 120er.
   ───────────────────────────────────────────────────────────────────────── */

export const K = 2.52;                 // Einheiten je Zentimeter
export const SX = 0.36;                // Tiefenversatz nach rechts
export const SY = 0.5;                 // Tiefenversatz nach oben
export const OX = 70;                  // Ursprung (0,0,0) in der viewBox
export const OY = 392;
export const VB = { w: 1000, h: 470 };

export const TH = 4;                   // Plattenstärke in cm (Schild: 4 cm stark)
export const HT = 72;                  // Gestellhöhe in cm — bewusst OHNE Maßzahl,
                                       // kein Schild und kein Inserat nennt sie
export const TOPZ = HT + TH;
export const INSET = 24;               // Rücksprung der Stützen vom Plattenende
export const RAW_AMP = 4.5;            // cm, größter Ausschlag der Baumkante
export const SWISS_C = 1.2;            // cm, Fasenbreite der Schweizer Kante
export const SAMPLES = 48;             // Stützpunkte je Längskante — immer gleich viele
export const GRAIN_LINES = 17;
const GRAIN_STEP = 6.2;                // cm; konstant, also vermehren sich die
                                       // Jahresringe mit der Tiefe statt sich zu dehnen
const POST_W = 4;                      // Flachstahl, ohne Maßzahl
const FOOT_L = 60, FOOT_D = 36;        // Fußplatte U-Gestell
const SPLAY = 20;                      // Grad Neigung im X-Gestell
const BRACE_Z = 26, BRACE_H = 4;

export type Vec = { len: number; dep: number; raw: number; swiss: number; frm: number };

const r = (n: number) => Math.round(n * 10) / 10;

export function p(x: number, y: number, z: number): [number, number] {
  return [OX + (x + y * SX) * K, OY - (y * SY + z) * K];
}
const s = (x: number, y: number, z: number) => {
  const q = p(x, y, z);
  return `${r(q[0])},${r(q[1])}`;
};

/* Affine Matrizen, damit in einer Ebene direkt in Zentimetern gezeichnet
   werden kann — ein <g transform> statt Projektion in jedem Pfad. */
export const planeTop = (z: number) =>
  `matrix(${K} 0 ${r(SX * K)} ${r(-SY * K)} ${OX} ${r(OY - z * K)})`;
export const planeFront = (y: number) =>
  `matrix(${K} 0 0 ${-K} ${r(OX + y * SX * K)} ${r(OY - y * SY * K)})`;

/* Niederfrequente, deterministische Wuchskurve: drei Sinus mit
   inkommensurablen Frequenzen. Glatt — eine Baumkante ist keine Säge —
   und überall gleich: kein Math.random und kein fract(sin(x)*43758),
   das zwischen Server und Client kippen kann. */
function wuchs(t: number, ph: number) {
  return 0.55 * Math.sin(6.2832 * t + 0.7 + ph)
       + 0.30 * Math.sin(6.2832 * 2.3 * t + 2.1 + ph)
       + 0.15 * Math.sin(6.2832 * 3.7 * t + 4.4 + ph);
}

/** Vordere Längskante an der Stelle t (0..1). y nach vorn, dz = Stärkeschwankung. */
export function edgeAt(v: Vec, t: number) {
  const w = wuchs(t, 0);
  return { y: -v.raw * RAW_AMP * (0.5 + 0.5 * w), dz: v.raw * 0.9 * w };
}
/** Hintere Längskante, andere Phase — dasselbe Brett, nicht gespiegelt. */
function backAt(v: Vec, t: number) {
  const w = wuchs(t, 2.6);
  return v.dep + v.raw * RAW_AMP * (0.5 + 0.5 * w);
}

/** Deckfläche. Bei Schweizer Kante um die Fasenbreite zurückgesetzt. */
export function deck(v: Vec) {
  const c = SWISS_C * v.swiss;
  let d = "";
  for (let i = 0; i <= SAMPLES; i++) {
    const t = i / SAMPLES;
    d += (i ? "L" : "M") + s(t * v.len, edgeAt(v, t).y + c, TOPZ);
  }
  for (let i = SAMPLES; i >= 0; i--) {
    const t = i / SAMPLES;
    d += "L" + s(t * v.len, backAt(v, t) - c, TOPZ);
  }
  return d + "Z";
}
/** Fase der Schweizer Kante: eigene 45°-Fläche. Höhe 0 bei den anderen Kanten. */
export function chamfer(v: Vec) {
  const c = SWISS_C * v.swiss;
  let d = "";
  for (let i = 0; i <= SAMPLES; i++) {
    const t = i / SAMPLES;
    d += (i ? "L" : "M") + s(t * v.len, edgeAt(v, t).y + c, TOPZ);
  }
  for (let i = SAMPLES; i >= 0; i--) {
    const t = i / SAMPLES, q = edgeAt(v, t);
    d += "L" + s(t * v.len, q.y, TOPZ - c);
  }
  return d + "Z";
}
/** Stirnfläche: die 4 cm von vorn. Oberkante gehobelt, Unterkante wandert mit dz. */
export function band(v: Vec) {
  const c = SWISS_C * v.swiss;
  let d = "";
  for (let i = 0; i <= SAMPLES; i++) {
    const t = i / SAMPLES;
    d += (i ? "L" : "M") + s(t * v.len, edgeAt(v, t).y, TOPZ - c);
  }
  for (let i = SAMPLES; i >= 0; i--) {
    const t = i / SAMPLES, q = edgeAt(v, t);
    d += "L" + s(t * v.len, q.y, TOPZ - TH - q.dz);
  }
  return d + "Z";
}
/** Hirnholz am rechten Ende — die Fläche, die "vollmassiv" zeigt. */
export function endFace(v: Vec) {
  const c = SWISS_C * v.swiss, q = edgeAt(v, 1), yB = backAt(v, 1);
  return "M" + s(v.len, q.y + c, TOPZ)
       + "L" + s(v.len, yB - c, TOPZ)
       + "L" + s(v.len, yB, TOPZ - TH)
       + "L" + s(v.len, q.y, TOPZ - TH - q.dz)
       + "L" + s(v.len, q.y, TOPZ - c) + "Z";
}

/** Jahresring k, in Zentimetern der Deckflächen-Ebene (planeTop(TOPZ)). */
export function grain(v: Vec, k: number) {
  const N = 16;
  let d = "";
  for (let i = 0; i <= N; i++) {
    const t = i / N, q = edgeAt(v, t);
    const y = q.y + 2.4 + (k + 1) * GRAIN_STEP + 1.1 * Math.sin(6.2832 * 1.7 * t + k * 1.9);
    d += (i ? "L" : "M") + `${r(t * v.len)},${r(y)}`;
  }
  return d;
}

/* Astlöcher liegen auf der Deckfläche und werden an der Kantenkontur
   geclippt — nicht mehr frei auf der Kante wie bisher. */
export const KNOTS = [
  { t: 0.26, dy: 17 },
  { t: 0.58, dy: 8.5 },
  { t: 0.79, dy: 29 },
];
export function knot(v: Vec, k: { t: number; dy: number }) {
  const q = edgeAt(v, k.t);
  return { cx: r(k.t * v.len), cy: r(q.y + k.dy) };
}

/* ── Gestell ──────────────────────────────────────────────────────────────
   U und X sind dasselbe Gebilde: zwei Streben, zwei Fußplatten, ein Riegel.
   Ein Skalar frm fährt von 0 nach 1. Die Streben drehen um ihren oberen
   Anschlusspunkt unter der Platte; ihre Länge wächst dabei um 1/cos θ,
   damit der Fuß auf dem Boden bleibt. Kein display:none.                  */
export function base(v: Vec) {
  const th = (SPLAY * Math.PI / 180) * v.frm;
  const tan = Math.tan(th);
  // waagerechte Halbbreite: quer zur Strebenachse bleibt sie damit POST_W dick
  const hw = (POST_W / 2) / Math.cos(th);
  const top = Math.max(v.len / 2 - INSET, 16);
  const yc = v.dep / 2;
  const mid = v.len / 2;                 // der Tisch liegt bei x = 0..len,
  const posts = [-1, 1].map((sg) => {    // das Gestell steht also mittig darunter
    const xT = mid + sg * top, xF = mid + sg * (top + HT * tan);
    return { xT, xF, hw, xB: xT + (xF - xT) * (HT - BRACE_Z) / HT };
  });
  return {
    posts,
    footL: FOOT_L - (FOOT_L - 14) * v.frm,
    footD: FOOT_D - (FOOT_D - 14) * v.frm,
    yc,
    // der Riegel kommt erst, wenn die Streben schon geneigt sind
    braceO: Math.max(0, Math.min(1, (v.frm - 0.25) / 0.75)),
  };
}
export const postPath = (q: { xT: number; xF: number; hw: number }) =>
  `M${r(q.xT - q.hw)},${HT}L${r(q.xT + q.hw)},${HT}L${r(q.xF + q.hw)},0L${r(q.xF - q.hw)},0Z`;
export const rectPath = (x: number, y: number, w: number, h: number) =>
  `M${r(x)},${r(y)}L${r(x + w)},${r(y)}L${r(x + w)},${r(y + h)}L${r(x)},${r(y + h)}Z`;
export const bracePath = (b: ReturnType<typeof base>) =>
  rectPath(b.posts[0].xB, BRACE_Z, b.posts[1].xB - b.posts[0].xB, BRACE_H);

/** Maßlinie der Länge, in der Bodenebene vor dem Tisch. */
export function dimLen(v: Vec) {
  const y = -24, t = 7;
  const a = p(0, y, 0), b = p(v.len, y, 0);
  const u0 = p(0, y, TOPZ + 8), u1 = p(v.len, y, TOPZ + 8);
  return {
    line: `M${r(a[0])},${r(a[1])}L${r(b[0])},${r(b[1])}`,
    ticks: `M${r(a[0])},${r(a[1] - t)}L${r(a[0])},${r(a[1] + t)}`
         + `M${r(b[0])},${r(b[1] - t)}L${r(b[0])},${r(b[1] + t)}`,
    help: `M${r(a[0])},${r(a[1] - 5)}L${r(u0[0])},${r(u0[1])}`
        + `M${r(b[0])},${r(b[1] - 5)}L${r(u1[0])},${r(u1[1])}`,
    tx: r((a[0] + b[0]) / 2), ty: r(a[1] - 13),
  };
}
/** Maßlinie der Tiefe, links am Tisch. Wird nur gezeigt, wo ein Maß belegt ist. */
export function dimDep(v: Vec) {
  const x = -16, t = 6;
  const a = p(x, 0, 0), b = p(x, v.dep, 0);
  return {
    line: `M${r(a[0])},${r(a[1])}L${r(b[0])},${r(b[1])}`,
    ticks: `M${r(a[0] - t)},${r(a[1])}L${r(a[0] + t)},${r(a[1])}`
         + `M${r(b[0] - t)},${r(b[1])}L${r(b[0] + t)},${r(b[1])}`,
    tx: r((a[0] + b[0]) / 2 - 7), ty: r((a[1] + b[1]) / 2 - 10),
  };
}
/** Schatten, in der Bodenebene — also automatisch richtig verkürzt. */
export function shade(v: Vec) {
  return { cx: r(v.len / 2), cy: r(v.dep / 2), rx: r(v.len / 2), ry: r(Math.max(v.dep / 2 * 1.08, 8)) };
}

/* Die Zeichnung wächst nach rechts; damit sie in der Bühne nicht nach links
   rutscht, wird sie als Ganzes zentriert. Der Versatz ist Teil des Tweens,
   also wandert die Platte beim Größenwechsel sichtbar aus der Mitte heraus. */
const LEFT = OX + -16 * K;                       // linke Tiefen-Maßlinie
export function centerDx(v: Vec) {
  const right = OX + (v.len + v.dep * SX) * K;
  return r((VB.w - (right - LEFT)) / 2 - LEFT);
}
/** Fahne "nach Maß" am rechten Ende der Platte. */
export function flagPos(v: Vec) {
  const q = p(v.len + 6, v.dep, TOPZ);
  return { x: r(q[0]), y: r(q[1] - 10) };
}

/* ── Detailfenster ────────────────────────────────────────────────────────
   21 cm Kantenausschnitt, rund achtfach vergrößert, in derselben Projektion
   und aus derselben Kontur. Nur hier sind 4 cm Plattenstärke, eine
   1,2-cm-Fase und der Wuchs einer Baumkante wirklich zu sehen. Eine
   Werkzeichnung darf das: das ist ein Detailschnitt, keine Übertreibung.  */
export const DVB = { w: 30, h: 28 };
const DW = 21, DOX = 4, DOY = 23, DT0 = 0.30, DN = 26;
const dp = (x: number, y: number, z: number) =>
  `${r(DOX + x + y * SX)},${r(DOY - (y * SY + z))}`;

export function detail(v: Vec) {
  const c = SWISS_C * v.swiss;
  const tw = DW / Math.max(v.len, 1);
  const q = (i: number) => edgeAt(v, DT0 + (i / DN) * tw);
  let dk = "", ch = "", bd = "";
  for (let i = 0; i <= DN; i++) {
    const x = (i / DN) * DW, e = q(i);
    dk += (i ? "L" : "M") + dp(x, e.y + c, TH);
    ch += (i ? "L" : "M") + dp(x, e.y + c, TH);
    bd += (i ? "L" : "M") + dp(x, e.y, TH - c);
  }
  dk += `L${dp(DW, 9, TH)}L${dp(0, 9, TH)}Z`;
  for (let i = DN; i >= 0; i--) ch += "L" + dp((i / DN) * DW, q(i).y, TH - c);
  ch += "Z";
  for (let i = DN; i >= 0; i--) { const e = q(i); bd += "L" + dp((i / DN) * DW, e.y, -e.dz); }
  bd += "Z";
  return { deck: dk, cham: ch, band: bd };
}
export const DGRAIN = [1.3, 3.1, 5.0, 7.2];
export const DBRUSH = Array.from({ length: 17 }, (_, i) => 0.7 + i * 0.5);
export const dLine = (y: number) => `M${dp(0, y, TH)}L${dp(DW, y, TH)}`;
export const DBRACKET =
  `M${dp(DW + 2.4, 0, TH)}L${dp(DW + 2.4, 0, 0)}` +
  `M${dp(DW + 1.2, 0, TH)}L${dp(DW + 3.6, 0, TH)}` +
  `M${dp(DW + 1.2, 0, 0)}L${dp(DW + 3.6, 0, 0)}`;

/* Bürstlinien der Hauptansicht: gerade Haarlinien längs der Faser, in
   Zentimetern der Deckflächen-Ebene. Konstant — sie werden an der
   Kantenkontur geclippt, deshalb muss der Tween sie nicht anfassen. */
export const MBRUSH = Array.from({ length: 30 }, (_, i) => 1.2 + i * 3.4);
export const mLine = (y: number) => `M-6,${r(y)}L306,${r(y)}`;

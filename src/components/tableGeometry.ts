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

   Vorbild sind die eigenen Fotos aus Wesel: die Platten sind keine
   Baumscheiben, sondern Lamellenplatten — schmale Eichenstäbe im Verband,
   ringsum eine Friesleiste. Die Gestelle sind die beiden, die im Markt an
   der Wand hängen: U-100-100 und X-Balken-Set, Flachstahl schwarz.
   ───────────────────────────────────────────────────────────────────────── */

export const K = 2.52;                 // Einheiten je Zentimeter
export const SX = 0.56;                // Tiefenversatz nach rechts
export const SY = 0.44;                // Tiefenversatz nach oben
export const OX = 70;                  // Ursprung (0,0,0) in der viewBox
export const OY = 392;
export const VB = { w: 1000, h: 470 };

export const TH = 4;                   // Plattenstärke in cm (Schild: 4 cm stark)
export const HT = 72;                  // Gestellhöhe in cm — bewusst OHNE Maßzahl,
                                       // kein Schild und kein Inserat nennt sie
export const TOPZ = HT + TH;
export const INSET = 26;               // Rücksprung der Rahmen vom Plattenende
export const RAW_AMP = 1.7;            // cm, größter Ausschlag der Baumkante
export const SWISS_C = 1.2;            // cm, Fasenbreite der Schweizer Kante
export const SAMPLES = 96;             // Stützpunkte je Längskante — immer gleich viele
                                       // (die schnellste Schwingung ist 9,1 Perioden
                                       // lang, das sind rund 10 Punkte je Periode)

/* Der Zustand der Zeichnung. Alles sind Zahlen, damit der Tween sie
   einzeln interpolieren kann — auch die Gestellform. */
export type Vec = {
  len: number; dep: number; raw: number; swiss: number;
  /** halber Strebenabstand oben, als Anteil der vollen Spannweite */
  top: number;
  /** dasselbe unten; negativ heisst, die Streben haben die Seiten getauscht */
  bot: number;
  /** Kufe am Boden, 0..1 */
  kufe: number;
  /** Querriegel auf halber Hoehe, 0..1 */
  bar: number;
  /** Ueberblendung zum Mittelfuss-Kreuzgestell: 0 = zwei Rahmen an den
      Enden, 1 = ein Kreuzfuss in der Mitte */
  mid: number;
};

const r = (n: number) => Math.round(n * 10) / 10;
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

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
/** Ebene quer zum Tisch, bei festem x. Lokal wird in (Tiefe y, Höhe z) gerechnet —
    darin liegen die beiden Gestellrahmen. */
export const planeSide = (x: number) =>
  `matrix(${r(SX * K)} ${r(-SY * K)} 0 ${-K} ${r(OX + x * K)} ${OY})`;

/* Deterministische Wuchskurve. Vorbild ist das eigene Detailfoto der
   Kante: eine Baumkante ist fast gerade. Sie läuft nicht in einem großen
   Bogen durch, sondern bleibt dicht an der Flucht und setzt dort, wo ein
   Ast saß, eine kleine Nase ab. Deshalb vier Sinus mit steigender
   Frequenz und kleiner werdendem Ausschlag statt einer langen Welle —
   und überall gleich: kein Math.random und kein fract(sin(x)*43758),
   das zwischen Server und Client kippen kann. */
function wuchs(t: number, ph: number) {
  return 0.40 * Math.sin(6.2832 * 1.7 * t + 0.7 + ph)
       + 0.26 * Math.sin(6.2832 * 3.9 * t + 2.1 + ph)
       + 0.20 * Math.sin(6.2832 * 7.3 * t + 4.4 + ph)
       + 0.14 * Math.sin(6.2832 * 9.1 * t + 1.3 + ph);
}
/* Die Enden sind gesägt: dort läuft der Wuchs aus, die Platte hat an
   beiden Stirnseiten eine rechtwinklige Ecke. Die Potenz hält das Fenster
   über die ganze Länge bei 1 und zieht es erst kurz vor dem Ende herunter. */
function saum(t: number) {
  return Math.pow(Math.sin(Math.PI * Math.max(0, Math.min(1, t))), 0.33);
}

/** Vordere Längskante an der Stelle t (0..1). y nach vorn, dz = Stärkeschwankung. */
export function edgeAt(v: Vec, t: number) {
  const w = wuchs(t, 0);
  return {
    y: -v.raw * RAW_AMP * saum(t) * (0.5 + 0.5 * w),
    dz: v.raw * 0.45 * saum(t) * w,
  };
}
/** Hintere Längskante, andere Phase — dasselbe Brett, nicht gespiegelt. */
function backAt(v: Vec, t: number) {
  const w = wuchs(t, 2.6);
  return v.dep + v.raw * RAW_AMP * saum(t) * (0.5 + 0.5 * w);
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

/* ── Lamellen ─────────────────────────────────────────────────────────────
   So sehen die Platten im Markt aus: schmale Eichenstäbe nebeneinander,
   die Stöße von Reihe zu Reihe versetzt, dazwischen Stäbe in leicht
   unterschiedlichem Ton. Das Raster steht FEST in Zentimetern und wird an
   der Plattenkontur geclippt — eine größere Platte bekommt mehr Stäbe,
   nicht breitere. Deshalb muss der Tween es auch nie anfassen.            */
export const FRIES = 9;                // cm Friesbreite ringsum
const LAM_ROW = 7.6;                   // cm Stabbreite
const LAM_PITCH = 42;                  // cm mittlere Stablänge
const LAM_ROWS = 15;                   // deckt 114 cm Tiefe
const LAM_COLS = 11;                   // deckt rund 460 cm Länge

/* Lehmer-Generator auf ganzen Zahlen: s * 48271 bleibt unter 2^53, das
   Ergebnis ist auf Server und Client bitgleich. */
function rnd(seed: number) {
  let n = (seed % 2147483646) + 1;
  return () => { n = (n * 48271) % 2147483647; return n / 2147483647; };
}

export type Lam = { x: number; y: number; w: number; o: number };
export const LAM_H = LAM_ROW;
export const LAMS: Lam[] = (() => {
  const out: Lam[] = [];
  const g = rnd(19);
  for (let k = 0; k < LAM_ROWS; k++) {
    let x = -LAM_PITCH * (0.2 + 0.8 * g());      // Reihenversatz: Stöße stehen im Verband
    for (let j = 0; j < LAM_COLS; j++) {
      const w = LAM_PITCH * (0.5 + 1.0 * g());
      out.push({
        x: r(x), y: r(k * LAM_ROW), w: r(w),
        o: Math.round((g() * 2 - 1) * 5) / 100,  // −0,05 … +0,05
      });
      x += w;
    }
  }
  return out;
})();
export const LAM_SEAMS = LAMS.map((l) => `M${l.x},${l.y}L${l.x},${r(l.y + LAM_ROW)}`);
export const LAM_ROWLINES = Array.from({ length: LAM_ROWS - 1 }, (_, k) =>
  `M-12,${r((k + 1) * LAM_ROW)}L392,${r((k + 1) * LAM_ROW)}`);

/* Astlöcher: feste Stellen im Brett, ebenfalls geclippt. */
export const KNOTS = [
  { x: 41, y: 23.5, rx: 2.1, ry: 1.2 },
  { x: 118, y: 10.5, rx: 1.5, ry: 0.9 },
  { x: 187, y: 49, rx: 1.8, ry: 1.1 },
  { x: 262, y: 28, rx: 1.3, ry: 0.8 },
];

/** Friesleiste: Ring zwischen Plattenkontur und der um FRIES eingerückten
    Kontur, als ein Pfad mit fill-rule evenodd. Eine Baumkante hat keinen
    Fries — dort blendet er über 1 − raw aus. */
export function fries(v: Vec) {
  const c = SWISS_C * v.swiss, f = FRIES;
  let d = "";
  for (let i = 0; i <= SAMPLES; i++) {
    const t = i / SAMPLES;
    d += (i ? "L" : "M") + s(t * v.len, edgeAt(v, t).y + c, TOPZ);
  }
  for (let i = SAMPLES; i >= 0; i--) {
    const t = i / SAMPLES;
    d += "L" + s(t * v.len, backAt(v, t) - c, TOPZ);
  }
  d += "Z";
  const x0 = f, x1 = Math.max(v.len - f, f + 2), L = Math.max(v.len, 1);
  for (let i = 0; i <= SAMPLES; i++) {
    const x = x0 + (i / SAMPLES) * (x1 - x0);
    d += (i ? "L" : "M") + s(x, edgeAt(v, x / L).y + c + f, TOPZ);
  }
  for (let i = SAMPLES; i >= 0; i--) {
    const x = x0 + (i / SAMPLES) * (x1 - x0);
    d += "L" + s(x, backAt(v, x / L) - c - f, TOPZ);
  }
  return d + "Z";
}
/** Die vier Gehrungen in den Ecken des Frieses. */
export function mitre(v: Vec) {
  const c = SWISS_C * v.swiss, f = FRIES, L = Math.max(v.len, 1);
  const yf0 = edgeAt(v, 0).y + c, yf1 = edgeAt(v, 1).y + c;
  const yb0 = backAt(v, 0) - c, yb1 = backAt(v, 1) - c;
  const x1 = Math.max(v.len - f, f + 2);
  return "M" + s(0, yf0, TOPZ) + "L" + s(f, edgeAt(v, f / L).y + c + f, TOPZ)
       + "M" + s(v.len, yf1, TOPZ) + "L" + s(x1, edgeAt(v, x1 / L).y + c + f, TOPZ)
       + "M" + s(0, yb0, TOPZ) + "L" + s(f, backAt(v, f / L) - c - f, TOPZ)
       + "M" + s(v.len, yb1, TOPZ) + "L" + s(x1, backAt(v, x1 / L) - c - f, TOPZ);
}

/* ── Gestell ──────────────────────────────────────────────────────────────
   An der Wand in Wesel hängt eine ganze Reihe Untergestelle, und sie sind
   eine Familie: oben eine Montageplatte, darunter zwei Streben aus
   Flachstahl, unten je nach Modell eine durchgehende Kufe oder zwei
   Einzelfüße, beim A-Bock dazu ein Querriegel. Was sie unterscheidet,
   sind vier Zahlen — wie weit die Streben oben auseinanderstehen, wie weit
   unten, ob eine Kufe da ist, ob ein Riegel quer liegt. Deshalb ist der
   Wechsel zwischen ihnen eine Bewegung und kein Umschalter.

     U-100-100   oben wie unten voll, Kufe am Boden
     Trapez      oben 40 cm, unten 100 cm
     A-Gestell   oben fast zusammengelaufen, Querriegel
     V-Gestell   oben 100 cm, unten 40 cm
     X-Balken    die Streben tauschen die Seiten und kreuzen sich

   Beide Rahmen stehen quer zum Tisch, je einer unter einem Plattenende —
   so stehen sie auch im Markt.                                            */
const RAIL_H = 6;                      // cm Höhe der oberen Montageplatte
const RAIL_OUT = 3;                    // cm Überstand der Platte je Seite
const LEG_W = 10;                      // cm Breite des Flachstahls (100er Flachstahl)
const FOOT_H = 5;                      // cm Höhe von Kufe und Füßen
const FOOT_L = 15;                     // cm Länge eines Einzelfußes
const BAR_H = 5;                       // cm Höhe des Querriegels am A-Bock
const BAR_Z = 0.42;                    // Anteil der Strebenhöhe, auf der er sitzt
const BASE_W = 100;                    // cm Spannweite laut Preisschild (U-100-100)
const FRAME_IN = 7;                    // cm Rücksprung der Rahmen von der Plattenkante
/* Materialstärke des Flachstahls. Sie liegt quer zur Rahmenebene, also
   genau in x — in der Kavalier-Projektion ist das ein reiner Versatz nach
   rechts. Deshalb kann die Rückseite jedes Rahmens ein <use> sein. */
export const TKX = 2.6;                // cm
export const TKDX = Math.round(TKX * K * 10) / 10;

export type Form = { top: number; bot: number; kufe: number; bar: number };
/* Die Zahlen sind an den Preisschildern und an der Gestellwand abgenommen.
   top/bot sind Anteile der vollen Spannweite: Trapez 40-100 heißt oben 40
   von 100, also ein Drittel. */
export const FORMEN: Record<string, Form> = {
  u:      { top: 1,     bot:  1, kufe: 1, bar: 0 },
  trapez: { top: 1 / 3, bot:  1, kufe: 0, bar: 0 },
  a:      { top: 0.12,  bot:  1, kufe: 0, bar: 1 },
  x:      { top: 1,     bot: -1, kufe: 0, bar: 0 },
};
/* Auf der Gestellwand hängt auch eine Form, die wie ein V aussieht — oben
   breit, unten schmal. Die steht hier NICHT: an einer Wand hängt ein Trapez
   auf dem Kopf genauso, und kein Preisschild auf unseren Fotos nennt ein
   V-Gestell. Gibt es eins, ist es eine Zeile. */

export function base(v: Vec) {
  const halfL = Math.max(v.len / 2 - INSET, 15);
  const span = Math.min(BASE_W, Math.max(v.dep - 2 * FRAME_IN, 42));
  const yc = v.dep / 2;
  const a = span / 2 - LEG_W / 2;            // Abstand Strebenmitte von der Rahmenmitte
  const hz = HT - RAIL_H;                    // Höhe, über die die Strebe läuft
  const tA = a * v.top;
  const bA = a * v.bot;
  const legs = [-1, 1].map((sg) => {
    const yT = yc + sg * tA;
    const yF = yc + sg * bA;
    /* Die Strebe steht schräg; damit sie überall gleich breit aussieht,
       wird ihre waagerechte Breite um den Neigungswinkel aufgeweitet. */
    const hw = (LEG_W / 2) / Math.cos(Math.atan((yT - yF) / hz));
    return { yT, yF, hw };
  });
  const barZ = BAR_Z * hz;
  const bY = legs.map((q) => q.yF + (q.yT - q.yF) * (barZ / hz));
  const lo = Math.min(bY[0], bY[1]) + legs[0].hw * 0.9;
  const hi = Math.max(bY[0], bY[1]) - legs[1].hw * 0.9;
  const kufeHalf = Math.abs(bA);
  return {
    xs: [v.len / 2 - halfL, v.len / 2 + halfL],
    yc, legs,
    railY: r(yc - tA - LEG_W / 2 - RAIL_OUT),
    railW: r(2 * tA + LEG_W + 2 * RAIL_OUT),
    kufeY: r(yc - kufeHalf - LEG_W / 2),
    kufeW: r(2 * kufeHalf + LEG_W),
    barY: r(lo),
    barW: r(Math.max(hi - lo, 0)),
    barZ: r(barZ),
    /* Wo eine Kufe liegt, braucht es keine Einzelfüße — und umgekehrt. */
    kufeO: Math.round(clamp01(v.kufe) * 100) / 100,
    footO: Math.round(clamp01(1 - v.kufe) * 100) / 100,
    barO: Math.round(clamp01(v.bar) * 100) / 100,
  };
}
export type Base = ReturnType<typeof base>;

export const rectPath = (x: number, y: number, w: number, h: number) =>
  `M${r(x)},${r(y)}L${r(x + w)},${r(y)}L${r(x + w)},${r(y + h)}L${r(x)},${r(y + h)}Z`;
/* Die Montageplatte steht an beiden Seiten ein Stück über die Streben
   hinaus — auf dem Foto von der Gestellwand gut zu sehen. */
export const railPath = (b: Base) => rectPath(b.railY, HT - RAIL_H, b.railW, RAIL_H);
export const kufePath = (b: Base) => rectPath(b.kufeY, 0, b.kufeW, FOOT_H);
export const barPath = (b: Base) => rectPath(b.barY, b.barZ, b.barW, BAR_H);
export const legPath = (q: Base["legs"][number]) =>
  `M${r(q.yT - q.hw)},${HT - RAIL_H}L${r(q.yT + q.hw)},${HT - RAIL_H}` +
  `L${r(q.yF + q.hw)},0L${r(q.yF - q.hw)},0Z`;
export const footPath = (q: Base["legs"][number]) =>
  rectPath(q.yF - FOOT_L / 2, 0, FOOT_L, FOOT_H);

/* ── Mittelfuß-Kreuzgestell ───────────────────────────────────────────────
   Die Reihe auf der Bank vor der Gestellwand: kein Rahmen an jedem Ende,
   sondern ein Fuß in der Mitte. Von einem Knoten auf halber Höhe laufen
   vier Arme nach oben-außen unter die Platte und vier nach unten-außen auf
   den Boden — von der Seite ein X, von oben ein Kreuz.

   Das passt in keine der beiden Ebenen-Matrizen, weil die Arme schräg
   durch den Raum laufen. Deshalb hier als echte Vierecke: zwei Punkte in
   Zentimetern, Breite waagerecht quer zur Laufrichtung, vier Ecken durch
   p() projiziert.                                                         */
const SP_AX = 42;                      // cm, halbe Spannweite längs
const SP_W = 9;                        // cm, Breite des Flachstahls

function bar3(
  q0: [number, number, number],
  q1: [number, number, number],
  w: number,
) {
  const dx = q1[0] - q0[0], dy = q1[1] - q0[1];
  const L = Math.hypot(dx, dy) || 1;
  const nx = (-dy / L) * (w / 2), ny = (dx / L) * (w / 2);
  const c = [
    p(q0[0] + nx, q0[1] + ny, q0[2]), p(q1[0] + nx, q1[1] + ny, q1[2]),
    p(q1[0] - nx, q1[1] - ny, q1[2]), p(q0[0] - nx, q0[1] - ny, q0[2]),
  ];
  return "M" + c.map((e) => `${r(e[0])},${r(e[1])}`).join("L") + "Z";
}

export function spider(v: Vec) {
  const cx = v.len / 2, cy = v.dep / 2;
  const ax = Math.max(Math.min(SP_AX, v.len / 2 - 16), 18);
  const ay = Math.max(Math.min(v.dep / 2 - FRAME_IN, 34), 15);
  const hz = HT - RAIL_H;
  const zc = r(hz * 0.52);                     // Höhe des Knotens
  /* Hinten zuerst, vorn zuletzt — sonst stimmt die Verdeckung nicht. */
  const ecken: [number, number][] = [[-1, 1], [1, 1], [-1, -1], [1, -1]];
  const arme = ecken.flatMap(([sx, sy]) => [
    bar3([cx, cy, zc], [cx + sx * ax, cy + sy * ay, 0], SP_W),
    bar3([cx, cy, zc], [cx + sx * ax, cy + sy * ay, hz], SP_W),
  ]);
  /* Das Montagekreuz oben, zwei flache Balken über die Diagonalen. */
  const kreuz = [
    bar3([cx - ax, cy - ay, hz], [cx + ax, cy + ay, hz], SP_W),
    bar3([cx - ax, cy + ay, hz], [cx + ax, cy - ay, hz], SP_W),
  ];
  return { arme, kreuz };
}
export type Spider = ReturnType<typeof spider>;

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
  let dk = "", ch = "", bd = "", saw = "";
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
  /* Sägeschnitt auf der Stirnfläche: waagerechte Riefen, wie auf dem Foto
     der Baumkante. Nur dort — eine gehobelte Kante hat sie nicht. */
  for (let k = 1; k <= 6; k++) {
    const z = (TH * k) / 7;
    for (let i = 0; i <= 8; i++) {
      const x = (i / 8) * DW, e = q(Math.round((i / 8) * DN));
      saw += (i ? "L" : "M") + dp(x, e.y, z - e.dz * (1 - k / 7));
    }
  }
  return { deck: dk, cham: ch, band: bd, saw };
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
export const MBRUSH = Array.from({ length: 34 }, (_, i) => 1.0 + i * 3.3);
export const mLine = (y: number) => `M-8,${r(y)}L372,${r(y)}`;

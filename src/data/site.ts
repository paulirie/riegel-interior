/* Produktdaten — Beispiel; Preise & Maße bitte durch echte Werte ersetzen. */

export type Product = {
  id: string;
  cat: string;
  name: string;
  sub: string;
  price: string;
  from: boolean;
  masse: string;
  material: string;
  extra: string;
  colors: string[];
  cnames: string;
};

export const PRODUCTS: Product[] = [
  { id: "p-eiche-baumkante", cat: "esstische", name: "Esstisch „Baumkante“", sub: "Eiche massiv · geölt", price: "1.290", from: true,
    masse: "180 × 90 × 76 cm", material: "Eiche massiv, naturgeölt", extra: "Auch 200 / 220 / 260 cm", colors: ["#caa472", "#8a6a45", "#5a4631", "#2c2620"], cnames: "Natur · Cognac · Smoked · Black" },
  { id: "p-suar-unikat", cat: "esstische", name: "Suar-Tisch „Unikat“", sub: "Suar massiv · Baumstamm", price: "1.890", from: true,
    masse: "220 × 100 × 76 cm", material: "Suar (Akazie) massiv", extra: "Jede Platte ein Einzelstück", colors: ["#b58f5e", "#7c5e3c", "#3a2e20"], cnames: "Natur · Cognac · Smoked" },
  { id: "p-stuhl-cognac", cat: "stuehle", name: "Stuhl „Cognac“", sub: "Echtleder · Eichenbeine", price: "189", from: false,
    masse: "46 × 55 × 88 cm", material: "Echtleder, Gestell Eiche", extra: "Stapelbar bis 4 Stück", colors: ["#9c6b3f", "#2c2620", "#6c655b"], cnames: "Cognac · Schwarz · Grau" },
  { id: "p-sofa-cloud", cat: "sofas", name: "Sofa „Cloud“ 3-Sitzer", sub: "Webstoff · Federkern", price: "1.490", from: true,
    masse: "232 × 102 × 84 cm", material: "Webstoff, Federkern, Holzgestell", extra: "Auch als Ecksofa / 2-Sitzer", colors: ["#b9b2a4", "#6c655b", "#34302a", "#d8d2c6"], cnames: "Sand · Stein · Anthrazit · Creme" },
  { id: "p-sideboard-teak", cat: "anrichten", name: "Sideboard „Teak“", sub: "Teak massiv · 3 Türen", price: "890", from: true,
    masse: "180 × 45 × 75 cm", material: "Teak massiv, geölt", extra: "Passende Anrichte & Highboard erhältlich", colors: ["#a87f4f", "#5a4631"], cnames: "Natur · Smoked" },
  { id: "p-anrichte-eiche", cat: "anrichten", name: "Anrichte „Eiche“", sub: "Eiche massiv · Serie Vest", price: "1.190", from: true,
    masse: "200 × 48 × 80 cm", material: "Eiche massiv, Soft-Close", extra: "Serie: Sideboard, Schrank, Lowboard", colors: ["#caa472", "#8a6a45", "#2c2620"], cnames: "Natur · Cognac · Black" },
  { id: "p-couchtisch-treibholz", cat: "accessoires", name: "Couchtisch „Treibholz“", sub: "Treibholz · Glasplatte", price: "390", from: false,
    masse: "110 × 70 × 40 cm", material: "Treibholz, Sicherheitsglas", extra: "Naturgewachsen — Form variiert", colors: ["#b09a7c", "#7c6a52"], cnames: "Natur hell · Natur dunkel" },
  { id: "p-schrank-eiche", cat: "schraenke", name: "Kleiderschrank „Massiv“", sub: "Eiche massiv · 3-türig", price: "1.690", from: true,
    masse: "150 × 60 × 210 cm", material: "Eiche massiv, Echtholzfront", extra: "Auch 2- & 4-türig", colors: ["#caa472", "#8a6a45", "#2c2620"], cnames: "Natur · Cognac · Black" },
  { id: "p-teppich-wolle", cat: "textil", name: "Teppich „Berber“", sub: "Reine Schurwolle", price: "299", from: true,
    masse: "200 × 300 cm", material: "100 % Schurwolle, handgewebt", extra: "Auch 160×230 & 240×340 cm", colors: ["#e7e0d2", "#b9b2a4", "#34302a"], cnames: "Creme · Stein · Anthrazit" },
  { id: "p-kissen-set", cat: "textil", name: "Kissen-Set „Leinen“", sub: "2er-Set · Leinen", price: "49", from: false,
    masse: "50 × 50 cm", material: "Gewaschenes Leinen, Reißverschluss", extra: "Viele Farben kombinierbar", colors: ["#d8d2c6", "#b9a98c", "#6c655b", "#34302a"], cnames: "Creme · Sand · Grau · Schwarz" },
  { id: "p-leuchte-teak", cat: "lampen", name: "Stehleuchte „Teak“", sub: "Teak · Leinenschirm", price: "149", from: false,
    masse: "Ø 40 × 160 cm", material: "Teakfuß, Leinenschirm", extra: "Passende Tischleuchte erhältlich", colors: ["#a87f4f", "#e7e0d2"], cnames: "Teak natur · Schirm creme" },
  { id: "p-schale-teak", cat: "accessoires", name: "Deko-Schale „Wurzelholz“", sub: "Teak-Wurzel · Unikat", price: "39", from: false,
    masse: "ca. Ø 30 × 12 cm", material: "Teak-Wurzelholz, naturbelassen", extra: "Jedes Stück einzigartig", colors: ["#b09a7c", "#7c6a52"], cnames: "Natur hell · Natur dunkel" },
];

export const FILTERS = [
  { id: "all", label: "Alle" },
  { id: "esstische", label: "Esstische" },
  { id: "stuehle", label: "Stühle" },
  { id: "sofas", label: "Sofas & Garnituren" },
  { id: "anrichten", label: "Anrichten & Sideboards" },
  { id: "schraenke", label: "Schränke" },
  { id: "accessoires", label: "Accessoires" },
  { id: "textil", label: "Teppiche & Kissen" },
  { id: "lampen", label: "Lampen" },
];

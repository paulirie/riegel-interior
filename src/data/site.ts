/* Produktdaten.
 *
 * Alles hier steht so auf den Preisschildern im Markt oder ist auf den
 * eigenen Fotos zu sehen. Die Bilder sind Ausschnitte aus unseren eigenen
 * Showroom-Aufnahmen (public/img/prod/) — kein fremdes Bildmaterial.
 *
 * Wo auf dem Schild kein Preis zu lesen war, steht price: null. Die Karte
 * zeigt dann "Preis im Markt" statt einer erfundenen Zahl.
 */

export type Product = {
  id: string;
  cat: string;
  name: string;
  sub: string;
  img: string;
  /** null = Preis nicht hinterlegt, Karte zeigt "Preis im Markt" */
  price: string | null;
  /** durchgestrichener Vorher-Preis, wenn es ein Abverkauf ist */
  was?: string;
  masse?: string;
  material?: string;
  extra?: string;
  /** Einzelstück — kommt so kein zweites Mal */
  unikat?: boolean;
};

export const PRODUCTS: Product[] = [
  {
    id: "stuhl-sam",
    cat: "stuehle",
    name: "Stuhl Sam 2.0",
    sub: "Webstoff · mit Drehfunktion",
    img: "/img/prod/stuhl-sam.jpg",
    price: "249",
    material: "Webstoff, Gestell Metall schwarz",
    extra: "Zwei weitere Farben erhältlich",
  },
  {
    id: "stuhl-dave",
    cat: "stuehle",
    name: "Stuhl Dave",
    sub: "Freischwinger ohne Armlehne",
    img: "/img/prod/stuhl-dave.jpg",
    price: "189",
    was: "299",
    material: "Bezug in Lederoptik, Kufengestell schwarz",
    extra: "Bestellware · weitere Farben möglich",
  },
  {
    id: "ecksofa-glimminge",
    cat: "sofas",
    name: "Ecksofa Glimminge",
    sub: "Breitcord · Récamiere",
    img: "/img/prod/ecksofa.jpg",
    price: "1.595",
    material: "Breitcord creme",
    extra: "Abverkauf — nur solange der Vorrat reicht",
  },
  {
    id: "couchtisch-suar",
    cat: "tische",
    name: "Couchtisch Suar 80 × 80",
    sub: "Suar massiv · Baumscheibe",
    img: "/img/prod/couchtisch-suar.jpg",
    price: "595",
    was: "695",
    masse: "80 × 80 cm",
    material: "Suar massiv",
    unikat: true,
  },
  {
    id: "bar-suar-root",
    cat: "tische",
    name: "Bar-Tisch Suar-Root",
    sub: "Gewachsene Wurzel · Einzelstück",
    img: "/img/prod/bar-suar.jpg",
    price: "4.990",
    masse: "ca. 400 cm lang",
    material: "Suar-Wurzel, massiv",
    extra: "Steht in Wesel — bitte vorher anrufen",
    unikat: true,
  },
  {
    id: "tisch-suar-rund",
    cat: "tische",
    name: "Baumscheibentisch rund",
    sub: "Suar massiv · Vollscheibe",
    img: "/img/prod/tisch-suar-rund.jpg",
    price: null,
    material: "Suar massiv, Mittelfuß schwarz",
    extra: "Jede Scheibe wächst anders — Maß und Preis im Markt",
    unikat: true,
  },
  {
    id: "beistelltisch-baumscheibe",
    cat: "tische",
    name: "Beistelltisch Baumscheibe",
    sub: "Teak massiv · drei Höhen",
    img: "/img/prod/beistelltisch.jpg",
    price: null,
    material: "Teak massiv, naturbelassen",
    extra: "Einzeln oder als Gruppe",
    unikat: true,
  },
  {
    id: "tischplatte-eiche",
    cat: "platten",
    name: "Tischplatte Eiche",
    sub: "Schweizer Schnitte · vollmassiv",
    img: "/img/prod/tischplatte.jpg",
    price: "450",
    masse: "140 / 200 / 240 cm, 4 cm stark",
    material: "Eiche vollmassiv, Schweizer Schnitte",
    extra: "140 cm 450 € (statt 599) · 200 cm 855 € (statt 1.099) · 240 cm 995 € (statt 1.499)",
  },
  {
    id: "gestell-u",
    cat: "gestelle",
    name: "Untergestell U-100-100",
    sub: "Stahl · pulverbeschichtet",
    img: "/img/prod/gestell-u.jpg",
    price: "279",
    material: "Stahl, schwarz",
    extra: "Auch als Trapez 40-100 zum selben Preis",
  },
  {
    id: "gestell-x",
    cat: "gestelle",
    name: "Stahluntergestell X-Balken",
    sub: "Set · pulverbeschichtet",
    img: "/img/prod/gestell-x.jpg",
    price: "279",
    was: "349",
    material: "Stahl, schwarz",
    extra: "Set — passt unter alle unsere Platten",
  },
  {
    id: "beton-hocker",
    cat: "accessoires",
    name: "Beton-Hocker",
    sub: "In diversen Ausführungen",
    img: "/img/prod/beton-hocker.jpg",
    price: "59",
    material: "Beton",
    extra: "Abverkauf — verschiedene Oberflächen",
  },
  {
    id: "leuchte-rattan",
    cat: "lampen",
    name: "Hängeleuchte Rattan",
    sub: "Geflochten · mehrere Größen",
    img: "/img/prod/leuchte-rattan.jpg",
    price: null,
    material: "Rattan, geflochten",
    extra: "Hängt bei uns über dem Esstischbereich",
  },
];

const LABELS: Record<string, string> = {
  stuehle: "Stühle",
  sofas: "Sofas",
  tische: "Tische",
  platten: "Tischplatten",
  gestelle: "Gestelle",
  accessoires: "Accessoires",
  lampen: "Lampen",
};

/* Nur Filter zeigen, hinter denen auch etwas liegt — ein leerer Filter
   lässt den Shop größer wirken, als er ist. */
export const FILTERS = [
  { id: "all", label: "Alle" },
  ...Object.keys(LABELS)
    .filter((cat) => PRODUCTS.some((p) => p.cat === cat))
    .map((cat) => ({ id: cat, label: LABELS[cat] })),
];

/* Kontaktwege, die aus dem Shop heraus angeboten werden.
 *
 * REGEL (siehe CLAUDE.md): Der Standort eines Stücks kommt aus seiner
 * Anzeige, nicht aus dem Bauch. Jedes Stück zeigt die Nummer genau des
 * Marktes, in dem es steht, und verlinkt diesen Markt auf /standorte.
 */

/**
 * WhatsApp.
 *
 * e164 ist absichtlich leer: Es ist nicht bestätigt, über welche Nummer
 * WhatsApp läuft. Keines der 196 Kleinanzeigen-Inserate erwähnt WhatsApp,
 * riegel-interior.de auch nicht. Das Kleinanzeigen-Profil führt als zweiten
 * Kontakt die Mobilnummer 0162 572 7008 — naheliegend, aber geraten, und eine
 * geratene Nummer würde Kundennachrichten zu einem Fremden schicken.
 *
 * Solange e164 leer ist, zeigt die Produktkarte "Anrufen" mit der Nummer des
 * jeweiligen Marktes. Sobald die richtige Nummer feststeht, hier eintragen —
 * internationales Format ohne + und ohne führende 0, also z. B.
 * "491625727008" für 0162 572 7008. Der WhatsApp-Knopf erscheint dann von
 * selbst, samt vorausgefüllter Nachricht. Sonst ist nichts zu ändern.
 */
export const WHATSAPP = {
  e164: "",
  display: "",
};

export type Markt = {
  /** so, wie der Standort in site.ts steht */
  key: string;
  /** Kurzname für den Satz "Steht in …" */
  kurz: string;
  nummer: string;
  tel: string;
  /** Sprungmarke auf /standorte */
  anker: string;
  mail: string;
};

export const WESEL: Markt = {
  key: "Wesel", kurz: "Wesel",
  nummer: "0281 147 93 270", tel: "+4928114793270", anker: "/standorte#wesel",
  mail: "shop@riegel-interior.com",
};
export const SCHERMBECK: Markt = {
  key: "Lagerverkauf Schermbeck", kurz: "Schermbeck",
  /* Der Lagerverkauf hängt an derselben Leitung wie Wesel — eine eigene
     Nummer nennt weder die Seite noch ein Inserat. */
  nummer: "0281 147 93 270", tel: "+4928114793270", anker: "/standorte#schermbeck",
  mail: "shop@riegel-interior.com",
};
export const HALTERN: Markt = {
  key: "Haltern am See", kurz: "Haltern am See",
  nummer: "02364 50 99 515", tel: "+4923645099515", anker: "/standorte#haltern",
  mail: "haltern@riegel-interior.com",
};

export const MAERKTE = [WESEL, SCHERMBECK, HALTERN];

/**
 * Der Markt zu einem Standort aus site.ts.
 *
 * Gibt null zurück, wenn der Standort keiner unserer drei Märkte ist — dann
 * nennt die Karte bewusst keinen Markt, statt den falschen zu nennen. Betrifft
 * aktuell nur die beiden Stücke, deren Anzeige Dorsten nennt.
 */
export function marktFuer(loc?: string): Markt | null {
  if (!loc) return null;
  if (loc.includes("Haltern")) return HALTERN;
  if (loc.includes("Schermbeck")) return SCHERMBECK;
  if (loc.includes("Wesel")) return WESEL;
  return null;
}

/** Fällt auf Wesel zurück — nur für Telefon/Mail, nie für eine Ortsangabe. */
export function telFuer(loc?: string) {
  return marktFuer(loc) ?? WESEL;
}

export const MAIL = "shop@riegel-interior.com";

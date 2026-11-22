/* Kontaktwege, die aus dem Shop heraus angeboten werden.
 *
 * REGEL (siehe AGENTS.md, Abschnitt "Riegel Interior — Regeln für das
 * Sortiment"): Der Standort eines Stücks kommt aus seiner Anzeige. Jedes
 * Stück zeigt die Nummer genau des Marktes, in dem es steht, und verlinkt
 * diesen Markt auf /standorte. Steht ein Stück in keinem unserer Märkte,
 * nennt die Karte weder Markt noch Marktnummer.
 *
 * Dies ist die einzige Datei im Projekt, in der eine Telefonnummer, eine
 * Mailadresse oder eine Sprungmarke steht.
 */

export type Markt = {
  /** Kurzname für den Satz "Steht in …" */
  kurz: string;
  nummer: string;
  /** tel:-Ziel, E.164 ohne Leerzeichen */
  tel: string;
  mail: string;
  /** Sprungmarke auf /standorte */
  anker: string;
  /**
   * WhatsApp dieses Marktes, international ohne + und ohne führende 0
   * (z. B. "491625727008"), oder "" wenn keine bestätigt ist.
   *
   * Bewusst je Markt und nicht einmal global: ein globaler Schalter würde
   * auf allen Karten die marktgenaue Nummer durch eine einzige ersetzen und
   * damit genau die Zuordnung aufheben, um die es hier geht. Gibt es eine
   * Nummer fürs ganze Haus, trägt man sie eben bei allen dreien ein.
   *
   * Noch leer: keines der 196 Inserate nennt WhatsApp, riegel-interior.de
   * auch nicht. Das Kleinanzeigen-Profil führt als zweiten Kontakt die
   * Mobilnummer 0162 572 7008 — naheliegend, aber geraten, und eine
   * geratene Nummer schickt Kundennachrichten zu einem Fremden. Sobald die
   * richtige feststeht, hier eintragen; der WhatsApp-Knopf erscheint dann
   * von selbst, samt vorausgefüllter Nachricht.
   */
  whatsapp: string;
};

export const WESEL: Markt = {
  kurz: "Wesel",
  nummer: "0281 147 93 270", tel: "+4928114793270",
  mail: "shop@riegel-interior.com", anker: "/standorte#wesel", whatsapp: "",
};
export const SCHERMBECK: Markt = {
  kurz: "Schermbeck",
  /* Der Lagerverkauf hängt an derselben Leitung wie Wesel. Eine eigene
     Nummer nennt weder unsere Seite noch ein Inserat — also keine erfinden. */
  nummer: "0281 147 93 270", tel: "+4928114793270",
  mail: "shop@riegel-interior.com", anker: "/standorte#schermbeck", whatsapp: "",
};
export const HALTERN: Markt = {
  kurz: "Haltern am See",
  nummer: "02364 50 99 515", tel: "+4923645099515",
  mail: "haltern@riegel-interior.com", anker: "/standorte#haltern", whatsapp: "",
};

/** Reihenfolge wie auf /standorte. Fußzeile und Standorte-Seite lesen hieraus. */
export const MAERKTE: Markt[] = [WESEL, SCHERMBECK, HALTERN];

/**
 * Der Markt zu einem Standort aus site.ts.
 *
 * Gibt null zurück, wenn der Standort keiner unserer drei Märkte ist. Die
 * Karte nennt dann bewusst weder Markt noch Marktnummer, statt den falschen
 * zu nennen — betrifft aktuell die beiden Stücke, deren Anzeige Dorsten
 * nennt. Es gibt hier absichtlich KEINEN Rückfall auf Wesel: ein stiller
 * Rückfall würde eine Nummer ausliefern, deren Markt die Karte gerade
 * verschweigt.
 */
export function marktFuer(loc?: string): Markt | null {
  if (!loc) return null;
  if (loc.includes("Haltern")) return HALTERN;
  if (loc.includes("Schermbeck")) return SCHERMBECK;
  if (loc.includes("Wesel")) return WESEL;
  return null;
}

/** Hauptadresse des Hauses — für alles ohne Produktbezug. */
export const MAIL = WESEL.mail;

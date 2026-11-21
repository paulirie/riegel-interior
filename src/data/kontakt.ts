/* Kontaktwege, die aus dem Shop heraus angeboten werden. */

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

type Kontakt = { nummer: string; tel: string };

const WESEL: Kontakt = { nummer: "0281 147 93 270", tel: "+4928114793270" };
const HALTERN: Kontakt = { nummer: "02364 50 99 515", tel: "+4923645099515" };

/** Wesel und der Lagerverkauf Schermbeck hängen an derselben Nummer. */
export function telFuer(loc?: string): Kontakt {
  return loc?.includes("Haltern") ? HALTERN : WESEL;
}

export const MAIL = "shop@riegel-interior.com";

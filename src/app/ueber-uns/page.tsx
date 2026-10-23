import type { Metadata } from "next";
import Link from "next/link";
import { ImageSlot } from "@/components/ImageSlot";

export const metadata: Metadata = {
  title: "Über uns",
  description:
    "Ein Familienbetrieb in zweiter Generation: die Geschichte von Riegel Interior, unsere Manufaktur und unsere Philosophie.",
};

const VALUES = [
  { n: "01", h: "Einzigartig", p: "Möbel aus aller Welt, die du so nicht überall findest — viele davon Unikate." },
  { n: "02", h: "Hochwertig", p: "Echtes Massivholz, sorgfältig ausgewählt und verarbeitet. Kein Furnier-Schein." },
  { n: "03", h: "Faire Preise", p: "Geschickter Einkauf gibt uns Spielraum — den wir an dich weitergeben." },
  { n: "04", h: "Zertifiziert", p: "Tropische Hölzer aus zertifiziertem Anbau — vom Ursprung bis zu dir nach Hause." },
];

const GENS = [
  { yr: "1.", h: "Der Großvater", p: "Der Anfang. Mit Gespür für Qualität und dem Mut, Möbel anders zu denken." },
  { yr: "2.", h: "Der Vater", p: "Übernahm den Betrieb und baute ihn aus — bis zum großen Flagship-Store in Wesel." },
  { yr: "3.", h: "Die Kinder", p: "Tragen die Idee weiter und packen mit an, wo sie können — die nächste Generation Riegel." },
];

export default function UeberUnsPage() {
  return (
    <main>
      {/* HERO */}
      <section className="ab-hero">
        <ImageSlot
          src="/img/holz-suar-platten.jpg"
          alt="Massive Suar-Platten an der Wand der Manufaktur"
          dark
          priority
          sizes="100vw"
        />
        <div className="ab-hero__scrim"></div>
        <div className="ab-hero__inner">
          <p className="eyebrow" style={{ color: "rgba(250,248,244,.78)" }} data-reveal="">
            Über uns
          </p>
          <h1 className="reveal-lines">
            <span><i>Möbel sind</i></span>
            <span><i>Familiensache.</i></span>
          </h1>
        </div>
      </section>

      {/* INTRO */}
      <section className="section intro">
        <div className="wrap">
          <p className="intro__statement" data-reveal="">
            Was der Großvater begründete, führt die Familie Riegel heute in{" "}
            <em>dritter Generation</em> weiter — mit derselben Leidenschaft.
          </p>
        </div>
      </section>

      {/* STORY 1 */}
      <section className="story">
        <div className="story__media">
          <ImageSlot
            src="/img/ueber-uns-story.jpg"
            alt="Suar-Tisch aus einem Baumstamm-Unikat in der historischen Halle in Wesel"
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>
        <div className="story__body intro">
          <p className="eyebrow" data-reveal="">Unsere Geschichte</p>
          <h2 className="mt-s" data-reveal="" data-reveal-delay="1">Aus Liebe zum Holz.</h2>
          <div className="flow mt-m measure" data-reveal="" data-reveal-delay="2">
            <p>
              Angefangen hat alles mit einem einfachen Gedanken: außergewöhnliche
              Möbel sollten nicht außergewöhnlich teuer sein. Diese Überzeugung gab
              der Großvater an die nächste Generation weiter — und sie prägt Riegel
              Interior bis heute.
            </p>
            <p>
              Bis heute geht die Suche um die ganze Welt: Massivholz aus Indonesien
              und Asien, charaktervolle Hölzer aus Europa — immer mit dem Blick fürs
              Besondere.
            </p>
          </div>
        </div>
      </section>

      {/* STORY 2 */}
      <section className="story story--flip">
        <div className="story__media">
          <ImageSlot
            src="/img/holz-eiche-platten.jpg"
            alt="Eichen-Tischplatten in der Manufaktur, bereit zum Ölen"
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>
        <div className="story__body dark" style={{ background: "var(--ink)" }}>
          <p className="eyebrow" data-reveal="">Eigene Manufaktur</p>
          <h2 className="mt-s" data-reveal="" data-reveal-delay="1">Veredelt von Hand.</h2>
          <div className="flow mt-m measure" data-reveal="" data-reveal-delay="2">
            <p>
              Viele Tische entstehen in der eigenen Manufaktur: gehobelt,
              geschliffen, geölt. Baumkante oder Schweizer Schliff, naturbelassen
              oder farbig — und die Spachtelung der Astlöcher genau so, wie du sie
              dir wünschst.
            </p>
            <p>So wird aus einem Stück Holz ein Möbel, das es nur einmal gibt. Deins.</p>
          </div>
          <Link href="/konfigurator" className="link mt-l" data-reveal="" data-reveal-delay="3">
            Tisch konfigurieren <span className="arr">→</span>
          </Link>
        </div>
      </section>

      {/* WERTE */}
      <section className="section values">
        <div className="wrap">
          <p className="eyebrow" data-reveal="">Wofür wir stehen</p>
          <h2 className="mt-s" data-reveal="" data-reveal-delay="1">Vier Versprechen.</h2>
          <div className="val-grid">
            {VALUES.map((v, i) => (
              <div className="val" key={v.n} data-reveal="" data-reveal-delay={String(i || "")}>
                <div className="vn">{v.n}</div>
                <h4>{v.h}</h4>
                <p>{v.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GENERATIONEN */}
      <section className="section gens">
        <div className="wrap">
          <p className="eyebrow" data-reveal="">Generationen</p>
          <h2 className="mt-s" data-reveal="" data-reveal-delay="1">
            Drei Generationen,<br />eine Leidenschaft.
          </h2>
          <div className="gen-row">
            {GENS.map((g, i) => (
              <div className="gen" key={g.yr} data-reveal="" data-reveal-delay={String(i || "")}>
                <div className="yr">{g.yr}</div>
                <h4>{g.h}</h4>
                <hr className="rule" />
                <p>{g.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section intro" style={{ textAlign: "center" }}>
        <div className="wrap">
          <h2 data-reveal="" style={{ maxWidth: "20ch", marginInline: "auto" }}>
            Lern Riegel Interior kennen — in einem der Häuser.
          </h2>
          <div
            className="mt-l"
            data-reveal=""
            data-reveal-delay="1"
            style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link href="/standorte" className="btn btn--solid">
              Standorte ansehen <span className="arr">→</span>
            </Link>
            <Link href="/shop" className="btn">Zum Shop</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

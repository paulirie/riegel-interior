import Link from "next/link";
import { ImageSlot } from "@/components/ImageSlot";
import { ManufakturVideo } from "@/components/ManufakturVideo";
import { Ticker } from "@/components/Ticker";
import { CountUp } from "@/components/CountUp";
import { CategoryRail } from "@/components/CategoryRail";
import { ProductRail } from "@/components/ProductRail";
import { PRODUCTS } from "@/data/site";

const CATS = [
  { slot: "Esstische", nm: "Esstische", ct: "Eiche · Suar · Teak", img: "/img/kat-esstische.jpg" },
  { slot: "Stühle", nm: "Stühle", ct: "Esszimmer", img: "/img/kat-stuehle.jpg" },
  { slot: "Sofas & Garnituren", nm: "Sofas & Garnituren", ct: "Wohnen", img: "/img/kat-sofas.jpg" },
  { slot: "Anrichten & Sideboards", nm: "Anrichten & Sideboards", ct: "Serien", img: "/img/kat-anrichten.jpg" },
  { slot: "Schränke", nm: "Schränke", ct: "Massivholz", img: "/img/kat-schraenke.jpg" },
  { slot: "Accessoires", nm: "Accessoires", ct: "Teak · Wurzelholz", img: "/img/kat-accessoires.jpg" },
  { slot: "Teppiche & Kissen", nm: "Teppiche & Kissen", ct: "Textil", img: "/img/kat-textil.jpg" },
  { slot: "Lampen & Leuchten", nm: "Lampen", ct: "Teak · Naturholz", img: "/img/kat-lampen.jpg" },
];

const INSTA = [
  { src: "/img/detail-kante-1.jpg", alt: "Detail: Baumkante einer Eichen-Tischplatte" },
  { src: "/img/detail-suar-tisch.jpg", alt: "Suar-Esstisch mit Baumkante im Showroom" },
  { src: "/img/detail-stoffe.jpg", alt: "Cord-Stoffmuster in verschiedenen Farben" },
  { src: "/img/detail-platten.jpg", alt: "Eichen-Tischplatten in mehreren Größen" },
  { src: "/img/detail-sofa-gruen.jpg", alt: "Ecksofa im Showroom mit Wurzelholz-Couchtisch" },
  { src: "/img/detail-kante-2.jpg", alt: "Detail: helle Eichenkante mit Baumkante" },
];

/* Nur Hölzer und Begriffe, die in den eigenen Inseraten wirklich vorkommen.
   "Akazie" und "Treibholz" standen hier, obwohl keine einzige der 196 Anzeigen
   sie nennt; "Schweizer Schliff" heißt bei uns "Schweizer Kante". */
const TICKER = [
  "Teak", "~Eiche", "Suar", "~Mango", "Baumkante", "~Schweizer Kante",
  "Baumscheiben", "~Unikate aus aller Welt", "Tische nach Maß",
];

const WOODS = [
  { h: "Teak", p: "Unser größtes Sortiment. Schränke, Sideboards, Regale — und geschnitzte Einzelstücke." },
  { h: "Eiche", p: "Tischplatten nach Maß, von 80 × 80 bis 300 × 100 cm. Schweizer Kante, gerade Kante oder Baumkante." },
  { h: "Suar", p: "Tropisches Hartholz, bei uns als Baumscheibe und Monolith — jedes Stück ein Unikat." },
  { h: "Mango", p: "Esstische, Couchtische und Sideboards. Lebendig gemasert, oft dunkel gebeizt." },
];

export default function Home() {
  return (
    <main>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero__bg">
          <ImageSlot
            src="/img/hero-wesel.jpg"
            alt="Showroom Riegel Interior in Wesel — Massivholztische und Sofas in den ehemaligen Trapp-Hallen"
            dark
            priority
            sizes="100vw"
          />
        </div>
        <div className="hero__scrim"></div>
        <div className="hero__meta">
          Wesel · Flagship<br />Schermbeck<br />Haltern am See
        </div>
        <div className="hero__inner">
          <p className="eyebrow hero__eyebrow" data-reveal="" data-reveal-delay="1">
            Möbel aus aller Welt · seit drei Generationen
          </p>
          <h1 className="reveal-lines">
            <span><i>Einzigartige</i></span>
            <span><i>Möbel aus</i></span>
            <span><i>aller Welt.</i></span>
          </h1>
          <div className="hero__sub" data-reveal="" data-reveal-delay="3">
            <p className="lead">
              Massivholz mit Charakter — in hoher Qualität, zu richtig attraktiven
              Preisen. Vieles davon Einzelstücke.
            </p>
            <div className="hero__cta">
              <Link href="/shop" className="btn">
                Shop entdecken <span className="arr">→</span>
              </Link>
              <Link href="/standorte" className="btn">
                Standorte
              </Link>
            </div>
          </div>
        </div>
        <div className="scroll-cue">
          <span>Entdecken</span>
          <span className="ln"></span>
        </div>
      </section>

      <Ticker items={TICKER} />

      {/* ── PHILOSOPHIE ── */}
      <section className="section philo">
        <div className="wrap">
          <div className="philo__grid">
            <div data-reveal="">
              <p className="eyebrow">01 — Unsere Philosophie</p>
              <div className="figures">
                <div className="fig">
                  <div className="num"><CountUp to={3} /></div>
                  <div className="cap">Standorte in NRW</div>
                </div>
                <div className="fig">
                  <div className="num">
                    <CountUp to={3000} />
                    <span style={{ fontSize: ".4em" }}>m²</span>
                  </div>
                  <div className="cap">Flagship Wesel</div>
                </div>
                <div className="fig">
                  <div className="num">3.</div>
                  <div className="cap">Generation Familie</div>
                </div>
              </div>
            </div>
            <div data-reveal="" data-reveal-delay="2">
              <p className="philo__statement">
                Wir bringen <em>außergewöhnliche</em> Stücke aus aller Welt nach
                Hause — Massivholz aus Indonesien, Asien und Europa. Vieles davon
                aus Insolvenzen und Sonderposten. <em>Daher die Preise.</em>
              </p>
              <Link href="/ueber-uns" className="link mt-l">
                Unsere Geschichte <span className="arr">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── MANUFAKTUR ── */}
      <section className="split">
        <div className="split__media" style={{ minHeight: 480 }}>
          <ManufakturVideo />
        </div>
        <div className="split__body dark" style={{ background: "var(--ink)" }}>
          <p className="eyebrow" data-reveal="">02 — Tische nach Maß</p>
          <blockquote className="quote mt-m" data-reveal="" data-reveal-delay="1">
            „Ein Tisch ist kein Möbelstück. Er ist Treffpunkt. Mittelpunkt. Bühne
            für das Leben.“
            <span className="src">— Riegel Interior</span>
          </blockquote>
          <p className="mt-m measure" data-reveal="" data-reveal-delay="2">
            In Wesel stellst du dir deinen Esstisch selbst zusammen: vollmassive
            Eichenplatten von 80 × 80 bis 300 × 100 cm, mit Baumkante, Schweizer
            Kante oder gerader Kante, geschliffen oder gebürstet. Dazu das
            Gestell deiner Wahl — über 5.000 Kombinationen.
          </p>
          <Link href="/konfigurator" className="link mt-l" data-reveal="" data-reveal-delay="3">
            Tisch konfigurieren <span className="arr">→</span>
          </Link>
        </div>
      </section>

      {/* ── KATEGORIEN ── */}
      <section className="section cats">
        <div className="wrap">
          <div className="cats__head">
            <div data-reveal="">
              <p className="eyebrow">03 — Sortiment</p>
              <h2 className="mt-s">Für jeden Raum<br />das Besondere.</h2>
            </div>
            <Link href="/shop" className="link" data-reveal="" data-reveal-delay="2">
              Alle Produkte <span className="arr">→</span>
            </Link>
          </div>
        </div>

        <CategoryRail items={CATS} />
      </section>

      {/* ── MIX & MATCH ── */}
      <section className="section mix">
        <div className="wrap">
          <div className="mix__grid">
            <div>
              <p className="eyebrow" data-reveal="">04 — Mix &amp; Match</p>
              <h2 className="mt-s" data-reveal="" data-reveal-delay="1">
                Dein Tisch.<br />Deine Entscheidung.
              </h2>
              <p className="mt-m measure" data-reveal="" data-reveal-delay="2">
                Stell dir deinen Esstisch Schritt für Schritt zusammen — Platte,
                Kante, Oberfläche, Gestell. Über 5.000 Kombinationen, alle aus
                vollmassiver Eiche.
              </p>
              <div className="mix__steps">
                <div className="mix__step" data-reveal="">
                  <span className="n">01</span>
                  <div><span className="t">Tischplatte</span><div className="d">Vollmassive Eiche, 80 × 80 bis 300 × 100 cm</div></div>
                </div>
                <div className="mix__step" data-reveal="">
                  <span className="n">02</span>
                  <div><span className="t">Kante</span><div className="d">Baumkante, Schweizer Kante oder gerade</div></div>
                </div>
                <div className="mix__step" data-reveal="">
                  <span className="n">03</span>
                  <div><span className="t">Oberfläche</span><div className="d">Geschliffen oder gebürstet, über 10 Farbtöne</div></div>
                </div>
                <div className="mix__step" data-reveal="">
                  <span className="n">04</span>
                  <div><span className="t">Tischgestell</span><div className="d">Stahl schwarz — U, Trapez oder X-Balken</div></div>
                </div>
              </div>
              <Link href="/konfigurator" className="btn mt-l" data-reveal="">
                Jetzt konfigurieren <span className="arr">→</span>
              </Link>
            </div>
            <div className="mix__visual par" data-reveal="" data-reveal-delay="2">
              <ImageSlot
                className="reveal-img"
                src="/img/mix-platte-gestell.jpg"
                alt="Stahlgestelle und massive Eichen-Tischplatten in der Ausstellung"
                sizes="(max-width: 900px) 100vw, 45vw"
              />
              <span className="mix__tagfloat" style={{ top: "8%", left: "-6%" }}>
                Eiche · Baumkante
              </span>
              <span className="mix__tagfloat" style={{ bottom: "14%", right: "-6%" }}>
                Gestell · Schwarz matt
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── GERADE IM MARKT ── */}
      <section className="section stock">
        <div className="wrap">
          <div className="cats__head">
            <div data-reveal="">
              <p className="eyebrow">05 — Gerade im Markt</p>
              <h2 className="mt-s">
                Steht bei uns.<br />Heute noch.
              </h2>
            </div>
            <Link href="/shop" className="link" data-reveal="" data-reveal-delay="2">
              Zum Shop <span className="arr">→</span>
            </Link>
          </div>
        </div>

        {/* die zuletzt eingestellten Stücke — nicht alle 199, sonst läuft
            die Schiene minutenlang, bevor sie sich wiederholt */}
        <ProductRail items={PRODUCTS.slice(0, 14)} />
      </section>

      {/* ── HOLZARTEN ── */}
      <section className="section woods">
        <div className="wrap">
          <p className="eyebrow" data-reveal="" style={{ marginBottom: 46 }}>
            06 — Unsere Hölzer
          </p>
          <div className="wood-row">
            {WOODS.map((w, i) => (
              <div className="wood" key={w.h} data-reveal="" data-reveal-delay={String(i || "")}>
                <h4>{w.h}</h4>
                <p>{w.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STANDORTE ── */}
      <section className="section locs">
        <div className="wrap">
          <div className="cats__head">
            <div data-reveal="">
              <p className="eyebrow">07 — Standorte</p>
              <h2 className="mt-s">Besuch uns<br />in NRW.</h2>
            </div>
            <Link href="/standorte" className="link" data-reveal="" data-reveal-delay="2">
              Alle Standorte <span className="arr">→</span>
            </Link>
          </div>
          <div className="loc-grid">
            <Link href="/standorte" className="loc loc--hero" data-reveal="">
              <div className="loc__img par">
                <ImageSlot
                  src="/img/standort-wesel.jpg"
                  alt="Flagship-Store Wesel in den ehemaligen Trapp-Hallen"
                  sizes="(max-width: 900px) 100vw, 55vw"
                />
                <span className="loc__tag">Flagship</span>
                <div className="loc__cap">
                  <div className="nm">Wesel</div>
                  <div className="meta">3.000 m² · ehemalige Werkshallen der Firma Trapp</div>
                </div>
              </div>
            </Link>
            <Link href="/standorte" className="loc" data-reveal="" data-reveal-delay="1">
              <div className="loc__img par">
                {/* TODO: echtes Foto aus dem Lagerverkauf Schermbeck — die
                    ehemaligen Bundeswehrhallen sehen anders aus als unsere
                    Showrooms, ein Showroom-Foto wäre hier gelogen. */}
                <ImageSlot label="Foto Lagerverkauf Schermbeck" />
                <div className="loc__cap">
                  <div className="nm">Schermbeck</div>
                  <div className="meta">Lagerverkauf · ca. 800 m²</div>
                </div>
              </div>
            </Link>
            <Link href="/standorte" className="loc" data-reveal="" data-reveal-delay="2">
              <div className="loc__img par">
                {/* TODO: echtes Foto aus Haltern am See — aktuell Platzhalter aus dem Bildarchiv */}
                <ImageSlot
                  src="/img/standort-haltern.jpg"
                  alt="Riegel Interior in Haltern am See"
                  sizes="(max-width: 900px) 100vw, 30vw"
                />
                <div className="loc__cap">
                  <div className="nm">Haltern am See</div>
                  <div className="meta">Recklinghäuser Str. 120</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── ÜBER UNS ── */}
      <section className="section about">
        <div className="wrap">
          <div className="about__grid">
            <div className="about__media par par--deep" data-reveal="">
              <ImageSlot
                className="reveal-img"
                src="/img/about-showroom.jpg"
                alt="Blick durch den Showroom von Riegel Interior"
                sizes="(max-width: 900px) 100vw, 45vw"
              />
            </div>
            <div>
              <p className="eyebrow" data-reveal="">08 — Familie</p>
              <h2 className="mt-s" data-reveal="" data-reveal-delay="1">
                Ein Familien&shy;betrieb<br />in dritter Generation.
              </h2>
              <p className="mt-m measure" data-reveal="" data-reveal-delay="2">
                Was der Großvater begann, führt die Familie Riegel bis heute
                mit derselben Leidenschaft weiter — inzwischen in dritter
                Generation. Weil gute Möbel Familiensache sind.
              </p>
              <Link href="/ueber-uns" className="link mt-l" data-reveal="" data-reveal-delay="3">
                Mehr über uns <span className="arr">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── INSTAGRAM ── */}
      <section className="section--tight section insta">
        <div className="wrap">
          <div className="insta__head">
            <div data-reveal="">
              <p className="eyebrow">Folge uns</p>
              <h3 className="mt-s">@riegel.interior</h3>
            </div>
            <a
              href="https://www.instagram.com/riegel.interior/"
              target="_blank"
              rel="noopener"
              className="link"
              data-reveal=""
              data-reveal-delay="1"
            >
              Auf Instagram <span className="arr">→</span>
            </a>
          </div>
          <div className="insta__grid" data-reveal="">
            {INSTA.map((p) => (
              <ImageSlot
                key={p.src}
                src={p.src}
                alt={p.alt}
                sizes="(max-width: 700px) 33vw, 16vw"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ImageSlot } from "@/components/ImageSlot";

export const metadata: Metadata = {
  title: "Standorte",
  description:
    "Riegel Interior in NRW: Flagship-Store Wesel, Recklinghausen und Haltern am See. Adressen, Öffnungszeiten und Highlights.",
};

const darkBtn = { borderColor: "rgba(250,248,244,.5)", color: "var(--bone)" };

export default function StandortePage() {
  return (
    <main>
      <section className="std-hero">
        <div className="wrap">
          <p className="eyebrow" data-reveal="">Standorte · NRW</p>
          <h1 data-reveal="" data-reveal-delay="1">
            Besuch uns<br />vor Ort.
          </h1>
          <p className="lead" data-reveal="" data-reveal-delay="2">
            Drei Häuser im Herzen des Ruhrgebiets und am Niederrhein. Jedes mit
            eigenem Charakter — und einem wechselnden Sortiment, das immer wieder
            überrascht.
          </p>
        </div>
      </section>

      {/* FLAGSHIP WESEL */}
      <section className="flagship">
        <div className="flagship__grid">
          <div className="flagship__media">
            <ImageSlot
              src="/img/standort-wesel-2.jpg"
              alt="Flagship-Store Wesel: Showroom in den ehemaligen Trapp-Hallen"
              priority
              sizes="(max-width: 900px) 100vw, 55vw"
            />
            <span className="flagship__tag">★ Flagship-Store</span>
          </div>
          <div className="flagship__body">
            <p className="eyebrow" data-reveal="">Unser größtes Haus</p>
            <h2 data-reveal="" data-reveal-delay="1">Wesel</h2>
            <p className="mt-s measure" data-reveal="" data-reveal-delay="2">
              Über 6.000 m² in den ehemaligen Trapp-Hallen: rohe Wände, hohe
              Decken, große Fenster — Industriecharme, der perfekt zu unseren
              Möbeln passt.
            </p>
            <div className="info" data-reveal="" data-reveal-delay="2">
              <div>
                <div className="lab">Adresse</div>
                <div className="v">An der Brücke 1–3<br />46483 Wesel</div>
              </div>
              <div>
                <div className="lab">Telefon</div>
                <div className="v">
                  <a href="tel:+4928114793270">0281 147 93 270</a>
                  <br />
                  <a href="mailto:shop@riegel-interior.com">shop@riegel-interior.com</a>
                </div>
              </div>
              <div>
                <div className="lab">Öffnungszeiten</div>
                <div className="v">Mo–Fr 12–19 Uhr<br />Sa 10–15 Uhr</div>
              </div>
              <div>
                <div className="lab">Fläche</div>
                <div className="v">über 6.000 m²</div>
              </div>
            </div>
            <ul className="hl" data-reveal="">
              <li>Massivholz-Manufaktur</li>
              <li>Wohnen &amp; Esszimmer</li>
              <li>Schlafen</li>
              <li>Accessoires</li>
            </ul>
            <div className="flagship__cta" data-reveal="">
              <a
                href="https://www.google.com/maps/search/Riegel+Interior+An+der+Br%C3%BCcke+1-3+46483+Wesel"
                target="_blank"
                rel="noopener"
                className="btn"
                style={darkBtn}
              >
                Route planen <span className="arr">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* WEITERE STANDORTE */}
      <section className="section more-locs">
        <div className="wrap">
          <p className="eyebrow" data-reveal="" style={{ marginBottom: 42 }}>
            Weitere Standorte
          </p>
          <div className="loc-cards">
            {/* Recklinghausen */}
            <article className="lc" data-reveal="">
              <div className="lc__media">
                <ImageSlot
                  src="/img/standort-recklinghausen-2.jpg"
                  alt="Verkaufsfläche von Riegel Interior im Palais Vest Recklinghausen"
                  sizes="(max-width: 900px) 100vw, 45vw"
                />
              </div>
              <div className="lc__body">
                <p className="eyebrow">Im Palais Vest</p>
                <h3>Recklinghausen</h3>
                <p className="mt-s" style={{ fontSize: "14.5px" }}>
                  Auf moderner Fläche im Palais Vest — mitten in der Stadt,
                  garantiert ein Schnäppchen für dein Zuhause.
                </p>
                <div className="info">
                  <div>
                    <div className="lab">Adresse</div>
                    <div className="v">Palais Vest, Löhrhof 1<br />45657 Recklinghausen</div>
                  </div>
                  <div>
                    <div className="lab">Telefon</div>
                    <div className="v">
                      <a href="tel:+4923611066202">02361 10 66 202</a>
                      <br />
                      <a href="mailto:recklinghausen@riegel-interior.com">recklinghausen@riegel-interior.com</a>
                    </div>
                  </div>
                  <div>
                    <div className="lab">Öffnungszeiten</div>
                    <div className="v">Mo–Sa 11–19 Uhr</div>
                  </div>
                  <div>
                    <div className="lab">Highlights</div>
                    <div className="v">Moderne Möbel &amp; Teak</div>
                  </div>
                </div>
                <ul className="hl">
                  <li>Tische &amp; Stühle</li>
                  <li>Kommoden</li>
                  <li>Teakmöbel</li>
                </ul>
                <div className="lc__cta">
                  <a
                    href="https://www.google.com/maps/search/Riegel+Interior+Palais+Vest+Recklinghausen"
                    target="_blank"
                    rel="noopener"
                    className="link"
                  >
                    Route planen <span className="arr">→</span>
                  </a>
                </div>
              </div>
            </article>

            {/* Haltern */}
            <article className="lc" data-reveal="" data-reveal-delay="1">
              <div className="lc__media">
                {/* TODO: echtes Foto aus Haltern am See — aktuell Platzhalter aus dem Bildarchiv */}
                <ImageSlot
                  src="/img/standort-haltern.jpg"
                  alt="Riegel Interior in Haltern am See"
                  sizes="(max-width: 900px) 100vw, 45vw"
                />
              </div>
              <div className="lc__body">
                <p className="eyebrow">Am See</p>
                <h3>Haltern am See</h3>
                <p className="mt-s" style={{ fontSize: "14.5px" }}>
                  Auf rund 1.000 m² und barrierefrei: maßgefertigte Eichentische
                  sind hier das Herzstück der Ausstellung.
                </p>
                <div className="info">
                  <div>
                    <div className="lab">Adresse</div>
                    <div className="v">Recklinghäuser Str. 120<br />45721 Haltern am See</div>
                  </div>
                  <div>
                    <div className="lab">Telefon</div>
                    <div className="v">
                      <a href="tel:+4923645099515">02364 50 99 515</a>
                      <br />
                      <a href="mailto:haltern@riegel-interior.com">haltern@riegel-interior.com</a>
                    </div>
                  </div>
                  <div>
                    <div className="lab">Öffnungszeiten</div>
                    <div className="v">Mo–Fr 12–19 Uhr<br />Sa 10–15 Uhr</div>
                  </div>
                  <div>
                    <div className="lab">Fläche</div>
                    <div className="v">ca. 1.000 m² · barrierefrei</div>
                  </div>
                </div>
                <ul className="hl">
                  <li>Maßtische Eiche</li>
                  <li>Sofas</li>
                  <li>Accessoires</li>
                </ul>
                <div className="lc__cta">
                  <a
                    href="https://www.google.com/maps/search/Riegel+Interior+Recklingh%C3%A4user+Str+120+Haltern"
                    target="_blank"
                    rel="noopener"
                    className="link"
                  >
                    Route planen <span className="arr">→</span>
                  </a>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* CTA-BAND */}
      <section className="section cta-band">
        <div className="wrap">
          <p className="eyebrow" data-reveal="">Fragen?</p>
          <h2 className="mt-s" data-reveal="" data-reveal-delay="1">
            Wir beraten dich gern — persönlich.
          </h2>
          <div
            className="mt-l"
            data-reveal=""
            data-reveal-delay="2"
            style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}
          >
            <a href="tel:+4928114793270" className="btn" style={darkBtn}>
              Anrufen
            </a>
            <Link href="/shop" className="btn" style={darkBtn}>
              Zum Shop <span className="arr">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

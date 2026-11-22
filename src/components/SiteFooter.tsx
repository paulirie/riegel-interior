import Link from "next/link";
import { MAERKTE, WESEL, MAIL } from "@/data/kontakt";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-foot">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <div className="brand">
              RIEGEL <span className="sep">·</span> <b>INTERIOR</b>
            </div>
            <p style={{ maxWidth: "34ch" }}>
              Einzigartige Möbel aus aller Welt in hoher Qualität — zu richtig
              attraktiven Preisen.
            </p>
          </div>
          <div>
            <h4>Entdecken</h4>
            <ul>
              <li><Link href="/shop">Produkte</Link></li>
              <li><Link href="/konfigurator">Mix &amp; Match</Link></li>
              <li><Link href="/standorte">Standorte</Link></li>
              <li><Link href="/ueber-uns">Über uns</Link></li>
            </ul>
          </div>
          <div>
            <h4>Standorte</h4>
            <ul>
              {MAERKTE.map((m) => (
                <li key={m.anker}>
                  <Link href={m.anker}>
                    {m === WESEL ? "Wesel — Flagship" : m.kurz}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Kontakt</h4>
            <ul>
              <li><a href={`tel:${WESEL.tel}`}>{WESEL.nummer}</a></li>
              <li>
                <a
                  href="https://www.instagram.com/riegel.interior/"
                  target="_blank"
                  rel="noopener"
                >
                  Instagram
                </a>
              </li>
              <li><a href={`mailto:${MAIL}`}>{MAIL}</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-bar">
          <small>
            © {year} Riegel Interior · Alle Rechte vorbehalten
          </small>
          <small>Impressum · Datenschutz · AGB</small>
        </div>
      </div>
    </footer>
  );
}

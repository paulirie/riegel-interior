import Link from "next/link";

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
              <li><Link href="/shop">Shop</Link></li>
              <li><Link href="/konfigurator">Mix &amp; Match</Link></li>
              <li><Link href="/standorte">Standorte</Link></li>
              <li><Link href="/ueber-uns">Über uns</Link></li>
            </ul>
          </div>
          <div>
            <h4>Standorte</h4>
            <ul>
              <li><Link href="/standorte">Wesel — Flagship</Link></li>
              <li><Link href="/standorte">Recklinghausen</Link></li>
              <li><Link href="/standorte">Haltern am See</Link></li>
            </ul>
          </div>
          <div>
            <h4>Kontakt</h4>
            <ul>
              <li><a href="tel:+4928114793270">0281 147 93 270</a></li>
              <li>
                <a
                  href="https://www.instagram.com/riegel.interior/"
                  target="_blank"
                  rel="noopener"
                >
                  Instagram
                </a>
              </li>
              <li><a href="mailto:shop@riegel-interior.com">shop@riegel-interior.com</a></li>
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

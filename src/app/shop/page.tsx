import type { Metadata } from "next";
import { ShopGrid } from "@/components/ShopGrid";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Massivholzmöbel, Sofas, Accessoires und mehr — online ansehen, in Wesel, Schermbeck oder Haltern kaufen. Riegel Interior.",
};

export default function ShopPage() {
  return (
    <main>
      <section className="shop-hero">
        <div className="wrap">
          <p className="eyebrow" data-reveal="">Unser Sortiment</p>
          <h1 data-reveal="" data-reveal-delay="1">
            Einzelstücke<br />aus aller Welt.
          </h1>
          <p className="lead" data-reveal="" data-reveal-delay="2">
            Ausgewählte Möbel und Accessoires aus unseren drei Märkten.
          </p>
          <div className="shop-note" data-reveal="" data-reveal-delay="2">
            <span className="ico">✳</span>
            <div>
              <strong>Online nur ein Ausschnitt</strong>
              <p>
                Bestellen oder vorbestellen kannst du hier nicht. Diese Seite ist
                ein Ausschnitt: viele Stücke gibt es nur einmal, und in unseren
                Märkten steht mehr, als je online landet. Frag kurz nach, ob ein
                Stück noch da ist — oder schau einfach vorbei.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ShopGrid />
    </main>
  );
}

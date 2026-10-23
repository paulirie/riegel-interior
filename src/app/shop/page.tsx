import type { Metadata } from "next";
import { ShopGrid } from "@/components/ShopGrid";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Massivholzmöbel, Sofas, Accessoires und mehr — online entdecken, im Markt abholen. Riegel Interior.",
};

export default function ShopPage() {
  return (
    <main>
      <section className="shop-hero">
        <div className="wrap">
          <p className="eyebrow" data-reveal="">Online-Shop</p>
          <h1 data-reveal="" data-reveal-delay="1">
            Einzelstücke<br />aus aller Welt.
          </h1>
          <p className="lead" data-reveal="" data-reveal-delay="2">
            Entdecke ausgewählte Möbel und Accessoires online — viele weitere
            findest du nur bei uns im Markt.
          </p>
          <div className="shop-note" data-reveal="" data-reveal-delay="2">
            <span className="ico">✳</span>
            <p>
              Nicht alle unsere Möbel schaffen es in den Shop — tolle Angebote
              sind schnell vergriffen. Du kannst Artikel online vorbestellen und
              an deinem Standort abholen.
            </p>
          </div>
        </div>
      </section>

      <ShopGrid />
    </main>
  );
}

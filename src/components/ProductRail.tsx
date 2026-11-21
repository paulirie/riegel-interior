import Link from "next/link";
import { ImageSlot } from "./ImageSlot";
import type { Product } from "@/data/site";

/**
 * Laufende Schiene mit echten Stücken aus dem Markt — Foto, Name, Preis.
 *
 * Gleiche Technik wie die Sortiment-Schiene: Inhalt doppelt, Spur wandert um
 * genau 50 %, Abstand als margin-right an der Karte (mit gap säße die zweite
 * Hälfte um einen halben Abstand versetzt und der Übergang würde springen).
 * Sie läuft in die andere Richtung als die Sortiment-Schiene, damit die Seite
 * nicht in eine einzige Richtung zieht.
 */
export function ProductRail({ items }: { items: Product[] }) {
  const group = (clone: boolean) =>
    items.map((p) => (
      <Link
        key={(clone ? "b-" : "a-") + p.id}
        href="/shop"
        className="pcard"
        tabIndex={clone ? -1 : undefined}
        aria-hidden={clone || undefined}
      >
        <div className="pcard__img">
          <ImageSlot
            src={p.img}
            alt={clone ? "" : `${p.name} — ${p.sub}, bei Riegel Interior`}
            sizes="(max-width: 700px) 56vw, 300px"
          />
          {p.was && <span className="pcard__flag">Abverkauf</span>}
        </div>
        <div className="pcard__foot">
          <span className="pcard__nm">{p.name}</span>
          <span className="pcard__pr">
            {p.price ? (
              <>
                {p.was && <s>{p.was} €</s>}
                {p.price} €
              </>
            ) : (
              <em>Preis im Markt</em>
            )}
          </span>
        </div>
      </Link>
    ));

  return (
    <div className="prod-rail">
      <div className="prod-rail__track">
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}

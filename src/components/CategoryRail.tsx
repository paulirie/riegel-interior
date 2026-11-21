import Link from "next/link";
import { ImageSlot } from "./ImageSlot";

export type Category = { nm: string; ct: string; img: string };

/**
 * Endlos laufende Schiene mit den Sortiments-Kacheln.
 *
 * Die Spur enthält die Kacheln zweimal und wandert um exakt 50 % — deshalb
 * sitzt der Abstand als margin-right an jeder Kachel statt als gap an der
 * Spur: mit gap wäre die Hälfte der Spur um einen halben Abstand versetzt
 * und der Übergang würde sichtbar springen.
 */
export function CategoryRail({ items }: { items: Category[] }) {
  const group = (clone: boolean) =>
    items.map((c) => (
      <Link
        key={(clone ? "b-" : "a-") + c.nm}
        href="/shop"
        className="cat"
        tabIndex={clone ? -1 : undefined}
        aria-hidden={clone || undefined}
      >
        <div className="cat__img">
          <ImageSlot
            src={c.img}
            alt={clone ? "" : `${c.nm} bei Riegel Interior`}
            sizes="(max-width: 700px) 60vw, 320px"
          />
          <span className="plus">+</span>
        </div>
        <div className="cat__label">
          <span className="nm">{c.nm}</span>
          <span className="ct">{c.ct}</span>
        </div>
      </Link>
    ));

  return (
    <div className="cat-rail">
      <div className="cat-rail__track">
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}

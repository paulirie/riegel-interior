import Image from "next/image";

/**
 * Bildfläche (ersetzt die <image-slot>-Webkomponente des Prototyps).
 * Ohne `src` zeigt sie eine warme Platzhalter-Fläche mit Label,
 * mit `src` das echte Foto (über next/image optimiert).
 */
export function ImageSlot({
  label = "",
  dark = false,
  fit = "cover",
  src,
  alt,
  sizes = "100vw",
  priority = false,
  position = "center",
  className = "",
}: {
  label?: string;
  dark?: boolean;
  fit?: "cover" | "contain";
  src?: string;
  alt?: string;
  sizes?: string;
  priority?: boolean;
  position?: string;
  className?: string;
}) {
  return (
    <div
      className={`ph${dark ? " ph--dark" : ""}${className ? " " + className : ""}`}
      data-label={src ? undefined : label}
    >
      {src && (
        <Image
          src={src}
          alt={alt ?? label}
          fill
          sizes={sizes}
          priority={priority}
          style={{ objectFit: fit, objectPosition: position }}
        />
      )}
    </div>
  );
}

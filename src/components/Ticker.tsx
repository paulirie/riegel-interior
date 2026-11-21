/**
 * Endlos laufendes Band. Die Spur enthält den Inhalt zweimal und wandert um
 * genau 50 % — dadurch ist der Übergang nahtlos. Beim Überfahren hält sie an.
 */
export function Ticker({ items }: { items: string[] }) {
  const run = (
    <div className="ticker__item" aria-hidden="true">
      {items.map((t) => (
        <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: "inherit" }}>
          {t.startsWith("~") ? <i>{t.slice(1)}</i> : t}
          <span className="ticker__dot" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="ticker">
      <div className="ticker__track">
        {run}
        {run}
      </div>
      {/* für Screenreader und Suchmaschinen einmal als normaler Text */}
      <span className="sr-only">{items.map((t) => t.replace(/^~/, "")).join(" · ")}</span>
    </div>
  );
}

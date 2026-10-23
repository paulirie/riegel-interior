"use client";

import { useEffect, useRef } from "react";

/**
 * Hintergrund-Video für die Manufaktur-Sektion (Flagship Wesel).
 * Läuft stumm, automatisch und in Schleife – füllt die Medienfläche.
 * `muted` wird zusätzlich per JS gesetzt, damit Autoplay zuverlässig startet.
 */
export function ManufakturVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {
      /* Autoplay ggf. blockiert – kein Problem, Video bleibt im ersten Frame */
    });
  }, []);

  return (
    <video
      ref={ref}
      src="/wesel-manufaktur.mp4"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label="Eindrücke aus unserem Flagship-Store in Wesel"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        background: "#16140f",
      }}
    />
  );
}

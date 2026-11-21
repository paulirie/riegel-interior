"use client";

import { useEffect, useState } from "react";

export type Opening = { days: number[]; from: number; to: number };

const DAY_SHORT = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

function statusFor(hours: Opening[], now: Date) {
  const day = now.getDay();
  const minutes = now.getHours() * 60 + now.getMinutes();

  const today = hours.find((h) => h.days.includes(day));
  if (today && minutes >= today.from * 60 && minutes < today.to * 60) {
    return { open: true, label: `Jetzt geöffnet — bis ${today.to} Uhr` };
  }
  if (today && minutes < today.from * 60) {
    return { open: false, label: `Öffnet heute um ${today.from} Uhr` };
  }

  // nächster Öffnungstag innerhalb der kommenden Woche
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    const slot = hours.find((h) => h.days.includes(d));
    if (slot) {
      return { open: false, label: `Öffnet ${DAY_SHORT[d]} um ${slot.from} Uhr` };
    }
  }
  return { open: false, label: "Geschlossen" };
}

/**
 * Zeigt, ob der Markt gerade offen hat. Die Uhrzeit des Besuchers steht beim
 * Server-Rendering nicht fest, deshalb erscheint der Status erst nach dem
 * Mounten — so entsteht kein Hydration-Konflikt.
 */
export function OpenStatus({ hours }: { hours: Opening[] }) {
  const [state, setState] = useState<{ open: boolean; label: string } | null>(null);

  useEffect(() => {
    const update = () => setState(statusFor(hours, new Date()));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [hours]);

  if (!state) return null;

  return (
    <span className={`status${state.open ? " status--open" : ""}`}>
      <span className="status__dot" />
      {state.label}
    </span>
  );
}

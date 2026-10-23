import type { Metadata } from "next";
import { Configurator } from "@/components/Configurator";

export const metadata: Metadata = {
  title: "Mix & Match — Tisch konfigurieren",
  description:
    "Stell dir deinen Massivholztisch zusammen: Platte, Ölung, Gestell und Spachtelung. Riegel Interior Manufaktur.",
};

export default function KonfiguratorPage() {
  return (
    <main className="cfg">
      <Configurator />
    </main>
  );
}

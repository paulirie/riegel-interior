import type { Metadata } from "next";
import { Configurator } from "@/components/Configurator";

export const metadata: Metadata = {
  title: "Mix & Match — Tisch konfigurieren",
  description:
    "Stell dir deinen Esstisch aus vollmassiver Eiche zusammen: Platte, Kante, Oberfläche und Gestell. Riegel Interior.",
};

export default function KonfiguratorPage() {
  return (
    <main className="cfg">
      <Configurator />
    </main>
  );
}

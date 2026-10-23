import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ScrollReveal } from "@/components/ScrollReveal";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Riegel Interior — Einzigartige Möbel aus aller Welt",
    template: "%s — Riegel Interior",
  },
  description:
    "Riegel Interior — einzigartige Massivholzmöbel aus aller Welt in hoher Qualität, zu richtig attraktiven Preisen. Flagship-Store Wesel, Recklinghausen & Haltern am See.",
  openGraph: {
    title: "Riegel Interior — Einzigartige Möbel aus aller Welt",
    description:
      "Einzigartige Massivholzmöbel aus aller Welt in hoher Qualität, zu richtig attraktiven Preisen.",
    locale: "de_DE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <ScrollReveal />
      </body>
    </html>
  );
}

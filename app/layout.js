import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { SITE } from "@/data/site";
import Providers from "@/components/Providers";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description:
    "A small green homestay in the Kandy hills, Sri Lanka. The pool is free with your stay. There's a badminton court, quiet green rooms, and tree murals on the walls.",
  keywords: ["Kandy homestay", "Sri Lanka pool villa", "Kandy retreat", "The Heights Retreat"],
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: "A green hideaway with a fairy-lit pool, badminton and leafy rooms in Kandy.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#0b110d",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

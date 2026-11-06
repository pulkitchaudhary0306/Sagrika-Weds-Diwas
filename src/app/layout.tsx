import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Great_Vibes, Inter, Tiro_Devanagari_Hindi } from "next/font/google";
import { wedding } from "@/data/wedding";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-inter",
});

const devanagari = Tiro_Devanagari_Hindi({
  subsets: ["devanagari"],
  weight: "400",
  variable: "--font-devanagari",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const title = `${wedding.bride} & ${wedding.groom} (${wedding.brideHindi} परिणय ${wedding.groomHindi}) | Wedding Invitation`;
const description = `॥ शुभ विवाह ॥ With the blessings of our families (${wedding.family.hosts}), we cordially invite you to celebrate the wedding of ${wedding.bride} & ${wedding.groom} on ${wedding.weddingDay}, ${wedding.weddingDate} in Dehradun.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: [{ url: "/media/final-assets/couple-master.webp", alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/media/final-assets/couple-master.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#741f32",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${greatVibes.variable} ${inter.variable} ${devanagari.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

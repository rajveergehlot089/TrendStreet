import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { QuickViewModal } from "@/components/QuickViewModal";
import { StoreJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Trend Street | The Style Hub — Luxury Menswear & Bespoke Tailoring",
  description:
    "Discover Trend Street: premier luxury menswear fashion house. Hand-crafted Savile Row tailoring, Vitale Barberis wool suits, Italian footwear, cashmere outerwear, and 3D interactive atelier.",
  keywords: [
    "menswear",
    "luxury suits",
    "bespoke tailoring",
    "Savile Row",
    "Vitale Barberis wool",
    "Italian leather shoes",
    "cashmere overcoats",
    "trend street",
    "the style hub",
  ],
  authors: [{ name: "Trend Street Atelier" }],
  creator: "Trend Street",
  publisher: "Trend Street Ltd",
  metadataBase: new URL("https://trendstreet.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://trendstreet.com",
    title: "Trend Street | The Style Hub — Luxury Menswear & Bespoke Tailoring",
    description:
      "Handcrafted luxury menswear, bespoke tailoring, and contemporary sartorial elegance. Sourced from the finest European mills.",
    siteName: "Trend Street",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Trend Street Luxury Menswear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trend Street | The Style Hub",
    description: "Luxury Menswear, Bespoke Tailoring & Sartorial Elegance.",
    creator: "@trendstreet",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <StoreJsonLd />
      </head>
      <body className="min-h-screen flex flex-col bg-ivory text-espresso antialiased">
        <AdminAuthProvider>
          <StoreProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <QuickViewModal />
          </StoreProvider>
        </AdminAuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { AdminLayoutStyles } from "@/components/layout/AdminLayoutStyles";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/data/site";
import { getMenuItems, getSiteSettings } from "@/lib/db";
import { localBusinessSchema } from "@/data/schemas";
import { Inter, Monoton } from "next/font/google";

const googleSans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-google-sans",
  display: "swap",
});

const monoton = Monoton({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-monoton",
  display: "swap",
});

// Cache the layout for 1 hour — navigation & settings revalidate on the server,
// so each page transition doesn't block on a Supabase round-trip.
export const revalidate = 3600;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "PrimeSec Teknoloji | Güvenlik Sistemleri",
    template: "%s",
  },
  description: siteConfig.description,
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [settings, headerNavigation] = await Promise.all([
    getSiteSettings(),
    getMenuItems("header"),
  ]);

  return (
    <html lang="tr" className={`${googleSans.variable} ${monoton.variable}`}>
      <head />
      <body>
        <AdminLayoutStyles />
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: settings.name,
              legalName: settings.legalName,
              url: settings.siteUrl,
              email: settings.email,
              telephone: settings.phone,
              address: settings.address,
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: settings.name,
              url: settings.siteUrl,
            },
            localBusinessSchema(),
          ]}
        />
        <Header navigation={headerNavigation} />
        <main className="overflow-x-hidden">{children}</main>
        <Footer />
        <FloatingContact />
      </body>
    </html>
  );
}

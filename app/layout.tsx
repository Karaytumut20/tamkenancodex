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

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const [settings, headerNavigation] = await Promise.all([
    getSiteSettings(),
    getMenuItems("header"),
  ]);

  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&family=Monoton&display=swap" rel="stylesheet" />
      </head>
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
          ]}
        />
        <Header navigation={headerNavigation} />
        <main>{children}</main>
        <Footer />
        <FloatingContact />
      </body>
    </html>
  );
}

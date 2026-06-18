import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { AdminLayoutStyles } from "@/components/layout/AdminLayoutStyles";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/data/site";
import { getMenuItems, getSiteSettings, getMegaMenuData } from "@/lib/db";
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

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    metadataBase: new URL(settings.siteUrl || siteConfig.siteUrl),
    title: {
      default: "PrimeSec Teknoloji | Güvenlik Sistemleri",
      template: "%s",
    },
    description: settings.description || siteConfig.description,
    verification: {
      google: settings.gscVerification || undefined,
    },
    icons: {
      icon: [
        { url: "/images/favicon.ico" },
        { url: "/images/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/images/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [
        { url: "/images/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
      other: [
        {
          rel: "android-chrome-192x192",
          url: "/images/android-chrome-192x192.png",
        },
        {
          rel: "android-chrome-512x512",
          url: "/images/android-chrome-512x512.png",
        },
      ],
    },
    manifest: "/images/site.webmanifest",
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const settings = await getSiteSettings();
  const headerNavigation = await getMenuItems("header");

  const knownMegaMenuKeys = headerNavigation
    .map((item) => item.menuKey)
    .filter((key): key is string => !!key);

  const megaMenuResults = await Promise.all(
    knownMegaMenuKeys.map((key) => getMegaMenuData(key))
  );

  const megaMenusData: Record<string, any> = {};
  knownMegaMenuKeys.forEach((key, index) => {
    megaMenusData[key] = megaMenuResults[index] ?? null;
  });

  return (
    <html lang="tr" className={`${googleSans.variable} ${monoton.variable}`}>
      <head />
      <body>
        {settings.gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${settings.gaId}`}></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${settings.gaId}');
                `,
              }}
            />
          </>
        )}
        {settings.gtagScript && (
          <div dangerouslySetInnerHTML={{ __html: settings.gtagScript }} />
        )}
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
        <Header navigation={headerNavigation} megaMenusData={megaMenusData} />
        <main className="overflow-x-hidden">{children}</main>
        <Footer />
        <FloatingContact representatives={settings.representatives} />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { AdminLayoutStyles } from "@/components/layout/AdminLayoutStyles";
import { PwaRegister } from "@/components/seo/PwaRegister";
import { JsonLd } from "@/components/seo/JsonLd";
import { GoogleTag } from "@/components/seo/GoogleTag";
import { siteConfig } from "@/data/site";
import { getMenuItems, getSiteSettings, getMegaMenuData, type SiteSettings } from "@/lib/db";
import { localBusinessSchema } from "@/data/schemas";
import { Inter, Monoton } from "next/font/google";
import { unstable_cache } from "next/cache";

const GOOGLE_ADS_ID = "AW-18335318483";

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

const getCachedSiteSettings = unstable_cache(getSiteSettings, ["site-settings-v1"], {
  revalidate: 3600,
  tags: ["site-settings"],
});

const getCachedPublicChrome = unstable_cache(async () => {
  try {
    const settings = await getSiteSettings();
    const headerNavigation = await getMenuItems("header");
    const knownMegaMenuKeys = headerNavigation
      .map((item) => item.menuKey)
      .filter((key): key is string => Boolean(key));
    const megaMenuResults = await Promise.all(knownMegaMenuKeys.map((key) => getMegaMenuData(key)));
    const megaMenusData = Object.fromEntries(
      knownMegaMenuKeys.map((key, index) => [key, megaMenuResults[index] ?? null]),
    );
    return { settings, headerNavigation, megaMenusData };
  } catch (err) {
    console.error("[Layout] getCachedPublicChrome failed, using static fallbacks:", err);
    const { mainNavigation } = await import("@/data/navigation");
    return { settings: siteConfig as SiteSettings, headerNavigation: mainNavigation, megaMenusData: {} };
  }
}, ["public-chrome-v1"], { revalidate: 3600, tags: ["site-navigation", "mega-menu"] });

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  let settings: SiteSettings = siteConfig as SiteSettings;
  try {
    settings = await getCachedSiteSettings();
  } catch (err) {
    console.error("[Layout] generateMetadata failed, using siteConfig fallback:", err);
  }
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
    appleWebApp: {
      capable: true,
      title: "PrimeSec",
      statusBarStyle: "black-translucent",
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
  themeColor: "#0f172a",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { settings, headerNavigation, megaMenusData } = await getCachedPublicChrome();
  const googleTagConfig = [GOOGLE_ADS_ID, settings.gaId, settings.googleAdsId, settings.gtagScript]
    .filter(Boolean)
    .join("\n");
  const googleTagIds = Array.from(
    new Set(
      (googleTagConfig.match(/\b(?:G-[A-Z0-9]{6,}|AW-\d{6,}|GT-[A-Z0-9]{6,})\b/gi) ?? [])
        .map((id) => id.toUpperCase()),
    ),
  );

  return (
    <html lang="tr" className={`${googleSans.variable} ${monoton.variable}`}>
      <body>
        <a
          href="#main-content"
          className="sr-only z-[200] rounded-md bg-white px-4 py-3 text-slate-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Ana içeriğe geç
        </a>
        <GoogleTag ids={googleTagIds} />
        <AdminLayoutStyles />
        <PwaRegister />
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
        <main id="main-content" className="overflow-x-hidden">{children}</main>
        <Footer />
        <FloatingContact representatives={settings.representatives} />
      </body>
    </html>
  );
}

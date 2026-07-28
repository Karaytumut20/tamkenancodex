import "server-only";

export type UsdTryRate = {
  rate: number;
  date: string;
  source: "TCMB";
};

const TCMB_DAILY_RATES_URL = "https://www.tcmb.gov.tr/kurlar/today.xml";

export async function getUsdTryRate(): Promise<UsdTryRate | null> {
  try {
    const response = await fetch(TCMB_DAILY_RATES_URL, {
      headers: { "User-Agent": "PrimeSec-Teknoloji/1.0" },
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;

    const xml = await response.text();
    const usdBlock = xml.match(/<Currency[^>]*CurrencyCode="USD"[\s\S]*?<\/Currency>/)?.[0];
    const sellingText = usdBlock?.match(/<ForexSelling>([^<]+)<\/ForexSelling>/)?.[1];
    const rawDate = xml.match(/Date="([^"]+)"/)?.[1];
    const rate = Number(sellingText);

    if (!rawDate || !Number.isFinite(rate) || rate <= 0) return null;
    const [month, day, year] = rawDate.split("/");
    const date = day && month && year ? `${day}.${month}.${year}` : rawDate;
    return { rate, date, source: "TCMB" };
  } catch {
    return null;
  }
}

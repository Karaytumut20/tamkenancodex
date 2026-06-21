import { NextRequest, NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/db";
import { directWhatsappUrl } from "@/lib/whatsapp";

export async function GET(request: NextRequest) {
  const message = (request.nextUrl.searchParams.get("text") || "Merhaba, PrimeSec Teknoloji'den bilgi almak istiyorum.").slice(0, 1000);
  const settings = await getSiteSettings();
  const response = NextResponse.redirect(directWhatsappUrl(message, settings.whatsapp), 307);
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  return response;
}

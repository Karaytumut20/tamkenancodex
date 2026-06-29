import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { hasSupabasePublicEnv, requireSupabasePublicEnv } from "@/lib/supabase/env";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. HTTPS & www Yönlendirmesi ──────────────────────────────────────────
  // Sadece production'da çalışsın (localhost'u etkilemesin)
  const host = request.headers.get("host") ?? "";
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");

  if (!isLocalhost) {
    const isHttps = proto === "https";
    const isWww = host.startsWith("www.");
    const canonicalHost = isWww ? host : `www.${host}`;

    // HTTP → HTTPS veya non-www → www ise yönlendir (sadece primesecteknoloji.com)
    const isPrimesec = host === "primesecteknoloji.com" || host === "www.primesecteknoloji.com";
    if (isPrimesec && (!isHttps || !isWww)) {
      const redirectUrl = new URL(request.url);
      redirectUrl.protocol = "https:";
      redirectUrl.host = canonicalHost;
      return NextResponse.redirect(redirectUrl, { status: 301 });
    }
  }
  // ──────────────────────────────────────────────────────────────────────────

  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete("x-primesec-authenticated");
  requestHeaders.delete("x-primesec-admin");
  requestHeaders.delete("x-primesec-login");
  requestHeaders.set("x-primesec-admin-route", "1");
  let response = NextResponse.next({ request: { headers: requestHeaders } });
  const refreshedCookies: ResponseCookie[] = [];

  if (pathname.startsWith("/admin/login")) {
    requestHeaders.set("x-primesec-login", "1");
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    return response;
  }

  if (!hasSupabasePublicEnv()) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("setup", "missing-env");
    return NextResponse.redirect(loginUrl);
  }

  const env = requireSupabasePublicEnv();
  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        refreshedCookies.push(...cookiesToSet.map(({ name, value, options }) => ({ name, value, ...options })));
        response = NextResponse.next({ request: { headers: requestHeaders } });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("id, full_name, role, avatar_url, is_active")
    .eq("id", userId)
    .eq("is_active", true)
    .maybeSingle();

  if (!profile) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if ((pathname.startsWith("/admin/users") || pathname.startsWith("/admin/activity-logs")) && profile.role !== "super_admin") {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = "/admin";
    return NextResponse.redirect(adminUrl);
  }

  // Downstream Server Components can reuse the identity already verified here.
  // Incoming values are always deleted above, so clients cannot forge it.
  requestHeaders.set("x-primesec-authenticated", "1");
  requestHeaders.set(
    "x-primesec-admin",
    encodeURIComponent(JSON.stringify({
      id: userId,
      full_name: profile.full_name ?? null,
      role: profile.role,
      avatar_url: profile.avatar_url ?? null,
      is_active: true,
    })),
  );

  const verifiedResponse = NextResponse.next({ request: { headers: requestHeaders } });
  refreshedCookies.forEach((cookie) => verifiedResponse.cookies.set(cookie));

  return verifiedResponse;
}

export const config = {
  matcher: [
    /*
     * Aşağıdakiler HARİÇ tüm path'lerde çalış:
     * - _next/static  (statik dosyalar)
     * - _next/image   (resim optimizasyonu)
     * - favicon.ico, robots.txt, sitemap.xml vb.
     */
    "/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)",
  ],
};

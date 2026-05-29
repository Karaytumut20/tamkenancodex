import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json") ? await request.json() : Object.fromEntries((await request.formData()).entries());

  if (data.company) {
    return NextResponse.json({ ok: true });
  }

  if (!data.name || !data.phone || !data.city || !data.kvkkConsent) {
    return NextResponse.json({ ok: false, error: "Eksik zorunlu alan" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    lead: {
      ...data,
      createdAt: data.createdAt ?? new Date().toISOString(),
    },
  });
}

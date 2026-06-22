import { NextResponse } from "next/server";
import { hasSupabasePublicEnv } from "@/lib/supabase/env";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json") ? await request.json() : Object.fromEntries((await request.formData()).entries());

  if (data.company) {
    return NextResponse.json({ ok: true });
  }

  if (!data.name || !data.phone || !data.city || !data.kvkkConsent) {
    return NextResponse.json({ ok: false, error: "Eksik zorunlu alan" }, { status: 400 });
  }

  if (data.source === "system_builder" && (!data.area || !data.floor || !data.reason || !Array.isArray(data.selectedServices) || data.selectedServices.length === 0)) {
    return NextResponse.json({ ok: false, error: "Sistem bilgileri eksik" }, { status: 400 });
  }

  const leadPayload = {
    source: data.source ?? "contact_form",
    full_name: data.name ?? data.full_name,
    phone: data.phone,
    email: data.email ?? null,
    city: data.city,
    district: data.district ?? null,
    message: data.message ?? null,
    interested_service: data.interestedService ?? data.interested_service ?? null,
    status: "new",
    priority: "normal",
    kvkk_consent: data.kvkkConsent === true || data.kvkkConsent === "true" || data.kvkkConsent === "on",
    metadata: {
      raw: data,
      systemBuilder: data.source === "system_builder" ? {
        protectedArea: data.area,
        spaceType: data.floor,
        needReason: data.reason,
        selectedServices: data.selectedServices ?? [],
        marketingConsent: data.marketingConsent === true,
        pageUrl: data.pageUrl ?? null,
      } : null,
      submittedAt: new Date().toISOString(),
    },
  };

  if (hasSupabasePublicEnv()) {
    const supabase = createSupabaseServiceClient();
    const { data: lead, error } = await supabase.from("leads").insert(leadPayload).select("id").single();
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    if (data.source === "system_builder") {
      const { error: submissionError } = await supabase.from("system_builder_submissions").insert({
        lead_id: lead.id,
        protected_area: data.area ?? null,
        space_type: data.floor ?? null,
        need_reason: data.reason ?? null,
        selected_products_snapshot: data.selectedServices ?? [],
        summary: data,
      });
      if (submissionError) {
        await supabase.from("leads").delete().eq("id", lead.id);
        return NextResponse.json({ ok: false, error: submissionError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true, lead });
  }

  return NextResponse.json({
    ok: true,
    lead: {
      ...data,
      createdAt: data.createdAt ?? new Date().toISOString(),
    },
  });
}

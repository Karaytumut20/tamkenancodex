"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      source: "contact_form",
      name: formData.get("name"),
      phone: formData.get("phone"),
      city: formData.get("city"),
      message: formData.get("message"),
      kvkkConsent: formData.get("kvkkConsent") === "on",
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok || !result.ok) {
        throw new Error(result.error || "Bir hata oluştu");
      }
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Talebiniz gönderilirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="mt-8 border-t border-border pt-6 text-center space-y-3">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h4 className="text-lg font-black text-slate-800">Talebiniz Alındı!</h4>
        <p className="text-sm text-slate-500 font-medium">
          Müşteri temsilcilerimiz en kısa sürede sizinle iletişime geçecektir.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4 border-t border-border pt-6">
      <input type="hidden" name="source" value="contact" />
      <input name="company" className="hidden" tabIndex={-1} autoComplete="off" />
      <h3 className="text-lg font-bold text-ink mb-1">Keşif & Teklif Formu</h3>
      
      {error && (
        <div className="p-3 text-sm rounded-xl border border-red-200 bg-red-50 text-red-700 font-medium">
          {error}
        </div>
      )}

      {["Ad Soyad", "Telefon", "Şehir"].map((label) => (
        <label key={label} className="block">
          <span className="sr-only">{label}</span>
          <input
            name={label === "Ad Soyad" ? "name" : label === "Telefon" ? "phone" : "city"}
            required
            placeholder={label}
            className="h-12 w-full rounded-xl border border-border bg-white text-ink placeholder-ink-lighter px-4 outline-none focus:border-cyan-600 focus:bg-white transition-colors"
          />
        </label>
      ))}

      <label className="block">
        <span className="sr-only">Mesajınız</span>
        <textarea
          name="message"
          placeholder="Mesajınız (Varsa talepleriniz veya detaylar)"
          rows={3}
          className="w-full rounded-xl border border-border bg-white text-ink placeholder-ink-lighter p-4 outline-none focus:border-cyan-600 focus:bg-white transition-colors resize-none"
        />
      </label>

      <label className="flex gap-3 text-sm leading-6 text-ink-muted cursor-pointer">
        <input required name="kvkkConsent" type="checkbox" className="mt-1 h-5 w-5 shrink-0 rounded border-border accent-cyan-600" />
        <span>KVKK kapsamında iletişime geçilmesini kabul ediyorum.</span>
      </label>
      <button
        disabled={loading}
        className="h-12 w-full rounded-xl bg-cyan-600 border-2 border-cyan-700 text-white font-extrabold transition-colors flex items-center justify-center gap-2 hover:bg-cyan-700 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Gönderiliyor...
          </>
        ) : (
          "Bilgilerimi Gönder"
        )}
      </button>
    </form>
  );
}

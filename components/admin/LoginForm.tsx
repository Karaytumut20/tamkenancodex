"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { signInAdmin } from "@/app/admin/login/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-12 w-full rounded-lg primesec-navy-action text-sm font-extrabold text-white disabled:opacity-60"
    >
      {pending ? "Giriş yapılıyor..." : "Admin Paneline Gir"}
    </button>
  );
}

export function LoginForm() {
  const searchParams = useSearchParams();
  const [state, action] = useActionState(signInAdmin, {});

  return (
    <form action={action} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
      <input type="hidden" name="next" value={searchParams.get("next") ?? "/admin"} />
      <div>
        <label className="text-sm font-extrabold">E-posta</label>
        <input
          type="email"
          name="email"
          required
          className="mt-2 h-12 w-full rounded-lg border border-slate-200 px-3 outline-none focus:border-primary-400"
        />
      </div>
      <div>
        <label className="text-sm font-extrabold">Şifre</label>
        <input
          type="password"
          name="password"
          required
          className="mt-2 h-12 w-full rounded-lg border border-slate-200 px-3 outline-none focus:border-primary-400"
        />
      </div>
      {state.error ? <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-600">{state.error}</p> : null}
      <SubmitButton />
    </form>
  );
}

import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.36em] text-primary-600">PrimeSec</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-ink">Admin Girişi</h1>
          <p className="mt-2 text-sm text-ink-muted">Yetkili kullanıcı hesabınızla giriş yapın.</p>
        </div>
        <Suspense fallback={<div className="rounded-xl bg-white p-6">Yükleniyor...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}

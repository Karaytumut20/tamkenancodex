import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Logo({ dark = true }: { dark?: boolean }) {
  return (
    <Link href="/" className="flex min-w-[190px] items-center gap-3" aria-label="PrimeSec Teknoloji ana sayfa">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl primesec-navy-action text-white">
        <ShieldCheck className="h-6 w-6" />
      </span>
      <span className="leading-none">
        <span className={dark ? "block text-xl font-extrabold text-white" : "block text-xl font-extrabold text-ink"}>PrimeSec</span>
        <span className={dark ? "block text-[11px] font-extrabold tracking-[0.24em] text-primary-300" : "block text-[11px] font-extrabold tracking-[0.24em] text-primary-600"}>TEKNOLOJİ</span>
      </span>
    </Link>
  );
}

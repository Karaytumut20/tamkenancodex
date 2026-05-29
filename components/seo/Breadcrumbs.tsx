import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export type Crumb = { label: string; href: string };

export function Breadcrumbs({ items, dark = false }: { items: Crumb[]; dark?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className={dark ? "text-sm text-white/70" : "text-sm text-ink-muted"}>
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="inline-flex items-center gap-1 hover:text-primary-400">
            <Home className="h-4 w-4" /> Ana Sayfa
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.href} className="inline-flex items-center gap-2">
            <ChevronRight className="h-4 w-4 opacity-60" />
            <Link href={item.href} className="hover:text-primary-400">
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

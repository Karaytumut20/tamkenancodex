import type { ReactNode } from "react";

export function SectionHeading({ eyebrow, title, description, children }: { eyebrow?: string; title: string; description?: string; children?: ReactNode }) {
  return (
    <div className="mb-9 max-w-3xl">
      {eyebrow ? <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.12em] text-primary-600">{eyebrow}</p> : null}
      <h2 className="section-title text-ink">{title}</h2>
      {description ? <p className="mt-4 text-base leading-7 text-ink-muted md:text-lg">{description}</p> : null}
      {children}
    </div>
  );
}

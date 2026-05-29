import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondaryDark" | "outlineBlue" | "whatsapp" | "ghost";
type Size = "sm" | "md" | "lg" | "xl";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-br from-primary-600 to-primary-500 text-white shadow-glow hover:-translate-y-0.5 hover:shadow-[0_18px_54px_rgba(0,107,255,0.34)]",
  secondaryDark:
    "border border-white/25 bg-white/[0.04] text-white hover:border-primary-400 hover:bg-primary-500/10",
  outlineBlue:
    "border border-primary-500 bg-white text-primary-600 hover:bg-primary-600 hover:text-white",
  whatsapp:
    "border border-success-500 bg-success-500/10 text-white hover:bg-success-500 hover:text-navy-1000",
  ghost: "bg-transparent text-inherit hover:bg-primary-500/10",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-3 text-sm",
  md: "h-12 px-5 text-sm",
  lg: "h-[58px] px-6 text-base",
  xl: "h-16 px-7 text-lg",
};

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

export function Button({ children, variant = "primary", size = "md", className, ...props }: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn("inline-flex items-center justify-center gap-2 rounded-xl font-bold transition", variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({ children, variant = "primary", size = "md", className, ...props }: BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <Link className={cn("inline-flex items-center justify-center gap-2 rounded-xl font-bold transition", variants[variant], sizes[size], className)} {...props}>
      {children}
    </Link>
  );
}

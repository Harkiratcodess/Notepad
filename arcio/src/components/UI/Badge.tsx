import type { ReactNode } from "react";

type Variant = "neutral" | "accent" | "danger" | "lang";

const VARIANT: Record<Variant, string> = {
  neutral: "bg-arcio-surface text-arcio-text",
  accent: "bg-arcio-accent text-arcio-text",
  danger: "bg-arcio-danger text-white",
  lang: "bg-arcio-green text-arcio-text",
};

export function Badge({
  children,
  variant = "neutral",
  className = "",
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center border-2 border-arcio-border px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${VARIANT[variant]} ${className}`}
      style={{ borderRadius: "var(--radius)" }}
    >
      {children}
    </span>
  );
}

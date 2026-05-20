import type { ButtonHTMLAttributes, ReactElement, ReactNode } from "react";

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  selected?: boolean;
};

export function Chip({
  children,
  selected = false,
  className = "",
  type = "button",
  ...props
}: ChipProps): ReactElement {
  return (
    <button
      className={`min-h-10 rounded-full border px-4 py-2 text-sm font-semibold transition ${
        selected
          ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]"
          : "border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:border-[var(--color-zubda-500)] hover:text-[var(--color-ink)]"
      } ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

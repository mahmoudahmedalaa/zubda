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
          ? "border-[var(--color-zubda-500)] bg-[var(--color-zubda-500)] text-white"
          : "border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:border-[var(--color-zubda-300)] hover:text-[var(--color-zubda-700)]"
      } ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

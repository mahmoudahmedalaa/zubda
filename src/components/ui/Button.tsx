import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactElement, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type BaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonLinkProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

const variants: Record<ButtonVariant, string> = {
  primary: "bg-[#11161a] text-[#fffaf0] shadow-sm hover:bg-black",
  secondary:
    "border border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:border-[var(--color-zubda-500)]",
  ghost: "text-[var(--color-ink-muted)] hover:bg-[var(--color-zubda-50)] hover:text-[var(--color-ink)]"
};

const baseClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-card)] px-5 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-zubda-500)] disabled:pointer-events-none disabled:opacity-50";

export function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps): ReactElement {
  return (
    <button className={`${baseClass} ${variants[variant]} ${className}`} type={type} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  variant = "primary",
  className = "",
  href,
  ...props
}: ButtonLinkProps): ReactElement {
  return (
    <Link className={`${baseClass} ${variants[variant]} ${className}`} href={href} {...props}>
      {children}
    </Link>
  );
}

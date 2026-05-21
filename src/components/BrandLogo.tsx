import type { ReactElement } from "react";

type BrandLogoProps = {
  compact?: boolean;
};

export function BrandLogo({ compact = false }: BrandLogoProps): ReactElement {
  return (
    <span className="inline-flex items-center gap-4" aria-label="زبدة">
      <span className="relative grid size-16 place-items-center overflow-hidden rounded-[24px] bg-[var(--color-zubda-500)] text-white shadow-[0_16px_36px_rgb(72_87_252/0.24)]">
        <svg
          aria-hidden
          className="absolute inset-0 size-full"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 17H39" stroke="white" strokeOpacity="0.35" strokeWidth="5" strokeLinecap="round" />
          <path d="M10 29H30" stroke="white" strokeOpacity="0.25" strokeWidth="5" strokeLinecap="round" />
          <path d="M10 41H21" stroke="white" strokeOpacity="0.18" strokeWidth="5" strokeLinecap="round" />
          <circle cx="45" cy="45" r="10" fill="hsl(190 91% 48%)" fillOpacity="0.9" />
        </svg>
        <span className="relative -mt-1 text-[2.15rem] font-black leading-none">ز</span>
      </span>
      {compact ? null : (
        <span className="grid gap-2">
          <span className="display-arabic text-[2.15rem] font-black leading-none">زبدة</span>
          <span className="text-sm font-bold leading-none text-[var(--color-ink-muted)]">الزبدة مما يهمك</span>
        </span>
      )}
    </span>
  );
}

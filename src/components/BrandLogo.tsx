import type { ReactElement } from "react";

type BrandLogoProps = {
  compact?: boolean;
};

export function BrandLogo({ compact = false }: BrandLogoProps): ReactElement {
  return (
    <span className="inline-flex items-center gap-4" aria-label="زبدة">
      <span className="relative grid size-12 place-items-center overflow-hidden rounded-[22px] bg-[var(--color-zubda-500)] text-white shadow-[0_16px_36px_hsl(237_97%_61%/0.26)]">
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
        <span className="relative -mt-1 text-2xl font-black leading-none">ز</span>
      </span>
      {compact ? null : <span className="text-2xl font-black leading-none">زبدة</span>}
    </span>
  );
}

"use client";

import { motion } from "framer-motion";
import { type ReactElement } from "react";

const signals = [
  { label: "خبر رسمي", color: "var(--color-trust-500)", x: "12%", y: "18%" },
  { label: "سوق", color: "var(--color-saffron-500)", x: "70%", y: "14%" },
  { label: "تقنية", color: "var(--color-zubda-500)", x: "76%", y: "68%" },
  { label: "منطقتك", color: "var(--color-fig-500)", x: "18%", y: "72%" }
];

export function SignalFlow(): ReactElement {
  return (
    <div className="relative min-h-[390px] overflow-hidden rounded-[40px] bg-white p-6 shadow-[var(--shadow-card)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,hsl(237_97%_61%/0.12),transparent_16rem)]" />
      <svg aria-hidden className="absolute inset-0 h-full w-full" viewBox="0 0 420 390" fill="none">
        <motion.path
          animate={{ pathLength: [0.2, 1, 0.2], opacity: [0.22, 0.58, 0.22] }}
          d="M70 76 C150 122 168 168 210 195 C255 223 302 250 334 296"
          stroke="var(--color-zubda-500)"
          strokeLinecap="round"
          strokeWidth="3"
          transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          animate={{ pathLength: [0.15, 1, 0.15], opacity: [0.18, 0.5, 0.18] }}
          d="M324 68 C270 122 244 158 210 195 C170 238 118 274 84 306"
          stroke="var(--color-trust-500)"
          strokeLinecap="round"
          strokeWidth="3"
          transition={{ duration: 6.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      {signals.map((signal, index) => (
        <motion.div
          animate={{ y: [0, index % 2 === 0 ? -8 : 8, 0] }}
          className="absolute rounded-[24px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-black shadow-sm"
          key={signal.label}
          style={{ color: signal.color, left: signal.x, top: signal.y }}
          transition={{ duration: 4.8 + index * 0.35, repeat: Infinity, ease: "easeInOut" }}
        >
          {signal.label}
        </motion.div>
      ))}

      <motion.div
        animate={{ scale: [1, 1.04, 1], boxShadow: ["0 18px 44px hsl(237 97% 61% / 0.24)", "0 22px 64px hsl(237 97% 61% / 0.34)", "0 18px 44px hsl(237 97% 61% / 0.24)"] }}
        className="absolute left-1/2 top-1/2 grid size-32 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[36px] bg-[var(--color-zubda-500)] text-center text-lg font-black text-white"
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      >
        الزبدة
      </motion.div>
    </div>
  );
}

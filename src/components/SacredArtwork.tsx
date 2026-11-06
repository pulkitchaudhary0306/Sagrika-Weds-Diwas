import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

/** Traditional auspicious Mangal Kalash with coconut & mango leaves. */
export function KalashIllustration(props: P) {
  return (
    <svg
      viewBox="0 0 80 96"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {/* Top lotus finial & coconut (Shreefal) */}
      <path d="M40 6c6 5 9 12 9 18 0 5-4 8-9 8s-9-3-9-8c0-6 3-13 9-18z" fill="currentColor" fillOpacity={0.14} />
      <path d="M40 6v26" strokeWidth={0.9} strokeOpacity={0.5} />
      {/* Mango leaves (Ashoka/Amra pallav) */}
      <path d="M32 30c-9-4-16-2-21 6 7 3 15 2 22-3" fill="currentColor" fillOpacity={0.1} />
      <path d="M48 30c9-4 16-2 21 6-7 3-15 2-22-3" fill="currentColor" fillOpacity={0.1} />
      <path d="M35 28c-6-7-12-8-18-3 5 5 11 6 18 3" />
      <path d="M45 28c6-7 12-8 18-3-5 5-11 6-18 3" />
      {/* Kalash rim & neck */}
      <rect x="26" y="32" width="28" height="4.5" rx="2.2" fill="currentColor" fillOpacity={0.2} />
      <path d="M29 36.5l-2 6h26l-2-6" />
      {/* Kalash pot body */}
      <path
        d="M27 42.5c-9 6-12 16-10 25 2 9 11 15 23 15s21-6 23-15c2-9-1-19-10-25H27z"
        fill="currentColor"
        fillOpacity={0.12}
      />
      {/* Decorative band & sacred Swastika on the Kalash */}
      <path d="M18 55h44M18 59h44" strokeWidth={0.9} strokeOpacity={0.65} />
      <path d="M40 62v10M35 67h10M40 62h4M40 72h-4M35 67v-4M45 67v4" strokeWidth={1.3} />
      {/* Base pedestal */}
      <path d="M28 82.5l-4 6.5h32l-4-6.5" fill="currentColor" fillOpacity={0.2} />
      <path d="M20 89h40" strokeWidth={1.8} />
    </svg>
  );
}

/** Royal Indian Wedding Mandap with dome, pillars, toran & sacred Agni. */
export function MandapIllustration(props: P) {
  return (
    <svg
      viewBox="0 0 160 120"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {/* Kalash spire on top of dome */}
      <path d="M80 4v6" />
      <circle cx="80" cy="12" r="2.2" fill="currentColor" />
      {/* Royal Mughal/Rajasthani dome canopy */}
      <path
        d="M24 42c4-15 26-26 56-28 30 2 52 13 56 28H24z"
        fill="currentColor"
        fillOpacity={0.12}
      />
      <path d="M36 42c4-11 20-19 44-21 24 2 40 10 44 21" strokeWidth={0.85} strokeOpacity={0.65} />
      {/* Scalloped marigold toran */}
      <path d="M18 42h124" strokeWidth={1.8} />
      <path d="M24 42q14 11 28 0 14 11 28 0 14 11 28 0 14 11 28 0" fill="currentColor" fillOpacity={0.15} />
      {/* Outer & inner carved pillars */}
      <path d="M26 42v62M32 46v58M134 42v62M128 46v58" />
      <path d="M50 47v57M110 47v57" strokeWidth={0.9} strokeOpacity={0.7} />
      {/* Inner cusped arch */}
      <path d="M50 66c8-12 18-18 30-20 12 2 22 8 30 20" strokeWidth={1} />
      {/* Sacred Havan Kund & Agni (holy fire) */}
      <path d="M66 104l4-9h20l4 9" fill="currentColor" fillOpacity={0.2} />
      <path d="M62 104h36" />
      <path
        d="M80 93c-7-4-6-12 0-19 2 6 7 8 4 14 3-2 3-5 3-7 3 5 0 10-7 12z"
        fill="currentColor"
        fillOpacity={0.28}
      />
      {/* Mandap platform steps */}
      <rect x="16" y="104" width="128" height="5" rx="1.5" fill="currentColor" fillOpacity={0.16} />
      <path d="M10 113h140" strokeWidth={1.8} />
    </svg>
  );
}


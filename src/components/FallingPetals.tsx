"use client";

import { motion, useReducedMotion } from "motion/react";
import { useWeddingAudio } from "./AudioProvider";

const PETAL_IMAGES = {
  rose: "/media/final-assets/decor/petal-rose.webp",
  marigold: "/media/final-assets/decor/petal-marigold.webp",
  peach: "/media/final-assets/decor/petal-peach.webp",
} as const;

type PetalType = keyof typeof PETAL_IMAGES;

const PETALS: {
  type: PetalType;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  rotate: number;
  opacity: number;
  blur: number;
}[] = [
  { type: "rose", left: 6, size: 22, duration: 12.8, delay: 0, drift: 24, rotate: 210, opacity: 0.72, blur: 0 },
  { type: "marigold", left: 17, size: 17, duration: 15.2, delay: 2.4, drift: -18, rotate: -170, opacity: 0.58, blur: 0.25 },
  { type: "peach", left: 30, size: 25, duration: 10.9, delay: 5.1, drift: 28, rotate: 245, opacity: 0.78, blur: 0 },
  { type: "rose", left: 43, size: 15, duration: 15.8, delay: 7.8, drift: -14, rotate: -135, opacity: 0.56, blur: 0.35 },
  { type: "marigold", left: 58, size: 20, duration: 13.7, delay: 1.3, drift: 19, rotate: 185, opacity: 0.68, blur: 0.1 },
  { type: "peach", left: 70, size: 27, duration: 11.6, delay: 4.2, drift: -26, rotate: -225, opacity: 0.82, blur: 0 },
  { type: "rose", left: 82, size: 18, duration: 14.9, delay: 6.4, drift: 17, rotate: 155, opacity: 0.62, blur: 0.25 },
  { type: "marigold", left: 94, size: 23, duration: 12.1, delay: 8.7, drift: -22, rotate: -205, opacity: 0.74, blur: 0 },
  { type: "peach", left: 11, size: 14, duration: 16, delay: 10.2, drift: 13, rotate: 125, opacity: 0.54, blur: 0.4 },
  { type: "rose", left: 88, size: 28, duration: 10.4, delay: 11.6, drift: -30, rotate: -260, opacity: 0.84, blur: 0 },
];

export default function FallingPetals() {
  const reduceMotion = useReducedMotion();
  const { invitationOpened } = useWeddingAudio();

  if (!invitationOpened || reduceMotion) return null;

  return (
    <div className="falling-petals" aria-hidden="true">
      {PETALS.map((p, i) => (
        <motion.span
          key={`${p.type}-${i}`}
          className="falling-petals__petal"
          style={{
            left: `${p.left}%`,
            width: p.size * 4,
            height: p.size * 4 * (768 / 1408),
            marginLeft: p.size * -1.5,
            opacity: p.opacity,
            filter: p.blur ? `blur(${p.blur}px)` : "none",
            transformPerspective: 800,
          }}
          initial={{
            y: "-12vh",
            x: 0,
            rotateZ: 0,
            rotateX: -8,
            rotateY: 6,
          }}
          animate={{
            y: "112vh",
            x: [0, p.drift, p.drift * -0.55, p.drift * 0.35, 0],
            rotateZ: [0, p.rotate * 0.32, p.rotate * 0.68, p.rotate],
            rotateX: [-8, 18, -12, 10],
            rotateY: [6, -20, 14, -8],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: 1.4 + (i % 3) * 0.65,
            ease: "linear",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PETAL_IMAGES[p.type]}
            alt=""
            width={1408}
            height={768}
            decoding="async"
            draggable={false}
          />
        </motion.span>
      ))}
    </div>
  );
}


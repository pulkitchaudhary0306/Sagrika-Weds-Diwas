"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useWeddingAudio } from "./AudioProvider";

const BURST_MARKS = [
  { layer: "inner", type: "sparkle", x: -42, y: -48, rotate: -18, delay: 0, size: 13 },
  { layer: "inner", type: "petal", x: 38, y: -54, rotate: 42, delay: 0.05, size: 12 },
  { layer: "inner", type: "heart", x: -54, y: -20, rotate: -28, delay: 0.1, size: 11 },
  { layer: "inner", type: "sparkle", x: 52, y: -18, rotate: 24, delay: 0.14, size: 12 },
  { layer: "inner", type: "petal", x: -26, y: -68, rotate: -46, delay: 0.08, size: 13 },
  { layer: "inner", type: "sparkle", x: 20, y: -72, rotate: 18, delay: 0.18, size: 10 },
  { layer: "inner", type: "heart", x: 4, y: -58, rotate: 8, delay: 0.22, size: 10 },
  { layer: "outer", type: "petal", x: -92, y: -86, rotate: -62, delay: 0.18, size: 9 },
  { layer: "outer", type: "sparkle", x: 88, y: -92, rotate: 54, delay: 0.24, size: 8 },
  { layer: "outer", type: "heart", x: -108, y: -42, rotate: -34, delay: 0.3, size: 8 },
  { layer: "outer", type: "petal", x: 106, y: -38, rotate: 68, delay: 0.36, size: 9 },
  { layer: "outer", type: "sparkle", x: -66, y: -116, rotate: -20, delay: 0.28, size: 7 },
  { layer: "outer", type: "petal", x: 62, y: -122, rotate: 38, delay: 0.42, size: 8 },
  { layer: "outer", type: "sparkle", x: -122, y: -8, rotate: -50, delay: 0.46, size: 7 },
  { layer: "outer", type: "heart", x: 120, y: -4, rotate: 44, delay: 0.5, size: 7 },
  { layer: "outer", type: "sparkle", x: 0, y: -138, rotate: 12, delay: 0.34, size: 8 },
] as const;

const GLYPHS: Record<"sparkle" | "heart" | "petal", string> = {
  sparkle: "✦",
  heart: "♥",
  petal: "",
};

export default function BlessingsSection({
  groom,
  bride,
}: {
  groom: string;
  bride: string;
}) {
  const [sent, setSent] = useState(false);
  const [bursting, setBursting] = useState(false);
  const reduceMotion = useReducedMotion();
  const { playEffect } = useWeddingAudio();

  useEffect(() => {
    if (!bursting) return;
    const t = window.setTimeout(() => setBursting(false), reduceMotion ? 500 : 2800);
    return () => window.clearTimeout(t);
  }, [bursting, reduceMotion]);

  return (
    <section className="section blessings-section" aria-labelledby="blessings-title">
      <p className="eyebrow">With love &amp; blessings</p>
      <h2 id="blessings-title">Send Your Love</h2>
      <p>Your presence means the world to us.</p>

      <div
        className={`blessings-interaction ${sent ? "blessings-interaction--complete" : ""}`}
      >
        <span className="blessings-interaction__lotus" aria-hidden="true">
          ❀
        </span>

        <motion.button
          className="blessings-interaction__button"
          type="button"
          onClick={() => {
            if (!sent) {
              playEffect("blessingChime", { restart: true });
              setSent(true);
              setBursting(true);
            }
          }}
          disabled={sent}
          aria-pressed={sent}
          whileTap={sent || reduceMotion ? undefined : { scale: 0.965 }}
          animate={
            sent || reduceMotion
              ? { scale: 1, boxShadow: "0 0.8rem 2rem rgb(116 31 50 / 14%)" }
              : {
                  scale: [1, 1.012, 1],
                  boxShadow: [
                    "0 0.8rem 2rem rgb(116 31 50 / 12%)",
                    "0 0.9rem 2.4rem rgb(180 147 76 / 24%)",
                    "0 0.8rem 2rem rgb(116 31 50 / 12%)",
                  ],
                }
          }
          transition={
            sent || reduceMotion
              ? { duration: 0 }
              : { duration: 3.8, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <span className="blessings-interaction__label-frame">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={sent ? "sent" : "give"}
                className="blessings-interaction__label"
                initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduceMotion ? 0 : -5 }}
                transition={{
                  duration: reduceMotion ? 0.15 : 0.22,
                  delay: sent && !reduceMotion ? 0.08 : 0,
                  ease: "easeOut",
                }}
              >
                {sent ? "❀ Sent with love" : "Give Blessings"}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.button>

        <AnimatePresence>
          {bursting && (
            <motion.div
              className="blessings-interaction__effects"
              aria-hidden="true"
              exit={{ opacity: 0 }}
            >
              <motion.i
                className="blessings-interaction__ring"
                initial={{ opacity: 0.65, scale: 0.72 }}
                animate={{ opacity: 0, scale: reduceMotion ? 1 : 1.65 }}
                transition={{ duration: reduceMotion ? 0.35 : 1.15, ease: "easeOut" }}
              />
              {!reduceMotion &&
                BURST_MARKS.map((m, idx) => (
                  <motion.i
                    key={idx}
                    className={`blessings-interaction__mark blessings-interaction__mark--${
                      m.type
                    } blessings-interaction__mark--${m.layer} blessings-interaction__mark--petal-${
                      idx % 3
                    }`}
                    style={{ fontSize: m.size }}
                    initial={{ x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.35 }}
                    animate={{
                      x: m.x,
                      y: m.y,
                      rotate: m.rotate,
                      opacity: [0, m.layer === "inner" ? 0.9 : 0.58, 0],
                      scale: [0.35, 1, 0.76],
                    }}
                    transition={{
                      duration: m.layer === "inner" ? 1.65 : 2.25,
                      delay: m.delay,
                      ease: "easeOut",
                    }}
                  >
                    {GLYPHS[m.type]}
                  </motion.i>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="blessings-section__confirmation" aria-live="polite">
        <AnimatePresence>
          {sent && (
            <motion.span
              initial={{ opacity: 0, y: reduceMotion ? 0 : 7 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0.18 : 0.32,
                delay: reduceMotion ? 0 : 0.34,
                ease: "easeOut",
              }}
            >
              {groom} &amp; {bride} carry your warm wishes with them ✨
            </motion.span>
          )}
        </AnimatePresence>
      </p>
    </section>
  );
}


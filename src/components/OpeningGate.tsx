"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { WeddingData } from "@/data/wedding";
import { useWeddingAudio } from "./AudioProvider";
import { KalashIllustration } from "./SacredArtwork";

const GATE_TRANSITION = {
  duration: 1.7,
  ease: [0.65, 0, 0.35, 1] as const,
};

type Stage = "idle" | "pressed" | "opening";

export default function OpeningGate({ wedding }: { wedding: WeddingData }) {
  const [stage, setStage] = useState<Stage>("idle");
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();
  const { startOpeningAudio, finishInvitationOpening } = useWeddingAudio();

  const monogram =
    wedding.initials ||
    `${wedding.groom.trim().charAt(0)} · ${wedding.bride.trim().charAt(0)}`;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("wedding-gate-active");
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      root.classList.remove("wedding-gate-active", "wedding-gate-opening");
    };
  }, []);

  const handleOpen = () => {
    if (stage !== "idle") return;
    startOpeningAudio();
    setStage("pressed");
    timerRef.current = window.setTimeout(
      () => {
        document.documentElement.classList.add("wedding-gate-opening");
        setStage("opening");
      },
      reduceMotion ? 80 : 190,
    );
  };

  const handleComplete = () => {
    if (stage !== "opening") return;
    document.documentElement.classList.remove("wedding-gate-active", "wedding-gate-opening");
    finishInvitationOpening();
    setVisible(false);
  };

  const leftPanelAnimate = reduceMotion
    ? { opacity: stage === "opening" ? 0 : 1 }
    : { rotateY: stage === "opening" ? 88 : 0 };

  const rightPanelAnimate = reduceMotion
    ? { opacity: stage === "opening" ? 0 : 1 }
    : { rotateY: stage === "opening" ? -88 : 0 };

  const veilAnimate =
    stage === "opening"
      ? reduceMotion
        ? { opacity: [0, 0.18, 0], scaleX: 1 }
        : { opacity: [0, 0.26, 0.24, 0.1, 0], scaleX: [0.04, 0.42, 0.82, 1, 1] }
      : { opacity: 0, scaleX: reduceMotion ? 1 : 0.04 };

  const veilTransition = reduceMotion
    ? { duration: 0.35, times: [0, 0.5, 1], ease: "easeInOut" as const }
    : { duration: 1.7, times: [0, 0.15, 0.55, 0.8, 1], ease: "easeInOut" as const };

  return (
    <AnimatePresence>
      {visible && (
        <motion.section
          className="opening-gate-overlay"
          aria-label="Wedding invitation opening"
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.18 : 0.3 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="opening-gate__garland"
            src="/media/final-assets/decor/marigold-garland.webp"
            alt=""
            width={1408}
            height={768}
            loading="eager"
            decoding="async"
          />

          <div className="opening-gate__veil" aria-hidden="true">
            <motion.div
              className="opening-gate__veil-panel opening-gate__veil-panel--left"
              animate={veilAnimate}
              transition={veilTransition}
            />
            <motion.div
              className="opening-gate__veil-panel opening-gate__veil-panel--right"
              animate={veilAnimate}
              transition={veilTransition}
            />
          </div>

          <div className="opening-gate__perspective" aria-hidden="true">
            <motion.div
              className="opening-gate__panel opening-gate__panel--left"
              animate={leftPanelAnimate}
              transition={reduceMotion ? { duration: 0.35 } : GATE_TRANSITION}
              onAnimationComplete={handleComplete}
            >
              <div className="opening-gate__panel-border" />
              <span className="opening-gate__edge-shimmer" />
            </motion.div>

            <motion.div
              className="opening-gate__panel opening-gate__panel--right"
              animate={rightPanelAnimate}
              transition={reduceMotion ? { duration: 0.35 } : GATE_TRANSITION}
            >
              <div className="opening-gate__panel-border" />
              <span className="opening-gate__edge-shimmer" />
            </motion.div>
          </div>

          <motion.div
            className="opening-gate__center"
            animate={{ opacity: stage === "opening" ? 0 : 1 }}
            transition={{ duration: 0.25 }}
          >
            <div className="opening-gate__sacred" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="opening-gate__ganesha"
                src="/media/final-assets/ganesha-gold.png"
                alt=""
                width={96}
                height={96}
              />
              <span className="opening-gate__mantra" lang="hi">
                {wedding.ganeshMantra}
              </span>
              <span className="opening-gate__shubh" lang="hi">
                {wedding.auspiciousHeading}
              </span>
            </div>

            <motion.button
              className="opening-gate__seal"
              type="button"
              aria-label="Open wedding invitation"
              aria-disabled={stage !== "idle"}
              onClick={handleOpen}
              animate={{ scale: stage === "pressed" ? 0.94 : 1 }}
              transition={{ duration: reduceMotion ? 0.08 : 0.18, ease: "easeOut" }}
            >
              <span className="opening-gate__halo" aria-hidden="true" />
              <span className="opening-gate__seal-inner" aria-hidden="true">
                {monogram}
              </span>
            </motion.button>

            <motion.div
              className="opening-gate__cta-wrap"
              animate={{ opacity: stage === "idle" ? 1 : 0 }}
            >
              <p className="opening-gate__couple-hi" lang="hi">
                {wedding.groomHindi} <span className="opening-gate__parinay">{wedding.parinayLabel}</span>{" "}
                {wedding.brideHindi}
              </p>
              <p className="opening-gate__tap">
                <KalashIllustration className="opening-gate__kalash-mini" />
                <span>Tap to open invitation</span>
                <KalashIllustration className="opening-gate__kalash-mini" />
              </p>
            </motion.div>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

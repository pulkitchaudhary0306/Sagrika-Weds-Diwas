"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useWeddingAudio } from "./AudioProvider";

const SPARKLES = [
  { layer: "close", x: -34, y: -30, rotate: -24, delay: 0, size: "0.82rem", opacity: 0.95, color: "#b4934c" },
  { layer: "close", x: 32, y: -34, rotate: 28, delay: 0.04, size: "0.76rem", opacity: 0.9, color: "#c49b57" },
  { layer: "close", x: -38, y: 12, rotate: -42, delay: 0.09, size: "0.7rem", opacity: 0.86, color: "#b8757b" },
  { layer: "close", x: 38, y: 14, rotate: 38, delay: 0.13, size: "0.78rem", opacity: 0.9, color: "#b4934c" },
  { layer: "close", x: 2, y: -42, rotate: 8, delay: 0.07, size: "0.72rem", opacity: 0.88, color: "#c49b57" },
  { layer: "outer", x: -68, y: -52, rotate: -38, delay: 0.16, size: "0.55rem", opacity: 0.62, color: "#b4934c" },
  { layer: "outer", x: 66, y: -58, rotate: 44, delay: 0.22, size: "0.5rem", opacity: 0.58, color: "#b8757b" },
  { layer: "outer", x: -72, y: 28, rotate: -54, delay: 0.26, size: "0.48rem", opacity: 0.56, color: "#c49b57" },
  { layer: "outer", x: 70, y: 34, rotate: 52, delay: 0.31, size: "0.52rem", opacity: 0.6, color: "#b4934c" },
  { layer: "outer", x: 8, y: -74, rotate: 16, delay: 0.2, size: "0.46rem", opacity: 0.55, color: "#b8757b" },
] as const;

type Side = "bride" | "groom";

export default function PickYourSide({
  bride,
  groom,
  brideHindi,
  groomHindi,
}: {
  bride: string;
  groom: string;
  brideHindi?: string;
  groomHindi?: string;
}) {
  const [selected, setSelected] = useState<Side | null>(null);
  const [burstKey, setBurstKey] = useState(0);
  const reduceMotion = useReducedMotion();
  const { playEffect } = useWeddingAudio();

  const choose = (side: Side) => {
    if (side !== selected) {
      playEffect("pickSide", { restart: true });
    }
    setSelected(side);
    setBurstKey((k) => k + 1);
  };

  const teams: {
    id: Side;
    role: string;
    name: string;
    portrait: string;
    width: number;
    height: number;
  }[] = [
    {
      id: "bride",
      role: "Bride",
      name: brideHindi || bride,
      portrait: "/media/final-assets/bride-team.webp",
      width: 1122,
      height: 1402,
    },
    {
      id: "groom",
      role: "Groom",
      name: groomHindi || groom,
      portrait: "/media/final-assets/groom-team.webp",
      width: 1024,
      height: 1536,
    },
  ];

  return (
    <section className="section side-section" aria-labelledby="side-title">
      <p className="eyebrow">A little friendly rivalry</p>
      <h2 id="side-title">Pick your side</h2>
      <p>Who are you cheering for?</p>

      <div className="side-options" aria-label="Choose your wedding team">
        {teams.map((team) => {
          const isSelected = selected === team.id;
          return (
            <div key={team.id} className={`side-choice side-choice--${team.id}`}>
              <motion.button
                className={`side-card side-card--${team.id}`}
                type="button"
                aria-pressed={isSelected}
                aria-label={`Choose Team ${team.role}, ${team.name}`}
                onClick={() => choose(team.id)}
                whileTap={reduceMotion ? undefined : { scale: 0.975 }}
                animate={{
                  y: isSelected && !reduceMotion ? -4 : 0,
                  scale: isSelected && !reduceMotion ? 1.015 : 1,
                }}
                transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
              >
                <motion.img
                  className="side-card__portrait"
                  src={team.portrait}
                  alt=""
                  aria-hidden="true"
                  width={team.width}
                  height={team.height}
                  loading="lazy"
                  decoding="async"
                  animate={
                    isSelected && !reduceMotion
                      ? {
                        y: -3,
                        scale: 1.025,
                        rotate: team.id === "bride" ? -0.6 : 0.6,
                      }
                      : { y: 0, scale: 1, rotate: 0 }
                  }
                  transition={{ duration: reduceMotion ? 0 : 0.24, ease: "easeOut" }}
                />
                <span className="side-card__team">Team {team.role}</span>
                <strong className="side-card__name">{team.name}</strong>
                <span className="side-card__indicator" aria-hidden="true">
                  ✓
                </span>

                <AnimatePresence>
                  {isSelected && (
                    <motion.span
                      key={`${team.id}-${burstKey}`}
                      className="side-card__celebration"
                      aria-hidden="true"
                    >
                      {SPARKLES.map((s, idx) => (
                        <motion.i
                          key={idx}
                          className={`side-card__sparkle side-card__sparkle--${s.layer}`}
                          style={{ color: s.color, fontSize: s.size }}
                          initial={{ x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.4 }}
                          animate={{
                            x: s.x,
                            y: s.y,
                            rotate: s.rotate,
                            opacity: [0, s.opacity, 0],
                            scale: [0.4, 1, 0.78],
                          }}
                          transition={{
                            duration: reduceMotion ? 0 : s.layer === "close" ? 1.05 : 1.5,
                            delay: reduceMotion ? 0 : s.delay,
                            ease: "easeOut",
                          }}
                        >
                          ✦
                        </motion.i>
                      ))}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          );
        })}

        <span className="side-options__or" aria-hidden="true">
          vs
        </span>
      </div>

      <p className="side-section__confirmation" aria-live="polite">
        {selected && `You're cheering for Team ${selected === "bride" ? bride : groom} ✨`}
      </p>
    </section>
  );
}


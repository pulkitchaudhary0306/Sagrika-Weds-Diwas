"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationControls, useReducedMotion } from "motion/react";
import type { WeddingData } from "@/data/wedding";
import { useWeddingAudio } from "./AudioProvider";
import { KalashIllustration } from "./SacredArtwork";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function HeroSection({ wedding }: { wedding: WeddingData }) {
  const reduceMotion = useReducedMotion();
  const controls = useAnimationControls();
  const { invitationOpened } = useWeddingAudio();
  const [scrolledPast, setScrolledPast] = useState(false);
  const nudgedRef = useRef(false);
  const [gateOpeningOrDone, setGateOpeningOrDone] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const check = () => {
      if (
        root.classList.contains("wedding-gate-opening") ||
        !root.classList.contains("wedding-gate-active")
      ) {
        setGateOpeningOrDone(true);
      }
    };
    check();
    const obs = new MutationObserver(check);
    obs.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!invitationOpened) return;
    let timer: number | null = null;
    let interacted = false;
    let startY = window.scrollY;
    let dismissed = false;
    let io: IntersectionObserver | null = null;

    const stopNudge = () => {
      if (timer !== null) window.clearTimeout(timer);
      timer = null;
      controls.stop();
      controls.set({ y: 0 });
    };

    const onInteract = (e: Event) => {
      if (
        e.type === "keydown" &&
        !["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(
          (e as KeyboardEvent).key,
        )
      ) {
        return;
      }
      if (!interacted) {
        interacted = true;
        startY = window.scrollY;
      }
      stopNudge();
    };

    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      stopNudge();
      cleanupListeners();
      setScrolledPast(true);
    };

    const onScroll = () => {
      if (interacted && Math.abs(window.scrollY - startY) >= 110) {
        dismiss();
      }
    };

    const cleanupListeners = () => {
      window.removeEventListener("wheel", onInteract);
      window.removeEventListener("touchstart", onInteract);
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };

    const passive = { passive: true };
    window.addEventListener("wheel", onInteract, passive);
    window.addEventListener("touchstart", onInteract, passive);
    window.addEventListener("pointerdown", onInteract, passive);
    window.addEventListener("keydown", onInteract);
    window.addEventListener("scroll", onScroll, passive);

    const intro = document.querySelector(".introduction");
    if (intro) {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) dismiss();
        },
        { threshold: 0.35 },
      );
      io.observe(intro);
    }

    if (!reduceMotion && !nudgedRef.current && window.scrollY < 8) {
      nudgedRef.current = true;
      timer = window.setTimeout(() => {
        timer = null;
        if (!dismissed && !interacted) {
          controls.start({
            y: [0, -30, -30, 0],
            transition: {
              duration: 2.05,
              times: [0, 0.39, 0.51, 1],
              ease: EASE,
            },
          });
        }
      }, 600);
    }

    return () => {
      stopNudge();
      cleanupListeners();
    };
  }, [controls, invitationOpened, reduceMotion]);

  const fadeUp = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 14 },
    animate: gateOpeningOrDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    transition: {
      duration: reduceMotion ? 0 : 0.8,
      delay: reduceMotion ? 0 : delay,
      ease: EASE,
    },
  });

  return (
    <motion.header className="hero-section" aria-labelledby="hero-couple-names" animate={controls}>
      <motion.div className="hero-section__ganesh-header" {...fadeUp(0.02)}>
        <div className="hero-section__kalash-row" aria-hidden="true">
          <KalashIllustration className="hero-section__kalash" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="hero-section__ganesha"
            src="/media/final-assets/ganesha-gold.png"
            alt="Lord Ganesha"
            width={112}
            height={112}
          />
          <KalashIllustration className="hero-section__kalash" />
        </div>
        <p className="hero-section__mantra" lang="hi">
          {wedding.ganeshMantra}
        </p>
        <p className="hero-section__shloka" lang="hi">
          {wedding.sanskritShloka}
        </p>
        <p className="hero-section__shubh-vivah" lang="hi">
          {wedding.auspiciousHeading}
        </p>
      </motion.div>

      <div className="hero-section__ornament" aria-hidden="true">
        <span />
        <i>✦</i>
        <span />
      </div>

      <motion.p className="hero-section__invitation" {...fadeUp(0.06)}>
        Together with the blessings of our families
      </motion.p>

      <motion.p className="hero-section__hindi-names" lang="hi" {...fadeUp(0.1)}>
        <span>{wedding.brideHindi}</span>
        <em className="hero-section__parinay">{wedding.parinayLabel}</em>
        <span>{wedding.groomHindi}</span>
      </motion.p>

      <motion.h1 id="hero-couple-names" className="hero-section__names" {...fadeUp(0.14)}>
        <span>{wedding.bride}</span>
        <i>&amp;</i>
        <span>{wedding.groom}</span>
      </motion.h1>

      <motion.div
        className="hero-section__media"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: gateOpeningOrDone ? 1 : 0 }}
        transition={{
          duration: reduceMotion ? 0 : 1.05,
          delay: reduceMotion ? 0 : 0.2,
          ease: EASE,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="hero-section__portrait"
          src="/media/final-assets/couple-master.webp"
          alt={`${wedding.bride} and ${wedding.groom}`}
          width={912}
          height={1168}
          loading="eager"
          fetchPriority="high"
        />
      </motion.div>

      <motion.div className="hero-section__details" {...fadeUp(0.32)}>
        <time dateTime={wedding.dateISO}>
          {wedding.weddingDate}
          <span className="hero-section__day-bilingual">
            {wedding.weddingDay} | <span lang="hi">{wedding.weddingDayHindi}</span>
          </span>
        </time>
        <span className="hero-section__divider" aria-hidden="true" />
        <p>
          {wedding.weddingVenue.name} ·{" "}
          <span lang="hi">{wedding.weddingVenue.nameHindi}</span>
        </p>
        <address>
          {wedding.weddingVenue.location}
          <br />
          <span className="hero-section__address-hi" lang="hi">
            {wedding.weddingVenue.locationHindi}
          </span>
        </address>
      </motion.div>

      <div className="hero-section__scroll-cue" aria-hidden="true">
        <motion.div
          className="hero-section__scroll-cue-inner"
          initial={false}
          animate={{
            opacity: invitationOpened && !scrolledPast ? 1 : 0,
            y: invitationOpened && !scrolledPast ? 0 : 6,
          }}
          transition={{ duration: reduceMotion ? 0 : 0.35, ease: EASE }}
        >
          <span>Scroll to celebrate</span>
          <motion.span
            className="hero-section__scroll-arrow"
            animate={reduceMotion ? undefined : { y: [0, 4, 0] }}
            transition={
              reduceMotion ? undefined : { duration: 1.9, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </motion.span>
        </motion.div>
      </div>
    </motion.header>
  );
}

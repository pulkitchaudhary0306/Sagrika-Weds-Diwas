"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { WeddingEvent } from "@/data/wedding";
import { useWeddingAudio } from "./AudioProvider";

/* ── Shared ArrowLeft SVG ─────────────────────────────────────────────────── */
function ArrowLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

/* ==========================================================================
   1. Haldi Scratch Reveal (rub turmeric powder off canvas with particles)
   ========================================================================== */
const CHECK_THROTTLE_MS = 240;
const MAX_PARTICLES = 90;
const HALDI_COLORS = ["#e3a321", "#efb63f", "#cf7917", "#f3c35a"];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  age: number;
  life: number;
};

type Point = { x: number; y: number; time: number };

function ScratchReveal({
  children,
  completed = false,
  onComplete,
  onProgress,
  threshold = 0.55,
  brushRadius = 50,
  label = "Rub to reveal",
  instruction = "Rub to reveal",
  fallbackLabel = "Reveal artwork",
  fallbackVisuallyHidden = false,
}: {
  children: ReactNode;
  completed?: boolean;
  onComplete?: () => void;
  onProgress?: (ratio: number) => void;
  threshold?: number;
  brushRadius?: number;
  label?: string;
  instruction?: string;
  fallbackLabel?: string;
  fallbackVisuallyHidden?: boolean;
}) {
  const scratchCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef(false);
  const soundActiveRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);
  const lastCheckRef = useRef(0);
  const isCompletedRef = useRef(completed);
  const initializedRef = useRef(false);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef(0);

  const [started, setStarted] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [hidden, setHidden] = useState(completed);
  const reduceMotion = useReducedMotion();
  const { playEffect, stopEffect } = useWeddingAudio();

  useEffect(() => () => stopEffect("haldiRub"), [stopEffect]);

  const paintTurmericLayer = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.globalCompositeOperation = "source-over";
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "#e8a52a");
      grad.addColorStop(0.48, "#d88919");
      grad.addColorStop(1, "#efb842");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 34; i += 1) {
        const cx = (((i * 83) % 97) / 97) * w;
        const cy = (((i * 47) % 89) / 89) * h;
        const r = 18 + ((i * 13) % 32);
        const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        rg.addColorStop(0, i % 2 ? "rgba(255, 205, 92, 0.14)" : "rgba(151, 77, 10, 0.1)");
        rg.addColorStop(1, "rgba(255, 190, 55, 0)");
        ctx.fillStyle = rg;
        ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      }

      const grainCount = Math.min(420, Math.round((w * h) / 520));
      for (let i = 0; i < grainCount; i += 1) {
        const gx = (((i * 67) % 997) / 997) * w;
        const gy = (((i * 149) % 991) / 991) * h;
        const gr = 0.45 + (i % 4) * 0.28;
        ctx.fillStyle = i % 3 ? "rgba(112, 54, 8, 0.13)" : "rgba(255, 232, 151, 0.18)";
        ctx.beginPath();
        ctx.arc(gx, gy, gr, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    [],
  );

  const resizeCanvases = useCallback(() => {
    const scratch = scratchCanvasRef.current;
    const particles = particleCanvasRef.current;
    const surface = surfaceRef.current;
    if (!surface || isCompletedRef.current) return;
    const rect = surface.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pw = Math.round(rect.width * dpr);
    const ph = Math.round(rect.height * dpr);

    if (scratch && (!initializedRef.current || scratch.width !== pw || scratch.height !== ph)) {
      const backup = document.createElement("canvas");
      backup.width = initializedRef.current ? scratch.width : 0;
      backup.height = initializedRef.current ? scratch.height : 0;
      if (initializedRef.current) {
        backup.getContext("2d")?.drawImage(scratch, 0, 0);
      }
      scratch.width = pw;
      scratch.height = ph;
      scratch.style.width = `${rect.width}px`;
      scratch.style.height = `${rect.height}px`;
      const ctx = scratch.getContext("2d", { willReadFrequently: true });
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (backup.width && backup.height) {
          ctx.drawImage(backup, 0, 0, backup.width, backup.height, 0, 0, rect.width, rect.height);
        } else {
          paintTurmericLayer(ctx, rect.width, rect.height);
        }
        initializedRef.current = true;
      }
    }

    if (particles && (particles.width !== pw || particles.height !== ph)) {
      particles.width = pw;
      particles.height = ph;
      particles.style.width = `${rect.width}px`;
      particles.style.height = `${rect.height}px`;
    }
  }, [paintTurmericLayer]);

  useEffect(() => {
    resizeCanvases();
    const rafId = window.requestAnimationFrame(resizeCanvases);
    const timerId = window.setTimeout(resizeCanvases, 120);
    const ro = new ResizeObserver(resizeCanvases);
    if (surfaceRef.current) ro.observe(surfaceRef.current);
    window.addEventListener("resize", resizeCanvases);
    window.addEventListener("orientationchange", resizeCanvases);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timerId);
      ro.disconnect();
      window.removeEventListener("resize", resizeCanvases);
      window.removeEventListener("orientationchange", resizeCanvases);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [resizeCanvases]);

  const stepParticles = useCallback(function tick(now: number) {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dt = lastTickRef.current ? Math.min((now - lastTickRef.current) / 16.67, 2) : 1;
    lastTickRef.current = now;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    particlesRef.current = particlesRef.current.filter((p) => {
      p.age += 16.67 * dt;
      if (p.age >= p.life) return false;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 0.025 * dt;
      const alpha = (1 - p.age / p.life) * p.opacity;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      return true;
    });

    ctx.globalAlpha = 1;
    if (particlesRef.current.length) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      rafRef.current = null;
      lastTickRef.current = 0;
    }
  }, []);

  const spawnParticles = useCallback(
    (pos: { x: number; y: number }, delta: { x: number; y: number }, count = 4) => {
      if (reduceMotion || !particleCanvasRef.current) return;
      const len = Math.hypot(delta.x, delta.y);
      const speed = Math.min(len, 36);
      const nx = speed ? delta.x / len : 0;
      const ny = speed ? delta.y / len : 0;
      for (let i = 0; i < count; i += 1) {
        const jx = (Math.random() - 0.5) * 1.5;
        const jy = (Math.random() - 0.5) * 1.15;
        particlesRef.current.push({
          x: pos.x + (Math.random() - 0.5) * brushRadius * 0.8,
          y: pos.y + (Math.random() - 0.5) * brushRadius * 0.55,
          vx: nx * (0.7 + speed * 0.035) + jx,
          vy: ny * (0.45 + speed * 0.018) + jy - 0.25,
          size: 0.7 + Math.random() * 1.65,
          opacity: 0.28 + Math.random() * 0.28,
          color: HALDI_COLORS[i % HALDI_COLORS.length],
          age: 0,
          life: 320 + Math.random() * 360,
        });
      }
      if (particlesRef.current.length > MAX_PARTICLES) {
        particlesRef.current.splice(0, particlesRef.current.length - MAX_PARTICLES);
      }
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(stepParticles);
      }
    },
    [brushRadius, reduceMotion, stepParticles],
  );

  const finishReveal = useCallback(() => {
    if (isCompletedRef.current) return;
    isCompletedRef.current = true;
    isDrawingRef.current = false;
    soundActiveRef.current = false;
    stopEffect("haldiRub");
    const rect = surfaceRef.current?.getBoundingClientRect();
    if (rect) {
      spawnParticles({ x: rect.width / 2, y: rect.height / 2 }, { x: 5, y: -2 }, 12);
    }
    setFadingOut(true);
  }, [spawnParticles, stopEffect]);

  const checkProgress = useCallback(
    (force = false) => {
      const now = performance.now();
      if (!force && now - lastCheckRef.current < CHECK_THROTTLE_MS) return;
      lastCheckRef.current = now;
      const canvas = scratchCanvasRef.current;
      if (!canvas || isCompletedRef.current) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const stride = Math.max(8, Math.floor((window.devicePixelRatio || 1) * 6));
      let cleared = 0;
      let total = 0;
      for (let y = 0; y < canvas.height; y += stride) {
        for (let x = 0; x < canvas.width; x += stride) {
          cleared += 1 - data[(y * canvas.width + x) * 4 + 3] / 255;
          total += 1;
        }
      }
      if (!total) return;
      const ratio = cleared / total;
      onProgress?.(ratio);
      if (ratio >= threshold) finishReveal();
    },
    [finishReveal, onProgress, threshold],
  );

  const getPoint = (e: ReactPointerEvent<HTMLCanvasElement>): Point => {
    const rect = scratchCanvasRef.current!.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      time: e.timeStamp,
    };
  };

  const stampBrush = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    r: number,
    alpha: number,
  ) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(0, 0, 0, ${alpha})`);
    g.addColorStop(0.45, `rgba(0, 0, 0, ${alpha * 0.62})`);
    g.addColorStop(0.78, `rgba(0, 0, 0, ${alpha * 0.2})`);
    g.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  };

  const eraseStroke = (from: Point, to: Point) => {
    const ctx = scratchCanvasRef.current?.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.hypot(dx, dy);
    const steps = Math.max(1, Math.ceil(dist / (brushRadius * 0.35)));
    const nx = dist ? dx / dist : 0;
    const ny = dist ? dy / dist : 0;
    const velocity = dist / Math.max(to.time - from.time, 1);
    const alpha = Math.min(0.55, 0.32 + velocity * 0.04);

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "destination-out";
    for (let i = 1; i <= steps; i += 1) {
      const t = i / steps;
      const sx = from.x + dx * t;
      const sy = from.y + dy * t;
      const jx = (Math.random() - 0.5) * brushRadius * 0.16;
      const jy = (Math.random() - 0.5) * brushRadius * 0.16;
      const r = brushRadius * (0.9 + Math.random() * 0.18);
      stampBrush(ctx, sx - nx * r * 0.2, sy - ny * r * 0.2, r * 0.92, alpha * 0.58);
      stampBrush(ctx, sx + jx, sy + jy, r, alpha);
      stampBrush(ctx, sx + nx * r * 0.24, sy + ny * r * 0.24, r * 0.82, alpha * 0.66);
    }
    ctx.restore();
    spawnParticles(to, { x: dx, y: dy }, Math.min(6, Math.max(2, Math.ceil(dist / 12))));
  };

  useEffect(() => {
    const canvas = scratchCanvasRef.current;
    if (!canvas) return;
    const preventScroll = (e: TouchEvent) => {
      if (!isCompletedRef.current) e.preventDefault();
    };
    canvas.addEventListener("touchstart", preventScroll, { passive: false });
    canvas.addEventListener("touchmove", preventScroll, { passive: false });
    return () => {
      canvas.removeEventListener("touchstart", preventScroll);
      canvas.removeEventListener("touchmove", preventScroll);
    };
  }, [hidden]);

  const onPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (isCompletedRef.current) return;
    e.preventDefault();
    try {
      scratchCanvasRef.current?.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture is unsupported in emulated touch mode
    }
    isDrawingRef.current = true;
    if (!started) setStarted(true);
    if (!soundActiveRef.current) {
      soundActiveRef.current = true;
      playEffect("haldiRub", { restart: true });
    }
    const pt = getPoint(e);
    lastPointRef.current = pt;
    eraseStroke(pt, pt);
    checkProgress();
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || isCompletedRef.current) return;
    e.preventDefault();
    if (!started) setStarted(true);
    if (!soundActiveRef.current) {
      soundActiveRef.current = true;
      playEffect("haldiRub", { restart: true });
    }
    const pt = getPoint(e);
    eraseStroke(lastPointRef.current || pt, pt);
    lastPointRef.current = pt;
    checkProgress();
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    soundActiveRef.current = false;
    stopEffect("haldiRub");
    lastPointRef.current = null;
    try {
      if (scratchCanvasRef.current?.hasPointerCapture(e.pointerId)) {
        scratchCanvasRef.current.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }
    checkProgress(true);
  };

  return (
    <div className="scratch-reveal">
      <div className="scratch-reveal__surface" ref={surfaceRef}>
        <div className="scratch-reveal__content">{children}</div>
        {!hidden && (
          <motion.canvas
            ref={scratchCanvasRef}
            className="scratch-reveal__canvas"
            aria-label={label}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            animate={{ opacity: fadingOut ? 0 : 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.58, ease: "easeOut" }}
            onAnimationComplete={
              fadingOut
                ? () => {
                    if (fadingOut) {
                      setHidden(true);
                      onComplete?.();
                    }
                  }
                : undefined
            }
          />
        )}
        <canvas ref={particleCanvasRef} className="scratch-reveal__particles" aria-hidden="true" />
        {!hidden && (
          <motion.p
            className="scratch-reveal__instruction"
            animate={{ opacity: started || fadingOut ? 0 : 1 }}
            aria-hidden="true"
          >
            {instruction}
          </motion.p>
        )}
        {!hidden && (
          <button
            className={`scratch-reveal__fallback ${
              fallbackVisuallyHidden ? "scratch-reveal__fallback--sr-only" : ""
            }`}
            type="button"
            onClick={finishReveal}
          >
            {fallbackLabel}
          </button>
        )}
      </div>
    </div>
  );
}

function HaldiInformation({ event }: { event: WeddingEvent }) {
  return (
    <div className="haldi-information">
      <p className="haldi-information__label">{event.name}</p>
      {event.nameHindi && (
        <p className="haldi-information__hindi" lang="hi">
          {event.nameHindi}
        </p>
      )}
      <h3>
        {event.dayLabel}, {event.date}
      </h3>
      {event.time && (
        <time>
          {event.time} {event.timeHindi && <span lang="hi">· {event.timeHindi}</span>}
        </time>
      )}
      <span className="haldi-information__ornament" aria-hidden="true">
        ✦
      </span>
      {event.venue && <strong>{event.venue}</strong>}
      {event.address && <address>{event.address}</address>}
      {event.dressCode && <p className="haldi-information__dress">Dress: {event.dressCode}</p>}
      {event.description && <p className="haldi-information__description">{event.description}</p>}
    </div>
  );
}

export function HaldiInteraction({
  event,
  completed,
  onComplete,
}: {
  event: WeddingEvent;
  completed: boolean;
  onComplete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isNarrow, setIsNarrow] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 430px)").matches,
  );
  const progressRef = useRef(0);
  const reduceMotion = useReducedMotion();

  const handleClose = useCallback(() => {
    if (!completed && progressRef.current >= 0.25) onComplete();
    setOpen(false);
  }, [completed, onComplete]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 430px)");
    const handler = (e: MediaQueryListEvent) => setIsNarrow(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [handleClose, open]);

  const triggerStartRef = useRef<{ x: number; y: number } | null>(null);

  return (
    <>
      {!completed && (
        <button
          className="haldi-scratch__trigger"
          type="button"
          onClick={() => setOpen(true)}
          onPointerDown={(e) => {
            triggerStartRef.current = { x: e.clientX, y: e.clientY };
          }}
          onPointerMove={(e) => {
            if (!triggerStartRef.current) return;
            const dx = Math.abs(e.clientX - triggerStartRef.current.x);
            const dy = Math.abs(e.clientY - triggerStartRef.current.y);
            if (dx > 12 && dx >= dy) {
              triggerStartRef.current = null;
              setOpen(true);
            }
          }}
          onPointerUp={() => {
            triggerStartRef.current = null;
          }}
          aria-label="Rub Haldi to reveal Haldi event details"
        >
          <span>Rub the Haldi</span>
          <small>Tap or rub to reveal details</small>
        </button>
      )}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className="haldi-scratch__overlay"
                role="dialog"
                aria-modal="true"
                aria-labelledby="haldi-scratch-title"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.25 }}
              >
                <div className="haldi-scratch__dialog">
                  <button
                    className="haldi-scratch__close"
                    type="button"
                    onClick={handleClose}
                    autoFocus
                  >
                    <ArrowLeftIcon />
                    Back to festivities
                  </button>
                  <header className="haldi-scratch__header">
                    <h2 id="haldi-scratch-title">{event.name}</h2>
                    <p>Sweep away the turmeric to reveal the celebration.</p>
                  </header>
                  <div className="haldi-scratch__surface">
                    <ScratchReveal
                      completed={completed}
                      onComplete={onComplete}
                      onProgress={(r) => {
                        progressRef.current = r;
                      }}
                      threshold={isNarrow ? 0.28 : 0.32}
                      brushRadius={isNarrow ? 46 : 54}
                      instruction="Rub the Haldi"
                      fallbackLabel="Skip & Reveal"
                      label="Rub the turmeric powder to reveal the Haldi celebration details"
                    >
                      <HaldiInformation event={event} />
                    </ScratchReveal>
                  </div>
                  {completed && (
                    <p className="haldi-scratch__complete" aria-live="polite">
                      The celebration details are revealed.
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

/* ==========================================================================
   2. Mehendi Heart Trace
   ========================================================================== */
const HEART_SEGMENTS = 180;

function generateHeartPoints(w: number, h: number): { x: number; y: number }[] {
  const scale = Math.min(w / 38, h / 38);
  const cx = w / 2;
  const cy = h / 2 + scale * 1.5;
  return Array.from({ length: HEART_SEGMENTS }, (_, i) => {
    const t = (i / HEART_SEGMENTS) * Math.PI * 2;
    const s = Math.sin(t);
    return {
      x: cx + 16 * s * s * s * scale,
      y:
        cy -
        (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale,
    };
  });
}

function distToSegment(
  p: { x: number; y: number },
  a: { x: number; y: number },
  b: { x: number; y: number },
): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (!dx && !dy) return Math.hypot(p.x - a.x, p.y - a.y);
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(p.x - (a.x + dx * t), p.y - (a.y + dy * t));
}

function MehendiTrace({
  children,
  completed = false,
  onComplete,
  onProgress,
  threshold = 0.4,
  label,
}: {
  children: ReactNode;
  completed?: boolean;
  onComplete?: () => void;
  onProgress?: (ratio: number) => void;
  threshold?: number;
  label?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointsRef = useRef<{ x: number; y: number }[]>([]);
  const tracedSetRef = useRef<Set<number>>(new Set());
  const isDrawingRef = useRef(false);
  const soundActiveRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const isCompletedRef = useRef(completed);

  const [started, setStarted] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [hidden, setHidden] = useState(completed);
  const reduceMotion = useReducedMotion();
  const { playEffect, stopEffect } = useWeddingAudio();

  useEffect(() => () => stopEffect("mehendiTrace"), [stopEffect]);

  const drawHeart = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || isCompletedRef.current) return;
    const rect = container.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#fffaf0";
    ctx.fillRect(0, 0, rect.width, rect.height);
    pointsRef.current = generateHeartPoints(rect.width, rect.height);
    const pts = pointsRef.current;
    ctx.strokeStyle = "rgba(112, 67, 43, 0.72)";
    ctx.lineWidth = 1.7;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.setLineDash([7, 3, 2, 3]);
    ctx.beginPath();
    pts.forEach((p, idx) => (idx ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.closePath();
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.strokeStyle = "#9b7436";
    ctx.lineWidth = 4;
    tracedSetRef.current.forEach((idx) => {
      const a = pts[idx];
      const b = pts[(idx + 1) % pts.length];
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    });
  }, []);

  useEffect(() => {
    drawHeart();
    const rafId = window.requestAnimationFrame(drawHeart);
    const timerId = window.setTimeout(drawHeart, 120);
    const ro = new ResizeObserver(drawHeart);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", drawHeart);
    window.addEventListener("orientationchange", drawHeart);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timerId);
      ro.disconnect();
      window.removeEventListener("resize", drawHeart);
      window.removeEventListener("orientationchange", drawHeart);
    };
  }, [drawHeart]);

  const handleTraceInput = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    const hitRadius = Math.max(24, Math.min(34, Math.min(rect.width, rect.height) * 0.085));
    const prev = lastPosRef.current || pos;
    let added = false;

    pointsRef.current.forEach((pt, idx) => {
      if (distToSegment(pt, prev, pos) <= hitRadius) {
        if (!tracedSetRef.current.has(idx)) added = true;
        tracedSetRef.current.add(idx);
      }
    });
    lastPosRef.current = pos;
    if (!added) return;

    if (!started) setStarted(true);
    if (!soundActiveRef.current) {
      soundActiveRef.current = true;
      playEffect("mehendiTrace", { restart: true });
    }
    drawHeart();
    const ratio = tracedSetRef.current.size / HEART_SEGMENTS;
    onProgress?.(ratio);
    if (ratio >= threshold) {
      isCompletedRef.current = true;
      isDrawingRef.current = false;
      soundActiveRef.current = false;
      stopEffect("mehendiTrace");
      setFadingOut(true);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const preventScroll = (e: TouchEvent) => {
      if (!isCompletedRef.current) e.preventDefault();
    };
    canvas.addEventListener("touchstart", preventScroll, { passive: false });
    canvas.addEventListener("touchmove", preventScroll, { passive: false });
    return () => {
      canvas.removeEventListener("touchstart", preventScroll);
      canvas.removeEventListener("touchmove", preventScroll);
    };
  }, [hidden]);

  const onPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (isCompletedRef.current) return;
    e.preventDefault();
    try {
      canvasRef.current?.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture is unsupported in emulated touch mode
    }
    isDrawingRef.current = true;
    lastPosRef.current = null;
    handleTraceInput(e);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || isCompletedRef.current) return;
    e.preventDefault();
    handleTraceInput(e);
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = false;
    soundActiveRef.current = false;
    stopEffect("mehendiTrace");
    lastPosRef.current = null;
    try {
      if (canvasRef.current?.hasPointerCapture(e.pointerId)) {
        canvasRef.current.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }
  };

  return (
    <div className="mehendi-trace" ref={containerRef}>
      <div className="mehendi-trace__content">{children}</div>
      {!hidden && (
        <motion.canvas
          ref={canvasRef}
          className="mehendi-trace__canvas"
          aria-label={label}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          animate={{ opacity: fadingOut ? 0 : 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.55, ease: "easeOut" }}
          onAnimationComplete={
            fadingOut
              ? () => {
                  if (fadingOut) {
                    setHidden(true);
                    onComplete?.();
                  }
                }
              : undefined
          }
        />
      )}
      {!hidden && (
        <motion.p
          className="mehendi-trace__instruction"
          animate={{ opacity: started || fadingOut ? 0 : 1 }}
          aria-hidden="true"
        >
          Trace the heart
        </motion.p>
      )}
      {!hidden && (
        <button
          className="mehendi-trace__fallback"
          type="button"
          onClick={() => {
            if (!isCompletedRef.current) {
              isCompletedRef.current = true;
              soundActiveRef.current = false;
              stopEffect("mehendiTrace");
              setFadingOut(true);
            }
          }}
        >
          Reveal Mehendi details
        </button>
      )}
    </div>
  );
}

function MehendiInformation({ event }: { event: WeddingEvent }) {
  return (
    <div className="mehendi-information">
      <p className="mehendi-information__label">{event.name}</p>
      {event.nameHindi && (
        <p className="mehendi-information__hindi" lang="hi">
          {event.nameHindi}
        </p>
      )}
      <h3>
        {event.dayLabel}, {event.date}
      </h3>
      {event.time && (
        <time>
          {event.time} {event.timeHindi && <span lang="hi">· {event.timeHindi}</span>}
        </time>
      )}
      <span className="mehendi-information__ornament" aria-hidden="true">
        ❧
      </span>
      {event.venue && <strong>{event.venue}</strong>}
      {event.address && <address>{event.address}</address>}
      {event.dressCode && <p className="mehendi-information__dress">Dress: {event.dressCode}</p>}
      {event.description && <p className="mehendi-information__description">{event.description}</p>}
    </div>
  );
}

export function MehendiInteraction({
  event,
  completed,
  onComplete,
}: {
  event: WeddingEvent;
  completed: boolean;
  onComplete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const progressRef = useRef(0);
  const reduceMotion = useReducedMotion();

  const handleClose = useCallback(() => {
    if (!completed && progressRef.current >= 0.25) onComplete();
    setOpen(false);
  }, [completed, onComplete]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [handleClose, open]);

  const triggerStartRef = useRef<{ x: number; y: number } | null>(null);

  return (
    <>
      {!completed && (
        <button
          className="mehendi-scratch__trigger"
          type="button"
          onClick={() => setOpen(true)}
          onPointerDown={(e) => {
            triggerStartRef.current = { x: e.clientX, y: e.clientY };
          }}
          onPointerMove={(e) => {
            if (!triggerStartRef.current) return;
            const dx = Math.abs(e.clientX - triggerStartRef.current.x);
            const dy = Math.abs(e.clientY - triggerStartRef.current.y);
            if (dx > 12 && dx >= dy) {
              triggerStartRef.current = null;
              setOpen(true);
            }
          }}
          onPointerUp={() => {
            triggerStartRef.current = null;
          }}
          aria-label="Trace Mehendi pattern to reveal event details"
        >
          <span className="mehendi-scratch__mini-heart" aria-hidden="true">
            ♡
          </span>
          <strong>Trace the Mehendi</strong>
          <small>Tap or trace to reveal details</small>
        </button>
      )}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className="mehendi-scratch__overlay"
                role="dialog"
                aria-modal="true"
                aria-labelledby="mehendi-scratch-title"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.25 }}
              >
                <div className="mehendi-scratch__dialog">
                  <button
                    className="mehendi-scratch__close"
                    type="button"
                    onClick={handleClose}
                    autoFocus
                  >
                    <ArrowLeftIcon />
                    Back to festivities
                  </button>
                  <header className="mehendi-scratch__header">
                    <h2 id="mehendi-scratch-title">{event.name}</h2>
                    <p>Trace the heart to reveal the celebration.</p>
                  </header>
                  <div className="mehendi-scratch__surface">
                    <MehendiTrace
                      completed={completed}
                      onComplete={onComplete}
                      onProgress={(r) => {
                        progressRef.current = r;
                      }}
                      threshold={0.6}
                      label="Trace the Mehendi heart to reveal event details"
                    >
                      <MehendiInformation event={event} />
                    </MehendiTrace>
                  </div>
                  {completed && (
                    <p className="mehendi-scratch__complete" aria-live="polite">
                      The celebration details are revealed.
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

/* ==========================================================================
   3. Sangeet Dhol Rhythm Game (6 beats)
   ========================================================================== */
const TOTAL_BEATS = 6;

function DholInformation({ event }: { event: WeddingEvent }) {
  return (
    <div className="dhol-game__information">
      <p className="dhol-game__label">{event.name}</p>
      {event.nameHindi && (
        <p className="dhol-game__hindi" lang="hi">
          {event.nameHindi}
        </p>
      )}
      <h3>
        {event.dayLabel}, {event.date}
      </h3>
      {event.time && (
        <time>
          {event.time} {event.timeHindi && <span lang="hi">· {event.timeHindi}</span>}
        </time>
      )}
      {event.venue && <strong>{event.venue}</strong>}
      {event.address && <address>{event.address}</address>}
      {event.dressCode && <p className="dhol-game__dress">Dress: {event.dressCode}</p>}
      {event.description && <p className="dhol-game__description">{event.description}</p>}
    </div>
  );
}

export function SangeetInteraction({
  event,
  completed,
  onComplete,
}: {
  event: WeddingEvent;
  completed: boolean;
  onComplete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [beats, setBeats] = useState(0);
  const notifiedRef = useRef(false);
  const reduceMotion = useReducedMotion();
  const { playEffect } = useWeddingAudio();

  const isRevealed = completed || beats >= TOTAL_BEATS;

  const handleClose = useCallback(() => {
    if (!completed && beats >= 4) onComplete();
    setOpen(false);
  }, [beats, completed, onComplete]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [handleClose, open]);

  useEffect(() => {
    if (beats >= TOTAL_BEATS && !completed && !notifiedRef.current) {
      notifiedRef.current = true;
      onComplete();
    }
  }, [beats, completed, onComplete]);

  return (
    <>
      {!completed && (
        <button
          className="dhol-game__trigger"
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Play dhol to reveal Sangeet event details"
        >
          <span aria-hidden="true">♪</span>
          <strong>Play the Dhol</strong>
          <small>Tap to reveal the celebration</small>
        </button>
      )}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className="dhol-game__overlay"
                role="dialog"
                aria-modal="true"
                aria-labelledby="dhol-game-title"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.25 }}
              >
                <div className="dhol-game__dialog">
                  <button
                    className="dhol-game__close"
                    type="button"
                    onClick={handleClose}
                    autoFocus
                  >
                    <ArrowLeftIcon />
                    Back to festivities
                  </button>
                  <header className="dhol-game__header">
                    <h2 id="dhol-game-title">{event.name}</h2>
                    <p>
                      {isRevealed ? "The celebration is ready." : "Tap the dhol to the rhythm."}
                    </p>
                  </header>
                  <AnimatePresence mode="wait">
                    {isRevealed ? (
                      <motion.div
                        key="details"
                        className="dhol-game__revealed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <span className="dhol-game__celebration" aria-hidden="true">
                          ✦ ♪ ✦
                        </span>
                        <DholInformation event={event} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="dhol"
                        className="dhol-game__stage"
                        exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
                      >
                        <motion.button
                          className="dhol-game__dhol"
                          type="button"
                          onClick={() => {
                            if (!isRevealed) {
                              playEffect("dholTap", { restart: true });
                              setBeats((b) => Math.min(b + 1, TOTAL_BEATS));
                            }
                          }}
                          aria-label="Play dhol"
                          whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                          animate={{
                            rotate: reduceMotion || beats === 0 ? 0 : beats % 2 ? -2 : 2,
                          }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            className="dhol-game__image"
                            src="/media/final-assets/dhol.webp"
                            alt=""
                            width={768}
                            height={1408}
                            decoding="async"
                            draggable={false}
                          />
                          {beats > 0 && (
                            <motion.span
                              key={beats}
                              className="dhol-game__pulse"
                              initial={{ opacity: 0.55, scale: 0.72 }}
                              animate={{ opacity: 0, scale: 1.35 }}
                              transition={{ duration: reduceMotion ? 0 : 0.38 }}
                              aria-hidden="true"
                            />
                          )}
                        </motion.button>
                        <div
                          className="dhol-game__beats"
                          role="status"
                          aria-label={`${beats} of ${TOTAL_BEATS} dhol beats played`}
                        >
                          {Array.from({ length: TOTAL_BEATS }, (_, idx) => (
                            <span
                              key={idx}
                              className={
                                idx < beats
                                  ? "dhol-game__beat dhol-game__beat--played"
                                  : "dhol-game__beat"
                              }
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                        <p className="dhol-game__count">
                          {beats} / {TOTAL_BEATS} beats
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}


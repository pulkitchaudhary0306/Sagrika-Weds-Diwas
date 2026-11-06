"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { WeddingData } from "@/data/wedding";
import {
  SCHEDULE_CARD_IMAGE_URL,
  downloadWeddingCalendar,
  downloadWeddingScheduleImage,
  downloadWeddingSchedulePdf,
} from "@/lib/downloadSchedule";

function DownloadIcon() {
  return (
    <svg
      className="site-footer__save-icon"
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
      <path d="M12 15V3" />
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}

function ImageDownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}

function FileDownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
      <path d="M14 2v5a1 1 0 0 0 1 1h5" />
      <path d="M12 18v-6" />
      <path d="m9 15 3 3 3-3" />
    </svg>
  );
}

function CalendarPlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 18h6" />
      <path d="M16 2v3" />
      <path d="M19 15v6" />
      <path d="M21 11.5V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h8.3" />
      <path d="M3 9h18" />
      <path d="M8 2v3" />
    </svg>
  );
}

function XIcon() {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export default function SiteFooter({ wedding }: { wedding: WeddingData }) {
  const reduceMotion = useReducedMotion();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstActionRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!sheetOpen) return;
    const prevActive = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    const raf = window.requestAnimationFrame(() => firstActionRef.current?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSheetOpen(false);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      window.cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      if (prevActive instanceof HTMLElement) prevActive.focus();
    };
  }, [sheetOpen]);

  useEffect(() => {
    if (!feedback) return;
    const t = window.setTimeout(() => setFeedback(""), 2600);
    return () => window.clearTimeout(t);
  }, [feedback]);

  return (
    <footer className="site-footer">
      <motion.div
        className="site-footer__inner"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="site-footer__floral" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/final-assets/decor/floral-divider.webp"
            alt=""
            width={1376}
            height={768}
            loading="lazy"
            decoding="async"
          />
        </div>

        <p className="site-footer__closing">With love, we begin forever.</p>

        <p className="site-footer__names-hi" lang="hi">
          <span>{wedding.brideHindi}</span>
          <i>{wedding.parinayLabel}</i>
          <span>{wedding.groomHindi}</span>
        </p>

        <p className="site-footer__names">
          <span>{wedding.bride}</span>
          <i>&amp;</i>
          <span>{wedding.groom}</span>
        </p>

        <p className="site-footer__hosts">
          <span lang="hi">
            {wedding.family.senderHeadingHindi}: {wedding.family.hostsHindi}
          </span>
          <span>
            {wedding.family.senderHeading}: {wedding.family.hosts} ({wedding.family.address})
          </span>
          <span>Contact: {wedding.family.contacts.join(" · ")}</span>
        </p>

        <div className="site-footer__save-group">
          <p className="site-footer__save-eyebrow">Keep the celebrations close</p>
          <p className="site-footer__schedule-copy">Save the wedding card &amp; schedule for later</p>
          <motion.button
            ref={triggerRef}
            className="site-footer__save"
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={sheetOpen}
            whileTap={reduceMotion ? undefined : { scale: 0.985 }}
            transition={{ duration: reduceMotion ? 0 : 0.16, ease: "easeOut" }}
          >
            <DownloadIcon />
            Save Wedding Schedule
          </motion.button>
        </div>

        <p className="site-footer__feedback" aria-live="polite">
          {feedback}
        </p>

        <time className="site-footer__date" dateTime={wedding.dateISO || undefined}>
          {wedding.weddingDate}
        </time>

        <span className="site-footer__ornament" aria-hidden="true">
          ❦
        </span>
      </motion.div>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {sheetOpen && (
              <motion.div
                className="schedule-sheet"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0.12 : 0.2 }}
                onMouseDown={(e) => {
                  if (e.target === e.currentTarget) setSheetOpen(false);
                }}
              >
                <motion.div
                  ref={dialogRef}
                  className="schedule-sheet__dialog"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="schedule-sheet-title"
                  initial={
                    reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }
                  }
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={
                    reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.99 }
                  }
                  transition={{ duration: reduceMotion ? 0.12 : 0.24, ease: "easeOut" }}
                  onKeyDown={(e) => {
                    if (e.key !== "Tab" || !dialogRef.current) return;
                    const btns = [
                      ...dialogRef.current.querySelectorAll<HTMLButtonElement>(
                        "button:not(:disabled)",
                      ),
                    ];
                    const first = btns[0];
                    const last = btns.at(-1);
                    if (e.shiftKey && document.activeElement === first) {
                      e.preventDefault();
                      last?.focus();
                    } else if (!e.shiftKey && document.activeElement === last) {
                      e.preventDefault();
                      first?.focus();
                    }
                  }}
                >
                  <button
                    className="schedule-sheet__close"
                    type="button"
                    onClick={() => setSheetOpen(false)}
                    aria-label="Close save schedule options"
                  >
                    <XIcon />
                  </button>
                  <p className="schedule-sheet__eyebrow">Keep the festivities close</p>
                  <h2 id="schedule-sheet-title">Save the celebration</h2>
                  <p className="schedule-sheet__copy">
                    Save the official wedding invitation card or add all ceremonies to your calendar.
                  </p>

                  <div className="schedule-sheet__card-preview">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={SCHEDULE_CARD_IMAGE_URL}
                      alt={`${wedding.bride} & ${wedding.groom} Wedding Schedule Card`}
                      width={682}
                      height={1024}
                      loading="eager"
                      decoding="async"
                    />
                  </div>

                  <div className="schedule-sheet__actions">
                    <button
                      ref={firstActionRef}
                      type="button"
                      onClick={() => {
                        void downloadWeddingScheduleImage(wedding);
                        setFeedback("Invitation card image downloaded");
                        setSheetOpen(false);
                      }}
                    >
                      <ImageDownIcon />
                      <span>
                        <strong>Download Invitation Card (Image)</strong>
                        <small>Save the wedding schedule card to your photos</small>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        void downloadWeddingSchedulePdf(wedding);
                        setFeedback("Schedule PDF downloaded");
                        setSheetOpen(false);
                      }}
                    >
                      <FileDownIcon />
                      <span>
                        <strong>Download as PDF</strong>
                        <small>Save the wedding invitation card as a PDF</small>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        downloadWeddingCalendar(wedding);
                        setFeedback("Calendar file downloaded");
                        setSheetOpen(false);
                      }}
                    >
                      <CalendarPlusIcon />
                      <span>
                        <strong>Add All to Calendar</strong>
                        <small>Save every celebration to your calendar</small>
                      </span>
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </footer>
  );
}

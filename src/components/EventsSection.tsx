"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { WeddingDaySchedule, WeddingEvent, WeddingEventVisual } from "@/data/wedding";
import {
  HaldiInteraction,
  MehendiInteraction,
  SangeetInteraction,
  VidaiInteraction,
  WeddingInteraction,
} from "./EventInteractions";
import { KalashIllustration, MandapIllustration } from "./SacredArtwork";

const MONTHS: Record<string, number> = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

function parseEventDateTime(dateStr?: string, timeStr?: string): Date | null {
  if (!dateStr) return null;
  const m = dateStr.trim().match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (!m) return null;
  const monthIdx = MONTHS[m[2].toLowerCase()];
  if (monthIdx === undefined) return null;
  let hour = 0;
  let minute = 0;
  if (timeStr) {
    const tm = timeStr.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
    if (!tm) return null;
    hour = Number(tm[1]) % 12;
    if (tm[3].toUpperCase() === "PM") hour += 12;
    minute = Number(tm[2] || 0);
  }
  const year = Number(m[3]);
  const day = Number(m[1]);
  const iso = `${year}-${String(monthIdx + 1).padStart(2, "0")}-${String(day).padStart(
    2,
    "0",
  )}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+05:30`;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

function toGoogleCalendarStamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function googleCalendarUrl(event: WeddingEvent): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${event.name} (${event.nameHindi})`,
  });
  const start = parseEventDateTime(event.date, event.time);
  if (start) {
    const end = event.endTime
      ? parseEventDateTime(event.date, event.endTime)
      : new Date(start.getTime() + 7200000);
    if (end) {
      params.set("dates", `${toGoogleCalendarStamp(start)}/${toGoogleCalendarStamp(end)}`);
    }
  }
  if (event.description) params.set("details", event.description);
  const loc = [event.venue, event.address].filter(Boolean).join(", ");
  if (loc) params.set("location", loc);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function directionsUrl(event: WeddingEvent): string | null {
  if (event.mapUrl) return event.mapUrl;
  const q = [event.venue, event.address].filter(Boolean).join(", ");
  if (!q || /to be announced/i.test(q)) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

const EVENT_MEDIA: Record<WeddingEventVisual, { src: string; width: number; height: number }> = {
  haldi: { src: "/media/final-assets/haldi.webp", width: 1376, height: 768 },
  mehendi: { src: "/media/final-assets/mehendi.webp", width: 1312, height: 816 },
  sangeet: { src: "/media/final-assets/sangeet.webp", width: 1312, height: 816 },
  wedding: { src: "/media/final-assets/wedding.webp", width: 1312, height: 816 },
  vidai: { src: "/media/final-assets/vidai.webp", width: 1312, height: 816 },
};

function CalendarDaysIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 2v3" />
      <path d="M16 2v3" />
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M8 13h.01" />
      <path d="M12 13h.01" />
      <path d="M16 13h.01" />
      <path d="M8 17h.01" />
      <path d="M12 17h.01" />
      <path d="M16 17h.01" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function EventCard({ event, index }: { event: WeddingEvent; index: number }) {
  const [haldiDone, setHaldiDone] = useState(false);
  const [mehendiDone, setMehendiDone] = useState(false);
  const [sangeetDone, setSangeetDone] = useState(false);
  const [weddingDone, setWeddingDone] = useState(false);
  const [vidaiDone, setVidaiDone] = useState(false);

  const isHaldi = event.interactionType === "haldi";
  const isMehendi = event.interactionType === "mehendi";
  const isSangeet = event.interactionType === "sangeet";
  const isWedding = event.interactionType === "wedding";
  const isVidai = event.interactionType === "vidai";
  const locked =
    (isHaldi && !haldiDone) ||
    (isMehendi && !mehendiDone) ||
    (isSangeet && !sangeetDone) ||
    (isWedding && !weddingDone) ||
    (isVidai && !vidaiDone);
  const unlocked = !locked;
  const calUrl = googleCalendarUrl(event);
  const mapUrl = directionsUrl(event);
  const media = EVENT_MEDIA[event.visual] || EVENT_MEDIA.wedding;

  return (
    <article
      className={`event-card event-card--${event.visual} ${index % 2 ? "event-card--reverse" : ""}`}
      data-interaction-type={event.interactionType || undefined}
      aria-labelledby={unlocked ? `event-${event.id}-title` : undefined}
      aria-label={unlocked ? undefined : `${event.name} event`}
    >
      <div className="event-card__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media.src}
          alt={`${event.name} celebration illustration`}
          width={media.width}
          height={media.height}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div
        className={`event-card__content ${
          locked ? "event-card__content--interaction-locked" : ""
        }`}
      >
        <div className="event-card__details-content" aria-hidden={!unlocked}>
          <p className="event-card__date">
            {event.dayLabel} (<span lang="hi">{event.dayLabelHindi}</span>) · {event.date} ·{" "}
            {event.time}
          </p>

          <h3 id={`event-${event.id}-title`}>{event.name}</h3>
          <p className="event-card__hindi-title" lang="hi">
            {event.nameHindi} · {event.dateHindi} · {event.timeHindi}
          </p>

          {event.subItems && event.subItems.length > 0 && (
            <ul className="event-card__subschedule" aria-label={`${event.name} rituals`}>
              {event.subItems.map((sub) => (
                <li key={`${sub.title}-${sub.time}`}>
                  <span className="event-card__sub-title">
                    <strong>{sub.title}</strong>
                    <span lang="hi">{sub.titleHindi}</span>
                  </span>
                  <span className="event-card__sub-time">
                    <strong>{sub.time}</strong>
                    <span lang="hi">{sub.timeHindi}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}

          {event.description && <p className="event-card__description">{event.description}</p>}

          <dl className="event-card__details">
            {event.venue && (
              <>
                <dt>Venue</dt>
                <dd>
                  {event.venue}
                  {event.venueHindi && (
                    <span className="event-card__detail-hi" lang="hi">
                      {" "}
                      ({event.venueHindi})
                    </span>
                  )}
                </dd>
              </>
            )}
            {event.address && (
              <>
                <dt>Address</dt>
                <dd>
                  {event.address}
                  {event.addressHindi && (
                    <span className="event-card__detail-hi" lang="hi">
                      {" "}
                      · {event.addressHindi}
                    </span>
                  )}
                </dd>
              </>
            )}
          </dl>

          <div className="event-card__actions">
            <a
              href={calUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Add ${event.name} to Google Calendar`}
            >
              <CalendarDaysIcon />
              Add to calendar
            </a>
            {mapUrl ? (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Get directions to ${event.name}`}
              >
                <MapPinIcon />
                Directions
              </a>
            ) : (
              <button
                type="button"
                disabled
                aria-label={`Directions to ${event.name} unavailable`}
              >
                <MapPinIcon />
                Directions
              </button>
            )}
          </div>
        </div>

        {isHaldi && (
          <HaldiInteraction
            event={event}
            completed={haldiDone}
            onComplete={() => setHaldiDone(true)}
          />
        )}
        {isMehendi && (
          <MehendiInteraction
            event={event}
            completed={mehendiDone}
            onComplete={() => setMehendiDone(true)}
          />
        )}
        {isSangeet && (
          <SangeetInteraction
            event={event}
            completed={sangeetDone}
            onComplete={() => setSangeetDone(true)}
          />
        )}
        {isWedding && (
          <WeddingInteraction
            event={event}
            completed={weddingDone}
            onComplete={() => setWeddingDone(true)}
          />
        )}
        {isVidai && (
          <VidaiInteraction
            event={event}
            completed={vidaiDone}
            onComplete={() => setVidaiDone(true)}
          />
        )}
      </div>
    </article>
  );
}

export default function EventsSection({
  events,
}: {
  events: WeddingEvent[];
  daySchedules?: WeddingDaySchedule[];
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="events-section" aria-labelledby="events-title">
      <header className="events-section__header">
        <div className="events-section__icon-pair" aria-hidden="true">
          <KalashIllustration className="events-section__kalash" />
          <MandapIllustration className="events-section__mandap" />
          <KalashIllustration className="events-section__kalash" />
        </div>
        <p>3 days of celebration · 8 – 10 December 2026</p>
        <h2 id="events-title">
          <span className="events-section__title-hi" lang="hi">
            मांगलिक कार्यक्रम
          </span>
          <span>The Festivities</span>
        </h2>
        <span aria-hidden="true">✦</span>
      </header>

      {/* Interactive ceremony cards */}
      <ol className="event-timeline">
        {events.map((event, idx) => (
          <motion.li
            key={event.id}
            className="event-timeline__item"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{
              duration: reduceMotion ? 0 : 0.65,
              delay: reduceMotion ? 0 : Math.min(idx * 0.06, 0.2),
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <motion.span
              className={`event-timeline__marker event-timeline__marker--${event.visual}`}
              aria-hidden="true"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.75 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: reduceMotion ? 0 : 0.45,
                delay: reduceMotion ? 0 : 0.1,
              }}
            />
            <EventCard event={event} index={idx} />
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

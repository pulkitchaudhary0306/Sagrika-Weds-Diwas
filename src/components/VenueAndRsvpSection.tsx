"use client";

import { motion, useReducedMotion } from "motion/react";
import type { WeddingData } from "@/data/wedding";
import { KalashIllustration, MandapIllustration } from "./SacredArtwork";

function MapPinIcon() {
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
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PhoneIcon() {
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z" />
    </svg>
  );
}

function buildWhatsAppUrl(phone: string, text: string): string {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${intl}?text=${encodeURIComponent(text)}`;
}

export default function VenueAndRsvpSection({ wedding }: { wedding: WeddingData }) {
  const reduceMotion = useReducedMotion();
  const { weddingVenue, family } = wedding;

  return (
    <>
      {/* ── Venue & Google Maps Directions Section ─────────────────────────── */}
      <section className="section venue-section" aria-labelledby="venue-section-title">
        <motion.div
          className="venue-section__inner"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: reduceMotion ? 0 : 0.65 }}
        >
          <MandapIllustration className="venue-section__mandap" />
          <p className="eyebrow">Where two families unite</p>
          <h2 id="venue-section-title">
            <span className="venue-section__hi" lang="hi">
              {weddingVenue.headingHindi}
            </span>
            <span>Wedding Venue &amp; Directions</span>
          </h2>

          <div className="venue-card">
            <div className="venue-card__details">
              <p className="venue-card__name-hi" lang="hi">
                {weddingVenue.nameHindi}
              </p>
              <h3 className="venue-card__name">{weddingVenue.name}</h3>
              <address className="venue-card__address">
                <span>{weddingVenue.landmark},</span>
                <span>{weddingVenue.road}</span>
                <span className="venue-card__address-hi" lang="hi">
                  {weddingVenue.landmarkHindi}, {weddingVenue.roadHindi}
                </span>
              </address>

              <div className="venue-card__actions">
                <a
                  href={weddingVenue.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="venue-card__btn"
                >
                  <MapPinIcon />
                  Get Directions on Google Maps
                </a>
              </div>
            </div>

            <div className="venue-card__map">
              <iframe
                title={`Google Maps location for ${weddingVenue.name}`}
                src={weddingVenue.mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Host Family (प्रेषक) & Contact Section ─────────────────────────── */}
      <section className="section host-rsvp-section" aria-labelledby="host-rsvp-title">
        <motion.div
          className="host-rsvp-section__inner"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduceMotion ? 0 : 0.65 }}
        >
          <div className="host-card">
            <div className="host-card__kalash-wrap" aria-hidden="true">
              <KalashIllustration className="host-card__kalash" />
            </div>
            <p className="eyebrow">
              <span lang="hi">{family.senderHeadingHindi}</span> · {family.senderHeading}
            </p>
            <h2 id="host-rsvp-title" className="host-card__hosts">
              <span className="host-card__hosts-hi" lang="hi">
                {family.hostsHindi}
              </span>
              <span>{family.hosts}</span>
            </h2>
            <address className="host-card__address">
              <span lang="hi">{family.addressHindi}</span>
              <span>{family.address}</span>
            </address>

            <div className="host-card__contacts" aria-label="Family contact numbers">
              {family.contacts.map((phone) => (
                <div key={phone} className="host-contact-pill">
                  <span className="host-contact-pill__num">{phone}</span>
                  <div className="host-contact-pill__links">
                    <a href={`tel:+91${phone}`} aria-label={`Call ${phone}`}>
                      <PhoneIcon /> Call
                    </a>
                    <a
                      href={buildWhatsAppUrl(
                        phone,
                        `नमस्ते 🙏 We received the wedding invitation for ${wedding.bride} & ${wedding.groom} on ${wedding.weddingDate}!`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Message ${phone} on WhatsApp`}
                    >
                      <WhatsAppIcon /> WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}

"use client";

import { useSyncExternalStore } from "react";

function subscribe(onTick: () => void) {
  const id = window.setInterval(onTick, 1000);
  return () => window.clearInterval(id);
}
const getNow = () => Math.floor(Date.now() / 1000);
const getServerNow = () => null;

export default function CountdownSection({
  date,
  displayDate,
}: {
  date: string;
  displayDate: string;
}) {
  const nowSec = useSyncExternalStore(subscribe, getNow, getServerNow);
  const targetSec = date ? Math.floor(new Date(date).getTime() / 1000) : NaN;
  const hasValidDate = Number.isFinite(targetSec);

  let diff = hasValidDate && nowSec !== null ? Math.max(0, targetSec - nowSec) : 0;
  const expired = hasValidDate && nowSec !== null && diff === 0;

  const days = Math.floor(diff / 86400);
  diff -= days * 86400;
  const hours = Math.floor(diff / 3600);
  diff -= hours * 3600;
  const minutes = Math.floor(diff / 60);
  const seconds = diff - minutes * 60;

  const units: [string, number][] = [
    ["Days", days],
    ["Hours", hours],
    ["Minutes", minutes],
    ["Seconds", seconds],
  ];

  return (
    <section className="section countdown-section" aria-labelledby="countdown-title">
      <p className="eyebrow">The countdown begins</p>
      <h2 id="countdown-title">Until We Say “I Do”</h2>
      <time dateTime={date || undefined}>{displayDate}</time>

      {expired ? (
        <p className="countdown-section__complete">Today, forever begins.</p>
      ) : (
        <div className="countdown-grid" aria-label="Time remaining until the wedding">
          {units.map(([label, val]) => (
            <div key={label} className="countdown-unit">
              <strong>{String(val).padStart(2, "0")}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      )}

      <span className="countdown-section__ornament" aria-hidden="true">
        ❧
      </span>
    </section>
  );
}


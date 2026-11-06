import type { WeddingData, WeddingEvent } from "@/data/wedding";

export const SCHEDULE_CARD_IMAGE_URL = "/media/final-assets/wedding-schedule-card.jpg";
const CARD_WIDTH = 682;
const CARD_HEIGHT = 1024;

const MONTHS: Record<string, number> = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
};

function slugify(str: string): string {
  return str
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

type DateParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

function parseParts(event: { date?: string; time?: string }): DateParts | null {
  const dm = event.date?.trim().match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  const tm = event.time?.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!dm || !tm) return null;
  const month = MONTHS[dm[2].toLowerCase()];
  if (!month) return null;
  let hour = Number(tm[1]) % 12;
  if (tm[3].toUpperCase() === "PM") hour += 12;
  return {
    year: Number(dm[3]),
    month,
    day: Number(dm[1]),
    hour,
    minute: Number(tm[2]),
  };
}

function addMinutes(p: DateParts, mins: number): DateParts {
  const d = new Date(Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute + mins));
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
  };
}

function formatIcsStamp(p: DateParts): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${p.year}${pad(p.month)}${pad(p.day)}T${pad(p.hour)}${pad(p.minute)}00`;
}

function escapeIcs(str = ""): string {
  return String(str)
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function foldLine(line: string): string {
  const out: string[] = [];
  let rest = line;
  while (rest.length > 73) {
    out.push(rest.slice(0, 73));
    rest = ` ${rest.slice(73)}`;
  }
  out.push(rest);
  return out.join("\r\n");
}

function resolveAddress(event: WeddingEvent, wedding: WeddingData): string {
  return (
    event.address ||
    (event.venue === wedding.weddingVenue?.name ? wedding.weddingVenue.location : "")
  );
}

function fullLocation(event: WeddingEvent, wedding: WeddingData): string {
  const addr = resolveAddress(event, wedding);
  return [event.venue, addr]
    .filter(Boolean)
    .filter((v, idx, arr) => arr.indexOf(v) === idx)
    .join(", ");
}

function buildIcs(wedding: WeddingData): string {
  const dtStamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
  const slug = `${slugify(wedding.bride)}-${slugify(wedding.groom)}`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//Schedule//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeIcs(`${wedding.bride} & ${wedding.groom} Wedding`)}`,
    "X-WR-TIMEZONE:Asia/Kolkata",
    "BEGIN:VTIMEZONE",
    "TZID:Asia/Kolkata",
    "X-LIC-LOCATION:Asia/Kolkata",
    "BEGIN:STANDARD",
    "TZOFFSETFROM:+0530",
    "TZOFFSETTO:+0530",
    "TZNAME:IST",
    "DTSTART:19700101T000000",
    "END:STANDARD",
    "END:VTIMEZONE",
  ];

  wedding.events.forEach((ev, idx) => {
    const start = parseParts(ev);
    if (!start) return;
    const rawEnd = ev.endTime ? parseParts({ ...ev, time: ev.endTime }) : null;
    const end = rawEnd
      ? formatIcsStamp(rawEnd) > formatIcsStamp(start)
        ? rawEnd
        : addMinutes(rawEnd, 1440)
      : addMinutes(start, 120);
    const loc = fullLocation(ev, wedding);
    const desc = [ev.description, `${wedding.bride} & ${wedding.groom}'s wedding celebrations.`]
      .filter(Boolean)
      .join("\n\n");

    lines.push(
      "BEGIN:VEVENT",
      `UID:${slugify(ev.id || ev.name)}-${formatIcsStamp(start)}-${idx}@${slug}.wedding`,
      `DTSTAMP:${dtStamp}`,
      `DTSTART;TZID=Asia/Kolkata:${formatIcsStamp(start)}`,
      `DTEND;TZID=Asia/Kolkata:${formatIcsStamp(end)}`,
      `SUMMARY:${escapeIcs(ev.name)}`,
      `LOCATION:${escapeIcs(loc)}`,
      `DESCRIPTION:${escapeIcs(desc)}`,
      "END:VEVENT",
    );
  });

  lines.push("END:VCALENDAR");
  return `${lines.map(foldLine).join("\r\n")}\r\n`;
}

/**
 * Builds a single-page PDF containing the exact JPEG wedding schedule card image.
 */
function buildImagePdfBytes(jpegBytes: Uint8Array, width: number, height: number): Uint8Array {
  const enc = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [0];
  let byteLength = 0;

  const pushBytes = (bytes: Uint8Array) => {
    chunks.push(bytes);
    byteLength += bytes.byteLength;
  };

  const pushStr = (str: string) => {
    pushBytes(enc.encode(str));
  };

  pushStr("%PDF-1.4\n%\xFF\xFF\xFF\xFF\n");

  // 1 0 obj: Catalog
  offsets.push(byteLength);
  pushStr("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");

  // 2 0 obj: Pages
  offsets.push(byteLength);
  pushStr("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");

  // 3 0 obj: Page
  offsets.push(byteLength);
  pushStr(
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`,
  );

  // 4 0 obj: Image XObject (DCTDecode raw JPEG stream)
  offsets.push(byteLength);
  pushStr(
    `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.byteLength} >>\nstream\n`,
  );
  pushBytes(jpegBytes);
  pushStr("\nendstream\nendobj\n");

  // 5 0 obj: Page Content stream drawing /Im0 full-bleed
  const contentStream = `q\n${width} 0 0 ${height} 0 0 cm\n/Im0 Do\nQ\n`;
  const contentBytes = enc.encode(contentStream);
  offsets.push(byteLength);
  pushStr(`5 0 obj\n<< /Length ${contentBytes.byteLength} >>\nstream\n`);
  pushBytes(contentBytes);
  pushStr("endstream\nendobj\n");

  // xref & trailer
  const xrefPos = byteLength;
  const totalObjs = 5;
  pushStr(`xref\n0 ${totalObjs + 1}\n0000000000 65535 f \n`);
  offsets.slice(1).forEach((off) => {
    pushStr(`${String(off).padStart(10, "0")} 00000 n \n`);
  });
  pushStr(
    `trailer\n<< /Size ${totalObjs + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`,
  );

  const result = new Uint8Array(byteLength);
  let pos = 0;
  for (const chunk of chunks) {
    result.set(chunk, pos);
    pos += chunk.byteLength;
  }
  return result;
}

export async function downloadWeddingScheduleImage(wedding: WeddingData) {
  const filename = `${slugify(wedding.bride)}-${slugify(wedding.groom)}-wedding-schedule.jpg`;
  const res = await fetch(SCHEDULE_CARD_IMAGE_URL);
  const blob = await res.blob();
  triggerDownload(blob, filename);
}

export async function downloadWeddingSchedulePdf(wedding: WeddingData) {
  const filename = `${slugify(wedding.bride)}-${slugify(wedding.groom)}-wedding-schedule.pdf`;
  const res = await fetch(SCHEDULE_CARD_IMAGE_URL);
  const arrayBuffer = await res.arrayBuffer();
  const pdfBytes = buildImagePdfBytes(new Uint8Array(arrayBuffer), CARD_WIDTH, CARD_HEIGHT);
  triggerDownload(
    new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" }),
    filename,
  );
}

export function downloadWeddingCalendar(wedding: WeddingData) {
  const filename = `${slugify(wedding.bride)}-${slugify(wedding.groom)}-wedding-events.ics`;
  triggerDownload(new Blob([buildIcs(wedding)], { type: "text/calendar;charset=utf-8" }), filename);
}

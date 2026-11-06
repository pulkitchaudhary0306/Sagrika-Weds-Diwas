import { wedding } from "@/data/wedding";
import { AudioProvider } from "@/components/AudioProvider";
import BlessingsSection from "@/components/BlessingsSection";
import CountdownSection from "@/components/CountdownSection";
import EventsSection from "@/components/EventsSection";
import FallingPetals from "@/components/FallingPetals";
import HeroSection from "@/components/HeroSection";
import MusicControl from "@/components/MusicControl";
import OpeningGate from "@/components/OpeningGate";
import PickYourSide from "@/components/PickYourSide";
import SiteFooter from "@/components/SiteFooter";
import VenueAndRsvpSection from "@/components/VenueAndRsvpSection";

export default function Home() {
  const { bride, groom, weddingDate } = wedding;
  const firstDate = wedding.events[0]?.date || weddingDate;

  return (
    <AudioProvider>
      <main className="invitation-shell">
        <OpeningGate wedding={wedding} />
        <FallingPetals />
        <HeroSection wedding={wedding} />

        <section className="section introduction" aria-labelledby="introduction-title">
          <p className="eyebrow">Together with their families</p>
          <p className="introduction__hindi-blessing" lang="hi">
            {wedding.auspiciousHeading}
          </p>
          <h2 id="introduction-title">A celebration of love</h2>
          <p>
            <strong>{wedding.family.hosts}</strong> (
            <span lang="hi">{wedding.family.hostsHindi}</span>) of{" "}
            <span>{wedding.family.address}</span> cordially invite you to share in the joy of the
            wedding festivities of <strong>{bride}</strong> (<span lang="hi">{wedding.brideHindi}</span>)
            and <strong>{groom}</strong> (<span lang="hi">{wedding.groomHindi}</span>), beginning on{" "}
            {firstDate}.
          </p>
          <div className="ornament" aria-hidden="true">
            ✦
          </div>
        </section>

        <EventsSection events={wedding.events} daySchedules={wedding.daySchedules} />

        <div className="major-section-divider" aria-hidden="true">
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

        <VenueAndRsvpSection wedding={wedding} />

        <PickYourSide
          bride={bride}
          groom={groom}
          brideHindi={wedding.brideHindi}
          groomHindi={wedding.groomHindi}
        />
        <CountdownSection
          date={wedding.dateISO}
          displayDate={`${wedding.weddingDate} · ${wedding.weddingDay} | ${wedding.weddingDayHindi}`}
        />
        <BlessingsSection bride={bride} groom={groom} />
        <SiteFooter wedding={wedding} />
        <MusicControl />
      </main>
    </AudioProvider>
  );
}

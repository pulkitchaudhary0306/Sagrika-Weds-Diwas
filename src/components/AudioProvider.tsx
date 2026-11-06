"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type SoundEffect =
  | "gateOpen"
  | "haldiRub"
  | "mehendiTrace"
  | "dholTap"
  | "blessingChime"
  | "pickSide";

type TrackKey = "music" | SoundEffect;

type TrackConfig = {
  src: string;
  volume: number;
  loop?: boolean;
  preload: "none" | "auto";
};

const TRACKS: Record<TrackKey, TrackConfig> = {
  music: { src: "/audio/wedding-music.mp3", volume: 0.32, loop: true, preload: "none" },
  gateOpen: { src: "/audio/gate-open.mp3", volume: 0.6, preload: "auto" },
  haldiRub: { src: "/audio/haldi-rub.mp3", volume: 0.28, loop: true, preload: "auto" },
  mehendiTrace: { src: "/audio/mehendi-trace.mp3", volume: 0.28, loop: true, preload: "auto" },
  dholTap: { src: "/audio/dhol-tap.mp3", volume: 0.62, preload: "auto" },
  blessingChime: { src: "/audio/blessing-chime.mp3", volume: 0.48, preload: "auto" },
  pickSide: { src: "/audio/pick-side.mp3", volume: 0.38, preload: "auto" },
};

const EFFECT_KEYS: SoundEffect[] = [
  "haldiRub",
  "mehendiTrace",
  "dholTap",
  "blessingChime",
  "pickSide",
];

function createAudioController() {
  const elements = new Map<TrackKey, HTMLAudioElement>();
  const failed = new Set<TrackKey>();
  let warmedUp = false;

  const getOrCreate = (key: TrackKey): HTMLAudioElement | null => {
    if (failed.has(key) || typeof Audio === "undefined") return null;
    if (elements.has(key)) return elements.get(key)!;
    const cfg = TRACKS[key];
    if (!cfg) return null;
    const audio = new Audio(cfg.src);
    audio.preload = cfg.preload;
    audio.volume = cfg.volume;
    audio.loop = !!cfg.loop;
    audio.addEventListener("error", () => failed.add(key), { once: true });
    elements.set(key, audio);
    return audio;
  };

  if (typeof window !== "undefined") {
    getOrCreate("gateOpen");
  }

  return {
    play: async (key: TrackKey, { restart = false }: { restart?: boolean } = {}) => {
      const audio = getOrCreate(key);
      if (!audio || failed.has(key)) return false;
      if (restart) {
        try {
          audio.currentTime = 0;
        } catch {
          // ignore
        }
      }
      try {
        await audio.play();
        return true;
      } catch (err: unknown) {
        const name = (err as { name?: string })?.name;
        if (audio.error || name === "NotSupportedError") {
          failed.add(key);
        }
        return false;
      }
    },
    pause: (key: TrackKey, { reset = false }: { reset?: boolean } = {}) => {
      const audio = elements.get(key);
      if (audio) {
        audio.pause();
        if (reset) {
          try {
            audio.currentTime = 0;
          } catch {
            // ignore
          }
        }
      }
    },
    setMuted: (key: TrackKey, muted: boolean) => {
      const audio = elements.get(key) || getOrCreate(key);
      if (audio) audio.muted = muted;
    },
    warmUpEffects: () => {
      if (warmedUp) return;
      warmedUp = true;
      EFFECT_KEYS.forEach((key) => {
        const audio = getOrCreate(key);
        if (audio && audio.readyState === HTMLMediaElement.HAVE_NOTHING) {
          audio.load();
        }
      });
    },
    destroy: () => {
      elements.forEach((audio) => {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      });
      elements.clear();
    },
  };
}

type AudioContextValue = {
  invitationOpened: boolean;
  musicMuted: boolean;
  startOpeningAudio: () => void;
  finishInvitationOpening: () => void;
  playEffect: (effect: SoundEffect, options?: { restart?: boolean }) => Promise<boolean>;
  stopEffect: (effect: SoundEffect) => void;
  toggleMusic: () => void;
};

const WeddingAudioContext = createContext<AudioContextValue | null>(null);

export function useWeddingAudio(): AudioContextValue {
  const ctx = useContext(WeddingAudioContext);
  if (!ctx) throw new Error("useWeddingAudio must be used within AudioProvider");
  return ctx;
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const [controller] = useState(() => createAudioController());
  const [invitationOpened, setInvitationOpened] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);

  useEffect(() => () => controller.destroy(), [controller]);
  useEffect(() => controller.setMuted("music", musicMuted), [controller, musicMuted]);

  const playEffect = useCallback(
    (effect: SoundEffect, options?: { restart?: boolean }) => controller.play(effect, options),
    [controller],
  );

  const stopEffect = useCallback(
    (effect: SoundEffect) => controller.pause(effect, { reset: true }),
    [controller],
  );

  const startOpeningAudio = useCallback(() => {
    controller.play("gateOpen", { restart: true });
    controller.warmUpEffects();
    controller.play("music");
  }, [controller]);

  const finishInvitationOpening = useCallback(() => setInvitationOpened(true), []);

  const toggleMusic = useCallback(() => setMusicMuted((m) => !m), []);

  const value = useMemo<AudioContextValue>(
    () => ({
      invitationOpened,
      musicMuted,
      startOpeningAudio,
      finishInvitationOpening,
      playEffect,
      stopEffect,
      toggleMusic,
    }),
    [
      finishInvitationOpening,
      invitationOpened,
      musicMuted,
      playEffect,
      startOpeningAudio,
      stopEffect,
      toggleMusic,
    ],
  );

  return <WeddingAudioContext value={value}>{children}</WeddingAudioContext>;
}


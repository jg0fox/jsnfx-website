"use client";

import { useState, useRef, useCallback } from "react";
import { Play, Loader2, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SENTENCE =
  "The results have been published, and they are now available for your review.";

interface VoiceVariant {
  id: string;
  label: string;
  stability: number;
  style: number;
  speed: number;
  nextText: string;
}

const variants: VoiceVariant[] = [
  {
    id: "neutral",
    label: "Version A",
    stability: 0.95,
    style: 0,
    speed: 1.0,
    nextText: "she read in a completely flat monotone, devoid of any feeling whatsoever, like a machine reading a legal document aloud.",
  },
  {
    id: "warm",
    label: "Version B",
    stability: 0.15,
    style: 1.0,
    speed: 0.85,
    nextText:
      "she whispered tenderly, beaming with joy and overflowing warmth, as if delivering the best news of someone's life. Her voice cracked with happy emotion.",
  },
  {
    id: "urgent",
    label: "Version C",
    stability: 0.1,
    style: 1.0,
    speed: 1.2,
    nextText:
      "she shouted with panicked urgency, voice shaking with fear and adrenaline, as if warning someone of immediate danger. Every syllable was strained and desperate.",
  },
  {
    id: "cold",
    label: "Version D",
    stability: 0.6,
    style: 0.5,
    speed: 0.75,
    nextText:
      "she said with icy, deliberate contempt, each word slow and dripping with quiet hostility. Her voice was low and threatening, barely concealing disgust.",
  },
];

const emotionLabels: Record<string, string> = {
  neutral: "Flat / neutral",
  warm: "Warm / encouraging",
  urgent: "Urgent / alarmed",
  cold: "Cold / disapproving",
};

const ratingOptions = [
  "Reassured",
  "Neutral",
  "Anxious",
  "Uneasy",
  "Motivated",
];

type Phase = "listen" | "rate" | "reveal";

export function ProsodicExercise() {
  const [phase, setPhase] = useState<Phase>("listen");
  const [audioCache, setAudioCache] = useState<Record<string, string>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [listenedTo, setListenedTo] = useState<Set<string>>(new Set());
  const [ratings, setRatings] = useState<Record<string, string>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchAndPlay = useCallback(
    async (variant: VoiceVariant) => {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      // Check cache first
      let base64 = audioCache[variant.id];

      if (!base64) {
        setLoadingId(variant.id);
        try {
          const res = await fetch("/api/elevenlabs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: SENTENCE,
              stability: variant.stability,
              style: variant.style,
              speed: variant.speed,
              nextText: variant.nextText,
              cacheKey: `prosodic-v2-${variant.id}`,
            }),
          });
          const data = await res.json();
          if (!res.ok || !data.audio) {
            console.error("Failed to generate audio:", data.error);
            setLoadingId(null);
            return;
          }
          base64 = data.audio;
          setAudioCache((prev) => ({ ...prev, [variant.id]: base64 }));
        } catch (err) {
          console.error("Error fetching audio:", err);
          setLoadingId(null);
          return;
        }
        setLoadingId(null);
      }

      // Play the audio
      const audio = new Audio(`data:audio/mpeg;base64,${base64}`);
      audioRef.current = audio;
      setPlayingId(variant.id);

      audio.addEventListener("ended", () => {
        setPlayingId(null);
        setListenedTo((prev) => new Set(prev).add(variant.id));
      });

      audio.play().catch((err) => {
        console.error("Playback error:", err);
        setPlayingId(null);
      });
    },
    [audioCache]
  );

  const allListened = variants.every((v) => listenedTo.has(v.id));
  const allRated = variants.every((v) => ratings[v.id]);

  const handleRate = (variantId: string, rating: string) => {
    setRatings((prev) => ({ ...prev, [variantId]: rating }));
  };

  const reset = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPhase("listen");
    setListenedTo(new Set());
    setRatings({});
    setPlayingId(null);
    setLoadingId(null);
  };

  return (
    <div>
      <p className="text-sm text-text-secondary leading-relaxed mb-2">
        The same sentence, spoken four different ways. Listen to each version,
        then rate how it makes you feel.
      </p>
      <p className="text-xs text-text-muted mb-4 italic">
        &ldquo;{SENTENCE}&rdquo;
      </p>

      {/* Listen phase */}
      {phase === "listen" && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {variants.map((variant) => {
              const isLoading = loadingId === variant.id;
              const isPlaying = playingId === variant.id;
              const hasListened = listenedTo.has(variant.id);

              return (
                <button
                  key={variant.id}
                  onClick={() => fetchAndPlay(variant)}
                  disabled={isLoading}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-4 rounded-lg border transition-all min-h-[80px]",
                    isPlaying
                      ? "border-bronze-spice bg-bronze-spice/5"
                      : hasListened
                        ? "border-palm-leaf/40 bg-palm-leaf/5"
                        : "border-soft-linen-dark hover:border-palm-leaf/40",
                    isLoading && "opacity-70"
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 text-text-muted animate-spin" />
                  ) : isPlaying ? (
                    <Volume2 className="w-5 h-5 text-bronze-spice" />
                  ) : (
                    <Play className="w-5 h-5 text-text-secondary" />
                  )}
                  <span className="text-xs font-medium text-text-primary">
                    {variant.label}
                  </span>
                  {hasListened && (
                    <span className="text-[10px] text-palm-leaf-3">
                      Heard
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {allListened && (
            <div className="flex justify-center">
              <button
                onClick={() => setPhase("rate")}
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-bronze-spice rounded-lg hover:bg-bronze-spice-light transition-colors min-h-[44px]"
              >
                Rate each version
              </button>
            </div>
          )}

          {!allListened && listenedTo.size > 0 && (
            <p className="text-xs text-text-muted text-center">
              Listen to all four versions to continue.
            </p>
          )}
        </>
      )}

      {/* Rating phase */}
      {phase === "rate" && (
        <>
          <div className="space-y-4 mb-4">
            {variants.map((variant) => (
              <div key={variant.id}>
                <div className="flex items-center gap-2 mb-2">
                  <button
                    onClick={() => fetchAndPlay(variant)}
                    className="flex items-center gap-1.5 text-xs text-palm-leaf-3 hover:text-bronze-spice transition-colors"
                  >
                    {playingId === variant.id ? (
                      <Volume2 className="w-3.5 h-3.5" />
                    ) : (
                      <Play className="w-3.5 h-3.5" />
                    )}
                    {variant.label}
                  </button>
                  <span className="text-xs text-text-muted">
                    How did this version make you feel?
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ratingOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleRate(variant.id, option)}
                      className={cn(
                        "px-3 py-1.5 text-xs rounded-full border transition-colors min-h-[32px]",
                        ratings[variant.id] === option
                          ? "border-palm-leaf bg-palm-leaf/10 text-palm-leaf-3 font-medium"
                          : "border-soft-linen-dark text-text-secondary hover:border-palm-leaf/40"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {allRated && (
            <div className="flex justify-center">
              <button
                onClick={() => setPhase("reveal")}
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-bronze-spice rounded-lg hover:bg-bronze-spice-light transition-colors min-h-[44px]"
              >
                See results
              </button>
            </div>
          )}
        </>
      )}

      {/* Reveal phase */}
      {phase === "reveal" && (
        <>
          <div className="space-y-2 mb-4">
            {variants.map((variant) => (
              <div
                key={variant.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3 rounded-lg bg-soft-linen-light border border-soft-linen-dark"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-text-primary">
                    {variant.label}:
                  </span>
                  <span className="text-xs text-palm-leaf-3 font-medium">
                    {emotionLabels[variant.id]}
                  </span>
                </div>
                <span className="text-xs text-text-muted">
                  You felt:{" "}
                  <span className="font-medium text-text-secondary">
                    {ratings[variant.id]}
                  </span>
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-palm-leaf/5 border-l-4 border-palm-leaf rounded-r-lg mb-4">
            <p className="text-sm text-text-secondary leading-relaxed">
              Every version spoke the exact same words. The only difference was
              prosody: pitch contour, tempo, and vocal tension. Your emotional
              responses were shaped before semantic processing even began. This
              is what &ldquo;pre-semantic injection&rdquo; means in practice.
              The voice carries the feeling; the words are along for the ride.
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-palm-leaf-3 border border-palm-leaf/30 rounded-lg hover:bg-palm-leaf/5 transition-colors min-h-[44px]"
            >
              Try again
            </button>
          </div>
        </>
      )}
    </div>
  );
}

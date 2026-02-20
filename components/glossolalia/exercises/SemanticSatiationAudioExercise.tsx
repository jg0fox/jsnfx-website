"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Play, Square, Loader2, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

const wordOptions = ["TREE", "DOOR", "BOWL", "CHAIR", "ROAD"];

interface MeaningEvent {
  time: number;
  type: "weaker" | "gone";
}

export function SemanticSatiationAudioExercise() {
  const [selectedWord, setSelectedWord] = useState(wordOptions[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [loopCount, setLoopCount] = useState(0);
  const [events, setEvents] = useState<MeaningEvent[]>([]);
  const [audioBase64, setAudioBase64] = useState<Record<string, string>>({});

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const loopCountRef = useRef(0);
  const maxDuration = 90;

  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute("src");
      audioRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    cleanup();
    setIsPlaying(false);
    setIsComplete(true);
  }, [cleanup]);

  const start = useCallback(async () => {
    setEvents([]);
    setElapsedSeconds(0);
    setLoopCount(0);
    setIsComplete(false);
    loopCountRef.current = 0;

    let base64 = audioBase64[selectedWord];

    if (!base64) {
      setIsLoading(true);
      try {
        const res = await fetch("/api/elevenlabs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: selectedWord.toLowerCase(),
            stability: 0.95,
            similarityBoost: 0.9,
            style: 0,
            speed: 0.9,
            cacheKey: `satiation-audio-${selectedWord}`,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.audio) {
          console.error("Failed to generate audio:", data.error);
          setIsLoading(false);
          return;
        }
        base64 = data.audio;
        setAudioBase64((prev) => ({ ...prev, [selectedWord]: base64 }));
      } catch (err) {
        console.error("Error fetching audio:", err);
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
    }

    setIsPlaying(true);

    const audio = new Audio(`data:audio/mpeg;base64,${base64}`);
    audioRef.current = audio;

    const playLoop = () => {
      if (!audioRef.current) return;
      loopCountRef.current++;
      setLoopCount(loopCountRef.current);
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    };

    audio.addEventListener("ended", () => {
      setTimeout(playLoop, 300);
    });

    playLoop();

    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => {
        if (prev >= maxDuration - 1) {
          stop();
          return maxDuration;
        }
        return prev + 1;
      });
    }, 1000);
  }, [audioBase64, selectedWord, stop]);

  const markEvent = useCallback(
    (type: "weaker" | "gone") => {
      setEvents((prev) => [...prev, { time: elapsedSeconds, type }]);
      if (type === "gone") {
        stop();
      }
    },
    [elapsedSeconds, stop]
  );

  const reset = useCallback(() => {
    cleanup();
    setIsPlaying(false);
    setIsComplete(false);
    setElapsedSeconds(0);
    setLoopCount(0);
    setEvents([]);
  }, [cleanup]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const meaningGone = events.some((e) => e.type === "gone");

  return (
    <div>
      <p className="text-sm text-text-secondary leading-relaxed mb-4">
        This time, listen to the word spoken aloud on a loop. Track when the
        meaning starts to dissolve. Does hearing it change when satiation hits?
      </p>

      {/* Word selector */}
      {!isPlaying && !isComplete && (
        <div className="flex flex-wrap gap-2 mb-6">
          {wordOptions.map((word) => (
            <button
              key={word}
              onClick={() => setSelectedWord(word)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-full border transition-colors min-h-[36px]",
                selectedWord === word
                  ? "border-palm-leaf bg-palm-leaf/10 text-palm-leaf-3 font-medium"
                  : "border-soft-linen-dark text-text-secondary hover:border-palm-leaf/40"
              )}
            >
              {word}
            </button>
          ))}
        </div>
      )}

      {/* Display area */}
      <div className="flex flex-col items-center py-6 md:py-10">
        <p className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-3">
          {selectedWord}
        </p>

        {(isPlaying || isComplete) && (
          <div className="flex items-center gap-4 text-sm text-text-muted font-mono">
            <span>{formatTime(elapsedSeconds)}</span>
            {isPlaying && (
              <Volume2 className="w-4 h-4 text-bronze-spice animate-pulse" />
            )}
            <span>Loop {loopCount}</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-3">
        {!isPlaying && !isComplete && (
          <button
            onClick={start}
            disabled={isLoading}
            className={cn(
              "inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-bronze-spice rounded-lg hover:bg-bronze-spice-light transition-colors min-h-[44px]",
              isLoading && "opacity-70"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating audio...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start listening
              </>
            )}
          </button>
        )}

        {isPlaying && (
          <div className="flex flex-col items-center gap-3 w-full">
            <div className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
              <button
                onClick={() => markEvent("weaker")}
                className="flex-1 inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-text-primary border-2 border-palm-leaf/40 rounded-lg hover:bg-palm-leaf/5 active:scale-95 transition-all min-h-[48px]"
              >
                Meaning feels weaker
              </button>
              <button
                onClick={() => markEvent("gone")}
                className="flex-1 inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-palm-leaf rounded-lg hover:bg-palm-leaf-3 active:scale-95 transition-all min-h-[48px]"
              >
                Meaning is gone
              </button>
            </div>
            <button
              onClick={stop}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs text-text-muted hover:text-text-secondary transition-colors min-h-[44px]"
            >
              <Square className="w-3 h-3" />
              Stop
            </button>
          </div>
        )}

        {isComplete && (
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-palm-leaf-3 border border-palm-leaf/30 rounded-lg hover:bg-palm-leaf/5 transition-colors min-h-[44px]"
          >
            Try another word
          </button>
        )}
      </div>

      {/* Results */}
      {isComplete && (
        <div className="mt-6 space-y-4">
          {events.length > 0 && (
            <div className="p-3 bg-soft-linen-light border border-soft-linen-dark rounded-lg">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wide mb-2">
                Meaning dissolution timeline
              </p>
              <div className="flex flex-wrap gap-2">
                {events.map((event, i) => (
                  <span
                    key={i}
                    className={cn(
                      "inline-block text-xs font-mono px-2 py-1 rounded-full",
                      event.type === "gone"
                        ? "text-bronze-spice bg-bronze-spice/10"
                        : "text-palm-leaf-3 bg-palm-leaf/10"
                    )}
                  >
                    {event.type === "weaker" ? "Weaker" : "Gone"} at{" "}
                    {formatTime(event.time)}
                  </span>
                ))}
              </div>
              <p className="text-xs text-text-muted mt-2">
                {meaningGone
                  ? `Meaning dissolved after ${formatTime(events.find((e) => e.type === "gone")!.time)} across ${loopCount} repetitions.`
                  : `${events.length} weakening events over ${formatTime(elapsedSeconds)}.`}
              </p>
            </div>
          )}

          <div className="p-4 bg-palm-leaf/5 border-l-4 border-palm-leaf rounded-r-lg">
            <p className="text-sm text-text-secondary leading-relaxed">
              {events.length === 0
                ? "You did not report any meaning changes. Try again with a longer listening period. Most listeners begin experiencing satiation within 20 to 40 seconds of auditory repetition."
                : "Auditory repetition often produces satiation faster than visual repetition. The spoken word engages phonological processing loops that fatigue more quickly when driven by an external source you cannot control. Compare this to the text-based exercise above: did meaning dissolve at the same rate?"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

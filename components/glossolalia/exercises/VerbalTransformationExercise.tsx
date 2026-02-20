"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Play, Square, Loader2, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

const wordOptions = ["STRESS", "LIFE", "SAY", "FLOAT", "TRICE"];

export function VerbalTransformationExercise() {
  const [selectedWord, setSelectedWord] = useState(wordOptions[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [transformations, setTransformations] = useState<number[]>([]);
  const [audioBase64, setAudioBase64] = useState<Record<string, string>>({});

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const loopCountRef = useRef(0);
  const maxDuration = 120; // 2 minutes max

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
    setTransformations([]);
    setElapsedSeconds(0);
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
            text: selectedWord,
            stability: 0.9,
            similarityBoost: 0.9,
            style: 0,
            speed: 0.85,
            cacheKey: `verbal-transform-${selectedWord}`,
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

    // Start looping playback
    setIsPlaying(true);

    const audio = new Audio(`data:audio/mpeg;base64,${base64}`);
    audioRef.current = audio;

    const playLoop = () => {
      if (!audioRef.current) return;
      loopCountRef.current++;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Silently handle autoplay issues
      });
    };

    audio.addEventListener("ended", () => {
      // Brief pause between repetitions for clarity
      setTimeout(playLoop, 150);
    });

    playLoop();

    // Start elapsed timer
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

  const markTransformation = useCallback(() => {
    setTransformations((prev) => [...prev, elapsedSeconds]);
  }, [elapsedSeconds]);

  const reset = useCallback(() => {
    cleanup();
    setIsPlaying(false);
    setIsComplete(false);
    setElapsedSeconds(0);
    setTransformations([]);
  }, [cleanup]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div>
      <p className="text-sm text-text-secondary leading-relaxed mb-4">
        Select a word and press play. It will loop continuously. Each time you
        hear it transform into a different word or sound, tap the button. Pay
        attention to when the first shift happens.
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
            <span>
              {transformations.length}{" "}
              {transformations.length === 1
                ? "transformation"
                : "transformations"}
            </span>
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
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={markTransformation}
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-palm-leaf rounded-lg hover:bg-palm-leaf-3 active:scale-95 transition-all min-h-[56px]"
            >
              I heard it change
            </button>
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
          {transformations.length > 0 && (
            <div className="p-3 bg-soft-linen-light border border-soft-linen-dark rounded-lg">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wide mb-2">
                Transformation timeline
              </p>
              <div className="flex flex-wrap gap-2">
                {transformations.map((time, i) => (
                  <span
                    key={i}
                    className="inline-block text-xs font-mono text-palm-leaf-3 bg-palm-leaf/10 px-2 py-1 rounded-full"
                  >
                    #{i + 1} at {formatTime(time)}
                  </span>
                ))}
              </div>
              {transformations.length > 0 && (
                <p className="text-xs text-text-muted mt-2">
                  First transformation at {formatTime(transformations[0])}.
                  Total: {transformations.length} perceived changes over{" "}
                  {formatTime(elapsedSeconds)}.
                </p>
              )}
            </div>
          )}

          <div className="p-4 bg-palm-leaf/5 border-l-4 border-palm-leaf rounded-r-lg">
            <p className="text-sm text-text-secondary leading-relaxed">
              {transformations.length === 0
                ? "You didn't report any transformations. Try again with a longer listening period, or try a different word. Most listeners begin hearing changes within 15 to 30 seconds."
                : `You heard ${transformations.length} transformation${transformations.length === 1 ? "" : "s"}. Warren's original research found approximately 30 changes over 3 minutes of continuous repetition. You did not choose these transformations. Your semantic network generated them autonomously as the neural coupling between sound and meaning destabilized.`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

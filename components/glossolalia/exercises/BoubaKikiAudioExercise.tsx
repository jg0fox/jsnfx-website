"use client";

import { useState, useRef, useCallback } from "react";
import { Play, Loader2, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface WordPair {
  round: number;
  wordA: string;
  wordB: string;
  // "round" sound maps to round shape, "sharp" maps to jagged
  roundSound: "A" | "B";
}

const wordPairs: WordPair[] = [
  { round: 1, wordA: "bouba", wordB: "kiki", roundSound: "A" },
  { round: 2, wordA: "maluma", wordB: "takete", roundSound: "A" },
  { round: 3, wordA: "lomba", wordB: "tikedi", roundSound: "A" },
];

type ShapeChoice = "round" | "jagged";

interface RoundResult {
  wordAShape: ShapeChoice;
  correct: boolean;
}

export function BoubaKikiAudioExercise() {
  const [currentRound, setCurrentRound] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [playingWord, setPlayingWord] = useState<string | null>(null);
  const [audioCache, setAudioCache] = useState<Record<string, string>>({});
  const [wordAChoice, setWordAChoice] = useState<ShapeChoice | null>(null);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchAndPlay = useCallback(
    async (word: string) => {
      // Stop current audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      let base64 = audioCache[word];

      if (!base64) {
        setIsLoading(true);
        try {
          const res = await fetch("/api/elevenlabs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: word,
              stability: 0.7,
              similarityBoost: 0.8,
              style: 0,
              speed: 0.9,
              cacheKey: `bouba-kiki-audio-${word}`,
            }),
          });
          const data = await res.json();
          if (!res.ok || !data.audio) {
            console.error("Failed to generate audio:", data.error);
            setIsLoading(false);
            return;
          }
          base64 = data.audio;
          setAudioCache((prev) => ({ ...prev, [word]: base64 }));
        } catch (err) {
          console.error("Error fetching audio:", err);
          setIsLoading(false);
          return;
        }
        setIsLoading(false);
      }

      const audio = new Audio(`data:audio/mpeg;base64,${base64}`);
      audioRef.current = audio;
      setPlayingWord(word);

      audio.addEventListener("ended", () => {
        setPlayingWord(null);
      });

      audio.play().catch((err) => {
        console.error("Playback error:", err);
        setPlayingWord(null);
      });
    },
    [audioCache]
  );

  const pair = wordPairs[currentRound];
  const isLastRound = currentRound >= wordPairs.length - 1;

  const submitRound = useCallback(() => {
    if (!wordAChoice || !pair) return;

    const isCorrect =
      (pair.roundSound === "A" && wordAChoice === "round") ||
      (pair.roundSound === "B" && wordAChoice === "jagged");

    const result: RoundResult = {
      wordAShape: wordAChoice,
      correct: isCorrect,
    };

    const newResults = [...results, result];
    setResults(newResults);
    setWordAChoice(null);

    if (isLastRound) {
      setShowResults(true);
    } else {
      setCurrentRound((prev) => prev + 1);
    }
  }, [wordAChoice, pair, results, isLastRound]);

  const reset = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setCurrentRound(0);
    setWordAChoice(null);
    setResults([]);
    setShowResults(false);
    setPlayingWord(null);
  }, []);

  const correctCount = results.filter((r) => r.correct).length;

  if (showResults) {
    return (
      <div>
        <p className="text-sm text-text-secondary leading-relaxed mb-4">
          You heard three pairs of nonsense words and matched each to a shape.
        </p>

        <div className="space-y-2 mb-4">
          {wordPairs.map((wp, i) => {
            const result = results[i];
            return (
              <div
                key={wp.round}
                className={cn(
                  "flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3 rounded-lg border",
                  result.correct
                    ? "border-palm-leaf/40 bg-palm-leaf/5"
                    : "border-red-300 bg-red-50"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-text-primary">
                    Round {wp.round}:
                  </span>
                  <span className="text-xs text-text-secondary">
                    &ldquo;{wp.wordA}&rdquo; &amp; &ldquo;{wp.wordB}&rdquo;
                  </span>
                </div>
                <span className="text-xs text-text-muted">
                  {result.correct ? "Matched majority" : "Diverged from majority"}
                </span>
              </div>
            );
          })}
        </div>

        <div className="text-center mb-4">
          <p className="text-2xl font-display font-bold text-text-primary">
            {correctCount}/{wordPairs.length}
          </p>
          <p className="text-xs text-text-muted">
            rounds matching the cross-cultural majority
          </p>
        </div>

        <div className="p-4 bg-palm-leaf/5 border-l-4 border-palm-leaf rounded-r-lg mb-4">
          <p className="text-sm text-text-secondary leading-relaxed">
            {correctCount === wordPairs.length ? (
              <>
                Across all three word pairs, you matched the same way as{" "}
                <strong>95-98% of people across languages and cultures</strong>.
                Round sounds map to round shapes; sharp sounds map to angular
                ones.{" "}
              </>
            ) : correctCount >= 2 ? (
              <>
                You matched the majority pattern in most rounds. The effect is
                robust:{" "}
                <strong>95-98% of people across all languages</strong> assign
                round sounds to round shapes and sharp sounds to angular ones.{" "}
              </>
            ) : (
              <>
                You diverged from the majority mapping. Across populations,{" "}
                <strong>95-98% of people</strong> assign round sounds to round
                shapes and sharp sounds to angular ones. Individual variation
                exists, but the cross-modal pattern is one of the most universal
                findings in psycholinguistics.{" "}
              </>
            )}
            This mapping is present even in spoken nonsense words you have never
            encountered before. Your brain maps acoustic properties to visual
            geometry pre-linguistically.
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-palm-leaf-3 border border-palm-leaf/30 rounded-lg hover:bg-palm-leaf/5 transition-colors min-h-[44px]"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-text-secondary leading-relaxed mb-2">
        You will hear pairs of nonsense words. For each pair, match the first
        word to one of the two shapes below.
      </p>
      <p className="text-xs text-text-muted mb-4">
        Round {(pair?.round ?? 0)} of {wordPairs.length}
      </p>

      {/* Shapes */}
      <div className="flex justify-center gap-6 md:gap-12 mb-6">
        <div className="text-center">
          <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <path
                d="M100,30 C140,30 170,50 175,80 C180,110 165,140 145,160 C125,180 90,185 65,170 C40,155 25,130 25,100 C25,70 40,45 60,35 C75,28 90,30 100,30 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-text-primary"
              />
            </svg>
          </div>
          <p className="text-xs text-text-muted mt-1">Round shape</p>
        </div>

        <div className="text-center">
          <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <path
                d="M100,15 L120,60 L170,40 L140,80 L185,100 L140,120 L170,160 L120,140 L100,185 L80,140 L30,160 L60,120 L15,100 L60,80 L30,40 L80,60 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-text-primary"
              />
            </svg>
          </div>
          <p className="text-xs text-text-muted mt-1">Jagged shape</p>
        </div>
      </div>

      {/* Audio buttons */}
      {pair && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-text-primary text-center">
            Listen to both words:
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => fetchAndPlay(pair.wordA)}
              disabled={isLoading}
              className={cn(
                "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border transition-all min-h-[48px]",
                playingWord === pair.wordA
                  ? "border-bronze-spice bg-bronze-spice/5"
                  : "border-soft-linen-dark hover:border-palm-leaf/40",
                isLoading && "opacity-70"
              )}
            >
              {isLoading && !audioCache[pair.wordA] ? (
                <Loader2 className="w-4 h-4 animate-spin text-text-muted" />
              ) : playingWord === pair.wordA ? (
                <Volume2 className="w-4 h-4 text-bronze-spice" />
              ) : (
                <Play className="w-4 h-4 text-text-secondary" />
              )}
              <span className="text-sm font-medium">Word A</span>
            </button>
            <button
              onClick={() => fetchAndPlay(pair.wordB)}
              disabled={isLoading}
              className={cn(
                "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border transition-all min-h-[48px]",
                playingWord === pair.wordB
                  ? "border-bronze-spice bg-bronze-spice/5"
                  : "border-soft-linen-dark hover:border-palm-leaf/40",
                isLoading && "opacity-70"
              )}
            >
              {isLoading && !audioCache[pair.wordB] ? (
                <Loader2 className="w-4 h-4 animate-spin text-text-muted" />
              ) : playingWord === pair.wordB ? (
                <Volume2 className="w-4 h-4 text-bronze-spice" />
              ) : (
                <Play className="w-4 h-4 text-text-secondary" />
              )}
              <span className="text-sm font-medium">Word B</span>
            </button>
          </div>

          {/* Shape assignment */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-text-primary text-center">
              Which shape matches <strong>Word A</strong>?
            </p>
            <div className="flex gap-3 max-w-sm mx-auto">
              <button
                onClick={() => setWordAChoice("round")}
                className={cn(
                  "flex-1 px-4 py-3 text-sm rounded-lg border transition-all min-h-[44px]",
                  wordAChoice === "round"
                    ? "border-2 border-palm-leaf bg-palm-leaf/5 font-medium"
                    : "border-soft-linen-dark hover:border-palm-leaf/40 bg-white"
                )}
              >
                Round shape
              </button>
              <button
                onClick={() => setWordAChoice("jagged")}
                className={cn(
                  "flex-1 px-4 py-3 text-sm rounded-lg border transition-all min-h-[44px]",
                  wordAChoice === "jagged"
                    ? "border-2 border-palm-leaf bg-palm-leaf/5 font-medium"
                    : "border-soft-linen-dark hover:border-palm-leaf/40 bg-white"
                )}
              >
                Jagged shape
              </button>
            </div>
          </div>

          {wordAChoice && (
            <div className="flex justify-center pt-2">
              <button
                onClick={submitRound}
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-palm-leaf rounded-lg hover:bg-palm-leaf-3 transition-colors min-h-[44px]"
              >
                {isLastRound ? "See results" : "Next pair"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

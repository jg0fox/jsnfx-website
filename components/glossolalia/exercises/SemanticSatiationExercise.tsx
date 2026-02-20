"use client";

import { useState, useRef, useCallback, useEffect } from "react";

const wordOptions = ["TREE", "DOOR", "BOWL", "CHAIR", "ROAD"];

export function SemanticSatiationExercise() {
  const [selectedWord, setSelectedWord] = useState(wordOptions[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [count, setCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [pulse, setPulse] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const maxReps = 30;

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setIsComplete(true);
  }, []);

  const start = useCallback(() => {
    setCount(0);
    setIsComplete(false);
    setIsRunning(true);
    setPulse(false);

    intervalRef.current = setInterval(() => {
      setCount((prev) => {
        if (prev >= maxReps - 1) {
          stop();
          return maxReps;
        }
        setPulse(true);
        setTimeout(() => setPulse(false), 200);
        return prev + 1;
      });
    }, 500);
  }, [stop]);

  const reset = useCallback(() => {
    stop();
    setCount(0);
    setIsComplete(false);
  }, [stop]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div>
      <p className="text-sm text-text-secondary leading-relaxed mb-4">
        Pick a word, press start, and focus on it as it repeats. Pay attention
        to what happens to its meaning.
      </p>

      {/* Word selector */}
      {!isRunning && !isComplete && (
        <div className="flex flex-wrap gap-2 mb-6">
          {wordOptions.map((word) => (
            <button
              key={word}
              onClick={() => setSelectedWord(word)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors min-h-[36px] ${
                selectedWord === word
                  ? "border-palm-leaf bg-palm-leaf/10 text-palm-leaf-3 font-medium"
                  : "border-soft-linen-dark text-text-secondary hover:border-palm-leaf/40"
              }`}
            >
              {word}
            </button>
          ))}
        </div>
      )}

      {/* Word display */}
      <div className="flex flex-col items-center py-8 md:py-12">
        <p
          className={`text-4xl md:text-5xl font-display font-bold text-text-primary transition-transform duration-150 ${
            pulse ? "scale-110" : "scale-100"
          }`}
        >
          {selectedWord}
        </p>
        {isRunning && (
          <p className="text-sm text-text-muted mt-4 font-mono">
            Repetition {count + 1} / {maxReps}
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        {!isRunning && !isComplete && (
          <button
            onClick={start}
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-bronze-spice rounded-lg hover:bg-bronze-spice-light transition-colors min-h-[44px]"
          >
            Start
          </button>
        )}
        {isRunning && (
          <button
            onClick={stop}
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-text-primary border border-soft-linen-dark rounded-lg hover:bg-soft-linen-dark/50 transition-colors min-h-[44px]"
          >
            Stop early
          </button>
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

      {/* Reflection */}
      {isComplete && (
        <div className="mt-6 p-4 bg-palm-leaf/5 border-l-4 border-palm-leaf rounded-r-lg">
          <p className="text-sm text-text-secondary leading-relaxed">
            Did the word start to feel strange or hollow? That dissolution is
            semantic satiation happening in real time — the neural coupling
            between the word&apos;s sound and its meaning literally fatiguing.
            The word&apos;s acoustic shell persists after its semantic content
            has been evacuated.
          </p>
        </div>
      )}
    </div>
  );
}

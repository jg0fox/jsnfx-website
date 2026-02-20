"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

type Phase = "instructions" | "control" | "congruent" | "incongruent" | "results";
type ColorName = "red" | "blue" | "green" | "yellow";

interface Stimulus {
  text: string;
  displayColor: string;
  correctAnswer: ColorName;
}

const colorMap: Record<ColorName, string> = {
  red: "#dc2626",
  blue: "#2563eb",
  green: "#16a34a",
  yellow: "#ca8a04",
};

const colorNames: ColorName[] = ["red", "blue", "green", "yellow"];

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function generateStimuli(phase: "control" | "congruent" | "incongruent"): Stimulus[] {
  const items: Stimulus[] = [];
  const colors = shuffle([...colorNames, ...colorNames, ...colorNames].slice(0, 10));

  for (const color of colors) {
    if (phase === "control") {
      items.push({ text: "■■■", displayColor: colorMap[color], correctAnswer: color });
    } else if (phase === "congruent") {
      items.push({
        text: color.toUpperCase(),
        displayColor: colorMap[color],
        correctAnswer: color,
      });
    } else {
      const others = colorNames.filter((c) => c !== color);
      const wrongWord = others[Math.floor(Math.random() * others.length)];
      items.push({
        text: wrongWord.toUpperCase(),
        displayColor: colorMap[color],
        correctAnswer: color,
      });
    }
  }
  return items;
}

export function StroopEffectExercise() {
  const [phase, setPhase] = useState<Phase>("instructions");
  const [stimuli, setStimuli] = useState<Stimulus[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [roundStart, setRoundStart] = useState(0);
  const [results, setResults] = useState<{
    control: number;
    congruent: number;
    incongruent: number;
    errors: { control: number; congruent: number; incongruent: number };
  }>({ control: 0, congruent: 0, incongruent: 0, errors: { control: 0, congruent: 0, incongruent: 0 } });
  const errorsRef = useRef(0);
  const itemStartRef = useRef(0);
  const timesRef = useRef<number[]>([]);

  const startRound = useCallback((roundPhase: "control" | "congruent" | "incongruent") => {
    const newStimuli = generateStimuli(roundPhase);
    setStimuli(newStimuli);
    setCurrentIndex(0);
    setPhase(roundPhase);
    errorsRef.current = 0;
    timesRef.current = [];
    setRoundStart(Date.now());
    itemStartRef.current = Date.now();
  }, []);

  const handleAnswer = useCallback(
    (answer: ColorName) => {
      const current = stimuli[currentIndex];
      if (!current) return;

      const itemTime = Date.now() - itemStartRef.current;
      timesRef.current.push(itemTime);

      if (answer !== current.correctAnswer) {
        errorsRef.current++;
      }

      if (currentIndex >= stimuli.length - 1) {
        const totalTime = Date.now() - roundStart;
        const avgTime = Math.round(totalTime / stimuli.length);
        const currentPhase = phase as "control" | "congruent" | "incongruent";

        setResults((prev) => ({
          ...prev,
          [currentPhase]: avgTime,
          errors: { ...prev.errors, [currentPhase]: errorsRef.current },
        }));

        if (currentPhase === "control") {
          setTimeout(() => startRound("congruent"), 800);
        } else if (currentPhase === "congruent") {
          setTimeout(() => startRound("incongruent"), 800);
        } else {
          setPhase("results");
        }
      } else {
        setCurrentIndex((prev) => prev + 1);
        itemStartRef.current = Date.now();
      }
    },
    [stimuli, currentIndex, roundStart, phase, startRound]
  );

  // Keyboard shortcuts
  useEffect(() => {
    if (phase !== "control" && phase !== "congruent" && phase !== "incongruent") return;
    const handleKey = (e: KeyboardEvent) => {
      const keyMap: Record<string, ColorName> = { r: "red", b: "blue", g: "green", y: "yellow" };
      const color = keyMap[e.key.toLowerCase()];
      if (color) handleAnswer(color);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [phase, handleAnswer]);

  const currentStimulus = stimuli[currentIndex];
  const isActive = phase === "control" || phase === "congruent" || phase === "incongruent";

  const phaseLabel =
    phase === "control"
      ? "Round 1: Color patches"
      : phase === "congruent"
        ? "Round 2: Matching words"
        : phase === "incongruent"
          ? "Round 3: Conflicting words"
          : "";

  return (
    <div>
      {/* Instructions: always visible except during results */}
      {phase !== "results" && (
        <div className={isActive ? "mb-4" : ""}>
          <p className="text-sm text-text-secondary leading-relaxed mb-3">
            You will see colored items in three rounds. Your task is to identify
            the <strong>ink color</strong> as fast as you can. Ignore the word
            itself. Press the matching color button below.
          </p>
          {!isActive && (
            <>
              <ul className="text-sm text-text-secondary leading-relaxed mb-4 space-y-1">
                <li>Round 1: Colored squares (control)</li>
                <li>Round 2: Words matching their ink color</li>
                <li>Round 3: Words conflicting with their ink color</li>
              </ul>
              <div className="flex justify-center">
                <button
                  onClick={() => startRound("control")}
                  className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-bronze-spice rounded-lg hover:bg-bronze-spice-light transition-colors min-h-[44px]"
                >
                  Begin
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {isActive && currentStimulus && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
              {phaseLabel}
            </p>
            <p className="text-xs text-text-muted font-mono">
              {currentIndex + 1}/{stimuli.length}
            </p>
          </div>

          <div className="flex items-center justify-center py-8 md:py-12">
            <p
              className="text-4xl md:text-5xl font-display font-black select-none"
              style={{ color: currentStimulus.displayColor }}
            >
              {currentStimulus.text}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2 md:gap-3">
            {colorNames.map((color) => (
              <button
                key={color}
                onClick={() => handleAnswer(color)}
                className="flex items-center justify-center py-3 md:py-4 rounded-lg text-white font-bold text-sm uppercase transition-transform active:scale-95 min-h-[44px]"
                style={{ backgroundColor: colorMap[color] }}
              >
                {color}
              </button>
            ))}
          </div>
          <p className="text-xs text-text-muted text-center mt-2">
            Keyboard: R, B, G, Y
          </p>
        </div>
      )}

      {phase === "results" && (
        <div>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            Average response time per item:
          </p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {(["control", "congruent", "incongruent"] as const).map((round) => (
              <div
                key={round}
                className="text-center p-3 rounded-lg border border-soft-linen-dark bg-white"
              >
                <p className="text-2xl font-display font-bold text-text-primary">
                  {results[round]}
                  <span className="text-sm font-normal text-text-muted">ms</span>
                </p>
                <p className="text-xs text-text-muted mt-1 capitalize">{round}</p>
                {results.errors[round] > 0 && (
                  <p className="text-xs text-red-500 mt-0.5">
                    {results.errors[round]} error{results.errors[round] > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 bg-palm-leaf/5 border-l-4 border-palm-leaf rounded-r-lg">
            <p className="text-sm text-text-secondary leading-relaxed">
              {results.incongruent > results.control * 1.15 ? (
                <>
                  Your incongruent round was{" "}
                  <strong>
                    {Math.round(
                      ((results.incongruent - results.control) / results.control) * 100
                    )}
                    % slower
                  </strong>{" "}
                  than the control. That delay is the Stroop effect: your
                  automatic reading process interfering with color naming. You
                  cannot un-read a word. Language has root-level access to your
                  cognition.
                </>
              ) : (
                <>
                  Interesting: your times were relatively close across rounds.
                  Most people show a significant slowdown on incongruent trials.
                  The Stroop effect is robust across populations, but individual
                  variation exists. Try the exercise again; the effect often
                  becomes more apparent with practice as you try harder to
                  respond quickly.
                </>
              )}
            </p>
          </div>

          <div className="mt-4 flex justify-center">
            <button
              onClick={() => {
                setPhase("instructions");
                setResults({ control: 0, congruent: 0, incongruent: 0, errors: { control: 0, congruent: 0, incongruent: 0 } });
              }}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-palm-leaf-3 border border-palm-leaf/30 rounded-lg hover:bg-palm-leaf/5 transition-colors min-h-[44px]"
            >
              Try again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

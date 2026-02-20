"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Phase = "scenario-a" | "scenario-b" | "reveal";

export function FramingEffectExercise() {
  const [phase, setPhase] = useState<Phase>("scenario-a");
  const [choiceA, setChoiceA] = useState<"A" | "B" | null>(null);
  const [choiceB, setChoiceB] = useState<"C" | "D" | null>(null);

  const didReverse =
    (choiceA === "A" && choiceB === "D") ||
    (choiceA === "B" && choiceB === "C");

  return (
    <div>
      {phase === "scenario-a" && (
        <div>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            Imagine 600 people are affected by a disease outbreak. Two programs
            have been proposed. Which do you prefer?
          </p>

          <div className="grid gap-3 mb-4">
            <button
              onClick={() => setChoiceA("A")}
              className={cn(
                "w-full text-left p-4 rounded-lg border transition-all min-h-[44px]",
                choiceA === "A"
                  ? "border-2 border-palm-leaf bg-palm-leaf/5"
                  : "border-soft-linen-dark hover:border-palm-leaf/40 bg-white"
              )}
            >
              <span className="text-xs font-mono font-bold text-text-muted">
                Program A:
              </span>
              <p className="text-sm text-text-primary mt-1">
                200 people will be saved.
              </p>
            </button>

            <button
              onClick={() => setChoiceA("B")}
              className={cn(
                "w-full text-left p-4 rounded-lg border transition-all min-h-[44px]",
                choiceA === "B"
                  ? "border-2 border-palm-leaf bg-palm-leaf/5"
                  : "border-soft-linen-dark hover:border-palm-leaf/40 bg-white"
              )}
            >
              <span className="text-xs font-mono font-bold text-text-muted">
                Program B:
              </span>
              <p className="text-sm text-text-primary mt-1">
                There is a 1/3 probability that 600 people will be saved, and a
                2/3 probability that no one will be saved.
              </p>
            </button>
          </div>

          {choiceA && (
            <div className="flex justify-end">
              <button
                onClick={() => setPhase("scenario-b")}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-palm-leaf rounded-lg hover:bg-palm-leaf-3 transition-colors min-h-[44px]"
              >
                Next scenario &rarr;
              </button>
            </div>
          )}
        </div>
      )}

      {phase === "scenario-b" && (
        <div>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            Now consider a different scenario. Same disease, same 600 people.
            Two new programs. Which do you prefer?
          </p>

          <div className="grid gap-3 mb-4">
            <button
              onClick={() => setChoiceB("C")}
              className={cn(
                "w-full text-left p-4 rounded-lg border transition-all min-h-[44px]",
                choiceB === "C"
                  ? "border-2 border-palm-leaf bg-palm-leaf/5"
                  : "border-soft-linen-dark hover:border-palm-leaf/40 bg-white"
              )}
            >
              <span className="text-xs font-mono font-bold text-text-muted">
                Program C:
              </span>
              <p className="text-sm text-text-primary mt-1">
                400 people will die.
              </p>
            </button>

            <button
              onClick={() => setChoiceB("D")}
              className={cn(
                "w-full text-left p-4 rounded-lg border transition-all min-h-[44px]",
                choiceB === "D"
                  ? "border-2 border-palm-leaf bg-palm-leaf/5"
                  : "border-soft-linen-dark hover:border-palm-leaf/40 bg-white"
              )}
            >
              <span className="text-xs font-mono font-bold text-text-muted">
                Program D:
              </span>
              <p className="text-sm text-text-primary mt-1">
                There is a 1/3 probability that nobody will die, and a 2/3
                probability that 600 people will die.
              </p>
            </button>
          </div>

          {choiceB && (
            <div className="flex justify-end">
              <button
                onClick={() => setPhase("reveal")}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-palm-leaf rounded-lg hover:bg-palm-leaf-3 transition-colors min-h-[44px]"
              >
                See results &rarr;
              </button>
            </div>
          )}
        </div>
      )}

      {phase === "reveal" && (
        <div>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-lg border border-soft-linen-dark bg-white">
              <p className="text-xs font-mono font-bold text-text-muted mb-2">
                Gain frame
              </p>
              <p className="text-sm text-text-primary mb-2">
                You chose:{" "}
                <span className="font-bold">Program {choiceA}</span>
              </p>
              <div className="text-xs text-text-muted space-y-1">
                <p>A: &ldquo;200 people will be saved&rdquo;</p>
                <p>
                  B: &ldquo;1/3 chance all saved, 2/3 chance none saved&rdquo;
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-soft-linen-dark bg-white">
              <p className="text-xs font-mono font-bold text-text-muted mb-2">
                Loss frame
              </p>
              <p className="text-sm text-text-primary mb-2">
                You chose:{" "}
                <span className="font-bold">Program {choiceB}</span>
              </p>
              <div className="text-xs text-text-muted space-y-1">
                <p>C: &ldquo;400 people will die&rdquo;</p>
                <p>
                  D: &ldquo;1/3 chance nobody dies, 2/3 chance all 600 die&rdquo;
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-palm-leaf/5 border-l-4 border-palm-leaf rounded-r-lg">
            <p className="text-sm text-text-secondary leading-relaxed mb-2">
              <strong>Program A and Program C are mathematically identical</strong>{" "}
              : both result in 200 saved / 400 dead. Programs B and D are also
              identical: both are a 1/3 gamble on saving everyone.
            </p>
            {didReverse ? (
              <p className="text-sm text-text-secondary leading-relaxed">
                Your preferences reversed between frames, just like 72% of
                Tversky and Kahneman&apos;s original participants. The gain
                frame pushed you toward the sure thing; the loss frame pushed you
                toward the gamble. Same information, different words, opposite
                decisions. That is the frame constructing your preference.
              </p>
            ) : (
              <p className="text-sm text-text-secondary leading-relaxed">
                You maintained consistent preferences across frames, unlike the
                majority. In Tversky and Kahneman&apos;s original study, ~72%
                chose A in the gain frame but ~78% chose D in the loss frame,
                reversing their preference based purely on word choice.
              </p>
            )}
          </div>

          <div className="mt-4 flex justify-center">
            <button
              onClick={() => {
                setPhase("scenario-a");
                setChoiceA(null);
                setChoiceB(null);
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

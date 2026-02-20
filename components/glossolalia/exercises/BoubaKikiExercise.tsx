"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function BoubaKikiExercise() {
  const [boubaChoice, setBoubaChoice] = useState<"left" | "right" | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Left = round blob, Right = jagged star
  const isCorrect = boubaChoice === "left";

  return (
    <div>
      <p className="text-sm text-text-secondary leading-relaxed mb-6">
        Look at the two shapes below. One is called <strong>&ldquo;bouba&rdquo;</strong> and
        the other is called <strong>&ldquo;kiki.&rdquo;</strong> Which is which?
      </p>

      {/* Shapes */}
      <div className="flex justify-center gap-6 md:gap-12 mb-6">
        <div className="text-center">
          <div className="w-28 h-28 md:w-36 md:h-36 flex items-center justify-center">
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
          <p className="text-xs text-text-muted mt-1">Shape 1</p>
        </div>

        <div className="text-center">
          <div className="w-28 h-28 md:w-36 md:h-36 flex items-center justify-center">
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
          <p className="text-xs text-text-muted mt-1">Shape 2</p>
        </div>
      </div>

      {/* Selection */}
      {!submitted && (
        <div className="space-y-3 mb-4">
          <p className="text-sm font-medium text-text-primary">
            Which shape is &ldquo;bouba&rdquo;?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setBoubaChoice("left")}
              className={cn(
                "flex-1 px-4 py-3 text-sm rounded-lg border transition-all min-h-[44px]",
                boubaChoice === "left"
                  ? "border-2 border-palm-leaf bg-palm-leaf/5 font-medium"
                  : "border-soft-linen-dark hover:border-palm-leaf/40 bg-white"
              )}
            >
              Shape 1 (round)
            </button>
            <button
              onClick={() => setBoubaChoice("right")}
              className={cn(
                "flex-1 px-4 py-3 text-sm rounded-lg border transition-all min-h-[44px]",
                boubaChoice === "right"
                  ? "border-2 border-palm-leaf bg-palm-leaf/5 font-medium"
                  : "border-soft-linen-dark hover:border-palm-leaf/40 bg-white"
              )}
            >
              Shape 2 (jagged)
            </button>
          </div>
        </div>
      )}

      {!submitted && boubaChoice && (
        <div className="flex justify-center">
          <button
            onClick={() => setSubmitted(true)}
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-palm-leaf rounded-lg hover:bg-palm-leaf-3 transition-colors min-h-[44px]"
          >
            Reveal
          </button>
        </div>
      )}

      {submitted && (
        <div className="space-y-4">
          <div className="p-4 bg-palm-leaf/5 border-l-4 border-palm-leaf rounded-r-lg">
            <p className="text-sm text-text-secondary leading-relaxed mb-2">
              {isCorrect ? (
                <>
                  You matched &ldquo;bouba&rdquo; to the round shape — just like{" "}
                  <strong>95-98% of people across all languages and cultures</strong>.
                </>
              ) : (
                <>
                  You matched differently than most.{" "}
                  <strong>95-98% of people across all languages and cultures</strong>{" "}
                  assign &ldquo;bouba&rdquo; to the round shape and &ldquo;kiki&rdquo; to the jagged one.
                </>
              )}
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              This mapping is present in toddlers as young as 2.5 years. It
              reflects real acoustic physics: round objects resonate at lower
              frequencies than angular objects, and your brain tracks these
              relationships pre-linguistically — before culture, before literacy,
              before language itself.
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => {
                setBoubaChoice(null);
                setSubmitted(false);
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

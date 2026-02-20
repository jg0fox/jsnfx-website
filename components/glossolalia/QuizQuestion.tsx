"use client";

import { cn } from "@/lib/utils";
import type { QuizQuestion as QuizQuestionType } from "@/types/glossolalia";

interface QuizQuestionProps {
  question: QuizQuestionType;
  selectedIndex: number | null;
  revealed: boolean;
  onSelect: (index: number) => void;
}

const optionLabels = ["a", "b", "c", "d"];

export function QuizQuestion({
  question,
  selectedIndex,
  revealed,
  onSelect,
}: QuizQuestionProps) {
  return (
    <div>
      <p className="text-xs font-medium text-palm-leaf-3 uppercase tracking-wide mb-2">
        {question.phenomenonTitle}
      </p>
      <p className="text-base font-display font-bold text-text-primary mb-4">
        {question.question}
      </p>

      <div className="grid gap-2">
        {question.options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const isCorrect = index === question.correctIndex;

          let optionStyle =
            "border border-soft-linen-dark hover:border-palm-leaf/50 bg-white";
          if (revealed) {
            if (isCorrect) {
              optionStyle = "border-2 border-green-600 bg-green-50";
            } else if (isSelected && !isCorrect) {
              optionStyle = "border-2 border-red-500 bg-red-50";
            } else {
              optionStyle = "border border-soft-linen-dark bg-white opacity-60";
            }
          } else if (isSelected) {
            optionStyle = "border-2 border-palm-leaf bg-palm-leaf/5";
          }

          return (
            <button
              key={index}
              onClick={() => !revealed && onSelect(index)}
              disabled={revealed}
              className={cn(
                "w-full text-left p-3 rounded-lg transition-all duration-150 min-h-[44px]",
                optionStyle,
                !revealed && "cursor-pointer"
              )}
            >
              <span className="flex items-start gap-2">
                <span className="text-xs font-mono font-bold text-text-muted mt-0.5 shrink-0">
                  {optionLabels[index]})
                </span>
                <span className="text-sm text-text-primary">{option}</span>
                {revealed && isCorrect && (
                  <span className="ml-auto text-green-600 shrink-0">✓</span>
                )}
                {revealed && isSelected && !isCorrect && (
                  <span className="ml-auto text-red-500 shrink-0">✗</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className="mt-4 p-3 bg-soft-linen-light border border-soft-linen-dark rounded-lg">
          <p className="text-sm text-text-secondary leading-relaxed">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

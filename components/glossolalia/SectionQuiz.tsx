"use client";

import type { QuizQuestion as QuizQuestionType, QuizState } from "@/types/glossolalia";
import { QuizQuestion } from "./QuizQuestion";
import { ProgressBar } from "./ProgressBar";

interface SectionQuizProps {
  tierId: string;
  tierTitle: string;
  questions: QuizQuestionType[];
  state: QuizState;
  onAnswer: (questionId: string, selectedIndex: number) => void;
  onNext: () => void;
  onReset: () => void;
}

export function SectionQuiz({
  tierId,
  tierTitle,
  questions,
  state,
  onAnswer,
  onNext,
  onReset,
}: SectionQuizProps) {
  const currentQuestion = questions[state.currentQuestionIndex];
  const isComplete =
    Object.keys(state.revealed).length === questions.length;
  const isLastQuestion =
    state.currentQuestionIndex === questions.length - 1;
  const currentRevealed = currentQuestion
    ? state.revealed[currentQuestion.id] ?? false
    : false;

  return (
    <section
      id={`quiz-${tierId}`}
      className="scroll-mt-32 lg:scroll-mt-16 bg-soft-linen-light border border-soft-linen-dark rounded-lg p-4 md:p-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg md:text-xl font-display font-bold text-text-primary">
          {tierTitle} quiz
        </h3>
        <div className="text-right">
          <span className="text-2xl font-display font-bold text-palm-leaf">
            {state.score}
          </span>
          <span className="text-sm text-text-muted">/{state.total}</span>
        </div>
      </div>

      <ProgressBar
        progress={
          Object.keys(state.revealed).length / questions.length
        }
        label={`Question ${state.currentQuestionIndex + 1} of ${questions.length}`}
        className="mb-6"
      />

      {isComplete ? (
        <div className="text-center py-8">
          <p className="text-4xl font-display font-bold text-palm-leaf mb-2">
            {state.score}/{state.total}
          </p>
          <p className="text-base text-text-secondary mb-6">
            {state.score === state.total
              ? "Perfect score."
              : state.score >= state.total * 0.8
                ? "Strong understanding."
                : state.score >= state.total * 0.6
                  ? "Decent grasp. Consider revisiting the sections you missed."
                  : "Worth another read through the material."}
          </p>
          <button
            onClick={onReset}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-palm-leaf-3 border border-palm-leaf/30 rounded-lg hover:bg-palm-leaf/5 transition-colors min-h-[44px]"
          >
            Retake quiz
          </button>
        </div>
      ) : (
        currentQuestion && (
          <div>
            <QuizQuestion
              question={currentQuestion}
              selectedIndex={state.answers[currentQuestion.id] ?? null}
              revealed={currentRevealed}
              onSelect={(index) => onAnswer(currentQuestion.id, index)}
            />

            {currentRevealed && !isLastQuestion && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={onNext}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-palm-leaf rounded-lg hover:bg-palm-leaf-3 transition-colors min-h-[44px]"
                >
                  Next question &rarr;
                </button>
              </div>
            )}

            {currentRevealed && isLastQuestion && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={onNext}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-palm-leaf rounded-lg hover:bg-palm-leaf-3 transition-colors min-h-[44px]"
                >
                  See results
                </button>
              </div>
            )}
          </div>
        )
      )}
    </section>
  );
}

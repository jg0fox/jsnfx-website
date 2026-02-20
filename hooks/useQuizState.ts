"use client";

import { useState, useEffect, useCallback } from "react";
import type { QuizQuestion, QuizState } from "@/types/glossolalia";

function createInitialState(questions: QuizQuestion[]): QuizState {
  return {
    currentQuestionIndex: 0,
    answers: {},
    revealed: {},
    score: 0,
    total: questions.length,
  };
}

export function useQuizState(tierId: string, questions: QuizQuestion[]) {
  const storageKey = `glossolalia-quiz-${tierId}`;

  const [state, setState] = useState<QuizState>(() => {
    if (typeof window === "undefined") return createInitialState(questions);
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved) as QuizState;
    } catch {}
    return createInitialState(questions);
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(state));
    } catch {}
  }, [state, storageKey]);

  const answer = useCallback(
    (questionId: string, selectedIndex: number) => {
      setState((prev) => {
        if (prev.revealed[questionId]) return prev;
        const question = questions.find((q) => q.id === questionId);
        const isCorrect = question?.correctIndex === selectedIndex;
        return {
          ...prev,
          answers: { ...prev.answers, [questionId]: selectedIndex },
          revealed: { ...prev.revealed, [questionId]: true },
          score: isCorrect ? prev.score + 1 : prev.score,
        };
      });
    },
    [questions]
  );

  const next = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentQuestionIndex: Math.min(
        prev.currentQuestionIndex + 1,
        questions.length - 1
      ),
    }));
  }, [questions.length]);

  const reset = useCallback(() => {
    setState(createInitialState(questions));
  }, [questions]);

  return { state, answer, next, reset };
}

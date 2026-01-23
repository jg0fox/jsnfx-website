'use client';

import { useRef, useCallback, useEffect } from 'react';
import {
  TextScrambler,
  TextScramblerOptions,
  scrambleSentences,
} from '@/lib/text-scrambler';

/**
 * React hook for text scramble animations
 */
export function useTextScramble(
  elementRef: React.RefObject<HTMLElement>,
  options?: TextScramblerOptions
) {
  const scramblerRef = useRef<TextScrambler | null>(null);

  // Initialize scrambler when element is available
  useEffect(() => {
    if (elementRef.current && !scramblerRef.current) {
      scramblerRef.current = new TextScrambler(elementRef.current, options);
    }

    return () => {
      scramblerRef.current?.cancel();
      scramblerRef.current = null;
    };
  }, [elementRef, options]);

  /**
   * Scramble to new text
   */
  const scrambleTo = useCallback(async (newText: string): Promise<void> => {
    if (!scramblerRef.current && elementRef.current) {
      scramblerRef.current = new TextScrambler(elementRef.current, options);
    }
    return scramblerRef.current?.setText(newText);
  }, [elementRef, options]);

  /**
   * Scramble with staggered reveal (left to right)
   */
  const scrambleStaggered = useCallback(
    async (newText: string, staggerAmount?: number): Promise<void> => {
      if (!scramblerRef.current && elementRef.current) {
        scramblerRef.current = new TextScrambler(elementRef.current, options);
      }
      return scramblerRef.current?.setTextStaggered(newText, staggerAmount);
    },
    [elementRef, options]
  );

  /**
   * Cancel current animation
   */
  const cancel = useCallback(() => {
    scramblerRef.current?.cancel();
  }, []);

  /**
   * Reset to original content
   */
  const reset = useCallback(() => {
    scramblerRef.current?.reset();
  }, []);

  /**
   * Check if currently animating
   */
  const isAnimating = useCallback(() => {
    return scramblerRef.current?.isAnimating() ?? false;
  }, []);

  return {
    scrambleTo,
    scrambleStaggered,
    cancel,
    reset,
    isAnimating,
  };
}

/**
 * Hook for scrambling sentences within a paragraph
 */
export function useSentenceScramble(
  elementRef: React.RefObject<HTMLElement>,
  options?: TextScramblerOptions & { delayBetween?: number }
) {
  const isAnimatingRef = useRef(false);

  const scrambleSentencesTo = useCallback(
    async (newText: string): Promise<void> => {
      if (!elementRef.current || isAnimatingRef.current) return;

      isAnimatingRef.current = true;
      try {
        await scrambleSentences(elementRef.current, newText, options);
      } finally {
        isAnimatingRef.current = false;
      }
    },
    [elementRef, options]
  );

  const isAnimating = useCallback(() => isAnimatingRef.current, []);

  return {
    scrambleSentencesTo,
    isAnimating,
  };
}

/**
 * Hook for managing multiple scramble animations
 */
export function useMultipleScramble() {
  const scramblers = useRef<Map<string, TextScrambler>>(new Map());

  /**
   * Register an element for scrambling
   */
  const register = useCallback(
    (id: string, element: HTMLElement, options?: TextScramblerOptions) => {
      if (!scramblers.current.has(id)) {
        scramblers.current.set(id, new TextScrambler(element, options));
      }
    },
    []
  );

  /**
   * Unregister an element
   */
  const unregister = useCallback((id: string) => {
    const scrambler = scramblers.current.get(id);
    scrambler?.cancel();
    scramblers.current.delete(id);
  }, []);

  /**
   * Scramble a specific element
   */
  const scramble = useCallback(async (id: string, newText: string): Promise<void> => {
    const scrambler = scramblers.current.get(id);
    if (scrambler) {
      await scrambler.setText(newText);
    }
  }, []);

  /**
   * Scramble multiple elements with staggered timing
   */
  const scrambleMultiple = useCallback(
    async (
      updates: Array<{ id: string; newText: string }>,
      delayBetween: number = 200
    ): Promise<void> => {
      for (let i = 0; i < updates.length; i++) {
        const { id, newText } = updates[i];
        const scrambler = scramblers.current.get(id);

        if (scrambler) {
          if (i > 0) {
            await new Promise((resolve) => setTimeout(resolve, delayBetween));
          }
          await scrambler.setText(newText);
        }
      }
    },
    []
  );

  /**
   * Cancel all animations
   */
  const cancelAll = useCallback(() => {
    scramblers.current.forEach((scrambler) => scrambler.cancel());
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      scramblers.current.forEach((scrambler) => scrambler.cancel());
      scramblers.current.clear();
    };
  }, []);

  return {
    register,
    unregister,
    scramble,
    scrambleMultiple,
    cancelAll,
  };
}

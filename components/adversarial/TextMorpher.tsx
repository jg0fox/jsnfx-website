'use client';

/**
 * TextMorpher - Animates text transitions with character-by-character morphing
 *
 * Creates a "living text" effect where content appears to shift and change
 * letter by letter, with characters scrambling through random values before
 * settling into their final form.
 */

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import {
  diffWords,
  diffChars,
  randomChar,
  getAnimationConfig,
  calculateDelay,
  type WordDiff,
  type AnimationConfig,
} from '@/lib/textDiff';

export interface TextMorpherProps {
  /** The text to display (current/target state) */
  text: string;
  /** Previous text (for diffing). If not provided, text appears without animation */
  previousText?: string;
  /** Transformation mode */
  mode?: 'expand' | 'rewrite';
  /** Rewrite level (1-3) */
  level?: 1 | 2 | 3;
  /** Callback when animation completes */
  onComplete?: () => void;
  /** Custom animation config override */
  animationConfig?: Partial<AnimationConfig>;
  /** Additional CSS classes */
  className?: string;
}

interface AnimatingWord {
  wordIndex: number;
  diff: WordDiff;
  currentText: string;
  targetText: string;
  charIndex: number;
  scrambleFrame: number;
  isComplete: boolean;
  startTime: number;
}

export function TextMorpher({
  text,
  previousText,
  mode = 'rewrite',
  level = 1,
  onComplete,
  animationConfig: customConfig,
  className = '',
}: TextMorpherProps) {
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | null>(null);
  const animatingWordsRef = useRef<Map<number, AnimatingWord>>(new Map());

  const config = useMemo(() => {
    const baseConfig = getAnimationConfig(mode, level);
    return { ...baseConfig, ...customConfig };
  }, [mode, level, customConfig]);

  const wordDiffs = useMemo(() => {
    if (!previousText || previousText === text) {
      return null;
    }
    return diffWords(previousText, text);
  }, [previousText, text]);

  // Initialize displayed words
  useEffect(() => {
    if (!wordDiffs) {
      // No animation needed - just display the text
      setDisplayedWords(text.split(/(\s+)/).filter((t) => t.length > 0));
      return;
    }

    // Start with previous text state
    const initialWords = wordDiffs.map((diff) => {
      if (diff.type === 'added') {
        return ''; // Will animate in
      }
      return diff.oldWord;
    });
    setDisplayedWords(initialWords);
  }, [wordDiffs, text]);

  // Animation loop
  const animate = useCallback(() => {
    if (!wordDiffs) return;

    const now = performance.now();
    let allComplete = true;
    const newDisplayedWords = [...displayedWords];

    wordDiffs.forEach((diff, wordIndex) => {
      if (diff.type === 'unchanged') {
        newDisplayedWords[wordIndex] = diff.newWord;
        return;
      }

      let animWord = animatingWordsRef.current.get(wordIndex);

      // Initialize animation for this word if needed
      if (!animWord) {
        const delay = calculateDelay(
          wordIndex,
          wordDiffs.length,
          config.staggerDelay
        );

        // Add chaotic jitter for L3
        const chaoticDelay = config.chaotic
          ? delay + Math.random() * 200 - 100
          : delay;

        animWord = {
          wordIndex,
          diff,
          currentText: diff.oldWord || '',
          targetText: diff.newWord || '',
          charIndex: 0,
          scrambleFrame: 0,
          isComplete: false,
          startTime: now + Math.max(0, chaoticDelay),
        };
        animatingWordsRef.current.set(wordIndex, animWord);
      }

      // Check if we should start animating this word
      if (now < animWord.startTime) {
        newDisplayedWords[wordIndex] = animWord.currentText;
        allComplete = false;
        return;
      }

      if (animWord.isComplete) {
        newDisplayedWords[wordIndex] = animWord.targetText;
        return;
      }

      allComplete = false;

      // Animate character by character
      const elapsed = now - animWord.startTime;
      const charDuration = config.scrambleDuration / Math.max(1, animWord.targetText.length);
      const currentCharIndex = Math.floor(elapsed / charDuration);

      if (currentCharIndex >= animWord.targetText.length && diff.type !== 'removed') {
        // Animation complete for this word
        animWord.isComplete = true;
        animWord.currentText = animWord.targetText;
        newDisplayedWords[wordIndex] = animWord.targetText;
        return;
      }

      if (diff.type === 'removed') {
        // For removed words, fade out character by character
        const charsToRemove = Math.min(currentCharIndex, animWord.currentText.length);
        animWord.currentText = animWord.currentText.slice(0, -charsToRemove || undefined);
        if (animWord.currentText.length === 0) {
          animWord.isComplete = true;
        }
        newDisplayedWords[wordIndex] = animWord.currentText;
        return;
      }

      // Build the current display text
      let displayText = '';
      const charDiffs = diffChars(diff.oldWord || '', diff.newWord || '');

      for (let i = 0; i < animWord.targetText.length; i++) {
        if (i < currentCharIndex) {
          // This character is settled
          displayText += animWord.targetText[i];
        } else if (i === currentCharIndex) {
          // This character is currently scrambling
          const scrambleProgress = (elapsed % charDuration) / charDuration;
          const scrambleStep = Math.floor(scrambleProgress * config.scrambleSteps);

          if (scrambleStep >= config.scrambleSteps - 1) {
            displayText += animWord.targetText[i];
          } else {
            // Show scramble character
            displayText += config.chaotic
              ? randomChar()
              : charDiffs[i]?.oldChar || randomChar();
          }
        } else {
          // This character hasn't started animating
          const originalChar = diff.oldWord?.[i] || '';
          if (originalChar) {
            displayText += originalChar;
          } else if (config.chaotic) {
            // For chaotic mode, show random chars for upcoming positions
            displayText += Math.random() > 0.7 ? randomChar() : ' ';
          }
        }
      }

      animWord.currentText = displayText;
      newDisplayedWords[wordIndex] = displayText;
    });

    setDisplayedWords(newDisplayedWords);

    if (allComplete) {
      setIsAnimating(false);
      animatingWordsRef.current.clear();
      onComplete?.();
    } else {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [wordDiffs, displayedWords, config, onComplete]);

  // Start animation when diffs change
  useEffect(() => {
    if (!wordDiffs || wordDiffs.every((d) => d.type === 'unchanged')) {
      return;
    }

    setIsAnimating(true);
    animatingWordsRef.current.clear();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [wordDiffs]); // eslint-disable-line react-hooks/exhaustive-deps

  // Continue animation loop
  useEffect(() => {
    if (isAnimating && wordDiffs) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, animate, wordDiffs]);

  // Compute CSS classes for animation intensity
  const intensityClass = useMemo(() => {
    if (config.intensity >= 0.8) return 'text-morph-intense';
    if (config.intensity >= 0.5) return 'text-morph-moderate';
    return 'text-morph-subtle';
  }, [config.intensity]);

  return (
    <span
      className={`text-morpher ${intensityClass} ${className}`}
      data-animating={isAnimating}
      data-mode={mode}
      data-level={level}
    >
      {displayedWords.map((word, i) => {
        const diff = wordDiffs?.[i];
        const isChanging =
          diff && diff.type !== 'unchanged' && !animatingWordsRef.current.get(i)?.isComplete;

        return (
          <span
            key={i}
            className={`morph-word ${isChanging ? 'morphing' : ''}`}
            data-diff-type={diff?.type || 'none'}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
}

/**
 * Hook for using text morphing in custom components
 */
export function useTextMorph(
  text: string,
  previousText: string | undefined,
  mode: 'expand' | 'rewrite' = 'rewrite',
  level: 1 | 2 | 3 = 1
) {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!previousText || previousText === text) {
      setDisplayText(text);
      return;
    }

    // Animation logic would go here for non-component usage
    setDisplayText(text);
  }, [text, previousText]);

  return { displayText, isAnimating };
}

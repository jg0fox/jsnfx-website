'use client';

/**
 * ContentTransformer - Orchestrates adversarial content transformations
 *
 * Refactored to use static pre-written content with scramble animations.
 * No API calls, no evaluation - just instant content swaps with visual effects.
 */

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useBehavior, useRegisterTransform } from '@/components/behavior';
import { useChunks } from './ViewportChunker';
import { TextScrambler } from '@/lib/text-scrambler';
import { generateSessionId } from '@/lib/session';
import type { ContentChunk } from '@/types/transformation';
import type { Mode, RewriteLevel } from '@/types/behavior';

export interface ContentTransformerProps {
  /** Enable/disable transformations */
  enabled?: boolean;
}

/**
 * Static content response from API
 */
interface StaticContentResponse {
  path: string;
  level: RewriteLevel;
  original: string;
  rewritten: string;
  metadata: {
    title: string;
    page_type: string;
  };
}

/**
 * Cached content per route and level
 */
interface ContentCache {
  [routeAndLevel: string]: {
    contentMap: Map<string, string>;
    fetchedAt: number;
  };
}

export function ContentTransformer({ enabled = true }: ContentTransformerProps) {
  const pathname = usePathname();
  const { state, thresholds } = useBehavior();
  const { getTransformableChunks, updateChunkContent, chunks } = useChunks();
  const registerTransform = useRegisterTransform();

  const [sessionId] = useState(() => generateSessionId());
  const [isTransforming, setIsTransforming] = useState(false);

  const lastModeRef = useRef<Mode>('NEUTRAL');
  const lastLevelRef = useRef<RewriteLevel>(1);
  const lastRewriteTimeRef = useRef<number>(0);
  const rewriteIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const transformedChunksRef = useRef<Set<string>>(new Set());
  const contentCacheRef = useRef<ContentCache>({});
  const scramblerMapRef = useRef<Map<string, TextScrambler>>(new Map());

  /**
   * Fetch static content for current route and level
   */
  const fetchStaticContent = useCallback(
    async (level: RewriteLevel): Promise<Map<string, string> | null> => {
      const cacheKey = `${pathname}:${level}`;

      // Check cache first (valid for 5 minutes)
      const cached = contentCacheRef.current[cacheKey];
      if (cached && Date.now() - cached.fetchedAt < 5 * 60 * 1000) {
        return cached.contentMap;
      }

      try {
        const response = await fetch(
          `/api/static-content?path=${encodeURIComponent(pathname)}&level=${level}`
        );

        if (!response.ok) {
          console.warn(`[Transform] No static content for ${pathname} at level ${level}`);
          return null;
        }

        const data: StaticContentResponse = await response.json();

        // Parse content into sentences/sections and create mapping
        const contentMap = createContentMap(data.original, data.rewritten);

        // Cache the result
        contentCacheRef.current[cacheKey] = {
          contentMap,
          fetchedAt: Date.now(),
        };

        return contentMap;
      } catch (error) {
        console.error('[Transform] Failed to fetch static content:', error);
        return null;
      }
    },
    [pathname]
  );

  /**
   * Create a mapping from original text segments to rewritten versions
   * Uses fuzzy matching to handle minor variations
   */
  const createContentMap = useCallback(
    (original: string, rewritten: string): Map<string, string> => {
      const map = new Map<string, string>();

      // Split both into paragraphs/sections
      const originalSections = parseSections(original);
      const rewrittenSections = parseSections(rewritten);

      // Map by position (sections should align)
      for (let i = 0; i < originalSections.length; i++) {
        const origSection = originalSections[i];
        const rewrittenSection = rewrittenSections[i];

        if (origSection && rewrittenSection) {
          // Normalize whitespace for matching
          const normalizedOrig = normalizeText(origSection);
          map.set(normalizedOrig, rewrittenSection);

          // Also map individual sentences within sections
          const origSentences = splitSentences(origSection);
          const rewrittenSentences = splitSentences(rewrittenSection);

          for (let j = 0; j < origSentences.length; j++) {
            if (origSentences[j] && rewrittenSentences[j]) {
              const normalizedSentence = normalizeText(origSentences[j]);
              map.set(normalizedSentence, rewrittenSentences[j]);
            }
          }
        }
      }

      return map;
    },
    []
  );

  /**
   * Parse content into sections (paragraphs, headings, list items)
   */
  const parseSections = (content: string): string[] => {
    // Split on double newlines or markdown section markers
    return content
      .split(/\n\n+|(?=^#{1,6}\s)/m)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  };

  /**
   * Split text into sentences
   */
  const splitSentences = (text: string): string[] => {
    return text
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  };

  /**
   * Normalize text for matching (lowercase, collapse whitespace)
   */
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s]/g, '')
      .trim();
  };

  /**
   * Find matching rewritten content for a chunk
   */
  const findRewrittenContent = useCallback(
    (chunkText: string, contentMap: Map<string, string>): string | null => {
      const normalizedChunk = normalizeText(chunkText);

      // Direct match
      if (contentMap.has(normalizedChunk)) {
        return contentMap.get(normalizedChunk)!;
      }

      // Fuzzy match - try to find content that contains most of the chunk
      for (const [origKey, rewritten] of contentMap.entries()) {
        // Check if original contains chunk or vice versa
        if (origKey.includes(normalizedChunk) || normalizedChunk.includes(origKey)) {
          return rewritten;
        }
      }

      // Try matching by significant words
      const chunkWords = new Set(normalizedChunk.split(' ').filter((w) => w.length > 4));
      let bestMatch: { key: string; score: number; rewritten: string } | null = null;

      for (const [origKey, rewritten] of contentMap.entries()) {
        const origWords = new Set(origKey.split(' ').filter((w) => w.length > 4));
        const intersection = [...chunkWords].filter((w) => origWords.has(w));
        const score = intersection.length / Math.max(chunkWords.size, origWords.size);

        if (score > 0.5 && (!bestMatch || score > bestMatch.score)) {
          bestMatch = { key: origKey, score, rewritten };
        }
      }

      return bestMatch?.rewritten ?? null;
    },
    []
  );

  /**
   * Get or create scrambler for an element
   */
  const getScrambler = useCallback((chunkId: string, element: HTMLElement): TextScrambler => {
    let scrambler = scramblerMapRef.current.get(chunkId);
    if (!scrambler) {
      scrambler = new TextScrambler(element, { speed: 1.2 });
      scramblerMapRef.current.set(chunkId, scrambler);
    }
    return scrambler;
  }, []);

  /**
   * Apply transformation with scramble animation
   */
  const applyTransformation = useCallback(
    async (chunk: ContentChunk, level: RewriteLevel) => {
      const startTime = Date.now();

      // Validate element is still in DOM
      if (!chunk.element.isConnected) {
        console.warn(`[Transform] Skipped: element no longer in DOM (${chunk.id})`);
        return;
      }

      // Get static content for this level
      const contentMap = await fetchStaticContent(level);
      if (!contentMap) {
        console.warn(`[Transform] No content map available for level ${level}`);
        return;
      }

      // Find matching rewritten content
      const currentText = chunk.element.innerText;
      const rewrittenContent = findRewrittenContent(currentText, contentMap);

      if (!rewrittenContent || rewrittenContent === currentText) {
        console.log(`[Transform] No change needed for chunk ${chunk.id}`);
        return;
      }

      // Apply scramble animation
      const scrambler = getScrambler(chunk.id, chunk.element);

      // Mark element as transforming
      chunk.element.classList.add('adversarial-chunk', 'adversarial-transforming');
      chunk.element.setAttribute('data-transform-level', level.toString());

      try {
        // Scramble to new content
        await scrambler.setTextStaggered(rewrittenContent, 1.5);

        const latency = Date.now() - startTime;

        // Update chunk state
        updateChunkContent(chunk.id, rewrittenContent, 'rewrite', level);

        // Register transform for debug panel
        registerTransform({
          chunkId: chunk.id,
          type: 'rewrite',
          level,
          latency,
        });

        console.log(
          `[Transform] ${chunk.id} → L${level} (${latency}ms, scramble animation)`
        );
      } finally {
        // Clear transforming state
        chunk.element.classList.remove('adversarial-transforming');
      }
    },
    [fetchStaticContent, findRewrittenContent, getScrambler, updateChunkContent, registerTransform]
  );

  /**
   * Select chunks to transform (prefers less-transformed chunks)
   */
  const selectChunksToTransform = useCallback(
    (count: number = 2): ContentChunk[] => {
      const allChunks = getTransformableChunks();

      if (allChunks.length === 0) {
        return [];
      }

      // Filter out chunks we've already transformed this session
      let available = allChunks.filter(
        (c) => !transformedChunksRef.current.has(c.id)
      );

      if (available.length === 0) {
        // Reset and allow re-transformation
        transformedChunksRef.current.clear();
        available = allChunks;
      }

      // Sort by transform count (prefer less-transformed)
      available.sort((a, b) => a.transformCount - b.transformCount);

      return available.slice(0, count);
    },
    [getTransformableChunks]
  );

  /**
   * Handle REWRITE mode - transform visible chunks at current level
   */
  const handleRewriteMode = useCallback(async () => {
    if (isTransforming) return;

    const now = Date.now();
    const timeSinceLastRewrite = now - lastRewriteTimeRef.current;

    // Check interval between transforms
    if (timeSinceLastRewrite < thresholds.rewriteInterval) {
      return;
    }

    const chunksToTransform = selectChunksToTransform(2);
    if (chunksToTransform.length === 0) return;

    setIsTransforming(true);
    lastRewriteTimeRef.current = now;

    // Mark chunks as transformed this session
    chunksToTransform.forEach((c) => transformedChunksRef.current.add(c.id));

    try {
      // Transform chunks with staggered timing for "spreading corruption" effect
      for (let i = 0; i < chunksToTransform.length; i++) {
        const chunk = chunksToTransform[i];

        if (i > 0) {
          // Delay between chunks (200-500ms)
          await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));
        }

        await applyTransformation(chunk, state.rewriteLevel);
      }
    } finally {
      setIsTransforming(false);
    }
  }, [
    isTransforming,
    selectChunksToTransform,
    applyTransformation,
    state.rewriteLevel,
    thresholds.rewriteInterval,
  ]);

  /**
   * Handle level changes - immediately transform visible content to new level
   */
  useEffect(() => {
    if (!enabled || state.mode !== 'REWRITE') return;

    const currentLevel = state.rewriteLevel;
    const previousLevel = lastLevelRef.current;

    if (currentLevel !== previousLevel) {
      console.log(`[Transform] Level change: L${previousLevel} → L${currentLevel}`);
      lastLevelRef.current = currentLevel;

      // Immediately trigger transformation at new level
      handleRewriteMode();
    }
  }, [enabled, state.mode, state.rewriteLevel, handleRewriteMode]);

  /**
   * Handle mode changes
   */
  useEffect(() => {
    if (!enabled) return;

    const currentMode = state.mode;
    const previousMode = lastModeRef.current;

    if (currentMode !== previousMode) {
      console.log(`[ContentTransformer] Mode: ${previousMode} → ${currentMode}`);

      // Clear any existing rewrite interval
      if (rewriteIntervalRef.current) {
        clearInterval(rewriteIntervalRef.current);
        rewriteIntervalRef.current = null;
      }

      lastModeRef.current = currentMode;
    }

    // Handle REWRITE mode
    if (currentMode === 'REWRITE') {
      if (!rewriteIntervalRef.current) {
        // Initial rewrite
        handleRewriteMode();

        // Set up interval for continued rewrites
        rewriteIntervalRef.current = setInterval(() => {
          handleRewriteMode();
        }, thresholds.rewriteInterval);
      }
    }

    return () => {
      if (rewriteIntervalRef.current) {
        clearInterval(rewriteIntervalRef.current);
        rewriteIntervalRef.current = null;
      }
    };
  }, [enabled, state.mode, handleRewriteMode, thresholds.rewriteInterval]);

  /**
   * Cleanup scramblers on unmount
   */
  useEffect(() => {
    return () => {
      scramblerMapRef.current.forEach((scrambler) => scrambler.cancel());
      scramblerMapRef.current.clear();
    };
  }, []);

  /**
   * Cleanup orphaned transforming states periodically
   */
  useEffect(() => {
    if (!enabled) return;

    const cleanup = () => {
      const transformingElements = document.querySelectorAll('.adversarial-transforming');
      transformingElements.forEach((el) => {
        if (el instanceof HTMLElement) {
          // Clear stuck states after 10 seconds
          el.classList.remove('adversarial-transforming');
        }
      });
    };

    const interval = setInterval(cleanup, 10000);
    return () => clearInterval(interval);
  }, [enabled]);

  // This component doesn't render anything - it just orchestrates
  return null;
}

'use client';

/**
 * ViewportChunker - Identifies and tracks transformable content chunks
 *
 * Uses Intersection Observer to track which content elements are visible
 * in the viewport and manages their transformation state.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { usePathname } from 'next/navigation';
import type { ContentChunk, ChunkState } from '@/types/transformation';
import type { RewriteLevel } from '@/types/behavior';
import { DEFAULT_CHUNKING_CONFIG } from '@/types/transformation';
import { useUpdateChunkCounts, useRegisterContentReset } from '@/components/behavior';
import { storeTransformedContent, getStoredTransform, clearStoredTransforms } from '@/lib/session';

export interface ChunkContextValue {
  /** All tracked chunks */
  chunks: Map<string, ContentChunk>;
  /** IDs of currently visible chunks */
  visibleChunkIds: Set<string>;
  /** Register an element as a chunk */
  registerChunk: (element: HTMLElement) => string | null;
  /** Unregister a chunk */
  unregisterChunk: (id: string) => void;
  /** Get a specific chunk by ID */
  getChunk: (id: string) => ContentChunk | undefined;
  /** Update chunk content after transformation */
  updateChunkContent: (id: string, newContent: string, type: 'expand' | 'rewrite', level?: RewriteLevel) => void;
  /** Get all visible chunks that can be transformed */
  getTransformableChunks: () => ContentChunk[];
  /** Total transforms this session */
  totalTransforms: number;
}

const ChunkContext = createContext<ChunkContextValue | null>(null);

export function useChunks(): ChunkContextValue {
  const context = useContext(ChunkContext);
  if (!context) {
    throw new Error('useChunks must be used within a ViewportChunker');
  }
  return context;
}

export interface ViewportChunkerProps {
  children: React.ReactNode;
  /** Content container selector to observe */
  containerSelector?: string;
}

export function ViewportChunker({
  children,
  containerSelector = '#main-content',
}: ViewportChunkerProps) {
  const [chunks, setChunks] = useState<Map<string, ContentChunk>>(new Map());
  const [visibleChunkIds, setVisibleChunkIds] = useState<Set<string>>(new Set());
  const [totalTransforms, setTotalTransforms] = useState(0);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const chunkIdCounter = useRef(0);
  const elementToIdMap = useRef<WeakMap<HTMLElement, string>>(new WeakMap());

  const pathname = usePathname();
  const updateChunkCounts = useUpdateChunkCounts();
  const registerContentReset = useRegisterContentReset();

  // Count words in text
  const countWords = useCallback((text: string): number => {
    return text.trim().split(/\s+/).filter((w) => w.length > 0).length;
  }, []);

  // Check if element should be excluded
  const shouldExclude = useCallback((element: HTMLElement): boolean => {
    const excludeSelectors = DEFAULT_CHUNKING_CONFIG.excludeSelectors;

    // Check if element matches exclude selectors
    for (const selector of excludeSelectors) {
      if (element.matches(selector)) return true;
      if (element.closest(selector)) return true;
    }

    // Check if element has no meaningful text content
    const text = element.textContent?.trim() || '';
    if (text.length < 10) return true;

    return false;
  }, []);

  // Generate unique chunk ID
  const generateChunkId = useCallback((element: HTMLElement): string => {
    const tagName = element.tagName.toLowerCase();
    const index = chunkIdCounter.current++;
    return `chunk-${tagName}-${index.toString().padStart(4, '0')}`;
  }, []);

  // Register a new chunk
  const registerChunk = useCallback(
    (element: HTMLElement): string | null => {
      if (shouldExclude(element)) return null;

      // Check if already registered
      const existingId = elementToIdMap.current.get(element);
      if (existingId) return existingId;

      const id = generateChunkId(element);
      const content = element.innerHTML;
      const wordCount = countWords(element.textContent || '');

      // Check for stored transformation from previous navigation
      const storedTransform = getStoredTransform(pathname, content);

      const chunk: ContentChunk = {
        id,
        element,
        baseContent: content,
        currentContent: storedTransform?.transformedContent || content,
        transformCount: storedTransform?.transformCount || 0,
        lastTransformType: storedTransform?.lastTransformType || null,
        lastRewriteLevel: storedTransform?.lastRewriteLevel || null,
        lastTransformTime: storedTransform ? Date.now() : null,
        isVisible: false,
        wordCount,
      };

      // If there's a stored transform, apply it to the DOM
      if (storedTransform?.transformedContent) {
        element.innerHTML = storedTransform.transformedContent;
      }

      elementToIdMap.current.set(element, id);

      setChunks((prev) => {
        const next = new Map(prev);
        next.set(id, chunk);
        return next;
      });

      // Start observing
      observerRef.current?.observe(element);

      return id;
    },
    [shouldExclude, generateChunkId, countWords, pathname]
  );

  // Unregister a chunk
  const unregisterChunk = useCallback((id: string) => {
    setChunks((prev) => {
      const chunk = prev.get(id);
      if (chunk) {
        observerRef.current?.unobserve(chunk.element);
        elementToIdMap.current.delete(chunk.element);
      }
      const next = new Map(prev);
      next.delete(id);
      return next;
    });

    setVisibleChunkIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  // Get a specific chunk
  const getChunk = useCallback(
    (id: string): ContentChunk | undefined => {
      return chunks.get(id);
    },
    [chunks]
  );

  // Update chunk after transformation
  const updateChunkContent = useCallback(
    (
      id: string,
      newContent: string,
      type: 'expand' | 'rewrite',
      level?: RewriteLevel
    ) => {
      setChunks((prev) => {
        const chunk = prev.get(id);
        if (!chunk) return prev;

        const newTransformCount = chunk.transformCount + 1;
        const newLevel = type === 'rewrite' ? level ?? null : null;

        // Store transform for persistence across navigation
        storeTransformedContent(
          pathname,
          chunk.baseContent,
          newContent,
          newTransformCount,
          type,
          newLevel
        );

        const next = new Map(prev);
        next.set(id, {
          ...chunk,
          currentContent: newContent,
          transformCount: newTransformCount,
          lastTransformType: type,
          lastRewriteLevel: newLevel,
          lastTransformTime: Date.now(),
          wordCount: countWords(newContent.replace(/<[^>]*>/g, '')),
        });
        return next;
      });

      setTotalTransforms((prev) => prev + 1);
    },
    [countWords, pathname]
  );

  // Get transformable visible chunks
  const getTransformableChunks = useCallback((): ContentChunk[] => {
    const result: ContentChunk[] = [];

    visibleChunkIds.forEach((id) => {
      const chunk = chunks.get(id);
      if (chunk && chunk.wordCount >= 10) {
        result.push(chunk);
      }
    });

    return result;
  }, [chunks, visibleChunkIds]);

  // Reset all content to original state
  const resetAllContent = useCallback(() => {
    setChunks((prevChunks) => {
      const nextChunks = new Map<string, ContentChunk>();

      prevChunks.forEach((chunk, id) => {
        // Restore original content to DOM
        if (chunk.element.isConnected) {
          chunk.element.innerHTML = chunk.baseContent;
        }

        // Reset chunk state
        nextChunks.set(id, {
          ...chunk,
          currentContent: chunk.baseContent,
          transformCount: 0,
          lastTransformType: null,
          lastRewriteLevel: null,
          lastTransformTime: null,
        });
      });

      return nextChunks;
    });

    // Clear stored transforms from session storage
    clearStoredTransforms();
    setTotalTransforms(0);

    console.log('[ViewportChunker] All content reset to original');
  }, []);

  // Register reset function with behavior context
  useEffect(() => {
    registerContentReset(resetAllContent);
  }, [registerContentReset, resetAllContent]);

  // Set up Intersection Observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Batch all visibility updates
        const visibilityChanges: Map<string, boolean> = new Map();

        entries.forEach((entry) => {
          const id = elementToIdMap.current.get(entry.target as HTMLElement);
          if (id) {
            visibilityChanges.set(id, entry.isIntersecting);
          }
        });

        if (visibilityChanges.size === 0) return;

        // Update visible IDs in one batch
        setVisibleChunkIds((prev) => {
          const next = new Set(prev);
          visibilityChanges.forEach((isVisible, id) => {
            if (isVisible) {
              next.add(id);
            } else {
              next.delete(id);
            }
          });
          return next;
        });

        // Update chunk visibility in one batch
        setChunks((prevChunks) => {
          let hasChanges = false;
          const nextChunks = new Map(prevChunks);

          visibilityChanges.forEach((isVisible, id) => {
            const chunk = nextChunks.get(id);
            if (chunk && chunk.isVisible !== isVisible) {
              hasChanges = true;
              nextChunks.set(id, { ...chunk, isVisible });
            }
          });

          return hasChanges ? nextChunks : prevChunks;
        });
      },
      {
        root: null,
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  // Auto-discover chunks in the content container
  useEffect(() => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const discoverChunks = () => {
      const selectors = DEFAULT_CHUNKING_CONFIG.chunkSelectors.join(', ');
      const elements = container.querySelectorAll(selectors);

      elements.forEach((element) => {
        if (element instanceof HTMLElement) {
          registerChunk(element);
        }
      });
    };

    // Initial discovery
    discoverChunks();

    // Debounced mutation observer to prevent too frequent discovery
    let debounceTimeout: NodeJS.Timeout | null = null;
    const debouncedDiscover = () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
      debounceTimeout = setTimeout(discoverChunks, 100);
    };

    // Watch for DOM changes
    const mutationObserver = new MutationObserver(debouncedDiscover);

    mutationObserver.observe(container, {
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [containerSelector, registerChunk]);

  // Update debug panel with chunk counts
  useEffect(() => {
    const transformedCount = Array.from(chunks.values()).filter(
      (c) => c.transformCount > 0
    ).length;
    updateChunkCounts(visibleChunkIds.size, transformedCount);
  }, [chunks, visibleChunkIds, updateChunkCounts]);

  const contextValue: ChunkContextValue = useMemo(
    () => ({
      chunks,
      visibleChunkIds,
      registerChunk,
      unregisterChunk,
      getChunk,
      updateChunkContent,
      getTransformableChunks,
      totalTransforms,
    }),
    [
      chunks,
      visibleChunkIds,
      registerChunk,
      unregisterChunk,
      getChunk,
      updateChunkContent,
      getTransformableChunks,
      totalTransforms,
    ]
  );

  return (
    <ChunkContext.Provider value={contextValue}>
      {children}
    </ChunkContext.Provider>
  );
}

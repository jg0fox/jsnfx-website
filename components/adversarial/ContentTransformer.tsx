'use client';

/**
 * ContentTransformer - Orchestrates adversarial content transformations
 *
 * Listens for mode changes, selects chunks to transform, calls the API,
 * and applies transformations with animated text morphing.
 * Also handles batch collection and evaluation submission.
 */

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useBehavior, useRegisterTransform, useUpdateBatchInfo } from '@/components/behavior';
import { useChunks } from './ViewportChunker';
import { getAnimationConfig } from '@/lib/textDiff';
import {
  generateSessionId,
  generateBatchId,
  createVisitorMetadata,
  checkBatchTrigger,
  summarizeBehaviorSequence,
} from '@/lib/session';
import type { ContentChunk } from '@/types/transformation';
import type { Mode, RewriteLevel } from '@/types/behavior';
import type { TransformationRecord, EvaluationBatch, VisitorMetadata } from '@/types/evaluation';

export interface ContentTransformerProps {
  /** Enable/disable transformations */
  enabled?: boolean;
}

export function ContentTransformer({ enabled = true }: ContentTransformerProps) {
  const { state, thresholds, events } = useBehavior();
  const { getTransformableChunks, updateChunkContent } = useChunks();
  const registerTransform = useRegisterTransform();
  const updateBatchInfo = useUpdateBatchInfo();

  const [sessionId] = useState(() => generateSessionId());
  const [isTransforming, setIsTransforming] = useState(false);

  const lastModeRef = useRef<Mode>('NEUTRAL');
  const lastRewriteTimeRef = useRef<number>(0);
  const rewriteIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const transformedChunksThisCycleRef = useRef<Set<string>>(new Set());

  // Batch collection state
  const transformationRecordsRef = useRef<TransformationRecord[]>([]);
  const lastEvaluationTimeRef = useRef<number>(Date.now());
  const lastEventIndexRef = useRef<number>(0); // Track events sent in last batch
  const visitorMetadataRef = useRef<VisitorMetadata | null>(null);
  const batchCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Initialize visitor metadata
   */
  useEffect(() => {
    if (typeof window !== 'undefined' && !visitorMetadataRef.current) {
      const partialMetadata = createVisitorMetadata();
      // Fill in placeholder values for IP/location (would be filled server-side)
      visitorMetadataRef.current = {
        ip: 'client',
        location: { city: 'Unknown', region: 'Unknown', country: 'Unknown' },
        ...partialMetadata,
      };
    }
  }, []);

  /**
   * Submit evaluation batch
   */
  const submitEvaluationBatch = useCallback(
    async (trigger: 'time_elapsed' | 'transform_count' | 'session_end') => {
      const records = transformationRecordsRef.current;

      if (records.length === 0) {
        console.log('[Batch] No transformations to evaluate');
        return;
      }

      // Only send events since last batch (not full history) to reduce tokens
      const eventsSinceLastBatch = events.slice(lastEventIndexRef.current);
      lastEventIndexRef.current = events.length;

      // Summarize behavior events for token efficiency
      // This reduces hundreds of scroll events to ~20-50 summary items
      const behaviorSummary = summarizeBehaviorSequence(eventsSinceLastBatch);

      const batch = {
        sessionId,
        batchId: generateBatchId(),
        timestamp: new Date().toISOString(),
        visitor: visitorMetadataRef.current || {
          ip: 'unknown',
          location: { city: 'Unknown', region: 'Unknown', country: 'Unknown' },
          device: { type: 'unknown', browser: 'unknown', os: 'unknown', viewport: { width: 0, height: 0 } },
          referrer: null,
          localTime: new Date().toISOString(),
        },
        // Send summarized behavior instead of raw events
        behaviorSummary,
        transformations: records,
      };

      console.log(`[Batch] Submitting batch (${trigger}): ${records.length} transforms, ${eventsSinceLastBatch.length} events -> summarized`);

      try {
        const response = await fetch('/api/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ batch }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(
            `[Batch] Evaluation complete: ${data.report?.batchSummary?.passed ? 'PASSED' : 'FAILED'}`
          );
        } else {
          console.error('[Batch] Evaluation failed:', response.status);
        }
      } catch (error) {
        console.error('[Batch] Evaluation error:', error);
      }

      // Reset batch state
      transformationRecordsRef.current = [];
      lastEvaluationTimeRef.current = Date.now();
    },
    [sessionId, events]
  );

  /**
   * Check if batch should be triggered
   */
  const checkAndTriggerBatch = useCallback(() => {
    const transformsSinceLastEval = transformationRecordsRef.current.length;
    const timeSinceLastEval = Date.now() - lastEvaluationTimeRef.current;

    const { shouldTrigger, reason } = checkBatchTrigger(
      transformsSinceLastEval,
      timeSinceLastEval,
      false
    );

    // Update debug panel
    updateBatchInfo(transformsSinceLastEval, Math.max(0, 300 - timeSinceLastEval / 1000));

    if (shouldTrigger && reason) {
      submitEvaluationBatch(reason);
    }
  }, [submitEvaluationBatch, updateBatchInfo]);

  /**
   * Set up batch check interval
   */
  useEffect(() => {
    if (!enabled) return;

    // Check every 5 seconds
    batchCheckIntervalRef.current = setInterval(() => {
      checkAndTriggerBatch();
    }, 5000);

    return () => {
      if (batchCheckIntervalRef.current) {
        clearInterval(batchCheckIntervalRef.current);
      }
    };
  }, [enabled, checkAndTriggerBatch]);

  /**
   * Cleanup orphaned loading states periodically
   * This catches edge cases where loading state wasn't properly cleared
   */
  useEffect(() => {
    if (!enabled) return;

    const cleanupOrphanedLoadingStates = () => {
      const loadingElements = document.querySelectorAll('.adversarial-loading');
      loadingElements.forEach((el) => {
        if (el instanceof HTMLElement) {
          // If element has been loading for more than 15 seconds, clear it
          const transformingAttr = el.getAttribute('data-transforming');
          if (transformingAttr === 'true') {
            console.warn('[Transform] Clearing orphaned loading state');
            el.classList.remove('adversarial-loading');
            el.removeAttribute('data-transforming');
            el.removeAttribute('data-transform-type');
            el.style.opacity = '1';
          }
        }
      });
    };

    // Run cleanup every 10 seconds
    const cleanupInterval = setInterval(cleanupOrphanedLoadingStates, 10000);

    return () => {
      clearInterval(cleanupInterval);
    };
  }, [enabled]);

  /**
   * Handle session end (page unload)
   */
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = () => {
      if (transformationRecordsRef.current.length > 0) {
        // Summarize behavior events for token efficiency
        const behaviorSummary = summarizeBehaviorSequence(events);

        // Use sendBeacon for reliable delivery on page unload
        const batch = {
          sessionId,
          batchId: generateBatchId(),
          timestamp: new Date().toISOString(),
          visitor: visitorMetadataRef.current || {
            ip: 'unknown',
            location: { city: 'Unknown', region: 'Unknown', country: 'Unknown' },
            device: { type: 'unknown', browser: 'unknown', os: 'unknown', viewport: { width: 0, height: 0 } },
            referrer: null,
            localTime: new Date().toISOString(),
          },
          behaviorSummary,
          transformations: transformationRecordsRef.current,
        };

        navigator.sendBeacon('/api/evaluate', JSON.stringify({ batch }));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled, sessionId, events]);

  /**
   * Transform API response type
   */
  interface TransformAPIResponse {
    transformedContent: string | null;
    gateFailed?: boolean;
    gateReason?: string;
    latency?: number;
    preGenerated?: boolean;
    preGenVersion?: number;
    preGenChunkId?: string;
  }

  /**
   * Try to get pre-generated expansion content
   * Sends content to server which hashes it with MD5 for lookup
   */
  const getPreGeneratedExpansion = useCallback(
    async (content: string): Promise<TransformAPIResponse | null> => {
      try {
        // Send content to API - server will hash it properly with MD5
        const response = await fetch(`/api/expanded?content=${encodeURIComponent(content)}`);

        if (!response.ok) {
          // No pre-generated content available
          return null;
        }

        const data = await response.json();

        if (data.content) {
          return {
            transformedContent: data.content,
            latency: 0, // Instant!
            preGenerated: true,
            preGenVersion: data.version,
            preGenChunkId: data.chunkId,
          };
        }

        return null;
      } catch (error) {
        console.log('[Transform] Pre-generated lookup failed, falling back to API');
        return null;
      }
    },
    []
  );

  /**
   * Call the transform API
   */
  const callTransformAPI = useCallback(
    async (
      chunk: ContentChunk,
      type: 'expand' | 'rewrite',
      level?: RewriteLevel
    ): Promise<TransformAPIResponse> => {
      try {
        const response = await fetch('/api/transform', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            chunkId: chunk.id,
            content: chunk.currentContent,
            type,
            level,
            idleDuration: state.idleTime,
          }),
        });

        if (!response.ok) {
          console.error('[Transform] API error:', response.status);
          return { transformedContent: null };
        }

        const data = await response.json();

        // Check if gate failed
        if (data.gateFailed) {
          console.warn(`[Transform] Gate failed: ${data.gateReason}`);
          return {
            transformedContent: null, // Don't use the fallback content
            gateFailed: true,
            gateReason: data.gateReason,
          };
        }

        return {
          transformedContent: data.transformedContent,
          latency: data.latency,
        };
      } catch (error) {
        console.error('[Transform] Request failed:', error);
        return { transformedContent: null };
      }
    },
    [sessionId, state.idleTime]
  );

  /**
   * Check if element is still connected to DOM
   */
  const isElementConnected = useCallback((element: HTMLElement): boolean => {
    return element.isConnected && document.body.contains(element);
  }, []);

  /**
   * Show immediate loading state on element (before API returns)
   */
  const showLoadingState = useCallback((element: HTMLElement, type: 'expand' | 'rewrite') => {
    if (!isElementConnected(element)) return;

    element.classList.add('adversarial-chunk', 'adversarial-loading');
    element.setAttribute('data-transforming', 'true');
    element.setAttribute('data-transform-type', type);

    // Add subtle pulse/shimmer effect immediately
    element.style.transition = 'opacity 200ms ease-out';
    element.style.opacity = '0.85';
  }, [isElementConnected]);

  /**
   * Clear loading state from element
   */
  const clearLoadingState = useCallback((element: HTMLElement) => {
    if (!isElementConnected(element)) return;

    element.classList.remove('adversarial-loading');
    element.removeAttribute('data-transforming');
    element.removeAttribute('data-transform-type');
    element.style.opacity = '1';
  }, [isElementConnected]);

  /**
   * Apply transformation with animation
   */
  const applyTransformation = useCallback(
    async (
      chunk: ContentChunk,
      type: 'expand' | 'rewrite',
      level?: RewriteLevel
    ) => {
      const startTime = Date.now();

      // Validate element is still in DOM before starting
      if (!isElementConnected(chunk.element)) {
        console.warn(`[Transform] Skipped: element no longer in DOM (${chunk.id})`);
        return;
      }

      // Store previous content before any operations
      const previousContent = chunk.currentContent;

      // For REWRITE L3 (hostile), use pre-generated expanded content 70% of the time
      // This significantly reduces LLM costs while maintaining variety in hostile rewrites
      if (type === 'rewrite' && level === 3 && Math.random() < 0.7) {
        const preGenResult = await getPreGeneratedExpansion(previousContent);

        if (preGenResult?.transformedContent) {
          console.log(`[Transform] Using pre-generated content for L3 hostile rewrite (v${preGenResult.preGenVersion})`);

          // Validate element is still in DOM
          if (!isElementConnected(chunk.element)) {
            console.warn(`[Transform] Skipped DOM update: element no longer connected (${chunk.id})`);
            return;
          }

          const transformedContent = preGenResult.transformedContent;

          // Update chunk state
          updateChunkContent(chunk.id, transformedContent, type, level);

          // Register transform for debug panel (mark as pre-generated)
          registerTransform({
            chunkId: chunk.id,
            type,
            level,
            latency: 0,
          });

          // Record transformation for batch evaluation (with pre-generated flag)
          const record: TransformationRecord = {
            chunkId: chunk.id,
            type,
            level,
            trigger: 'idle_pregen_l3',
            originalContent: previousContent,
            transformedContent,
            latency: 0,
            timestamp: Date.now(),
          };
          transformationRecordsRef.current.push(record);

          // Check if we should trigger a batch
          checkAndTriggerBatch();

          // Apply to DOM with animation
          const config = getAnimationConfig(type, level);
          applyToDOMWithAnimation(chunk.element, previousContent, transformedContent, config);

          return; // Done! No API call needed
        }
        // If no pre-generated content found, fall through to LLM generation
      }

      // IMMEDIATE: Show loading state before API call (only for real-time transforms)
      showLoadingState(chunk.element, type);

      try {
        // Call API (fallback for EXPAND, or primary for REWRITE)
        const result = await callTransformAPI(chunk, type, level);

        // Clear loading state (always, even on failure)
        clearLoadingState(chunk.element);

        // Handle gate failures or API errors - silently skip
        if (!result.transformedContent || result.gateFailed) {
          if (result.gateFailed) {
            console.log(`[Transform] Skipped due to gate failure: ${result.gateReason}`);
          }
          return;
        }

        // Validate element is still in DOM before applying
        if (!isElementConnected(chunk.element)) {
          console.warn(`[Transform] Skipped DOM update: element no longer connected (${chunk.id})`);
          return;
        }

        const transformedContent = result.transformedContent;
        const latency = result.latency || (Date.now() - startTime);

        // Update chunk state
        updateChunkContent(chunk.id, transformedContent, type, level);

        // Register transform for debug panel
        registerTransform({
          chunkId: chunk.id,
          type,
          level,
          latency,
        });

        // Record transformation for batch evaluation
        const record: TransformationRecord = {
          chunkId: chunk.id,
          type,
          level,
          trigger: `idle_${state.idleTime}ms`,
          originalContent: previousContent,
          transformedContent,
          latency,
          timestamp: Date.now(),
        };
        transformationRecordsRef.current.push(record);

        // Check if we should trigger a batch
        checkAndTriggerBatch();

        // Apply to DOM with animation
        const config = getAnimationConfig(type, level);
        applyToDOMWithAnimation(chunk.element, previousContent, transformedContent, config);
      } catch (error) {
        // Always clear loading state on any error
        clearLoadingState(chunk.element);
        console.error(`[Transform] Error transforming ${chunk.id}:`, error);
      }
    },
    [callTransformAPI, getPreGeneratedExpansion, updateChunkContent, registerTransform, state.idleTime, checkAndTriggerBatch, showLoadingState, clearLoadingState, isElementConnected]
  );

  /**
   * Apply content to DOM with smooth morphing animation
   */
  const applyToDOMWithAnimation = useCallback(
    (
      element: HTMLElement,
      previousContent: string,
      newContent: string,
      config: ReturnType<typeof getAnimationConfig>
    ) => {
      // Mark element as transforming
      element.classList.add('adversarial-chunk');
      element.setAttribute('data-transforming', 'true');
      element.setAttribute('data-intensity', config.intensity.toString());

      // Calculate animation duration based on config
      const duration = config.scrambleDuration;
      const easing = config.chaotic ? 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'ease-out';

      // Store original height to prevent layout shift
      const originalHeight = element.offsetHeight;
      element.style.minHeight = `${originalHeight}px`;

      // Phase 1: Fade out slightly and add subtle blur
      element.style.transition = `opacity ${duration / 3}ms ${easing}, filter ${duration / 3}ms ${easing}`;
      element.style.opacity = config.chaotic ? '0.6' : '0.8';
      element.style.filter = config.chaotic ? 'blur(1px)' : 'blur(0.5px)';

      setTimeout(() => {
        // Phase 2: Update content
        element.innerHTML = newContent;

        // Phase 3: Fade back in and remove blur
        element.style.transition = `opacity ${duration / 2}ms ${easing}, filter ${duration / 2}ms ${easing}, min-height ${duration}ms ${easing}`;
        element.style.opacity = '1';
        element.style.filter = 'blur(0)';

        // Allow height to adjust naturally
        setTimeout(() => {
          element.style.minHeight = '';
        }, duration / 2);

        // Cleanup
        setTimeout(() => {
          element.setAttribute('data-transforming', 'false');
          element.removeAttribute('data-intensity');
          element.style.transition = '';
          element.style.filter = '';
        }, duration);
      }, duration / 3);
    },
    []
  );

  /**
   * Number of chunks to transform simultaneously
   */
  const CHUNKS_PER_TRANSFORM = 2;

  /**
   * Select chunks to transform (returns up to CHUNKS_PER_TRANSFORM)
   */
  const selectChunksToTransform = useCallback((count: number = CHUNKS_PER_TRANSFORM): ContentChunk[] => {
    const chunks = getTransformableChunks();

    if (chunks.length === 0) {
      return [];
    }

    // Filter out chunks we've already transformed this cycle
    let availableChunks = chunks.filter(
      (c) => !transformedChunksThisCycleRef.current.has(c.id)
    );

    if (availableChunks.length === 0) {
      // Reset cycle and start fresh
      transformedChunksThisCycleRef.current.clear();
      availableChunks = chunks;
    }

    // Prefer chunks with fewer transformations
    availableChunks.sort((a, b) => a.transformCount - b.transformCount);

    // Return up to 'count' chunks
    return availableChunks.slice(0, Math.min(count, availableChunks.length));
  }, [getTransformableChunks]);

  /**
   * Handle EXPAND mode - DISABLED
   * Pre-generated expanded content is now used for L3 hostile rewrites instead.
   * Keeping this stub in case we want to re-enable EXPAND mode in the future.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleExpandMode = useCallback(async () => {
    // EXPAND mode is disabled - do nothing
    console.log('[ContentTransformer] EXPAND mode is disabled');
  }, []);

  /**
   * Handle REWRITE mode - transform with escalating levels
   */
  const handleRewriteMode = useCallback(async () => {
    if (isTransforming) return;

    const now = Date.now();
    const timeSinceLastRewrite = now - lastRewriteTimeRef.current;

    // Check if enough time has passed since last rewrite
    if (timeSinceLastRewrite < thresholds.rewriteInterval) {
      return;
    }

    const chunks = selectChunksToTransform(CHUNKS_PER_TRANSFORM);
    if (chunks.length === 0) return;

    setIsTransforming(true);
    lastRewriteTimeRef.current = now;
    chunks.forEach(c => transformedChunksThisCycleRef.current.add(c.id));

    try {
      // Transform chunks in parallel
      await Promise.all(
        chunks.map(chunk => applyTransformation(chunk, 'rewrite', state.rewriteLevel))
      );
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
   * Handle mode changes
   */
  useEffect(() => {
    if (!enabled) return;

    const currentMode = state.mode;
    const previousMode = lastModeRef.current;

    // Mode changed
    if (currentMode !== previousMode) {
      console.log(`[ContentTransformer] Mode: ${previousMode} → ${currentMode}`);

      // Clear any existing rewrite interval
      if (rewriteIntervalRef.current) {
        clearInterval(rewriteIntervalRef.current);
        rewriteIntervalRef.current = null;
      }

      // Reset transformed chunks on mode change
      transformedChunksThisCycleRef.current.clear();

      lastModeRef.current = currentMode;
    }

    // Handle current mode (EXPAND mode is disabled, only REWRITE is active)
    if (currentMode === 'REWRITE') {
      // Set up rewrite interval
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
  }, [
    enabled,
    state.mode,
    handleRewriteMode,
    thresholds.rewriteInterval,
  ]);

  // This component doesn't render anything - it just orchestrates
  return null;
}

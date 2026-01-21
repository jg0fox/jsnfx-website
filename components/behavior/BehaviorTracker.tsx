'use client';

/**
 * BehaviorTracker - React context provider for behavior tracking
 *
 * Wraps the app to provide behavior state to all components.
 * Handles event listeners and animation frame updates.
 */

import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import type {
  BehaviorState,
  BehaviorThresholds,
  BehaviorEvent,
  DebugInfo,
  Mode,
  RewriteLevel,
} from '@/types/behavior';
import { DEFAULT_THRESHOLDS, INITIAL_BEHAVIOR_STATE } from '@/types/behavior';
import { ModeEngine } from './ModeEngine';

export interface BehaviorContextValue {
  /** Current behavior state */
  state: BehaviorState;
  /** Current thresholds */
  thresholds: BehaviorThresholds;
  /** Behavior event history */
  events: BehaviorEvent[];
  /** Debug information for debug panel */
  debugInfo: DebugInfo;
  /** Whether debug panel is visible */
  debugVisible: boolean;
  /** Toggle debug panel visibility */
  toggleDebug: () => void;
  /** Force a mode (for testing) */
  forceMode: (mode: Mode) => void;
  /** Reset behavior tracking */
  reset: () => void;
  /** Register a transform for debug info */
  registerTransform: (info: {
    chunkId: string;
    type: 'expand' | 'rewrite';
    level?: RewriteLevel;
    latency: number;
  }) => void;
  /** Update viewport chunk counts */
  updateChunkCounts: (visible: number, transformed: number) => void;
  /** Update batch info */
  updateBatchInfo: (transforms: number, timeRemaining: number) => void;
}

const defaultDebugInfo: DebugInfo = {
  state: INITIAL_BEHAVIOR_STATE,
  viewportChunks: 0,
  transformedChunks: 0,
  lastTransformAge: null,
  lastTransformType: null,
  lastRewriteLevel: null,
  lastTransformChunk: null,
  lastTransformLatency: null,
  nextRewriteIn: null,
  batchTransforms: 0,
  batchTimeRemaining: 60,
  sessionTransforms: 0,
};

export const BehaviorContext = createContext<BehaviorContextValue>({
  state: INITIAL_BEHAVIOR_STATE,
  thresholds: DEFAULT_THRESHOLDS,
  events: [],
  debugInfo: defaultDebugInfo,
  debugVisible: false,
  toggleDebug: () => {},
  forceMode: () => {},
  reset: () => {},
  registerTransform: () => {},
  updateChunkCounts: () => {},
  updateBatchInfo: () => {},
});

export interface BehaviorTrackerProps {
  children: React.ReactNode;
  /** Custom thresholds (optional) */
  thresholds?: Partial<BehaviorThresholds>;
  /** Enable debug mode by default */
  debugDefault?: boolean;
}

export function BehaviorTracker({
  children,
  thresholds: customThresholds,
  debugDefault = false,
}: BehaviorTrackerProps) {
  const [state, setState] = useState<BehaviorState>(INITIAL_BEHAVIOR_STATE);
  const [events, setEvents] = useState<BehaviorEvent[]>([]);
  const [debugVisible, setDebugVisible] = useState(debugDefault);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>(defaultDebugInfo);

  const engineRef = useRef<ModeEngine | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastRewriteTimeRef = useRef<number | null>(null);
  const sessionTransformsRef = useRef(0);
  const lastDebugUpdateRef = useRef<number>(0);
  const lastStateRef = useRef<BehaviorState | null>(null);
  const lastTransformInfoRef = useRef<{
    time: number;
    chunkId: string;
    type: 'expand' | 'rewrite';
    level?: RewriteLevel;
    latency: number;
  } | null>(null);

  // Initialize engine
  useEffect(() => {
    const thresholds = { ...DEFAULT_THRESHOLDS, ...customThresholds };

    engineRef.current = new ModeEngine({
      thresholds,
      onModeChange: (newMode, prevMode) => {
        console.log(`[Adversarial] Mode: ${prevMode} → ${newMode}`);
        if (newMode === 'REWRITE') {
          lastRewriteTimeRef.current = Date.now();
        }
      },
      onRewriteLevelChange: (newLevel, prevLevel) => {
        console.log(`[Adversarial] Rewrite Level: ${prevLevel} → ${newLevel}`);
      },
      onEvent: (event) => {
        setEvents((prev) => [...prev.slice(-999), event]); // Keep last 1000 events
      },
    });

    return () => {
      engineRef.current = null;
    };
  }, [customThresholds]);

  // Animation frame loop for tick updates
  useEffect(() => {
    let mounted = true;
    const DEBUG_UPDATE_INTERVAL = 100; // Update debug info every 100ms

    const tick = () => {
      if (!mounted || !engineRef.current) return;

      const newState = engineRef.current.tick();
      const lastState = lastStateRef.current;

      // Only update state if it has meaningfully changed
      const stateChanged =
        !lastState ||
        lastState.mode !== newState.mode ||
        lastState.rewriteLevel !== newState.rewriteLevel ||
        lastState.fastScrollSustained !== newState.fastScrollSustained ||
        Math.abs(lastState.scrollVelocity - newState.scrollVelocity) > 10 ||
        Math.abs(lastState.idleTime - newState.idleTime) > 100;

      if (stateChanged) {
        setState(newState);
        lastStateRef.current = newState;
      }

      // Throttle debug info updates
      const now = Date.now();
      if (now - lastDebugUpdateRef.current >= DEBUG_UPDATE_INTERVAL) {
        lastDebugUpdateRef.current = now;

        const lastTransform = lastTransformInfoRef.current;
        const thresholds = engineRef.current.getThresholds();

        setDebugInfo((prev) => ({
          ...prev,
          state: newState,
          lastTransformAge: lastTransform
            ? (now - lastTransform.time) / 1000
            : null,
          lastTransformType: lastTransform?.type ?? null,
          lastRewriteLevel: lastTransform?.level ?? null,
          lastTransformChunk: lastTransform?.chunkId ?? null,
          lastTransformLatency: lastTransform?.latency ?? null,
          nextRewriteIn:
            newState.mode === 'REWRITE' && lastRewriteTimeRef.current
              ? Math.max(
                  0,
                  (thresholds.rewriteInterval -
                    (now - lastRewriteTimeRef.current)) /
                    1000
                )
              : null,
          sessionTransforms: sessionTransformsRef.current,
        }));
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      mounted = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Event listeners
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    const handleScroll = () => {
      engine.handleScroll(window.scrollY);
    };

    const handleClick = () => {
      engine.handleClick();
    };

    const handleMouseMove = (e: MouseEvent) => {
      engine.handleMouseMove(e.clientX, e.clientY);
    };

    const handleKeypress = () => {
      engine.handleKeypress();
    };

    const handleTouchStart = (e: TouchEvent) => {
      engine.handleTouch();
      // Initialize touch position for move tracking
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        engine.handleTouchMove(touch.clientX, touch.clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        engine.handleTouchMove(touch.clientX, touch.clientY);
      }
    };

    const handleTouchEnd = () => {
      engine.handleTouchEnd();
    };

    const handleVisibilityChange = () => {
      engine.handleVisibilityChange(!document.hidden);
    };

    // Keyboard shortcut for debug panel
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+Shift+D (Mac) or Ctrl+Shift+D (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'd') {
        e.preventDefault();
        setDebugVisible((prev) => !prev);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('click', handleClick);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('keypress', handleKeypress);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keypress', handleKeypress);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleDebug = useCallback(() => {
    setDebugVisible((prev) => !prev);
  }, []);

  const forceMode = useCallback((mode: Mode) => {
    engineRef.current?.forceMode(mode);
  }, []);

  const reset = useCallback(() => {
    engineRef.current?.reset();
    setEvents([]);
    sessionTransformsRef.current = 0;
    lastTransformInfoRef.current = null;
    lastRewriteTimeRef.current = null;
  }, []);

  const registerTransform = useCallback(
    (info: {
      chunkId: string;
      type: 'expand' | 'rewrite';
      level?: RewriteLevel;
      latency: number;
    }) => {
      sessionTransformsRef.current += 1;
      lastTransformInfoRef.current = {
        ...info,
        time: Date.now(),
      };
      if (info.type === 'rewrite') {
        lastRewriteTimeRef.current = Date.now();
      }
    },
    []
  );

  const updateChunkCounts = useCallback(
    (visible: number, transformed: number) => {
      setDebugInfo((prev) => ({
        ...prev,
        viewportChunks: visible,
        transformedChunks: transformed,
      }));
    },
    []
  );

  const updateBatchInfo = useCallback(
    (transforms: number, timeRemaining: number) => {
      setDebugInfo((prev) => ({
        ...prev,
        batchTransforms: transforms,
        batchTimeRemaining: timeRemaining,
      }));
    },
    []
  );

  const value: BehaviorContextValue = {
    state,
    thresholds: engineRef.current?.getThresholds() ?? DEFAULT_THRESHOLDS,
    events,
    debugInfo,
    debugVisible,
    toggleDebug,
    forceMode,
    reset,
    registerTransform,
    updateChunkCounts,
    updateBatchInfo,
  };

  return (
    <BehaviorContext.Provider value={value}>
      {children}
    </BehaviorContext.Provider>
  );
}

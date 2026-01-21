/**
 * Behavior tracking types for adversarial content system
 */

/**
 * Operating modes for the adversarial system
 * - NEUTRAL: Normal browsing, no transformations
 * - EXPAND: Fast scrolling detected, content expands
 * - REWRITE: Idle detected, content rewrites
 */
export type Mode = 'NEUTRAL' | 'EXPAND' | 'REWRITE';

/**
 * Rewrite intensity levels based on idle duration
 * - Level 1 (5-15s): Subtle changes (synonyms, slight rephrasing)
 * - Level 2 (15-30s): Noticeable changes (restructured sentences)
 * - Level 3 (30s+): Hostile changes (fragmented syntax, slippery meaning)
 */
export type RewriteLevel = 1 | 2 | 3;

/**
 * Threshold configuration for behavior detection
 */
export interface BehaviorThresholds {
  /** Pixels per second to trigger EXPAND mode */
  fastScrollVelocity: number;
  /** Milliseconds of sustained fast scroll to trigger EXPAND */
  fastScrollDuration: number;
  /** Minimum milliseconds to stay in EXPAND mode (ensures transform can complete) */
  expandMinDuration: number;
  /** Milliseconds idle to enter REWRITE mode */
  idleStart: number;
  /** Milliseconds between rewrites while idle */
  rewriteInterval: number;
  /** Milliseconds idle for REWRITE Level 2 */
  rewriteLevel2: number;
  /** Milliseconds idle for REWRITE Level 3 */
  rewriteLevel3: number;
  /** Pixels of cursor movement to reset idle */
  cursorMoveThreshold: number;
}

/**
 * Default thresholds as specified in CLAUDE.md
 */
export const DEFAULT_THRESHOLDS: BehaviorThresholds = {
  fastScrollVelocity: 600,      // px/s (raised from 500 to filter casual fast scrollers)
  fastScrollDuration: 2000,     // 2s sustained (raised from 1s for more intentional scrolling)
  expandMinDuration: 3000,      // 3s minimum in EXPAND (allows transform to complete)
  idleStart: 5000,              // 5s to enter REWRITE
  rewriteInterval: 8000,        // 8s between rewrites
  rewriteLevel2: 30000,         // 30s idle for L2 (was 15s) - L1 lasts ~25s = 3 transforms
  rewriteLevel3: 60000,         // 60s idle for L3 (was 30s) - L2 lasts ~30s = 4 transforms
  cursorMoveThreshold: 100,     // 100px movement resets idle
};

/**
 * Current behavior state
 */
export interface BehaviorState {
  /** Current operating mode */
  mode: Mode;
  /** Current scroll velocity in px/s (rolling 500ms average) */
  scrollVelocity: number;
  /** Milliseconds idle since last interaction */
  idleTime: number;
  /** Current rewrite level (only meaningful in REWRITE mode) */
  rewriteLevel: RewriteLevel;
  /** Milliseconds since session started */
  sessionDuration: number;
  /** Whether fast scroll has been sustained long enough */
  fastScrollSustained: boolean;
  /** Timestamp of last interaction */
  lastInteractionTime: number;
  /** Timestamp of last mode change */
  lastModeChangeTime: number;
}

/**
 * Initial behavior state
 */
export const INITIAL_BEHAVIOR_STATE: BehaviorState = {
  mode: 'NEUTRAL',
  scrollVelocity: 0,
  idleTime: 0,
  rewriteLevel: 1,
  sessionDuration: 0,
  fastScrollSustained: false,
  lastInteractionTime: Date.now(),
  lastModeChangeTime: Date.now(),
};

/**
 * Behavior event types for tracking
 */
export type BehaviorEventType =
  | 'scroll'
  | 'click'
  | 'mousemove'
  | 'keypress'
  | 'touch'
  | 'mode_change'
  | 'rewrite_level_change'
  | 'visibility_change';

/**
 * Behavior event for sequence tracking
 */
export interface BehaviorEvent {
  /** Milliseconds into session */
  timestamp: number;
  /** Type of event */
  event: BehaviorEventType;
  /** Additional event data */
  data?: {
    scrollVelocity?: number;
    idleTime?: number;
    mode?: Mode;
    rewriteLevel?: RewriteLevel;
    cursorDelta?: number;
    touchDelta?: number;
    visible?: boolean;
  };
}

/**
 * Debug information for the debug panel
 */
export interface DebugInfo {
  state: BehaviorState;
  /** Number of chunks in viewport */
  viewportChunks: number;
  /** Number of transformed chunks */
  transformedChunks: number;
  /** Seconds since last transform */
  lastTransformAge: number | null;
  /** Type of last transform */
  lastTransformType: 'expand' | 'rewrite' | null;
  /** Level of last rewrite (if applicable) */
  lastRewriteLevel: RewriteLevel | null;
  /** Chunk ID of last transform */
  lastTransformChunk: string | null;
  /** Latency of last transform in ms */
  lastTransformLatency: number | null;
  /** Seconds until next rewrite (in REWRITE mode) */
  nextRewriteIn: number | null;
  /** Transforms in current batch */
  batchTransforms: number;
  /** Seconds until time-based batch trigger */
  batchTimeRemaining: number;
  /** Total transforms this session */
  sessionTransforms: number;
}

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
 * - Level 2 (15-30s): Noticeable changes (restructured sentences, different framing)
 * - Level 3 (30-45s): Hostile changes (fragmented syntax, unusual word choices)
 * - Level 4 (45s+): Very hostile (highly degraded, difficult to comprehend)
 */
export type RewriteLevel = 1 | 2 | 3 | 4;

/**
 * Labels for each rewrite level
 */
export const REWRITE_LEVEL_LABELS: Record<RewriteLevel, string> = {
  1: 'subtle',
  2: 'noticeable',
  3: 'hostile',
  4: 'very hostile',
};

/**
 * Threshold configuration for behavior detection
 */
export interface BehaviorThresholds {
  /** Pixels per second to trigger EXPAND mode */
  fastScrollVelocity: number;
  /** Pixels per second to exit EXPAND mode (lower for hysteresis) */
  fastScrollExitVelocity: number;
  /** Milliseconds of sustained fast scroll to trigger EXPAND */
  fastScrollDuration: number;
  /** Minimum milliseconds to stay in EXPAND mode (ensures transform can complete) */
  expandMinDuration: number;
  /** Milliseconds after exiting EXPAND before re-entry is allowed */
  expandCooldown: number;
  /** Milliseconds idle to enter REWRITE mode */
  idleStart: number;
  /** Milliseconds between rewrites while idle */
  rewriteInterval: number;
  /** Milliseconds idle for REWRITE Level 2 */
  rewriteLevel2: number;
  /** Milliseconds idle for REWRITE Level 3 */
  rewriteLevel3: number;
  /** Milliseconds idle for REWRITE Level 4 */
  rewriteLevel4: number;
  /** Pixels of cursor movement to reset idle */
  cursorMoveThreshold: number;
}

/**
 * Default thresholds as specified in CLAUDE.md
 */
export const DEFAULT_THRESHOLDS: BehaviorThresholds = {
  fastScrollVelocity: 400,      // px/s - lowered from 600 for easier triggering
  fastScrollExitVelocity: 250,  // px/s - hysteresis: lower threshold to exit EXPAND
  fastScrollDuration: 800,      // 0.8s sustained to trigger EXPAND (lowered from 1.5s)
  expandMinDuration: 2000,      // 2s minimum in EXPAND
  expandCooldown: 3000,         // 3s cooldown after exiting EXPAND before re-entry
  idleStart: 5000,              // 5s to enter REWRITE mode at Level 1
  rewriteInterval: 8000,        // 8-10s between level escalation checks
  rewriteLevel2: 15000,         // 15s idle for L2 (noticeable)
  rewriteLevel3: 30000,         // 30s idle for L3 (hostile)
  rewriteLevel4: 45000,         // 45s idle for L4 (very hostile)
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
 * Information about upcoming mode/level change
 */
export interface NextModeInfo {
  /** Description of what's next */
  label: string;
  /** Seconds until it activates (null if action-based, not time-based) */
  secondsUntil: number | null;
  /** What triggers it */
  trigger: 'time' | 'action';
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
  /** Information about the next mode/level change */
  nextModeInfo: NextModeInfo | null;
  /** Transforms in current batch */
  batchTransforms: number;
  /** Seconds until time-based batch trigger */
  batchTimeRemaining: number;
  /** Total transforms this session */
  sessionTransforms: number;
}

/**
 * ModeEngine - State machine for adversarial behavior modes
 *
 * Mode transitions:
 * - NEUTRAL → EXPAND: scrollVelocity > 500px/s for > 1s
 * - NEUTRAL → REWRITE: idleTime > 5s
 * - EXPAND → NEUTRAL: scrollVelocity drops below threshold
 * - REWRITE → NEUTRAL: any interaction (scroll, click, cursor move > 100px)
 */

import type {
  Mode,
  RewriteLevel,
  BehaviorState,
  BehaviorThresholds,
  BehaviorEvent,
  BehaviorEventType,
} from '@/types/behavior';
import { DEFAULT_THRESHOLDS, INITIAL_BEHAVIOR_STATE } from '@/types/behavior';

export interface ModeEngineConfig {
  thresholds?: Partial<BehaviorThresholds>;
  onModeChange?: (newMode: Mode, prevMode: Mode) => void;
  onRewriteLevelChange?: (newLevel: RewriteLevel, prevLevel: RewriteLevel) => void;
  onEvent?: (event: BehaviorEvent) => void;
}

export class ModeEngine {
  private state: BehaviorState;
  private thresholds: BehaviorThresholds;
  private sessionStartTime: number;
  private scrollPositions: Array<{ time: number; position: number }> = [];
  private lastCursorPosition: { x: number; y: number } | null = null;
  private lastTouchPosition: { x: number; y: number } | null = null;
  private fastScrollStartTime: number | null = null;
  private config: ModeEngineConfig;

  constructor(config: ModeEngineConfig = {}) {
    this.sessionStartTime = Date.now();
    this.thresholds = { ...DEFAULT_THRESHOLDS, ...config.thresholds };
    this.state = {
      ...INITIAL_BEHAVIOR_STATE,
      lastInteractionTime: this.sessionStartTime,
      lastModeChangeTime: this.sessionStartTime,
    };
    this.config = config;
  }

  /**
   * Get current state (immutable copy)
   */
  getState(): BehaviorState {
    return { ...this.state };
  }

  /**
   * Get current thresholds
   */
  getThresholds(): BehaviorThresholds {
    return { ...this.thresholds };
  }

  /**
   * Update state and check for mode transitions
   * Should be called on requestAnimationFrame for smooth tracking
   */
  tick(): BehaviorState {
    const now = Date.now();

    // Update session duration
    this.state.sessionDuration = now - this.sessionStartTime;

    // Update idle time
    this.state.idleTime = now - this.state.lastInteractionTime;

    // Clean up stale scroll positions (older than 500ms)
    const cutoff = now - 500;
    this.scrollPositions = this.scrollPositions.filter((p) => p.time > cutoff);

    // Calculate scroll velocity from recent positions
    this.state.scrollVelocity = this.calculateScrollVelocity();

    // Check for fast scroll sustained
    this.updateFastScrollSustained(now);

    // Determine mode transitions
    this.checkModeTransitions(now);

    // Update rewrite level if in REWRITE mode
    if (this.state.mode === 'REWRITE') {
      this.updateRewriteLevel();
    }

    return this.getState();
  }

  /**
   * Record a scroll event
   */
  handleScroll(scrollY: number): void {
    const now = Date.now();

    // Add to scroll position history
    this.scrollPositions.push({ time: now, position: scrollY });

    // Keep only last 500ms of data
    const cutoff = now - 500;
    this.scrollPositions = this.scrollPositions.filter((p) => p.time > cutoff);

    // Scroll counts as interaction - reset idle
    this.recordInteraction('scroll', { scrollVelocity: this.state.scrollVelocity });
  }

  /**
   * Record a click event
   */
  handleClick(): void {
    this.recordInteraction('click');
  }

  /**
   * Record a mouse move event
   */
  handleMouseMove(x: number, y: number): void {
    if (this.lastCursorPosition) {
      const dx = x - this.lastCursorPosition.x;
      const dy = y - this.lastCursorPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Only count as interaction if moved more than threshold
      if (distance > this.thresholds.cursorMoveThreshold) {
        this.recordInteraction('mousemove', { cursorDelta: distance });
        this.lastCursorPosition = { x, y };
      }
    } else {
      this.lastCursorPosition = { x, y };
    }
  }

  /**
   * Record a keypress event
   */
  handleKeypress(): void {
    this.recordInteraction('keypress');
  }

  /**
   * Record a touch start event
   */
  handleTouch(): void {
    this.recordInteraction('touch');
  }

  /**
   * Record a touch move event (similar to mouse move)
   */
  handleTouchMove(x: number, y: number): void {
    if (this.lastTouchPosition) {
      const dx = x - this.lastTouchPosition.x;
      const dy = y - this.lastTouchPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Only count as interaction if moved more than threshold
      if (distance > this.thresholds.cursorMoveThreshold) {
        this.recordInteraction('touch', { touchDelta: distance });
        this.lastTouchPosition = { x, y };
      }
    } else {
      this.lastTouchPosition = { x, y };
    }
  }

  /**
   * Record touch end event
   */
  handleTouchEnd(): void {
    this.lastTouchPosition = null;
    this.recordInteraction('touch');
  }

  /**
   * Record visibility change
   */
  handleVisibilityChange(visible: boolean): void {
    this.emitEvent('visibility_change', { visible });

    if (!visible) {
      // Page hidden - could be session end
      // Let the BehaviorTracker handle session end logic
    }
  }

  /**
   * Force mode change (useful for testing/debugging)
   */
  forceMode(mode: Mode): void {
    const prevMode = this.state.mode;
    if (mode !== prevMode) {
      this.state.mode = mode;
      this.state.lastModeChangeTime = Date.now();
      this.emitEvent('mode_change', { mode });
      this.config.onModeChange?.(mode, prevMode);
    }
  }

  /**
   * Reset to initial state
   */
  reset(): void {
    this.sessionStartTime = Date.now();
    this.scrollPositions = [];
    this.lastCursorPosition = null;
    this.lastTouchPosition = null;
    this.fastScrollStartTime = null;
    this.state = {
      ...INITIAL_BEHAVIOR_STATE,
      lastInteractionTime: this.sessionStartTime,
      lastModeChangeTime: this.sessionStartTime,
    };
  }

  // Private methods

  private recordInteraction(
    type: BehaviorEventType,
    data?: BehaviorEvent['data']
  ): void {
    const now = Date.now();
    const wasInRewriteMode = this.state.mode === 'REWRITE';

    this.state.lastInteractionTime = now;
    this.state.idleTime = 0;

    this.emitEvent(type, data);

    // If we were in REWRITE mode, any interaction exits it
    if (wasInRewriteMode && type !== 'visibility_change') {
      this.transitionTo('NEUTRAL', now);
    }
  }

  private calculateScrollVelocity(): number {
    if (this.scrollPositions.length < 2) {
      return 0;
    }

    // Calculate average velocity over the 500ms window
    const oldest = this.scrollPositions[0];
    const newest = this.scrollPositions[this.scrollPositions.length - 1];
    const timeDelta = newest.time - oldest.time;

    if (timeDelta === 0) {
      return 0;
    }

    const positionDelta = Math.abs(newest.position - oldest.position);
    return (positionDelta / timeDelta) * 1000; // Convert to px/s
  }

  private updateFastScrollSustained(now: number): void {
    const isFastScrolling =
      this.state.scrollVelocity > this.thresholds.fastScrollVelocity;

    if (isFastScrolling) {
      if (this.fastScrollStartTime === null) {
        this.fastScrollStartTime = now;
      }
      const duration = now - this.fastScrollStartTime;
      this.state.fastScrollSustained =
        duration >= this.thresholds.fastScrollDuration;
    } else {
      this.fastScrollStartTime = null;
      this.state.fastScrollSustained = false;
    }
  }

  private checkModeTransitions(now: number): void {
    const { mode, idleTime, fastScrollSustained } = this.state;

    switch (mode) {
      case 'NEUTRAL':
        // Check for EXPAND trigger
        if (fastScrollSustained) {
          this.transitionTo('EXPAND', now);
        }
        // Check for REWRITE trigger
        else if (idleTime >= this.thresholds.idleStart) {
          this.transitionTo('REWRITE', now);
        }
        break;

      case 'EXPAND':
        // Exit EXPAND when scroll velocity drops AND minimum duration has passed
        // This ensures at least one transform has a chance to complete
        const timeInExpandMode = now - this.state.lastModeChangeTime;
        const minDurationMet = timeInExpandMode >= this.thresholds.expandMinDuration;

        if (!fastScrollSustained && minDurationMet) {
          this.transitionTo('NEUTRAL', now);
        }
        break;

      case 'REWRITE':
        // REWRITE exits on interaction (handled in recordInteraction)
        // No automatic exit here
        break;
    }
  }

  private updateRewriteLevel(): void {
    const { idleTime, rewriteLevel } = this.state;
    let newLevel: RewriteLevel = 1;

    if (idleTime >= this.thresholds.rewriteLevel3) {
      newLevel = 3;
    } else if (idleTime >= this.thresholds.rewriteLevel2) {
      newLevel = 2;
    }

    if (newLevel !== rewriteLevel) {
      const prevLevel = rewriteLevel;
      this.state.rewriteLevel = newLevel;
      this.emitEvent('rewrite_level_change', { rewriteLevel: newLevel });
      this.config.onRewriteLevelChange?.(newLevel, prevLevel);
    }
  }

  private transitionTo(newMode: Mode, now: number): void {
    const prevMode = this.state.mode;
    if (newMode === prevMode) return;

    this.state.mode = newMode;
    this.state.lastModeChangeTime = now;

    // Reset rewrite level when entering REWRITE
    if (newMode === 'REWRITE') {
      this.state.rewriteLevel = 1;
    }

    this.emitEvent('mode_change', { mode: newMode });
    this.config.onModeChange?.(newMode, prevMode);
  }

  private emitEvent(type: BehaviorEventType, data?: BehaviorEvent['data']): void {
    const event: BehaviorEvent = {
      timestamp: Date.now() - this.sessionStartTime,
      event: type,
      data,
    };
    this.config.onEvent?.(event);
  }
}

/**
 * Create a new ModeEngine instance
 */
export function createModeEngine(config?: ModeEngineConfig): ModeEngine {
  return new ModeEngine(config);
}

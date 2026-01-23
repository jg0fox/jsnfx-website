'use client';

/**
 * useBehavior - Hook to access behavior tracking state
 *
 * Use this hook in any component that needs to react to
 * user behavior changes or access the current mode.
 */

import { useContext } from 'react';
import { BehaviorContext, type BehaviorContextValue } from './BehaviorTracker';
import type { Mode, RewriteLevel } from '@/types/behavior';

/**
 * Access the full behavior context
 */
export function useBehavior(): BehaviorContextValue {
  const context = useContext(BehaviorContext);
  if (!context) {
    throw new Error('useBehavior must be used within a BehaviorTracker');
  }
  return context;
}

/**
 * Access just the current mode
 */
export function useMode(): Mode {
  const { state } = useBehavior();
  return state.mode;
}

/**
 * Access the current rewrite level (meaningful only in REWRITE mode)
 */
export function useRewriteLevel(): RewriteLevel {
  const { state } = useBehavior();
  return state.rewriteLevel;
}

/**
 * Check if currently in a specific mode
 */
export function useIsMode(mode: Mode): boolean {
  const currentMode = useMode();
  return currentMode === mode;
}

/**
 * Access idle time in milliseconds
 */
export function useIdleTime(): number {
  const { state } = useBehavior();
  return state.idleTime;
}

/**
 * Access scroll velocity in px/s
 */
export function useScrollVelocity(): number {
  const { state } = useBehavior();
  return state.scrollVelocity;
}

/**
 * Access debug visibility and toggle
 */
export function useDebug(): {
  visible: boolean;
  toggle: () => void;
  info: BehaviorContextValue['debugInfo'];
} {
  const { debugVisible, toggleDebug, debugInfo } = useBehavior();
  return {
    visible: debugVisible,
    toggle: toggleDebug,
    info: debugInfo,
  };
}

/**
 * Access transform registration function
 */
export function useRegisterTransform(): BehaviorContextValue['registerTransform'] {
  const { registerTransform } = useBehavior();
  return registerTransform;
}

/**
 * Access chunk count update function
 */
export function useUpdateChunkCounts(): BehaviorContextValue['updateChunkCounts'] {
  const { updateChunkCounts } = useBehavior();
  return updateChunkCounts;
}

/**
 * Access batch info update function
 */
export function useUpdateBatchInfo(): BehaviorContextValue['updateBatchInfo'] {
  const { updateBatchInfo } = useBehavior();
  return updateBatchInfo;
}

/**
 * Access adversarial mode enabled state and toggle
 */
export function useAdversarialMode(): {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
} {
  const { adversarialEnabled, setAdversarialEnabled } = useBehavior();
  return {
    enabled: adversarialEnabled,
    setEnabled: setAdversarialEnabled,
  };
}

/**
 * Access content reset registration function
 */
export function useRegisterContentReset(): BehaviorContextValue['registerContentReset'] {
  const { registerContentReset } = useBehavior();
  return registerContentReset;
}

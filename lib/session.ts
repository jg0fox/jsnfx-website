/**
 * Session tracking for adversarial content system
 *
 * Manages session IDs, visitor metadata collection, and behavior sequences.
 */

import type {
  SessionState,
  VisitorMetadata,
  VisitorDevice,
  TransformationRecord,
  EvaluationBatch,
} from '@/types/evaluation';
import type { BehaviorEvent } from '@/types/behavior';

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 11);
  return `sess_${timestamp}_${random}`;
}

/**
 * Generate a unique batch ID
 */
export function generateBatchId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return `batch_${timestamp}_${random}`;
}

/**
 * Detect device information from user agent
 */
export function detectDevice(): VisitorDevice {
  if (typeof window === 'undefined') {
    return {
      type: 'unknown',
      browser: 'unknown',
      os: 'unknown',
      viewport: { width: 0, height: 0 },
    };
  }

  const ua = navigator.userAgent;

  // Detect device type
  let type = 'desktop';
  if (/Mobi|Android/i.test(ua)) {
    type = 'mobile';
  } else if (/Tablet|iPad/i.test(ua)) {
    type = 'tablet';
  }

  // Detect browser
  let browser = 'unknown';
  if (ua.includes('Firefox')) {
    browser = 'Firefox';
  } else if (ua.includes('Chrome')) {
    browser = 'Chrome';
  } else if (ua.includes('Safari')) {
    browser = 'Safari';
  } else if (ua.includes('Edge')) {
    browser = 'Edge';
  }

  // Detect OS
  let os = 'unknown';
  if (ua.includes('Windows')) {
    os = 'Windows';
  } else if (ua.includes('Mac')) {
    os = 'macOS';
  } else if (ua.includes('Linux')) {
    os = 'Linux';
  } else if (ua.includes('Android')) {
    os = 'Android';
  } else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) {
    os = 'iOS';
  }

  return {
    type,
    browser,
    os,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
  };
}

/**
 * Get referrer URL
 */
export function getReferrer(): string | null {
  if (typeof document === 'undefined') return null;
  return document.referrer || null;
}

/**
 * Get visitor's local time as ISO string
 */
export function getLocalTime(): string {
  return new Date().toISOString();
}

/**
 * Create initial visitor metadata (client-side only, IP/location filled server-side)
 */
export function createVisitorMetadata(): Omit<VisitorMetadata, 'ip' | 'location'> {
  return {
    device: detectDevice(),
    referrer: getReferrer(),
    localTime: getLocalTime(),
  };
}

/**
 * Create a new session state
 */
export function createSessionState(sessionId?: string): SessionState {
  return {
    sessionId: sessionId || generateSessionId(),
    startTime: Date.now(),
    visitor: null,
    behaviorSequence: [],
    transformations: [],
    reports: [],
    isEnded: false,
  };
}

/**
 * Add a behavior event to the session
 */
export function addBehaviorEvent(
  session: SessionState,
  event: BehaviorEvent
): SessionState {
  return {
    ...session,
    behaviorSequence: [...session.behaviorSequence, event],
  };
}

/**
 * Add a transformation record to the session
 */
export function addTransformationRecord(
  session: SessionState,
  record: TransformationRecord
): SessionState {
  return {
    ...session,
    transformations: [...session.transformations, record],
  };
}

/**
 * Check if batch should be triggered
 */
export interface BatchTriggerCheck {
  shouldTrigger: boolean;
  reason: 'time_elapsed' | 'transform_count' | 'session_end' | null;
}

// Batch trigger thresholds (optimized for token efficiency)
const BATCH_TRANSFORM_THRESHOLD = 10; // Was 5
const BATCH_TIME_THRESHOLD_MS = 300000; // 5 minutes (was 60 seconds)

export function checkBatchTrigger(
  transformsSinceLastEval: number,
  timeSinceLastEval: number,
  isSessionEnding: boolean
): BatchTriggerCheck {
  // Session end always triggers
  if (isSessionEnding) {
    return { shouldTrigger: true, reason: 'session_end' };
  }

  // 10 transforms triggers batch (was 5)
  if (transformsSinceLastEval >= BATCH_TRANSFORM_THRESHOLD) {
    return { shouldTrigger: true, reason: 'transform_count' };
  }

  // 5 minutes triggers batch (was 60 seconds)
  if (timeSinceLastEval >= BATCH_TIME_THRESHOLD_MS) {
    return { shouldTrigger: true, reason: 'time_elapsed' };
  }

  return { shouldTrigger: false, reason: null };
}

/**
 * Create an evaluation batch from session data
 */
export function createEvaluationBatch(
  session: SessionState,
  transformationsSinceLastEval: TransformationRecord[],
  visitorMetadata: VisitorMetadata
): EvaluationBatch {
  return {
    sessionId: session.sessionId,
    batchId: generateBatchId(),
    timestamp: new Date().toISOString(),
    visitor: visitorMetadata,
    behaviorSequence: session.behaviorSequence,
    transformations: transformationsSinceLastEval,
  };
}

/**
 * Mark session as ended
 */
export function endSession(session: SessionState): SessionState {
  return {
    ...session,
    isEnded: true,
  };
}

// ==========================================
// Content Persistence (sessionStorage)
// ==========================================

const STORAGE_KEY_PREFIX = 'adversarial_content_';

interface StoredTransform {
  transformedContent: string;
  transformCount: number;
  lastTransformType: 'expand' | 'rewrite' | null;
  lastRewriteLevel: 1 | 2 | 3 | null;
}

/**
 * Generate a stable key for content based on pathname and base content hash
 */
function generateContentKey(pathname: string, baseContent: string): string {
  // Simple hash function for base content
  let hash = 0;
  for (let i = 0; i < Math.min(baseContent.length, 200); i++) {
    const char = baseContent.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `${STORAGE_KEY_PREFIX}${pathname}_${hash}`;
}

/**
 * Store transformed content in sessionStorage
 */
export function storeTransformedContent(
  pathname: string,
  baseContent: string,
  transformedContent: string,
  transformCount: number,
  lastTransformType: 'expand' | 'rewrite' | null,
  lastRewriteLevel: 1 | 2 | 3 | null
): void {
  if (typeof window === 'undefined') return;

  try {
    const key = generateContentKey(pathname, baseContent);
    const data: StoredTransform = {
      transformedContent,
      transformCount,
      lastTransformType,
      lastRewriteLevel,
    };
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    // Storage full or unavailable, ignore
    console.warn('[Storage] Failed to store transformed content:', e);
  }
}

/**
 * Retrieve stored transformed content from sessionStorage
 */
export function getStoredTransform(
  pathname: string,
  baseContent: string
): StoredTransform | null {
  if (typeof window === 'undefined') return null;

  try {
    const key = generateContentKey(pathname, baseContent);
    const stored = sessionStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as StoredTransform;
    }
  } catch (e) {
    // Parse error or unavailable, ignore
  }
  return null;
}

/**
 * Clear all stored transforms (useful for testing)
 */
export function clearStoredTransforms(): void {
  if (typeof window === 'undefined') return;

  const keysToRemove: string[] = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key?.startsWith(STORAGE_KEY_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => sessionStorage.removeItem(key));
}

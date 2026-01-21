/**
 * Evaluation types for adversarial content system
 */

import type { BehaviorEvent, RewriteLevel } from './behavior';
import type { TransformationType } from './transformation';

/**
 * Visitor device information
 */
export interface VisitorDevice {
  /** Device type (desktop, mobile, tablet) */
  type: string;
  /** Browser name and version */
  browser: string;
  /** Operating system */
  os: string;
  /** Viewport dimensions */
  viewport: {
    width: number;
    height: number;
  };
}

/**
 * Visitor location information
 */
export interface VisitorLocation {
  city: string;
  region: string;
  country: string;
}

/**
 * Visitor metadata collected for evaluation
 */
export interface VisitorMetadata {
  /** IP address (may be anonymized) */
  ip: string;
  /** Geolocation */
  location: VisitorLocation;
  /** Device information */
  device: VisitorDevice;
  /** Referrer URL */
  referrer: string | null;
  /** Visitor's local time */
  localTime: string;
}

/**
 * Record of a single transformation for evaluation
 */
export interface TransformationRecord {
  /** Chunk that was transformed */
  chunkId: string;
  /** Type of transformation */
  type: TransformationType;
  /** Rewrite level if applicable */
  level?: RewriteLevel;
  /** What triggered this transformation */
  trigger: string;
  /** Content before transformation */
  originalContent: string;
  /** Content after transformation */
  transformedContent: string;
  /** Latency in milliseconds */
  latency: number;
  /** Timestamp of transformation */
  timestamp: number;
}

/**
 * Batch of data sent for evaluation
 */
export interface EvaluationBatch {
  /** Unique session identifier */
  sessionId: string;
  /** Unique batch identifier */
  batchId: string;
  /** ISO timestamp of batch creation */
  timestamp: string;
  /** Visitor metadata */
  visitor: VisitorMetadata;
  /** Sequence of behavior events */
  behaviorSequence: BehaviorEvent[];
  /** Transformations to evaluate */
  transformations: TransformationRecord[];
}

/**
 * Score for a single transformation
 * Note: contentIntegrity and technicalQuality removed - now handled by real-time quality gate
 */
export interface TransformationScore {
  /** Chunk that was scored */
  chunkId: string;
  /** Score for adversarial effectiveness (1-10) */
  adversarialEffectiveness: number;
  /** Evaluator notes */
  notes: string;
}

/**
 * Summary of batch evaluation
 */
export interface BatchSummary {
  /** Average score across all transformations */
  averageScore: number;
  /** Whether the batch passed evaluation (avg >= 6) */
  passed: boolean;
  /** Total transformations in batch */
  totalTransformations: number;
  /** Number of failed transformations (score < 6) */
  failedTransformations: number;
  /** Evaluator summary notes */
  notes: string;
}

/**
 * Full evaluation report
 */
export interface EvaluationReport {
  /** Batch that was evaluated */
  batchId: string;
  /** Session this batch belongs to */
  sessionId: string;
  /** ISO timestamp of evaluation */
  evaluatedAt: string;
  /** Individual transformation scores */
  transformationScores: TransformationScore[];
  /** Batch-level summary */
  batchSummary: BatchSummary;
  /** Original batch data for reference */
  originalBatch: EvaluationBatch;
}

/**
 * Batch trigger reasons
 */
export type BatchTrigger =
  | 'time_elapsed'    // 60 seconds since last evaluation
  | 'transform_count' // 5 transformations since last evaluation
  | 'session_end';    // Page unload or extended idle

/**
 * Batch collection state
 */
export interface BatchState {
  /** Current batch being collected */
  currentBatch: Partial<EvaluationBatch> | null;
  /** Timestamp of last evaluation */
  lastEvaluationTime: number | null;
  /** Transforms since last evaluation */
  transformsSinceLastEval: number;
  /** Whether batch collection is active */
  isCollecting: boolean;
}

/**
 * Initial batch state
 */
export const INITIAL_BATCH_STATE: BatchState = {
  currentBatch: null,
  lastEvaluationTime: null,
  transformsSinceLastEval: 0,
  isCollecting: false,
};

/**
 * Session state for tracking
 */
export interface SessionState {
  /** Unique session ID */
  sessionId: string;
  /** Session start timestamp */
  startTime: number;
  /** Collected visitor metadata */
  visitor: VisitorMetadata | null;
  /** All behavior events this session */
  behaviorSequence: BehaviorEvent[];
  /** All transformation records this session */
  transformations: TransformationRecord[];
  /** All completed evaluation reports */
  reports: EvaluationReport[];
  /** Whether session is considered ended */
  isEnded: boolean;
}

/**
 * API request for evaluation
 */
export interface EvaluateRequest {
  batch: EvaluationBatch;
}

/**
 * API response for evaluation
 */
export interface EvaluateResponse {
  report: EvaluationReport;
}

/**
 * API response for fetching reports
 */
export interface ReportsResponse {
  reports: EvaluationReport[];
}

'use client';

/**
 * ReportDetail - Displays detailed evaluation report
 */

import React, { useState } from 'react';
import type { EvaluationReport, TransformationScore } from '@/types/evaluation';

export interface ReportDetailProps {
  report: EvaluationReport;
}

/**
 * Evaluation rubric - criteria used by the LLM evaluator
 */
const EVALUATION_RUBRIC = {
  expand: {
    label: 'EXPAND',
    description: 'Content expansion for fast scrollers',
    criteria: [
      'Did it meaningfully increase length (40-60% longer)?',
      'Does the expansion create genuine obstruction for fast scrollers?',
      'Are the additions relevant but time-consuming to read?',
    ],
  },
  rewrite_1: {
    label: 'REWRITE L1 (Subtle)',
    description: 'Subtle changes to make readers doubt their memory',
    criteria: [
      'Are changes subtle enough that a reader might doubt their memory?',
      'Would someone re-reading feel uncertain if text changed?',
      'Is the "gaslighting" effect achieved?',
    ],
  },
  rewrite_2: {
    label: 'REWRITE L2 (Noticeable)',
    description: 'Noticeable changes that disrupt focus',
    criteria: [
      'Are changes clearly noticeable but still comprehensible?',
      'Does it disrupt focus without being obviously broken?',
      'Would a reader feel confused but not suspicious of malfunction?',
    ],
  },
  rewrite_3: {
    label: 'REWRITE L3 (Hostile)',
    description: 'Aggressive changes that resist comprehension',
    criteria: [
      'Does content actively resist easy comprehension?',
      'Is the hostility intentional and artistic, not accidental?',
      'Does it feel deliberately difficult, not just broken?',
    ],
  },
};

const SCORING_GUIDE = [
  { range: '9-10', label: 'Excellent', description: 'Perfectly achieves adversarial intent', color: 'text-palm-leaf' },
  { range: '7-8', label: 'Good', description: 'Good obstruction with minor missed opportunities', color: 'text-palm-leaf-2' },
  { range: '5-6', label: 'Adequate', description: 'Achieves basic obstruction but could be stronger', color: 'text-text-secondary' },
  { range: '3-4', label: 'Weak', description: 'Weak adversarial effect, too subtle or too obvious', color: 'text-bronze-spice' },
  { range: '1-2', label: 'Failed', description: 'Fails to obstruct or feels like malfunction', color: 'text-bronze-spice' },
];

function getRubricKey(type: string, level?: number): keyof typeof EVALUATION_RUBRIC {
  if (type === 'expand') return 'expand';
  if (type === 'rewrite') {
    if (level === 1) return 'rewrite_1';
    if (level === 2) return 'rewrite_2';
    if (level === 3) return 'rewrite_3';
    return 'rewrite_1'; // default
  }
  return 'expand';
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getScoreColor(score: number): string {
  if (score >= 8) return 'text-palm-leaf';
  if (score >= 6) return 'text-text-secondary';
  return 'text-bronze-spice';
}

function getScoreBg(score: number): string {
  if (score >= 8) return 'bg-palm-leaf/10';
  if (score >= 6) return 'bg-soft-linen-dark/50';
  return 'bg-bronze-spice/10';
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const percentage = (score / 10) * 100;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-text-secondary">{label}</span>
        <span className={`font-medium ${getScoreColor(score)}`}>{score}/10</span>
      </div>
      <div className="h-2 bg-soft-linen-dark rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            score >= 8
              ? 'bg-palm-leaf'
              : score >= 6
                ? 'bg-palm-leaf-2'
                : 'bg-bronze-spice'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function TransformationCard({
  score,
  transformation,
}: {
  score: TransformationScore;
  transformation?: {
    type: string;
    level?: number;
    originalContent: string;
    transformedContent: string;
    latency: number;
  };
}) {
  const [showContent, setShowContent] = useState(false);
  const [showRubric, setShowRubric] = useState(false);
  // Now only adversarialEffectiveness is evaluated (quality handled by real-time gate)
  const effectivenessScore = score.adversarialEffectiveness;

  // Get the relevant rubric for this transformation type
  const rubricKey = transformation
    ? getRubricKey(transformation.type, transformation.level)
    : 'expand';
  const rubric = EVALUATION_RUBRIC[rubricKey];

  return (
    <div
      className={`p-4 rounded-lg border border-soft-linen-dark ${getScoreBg(effectivenessScore)}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="font-mono text-sm text-text-muted">{score.chunkId}</div>
          {transformation && (
            <div className="text-sm mt-1">
              <span className="font-medium">
                {transformation.type.toUpperCase()}
                {transformation.level && ` L${transformation.level}`}
              </span>
              <span className="text-text-muted ml-2">
                {transformation.latency}ms
              </span>
            </div>
          )}
        </div>
        <div className={`text-2xl font-bold ${getScoreColor(effectivenessScore ?? 0)}`}>
          {typeof effectivenessScore === 'number' ? effectivenessScore.toFixed(1) : 'N/A'}
        </div>
      </div>

      <div className="mt-4">
        <ScoreBar label="Adversarial effectiveness" score={score.adversarialEffectiveness} />
      </div>

      {score.notes && (
        <div className="mt-3 text-sm text-text-secondary italic">
          &ldquo;{score.notes}&rdquo;
        </div>
      )}

      {/* Rubric criteria for this transformation type */}
      <div className="mt-4 border-t border-soft-linen-dark pt-3">
        <button
          onClick={() => setShowRubric(!showRubric)}
          className="text-sm text-palm-leaf hover:text-palm-leaf-3 transition-colors flex items-center gap-1"
        >
          <span className="text-xs">{showRubric ? '▼' : '▶'}</span>
          {showRubric ? 'Hide' : 'Show'} scoring criteria ({rubric.label})
        </button>

        {showRubric && (
          <div className="mt-3 p-3 bg-soft-linen/50 rounded-lg">
            <div className="text-xs font-medium text-text-muted mb-2">
              {rubric.description}
            </div>
            <ul className="space-y-1">
              {rubric.criteria.map((criterion, idx) => (
                <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
                  <span className="text-palm-leaf mt-0.5">•</span>
                  {criterion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {transformation && (
        <div className="mt-3">
          <button
            onClick={() => setShowContent(!showContent)}
            className="text-sm text-palm-leaf hover:text-palm-leaf-3 transition-colors flex items-center gap-1"
          >
            <span className="text-xs">{showContent ? '▼' : '▶'}</span>
            {showContent ? 'Hide' : 'Show'} content
          </button>

          {showContent && (
            <div className="mt-3 space-y-3">
              <div>
                <div className="text-xs font-medium text-text-muted mb-1">
                  ORIGINAL
                </div>
                <div className="p-3 bg-soft-linen rounded text-sm text-text-secondary">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: transformation.originalContent,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-text-muted mb-1">
                  TRANSFORMED
                </div>
                <div className="p-3 bg-soft-linen rounded text-sm text-text-secondary">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: transformation.transformedContent,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ReportDetail({ report }: ReportDetailProps) {
  const { batchSummary, transformationScores, originalBatch } = report;

  // Map transformation data by chunkId
  const transformationMap = new Map(
    originalBatch.transformations.map((t) => [t.chunkId, t])
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-text-primary">
            Evaluation report
          </h2>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              batchSummary.passed
                ? 'bg-palm-leaf/10 text-palm-leaf'
                : 'bg-bronze-spice/10 text-bronze-spice'
            }`}
          >
            {batchSummary.passed ? 'PASSED' : 'FAILED'}
          </div>
        </div>
        <div className="text-sm text-text-muted mt-1">
          {formatDate(report.evaluatedAt)}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-soft-linen-light rounded-lg border border-soft-linen-dark">
          <div className={`text-3xl font-bold ${getScoreColor(batchSummary.averageScore ?? 0)}`}>
            {typeof batchSummary.averageScore === 'number' ? batchSummary.averageScore.toFixed(1) : 'N/A'}
          </div>
          <div className="text-sm text-text-muted">Average score</div>
        </div>
        <div className="p-4 bg-soft-linen-light rounded-lg border border-soft-linen-dark">
          <div className="text-3xl font-bold text-text-primary">
            {batchSummary.totalTransformations}
          </div>
          <div className="text-sm text-text-muted">Transformations</div>
        </div>
        <div className="p-4 bg-soft-linen-light rounded-lg border border-soft-linen-dark">
          <div className="text-3xl font-bold text-palm-leaf">
            {batchSummary.totalTransformations - batchSummary.failedTransformations}
          </div>
          <div className="text-sm text-text-muted">Passed</div>
        </div>
        <div className="p-4 bg-soft-linen-light rounded-lg border border-soft-linen-dark">
          <div className="text-3xl font-bold text-bronze-spice">
            {batchSummary.failedTransformations}
          </div>
          <div className="text-sm text-text-muted">Failed</div>
        </div>
      </div>

      {/* Batch Notes */}
      {batchSummary.notes && (
        <div className="p-4 bg-soft-linen-light rounded-lg border border-soft-linen-dark">
          <div className="text-sm font-medium text-text-muted mb-1">
            Evaluator notes
          </div>
          <div className="text-text-secondary">{batchSummary.notes}</div>
        </div>
      )}

      {/* Visitor Info */}
      <div className="p-4 bg-soft-linen-light rounded-lg border border-soft-linen-dark">
        <div className="text-sm font-medium text-text-muted mb-3">
          Visitor information
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          {/* IP Address */}
          <div>
            <div className="text-text-muted">IP address</div>
            <div className="text-text-primary font-mono text-xs">
              {originalBatch.visitor.ip || 'Unknown'}
            </div>
          </div>
          {/* Location */}
          <div>
            <div className="text-text-muted">Location</div>
            <div className="text-text-primary">
              {originalBatch.visitor.location?.city !== 'Unknown' ? (
                <>
                  {originalBatch.visitor.location.city}
                  {originalBatch.visitor.location.region !== 'Unknown' && `, ${originalBatch.visitor.location.region}`}
                  {originalBatch.visitor.location.country !== 'Unknown' && ` (${originalBatch.visitor.location.country})`}
                </>
              ) : (
                'Unknown'
              )}
            </div>
          </div>
          {/* Device */}
          <div>
            <div className="text-text-muted">Device</div>
            <div className="text-text-primary">
              {originalBatch.visitor.device.type} / {originalBatch.visitor.device.browser}
            </div>
          </div>
          {/* OS */}
          <div>
            <div className="text-text-muted">OS</div>
            <div className="text-text-primary">{originalBatch.visitor.device.os}</div>
          </div>
          {/* Viewport */}
          <div>
            <div className="text-text-muted">Viewport</div>
            <div className="text-text-primary">
              {originalBatch.visitor.device.viewport.width} ×{' '}
              {originalBatch.visitor.device.viewport.height}
            </div>
          </div>
          {/* Referrer */}
          <div>
            <div className="text-text-muted">Referrer</div>
            <div className="text-text-primary truncate" title={originalBatch.visitor.referrer || 'Direct'}>
              {originalBatch.visitor.referrer || 'Direct'}
            </div>
          </div>
        </div>
      </div>

      {/* Scoring Guide */}
      <div className="p-4 bg-soft-linen-light rounded-lg border border-soft-linen-dark">
        <div className="text-sm font-medium text-text-muted mb-3">
          Scoring guide
        </div>
        <div className="text-xs text-text-muted mb-3">
          Evaluates adversarial effectiveness only. Content quality is validated in real-time by the quality gate before delivery.
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {SCORING_GUIDE.map((item) => (
            <div key={item.range} className="flex sm:flex-col items-center sm:items-start gap-2 sm:gap-0">
              <div className={`font-mono font-bold ${item.color}`}>{item.range}</div>
              <div className="text-xs text-text-secondary">
                <span className="font-medium">{item.label}</span>
                <span className="hidden sm:inline">: {item.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transformation Scores */}
      <div>
        <h3 className="text-lg font-bold text-text-primary mb-4">
          Transformation scores
        </h3>
        <div className="space-y-4">
          {transformationScores.map((score, index) => (
            <TransformationCard
              key={`${score.chunkId}-${index}`}
              score={score}
              transformation={transformationMap.get(score.chunkId)}
            />
          ))}
        </div>
      </div>

      {/* Raw Data */}
      <details className="text-sm">
        <summary className="cursor-pointer text-text-muted hover:text-text-secondary">
          View raw batch data
        </summary>
        <pre className="mt-2 p-4 bg-soft-linen rounded-lg overflow-auto text-xs">
          {JSON.stringify(originalBatch, null, 2)}
        </pre>
      </details>
    </div>
  );
}

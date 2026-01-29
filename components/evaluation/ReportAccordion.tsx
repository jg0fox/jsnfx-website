'use client';

/**
 * ReportAccordion - Displays evaluation reports as expandable accordion items
 *
 * Single scroll context, mobile-friendly pattern that combines list and detail views.
 */

import React, { useState, useMemo } from 'react';
import type { EvaluationReport, TransformationScore } from '@/types/evaluation';

const REPORTS_PER_PAGE = 10;

export interface ReportAccordionProps {
  reports: EvaluationReport[];
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

function getRubricKey(type: string, level?: number): keyof typeof EVALUATION_RUBRIC {
  if (type === 'expand') return 'expand';
  if (type === 'rewrite') {
    if (level === 1) return 'rewrite_1';
    if (level === 2) return 'rewrite_2';
    if (level === 3) return 'rewrite_3';
    return 'rewrite_1';
  }
  return 'expand';
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatShortDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
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
  const effectivenessScore = score.adversarialEffectiveness;

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

      {/* Rubric criteria */}
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

function AccordionItem({ report, isOpen, onToggle }: {
  report: EvaluationReport;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const { batchSummary, transformationScores, originalBatch } = report;
  const location = originalBatch?.visitor?.location;

  const transformationMap = new Map(
    originalBatch.transformations.map((t) => [t.chunkId, t])
  );

  return (
    <div className="border border-soft-linen-dark rounded-lg overflow-hidden bg-soft-linen-light">
      {/* Collapsed header - always visible */}
      <button
        onClick={onToggle}
        className="w-full text-left p-4 hover:bg-soft-linen/50 transition-colors"
      >
        <div className="flex items-center justify-between gap-4">
          {/* Left: chevron + batch info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <span className={`text-text-muted transition-transform ${isOpen ? 'rotate-90' : ''}`}>
              ▶
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-text-primary">
                  Batch {report.batchId.slice(-8)}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    batchSummary.passed
                      ? 'bg-palm-leaf/10 text-palm-leaf'
                      : 'bg-bronze-spice/10 text-bronze-spice'
                  }`}
                >
                  {batchSummary.passed ? 'PASSED' : 'FAILED'}
                </span>
              </div>
              <div className="text-sm text-text-muted mt-0.5 flex items-center gap-2 flex-wrap">
                <span>{formatShortDate(report.evaluatedAt)}</span>
                {location && location.city !== 'Unknown' && (
                  <span className="text-xs">
                    {location.city}, {location.country}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: score + transform count */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right hidden sm:block">
              <div className="text-sm text-text-muted">
                {batchSummary.totalTransformations} transform{batchSummary.totalTransformations !== 1 ? 's' : ''}
              </div>
              {batchSummary.failedTransformations > 0 && (
                <div className="text-xs text-bronze-spice">
                  {batchSummary.failedTransformations} failed
                </div>
              )}
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(batchSummary.averageScore ?? 0)}`}>
              {typeof batchSummary.averageScore === 'number' ? batchSummary.averageScore.toFixed(1) : 'N/A'}
            </div>
          </div>
        </div>
      </button>

      {/* Expanded content */}
      {isOpen && (
        <div className="border-t border-soft-linen-dark p-4 md:p-6 space-y-6 bg-white/50">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-soft-linen rounded-lg">
              <div className={`text-2xl font-bold ${getScoreColor(batchSummary.averageScore ?? 0)}`}>
                {typeof batchSummary.averageScore === 'number' ? batchSummary.averageScore.toFixed(1) : 'N/A'}
              </div>
              <div className="text-xs text-text-muted">Average score</div>
            </div>
            <div className="p-3 bg-soft-linen rounded-lg">
              <div className="text-2xl font-bold text-text-primary">
                {batchSummary.totalTransformations}
              </div>
              <div className="text-xs text-text-muted">Transformations</div>
            </div>
            <div className="p-3 bg-soft-linen rounded-lg">
              <div className="text-2xl font-bold text-palm-leaf">
                {batchSummary.totalTransformations - batchSummary.failedTransformations}
              </div>
              <div className="text-xs text-text-muted">Passed</div>
            </div>
            <div className="p-3 bg-soft-linen rounded-lg">
              <div className="text-2xl font-bold text-bronze-spice">
                {batchSummary.failedTransformations}
              </div>
              <div className="text-xs text-text-muted">Failed</div>
            </div>
          </div>

          {/* Evaluator Notes */}
          {batchSummary.notes && (
            <div className="p-4 bg-soft-linen rounded-lg">
              <div className="text-xs font-medium text-text-muted mb-1">
                Evaluator notes
              </div>
              <div className="text-sm text-text-secondary">{batchSummary.notes}</div>
            </div>
          )}

          {/* Visitor Info */}
          <details className="group">
            <summary className="cursor-pointer text-sm text-palm-leaf hover:text-palm-leaf-3 transition-colors flex items-center gap-1">
              <span className="text-xs group-open:rotate-90 transition-transform">▶</span>
              Visitor information
            </summary>
            <div className="mt-3 p-4 bg-soft-linen rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-text-muted text-xs">IP address</div>
                  <div className="text-text-primary font-mono text-xs">
                    {originalBatch.visitor.ip || 'Unknown'}
                  </div>
                </div>
                <div>
                  <div className="text-text-muted text-xs">Location</div>
                  <div className="text-text-primary text-sm">
                    {location?.city !== 'Unknown' ? (
                      <>
                        {location.city}
                        {location.region !== 'Unknown' && `, ${location.region}`}
                        {location.country !== 'Unknown' && ` (${location.country})`}
                      </>
                    ) : (
                      'Unknown'
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-text-muted text-xs">Device</div>
                  <div className="text-text-primary text-sm">
                    {originalBatch.visitor.device.type} / {originalBatch.visitor.device.browser}
                  </div>
                </div>
                <div>
                  <div className="text-text-muted text-xs">OS</div>
                  <div className="text-text-primary text-sm">{originalBatch.visitor.device.os}</div>
                </div>
                <div>
                  <div className="text-text-muted text-xs">Viewport</div>
                  <div className="text-text-primary text-sm">
                    {originalBatch.visitor.device.viewport.width} ×{' '}
                    {originalBatch.visitor.device.viewport.height}
                  </div>
                </div>
                <div>
                  <div className="text-text-muted text-xs">Referrer</div>
                  <div className="text-text-primary text-sm truncate" title={originalBatch.visitor.referrer || 'Direct'}>
                    {originalBatch.visitor.referrer || 'Direct'}
                  </div>
                </div>
              </div>
            </div>
          </details>

          {/* Transformation Scores */}
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-3">
              Transformation scores
            </h4>
            <div className="space-y-3">
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
            <summary className="cursor-pointer text-text-muted hover:text-text-secondary flex items-center gap-1">
              <span className="text-xs">▶</span>
              View raw batch data
            </summary>
            <pre className="mt-2 p-4 bg-soft-linen rounded-lg overflow-auto text-xs">
              {JSON.stringify(originalBatch, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}

export function ReportAccordion({ reports }: ReportAccordionProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Filter out empty batches (pre-generated content that was skipped)
  const filteredReports = useMemo(() => {
    return reports.filter(r => r.batchSummary.totalTransformations > 0);
  }, [reports]);

  const [openReportId, setOpenReportId] = useState<string | null>(
    filteredReports.length > 0 ? filteredReports[0].batchId : null
  );

  const totalPages = Math.ceil(filteredReports.length / REPORTS_PER_PAGE);

  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * REPORTS_PER_PAGE;
    return filteredReports.slice(start, start + REPORTS_PER_PAGE);
  }, [filteredReports, currentPage]);

  if (filteredReports.length === 0) {
    return (
      <div className="text-center py-12 text-text-muted">
        <p>No evaluation reports yet.</p>
        <p className="text-sm mt-2">
          Reports are generated when transformations are evaluated.
        </p>
      </div>
    );
  }

  const handleToggle = (batchId: string) => {
    setOpenReportId(openReportId === batchId ? null : batchId);
  };

  return (
    <div className="space-y-4">
      {/* Report count */}
      <div className="text-sm text-text-muted">
        {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''} total
      </div>

      {/* Accordion list */}
      <div className="space-y-3">
        {paginatedReports.map((report) => (
          <AccordionItem
            key={report.batchId}
            report={report}
            isOpen={openReportId === report.batchId}
            onToggle={() => handleToggle(report.batchId)}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-soft-linen-dark">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-2 text-sm rounded-lg border transition-colors min-h-[44px] ${
              currentPage === 1
                ? 'border-soft-linen-dark text-text-muted cursor-not-allowed'
                : 'border-palm-leaf/30 text-palm-leaf hover:bg-palm-leaf/10'
            }`}
          >
            ← Previous
          </button>

          <span className="text-sm text-text-muted">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 text-sm rounded-lg border transition-colors min-h-[44px] ${
              currentPage === totalPages
                ? 'border-soft-linen-dark text-text-muted cursor-not-allowed'
                : 'border-palm-leaf/30 text-palm-leaf hover:bg-palm-leaf/10'
            }`}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

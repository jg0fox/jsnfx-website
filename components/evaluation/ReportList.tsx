'use client';

/**
 * ReportList - Displays a list of evaluation reports
 */

import React from 'react';
import type { EvaluationReport } from '@/types/evaluation';

export interface ReportListProps {
  reports: EvaluationReport[];
  selectedId?: string;
  onSelect: (report: EvaluationReport) => void;
}

function formatDate(isoString: string): string {
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

export function ReportList({ reports, selectedId, onSelect }: ReportListProps) {
  if (reports.length === 0) {
    return (
      <div className="text-center py-12 text-text-muted">
        <p>No evaluation reports yet.</p>
        <p className="text-sm mt-2">
          Reports are generated when transformations are evaluated.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {reports.map((report) => {
        const isSelected = report.batchId === selectedId;
        const { batchSummary } = report;

        return (
          <button
            key={report.batchId}
            onClick={() => onSelect(report)}
            className={`
              w-full text-left p-4 rounded-lg border transition-colors
              ${
                isSelected
                  ? 'bg-palm-leaf/10 border-palm-leaf'
                  : 'bg-soft-linen-light border-soft-linen-dark hover:border-palm-leaf/50'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-text-primary">
                  Batch {report.batchId.slice(-8)}
                </div>
                <div className="text-sm text-text-muted">
                  {formatDate(report.evaluatedAt)}
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`text-2xl font-bold ${getScoreColor(
                    batchSummary.averageScore
                  )}`}
                >
                  {batchSummary.averageScore.toFixed(1)}
                </div>
                <div
                  className={`text-xs font-medium ${
                    batchSummary.passed ? 'text-palm-leaf' : 'text-bronze-spice'
                  }`}
                >
                  {batchSummary.passed ? 'PASSED' : 'FAILED'}
                </div>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-4 text-sm text-text-muted">
              <span>{batchSummary.totalTransformations} transforms</span>
              {batchSummary.failedTransformations > 0 && (
                <span className="text-bronze-spice">
                  {batchSummary.failedTransformations} failed
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

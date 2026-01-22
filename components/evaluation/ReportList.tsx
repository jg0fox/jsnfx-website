'use client';

/**
 * ReportList - Displays a paginated list of evaluation reports
 */

import React, { useState, useMemo } from 'react';
import type { EvaluationReport } from '@/types/evaluation';

const REPORTS_PER_PAGE = 10;

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
  const [currentPage, setCurrentPage] = useState(1);

  // Filter out empty batches (pre-generated content that was skipped)
  const filteredReports = useMemo(() => {
    return reports.filter(r => r.batchSummary.totalTransformations > 0);
  }, [reports]);

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

  return (
    <div className="space-y-4">
      {/* Report count */}
      <div className="text-sm text-text-muted">
        {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''} total
      </div>

      {/* Report list */}
      <div className="space-y-2">
        {paginatedReports.map((report) => {
          const isSelected = report.batchId === selectedId;
          const { batchSummary, originalBatch } = report;
          const location = originalBatch?.visitor?.location;

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
                  {location && location.city !== 'Unknown' && (
                    <div className="text-xs text-text-muted mt-1">
                      📍 {location.city}, {location.country}
                    </div>
                  )}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-soft-linen-dark">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
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
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
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

'use client';

/**
 * Evaluation Reports Page
 *
 * Displays evaluation reports for adversarial transformations.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ReportAccordion } from '@/components/evaluation';
import type { EvaluationReport } from '@/types/evaluation';

export default function EvaluationPage() {
  const [reports, setReports] = useState<EvaluationReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch reports on mount
  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await fetch('/api/reports');

        if (!response.ok) {
          if (response.status === 503) {
            setError('Redis not configured. Reports cannot be loaded.');
          } else {
            setError('Failed to load reports.');
          }
          return;
        }

        const data = await response.json();
        setReports(data.reports || []);
      } catch (err) {
        console.error('Failed to fetch reports:', err);
        setError('Failed to connect to the server.');
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  // Refresh reports periodically
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/reports');
        if (response.ok) {
          const data = await response.json();
          setReports(data.reports || []);
        }
      } catch {
        // Silently ignore refresh errors
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Filter out empty batches (pre-generated content that was skipped)
  const filteredReports = useMemo(() => {
    return reports.filter(r => r.batchSummary.totalTransformations > 0);
  }, [reports]);

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-text-primary mb-2">
          Evaluation reports
        </h1>
        <p className="text-text-secondary">
          Review how adversarial transformations are performing against the
          quality rubric.
        </p>
      </div>

      {/* Debug Panel Tip */}
      <div className="mb-8 p-4 bg-palm-leaf/10 border border-palm-leaf/20 rounded-lg max-w-4xl">
        <div className="flex items-start gap-3">
          <span className="text-palm-leaf text-lg">💡</span>
          <div>
            <div className="font-medium text-text-primary">
              Want to see transformations in real-time?
            </div>
            <p className="text-sm text-text-secondary mt-1">
              Press <kbd className="px-1.5 py-0.5 bg-soft-linen-dark rounded text-xs font-mono">⌘</kbd> + <kbd className="px-1.5 py-0.5 bg-soft-linen-dark rounded text-xs font-mono">Shift</kbd> + <kbd className="px-1.5 py-0.5 bg-soft-linen-dark rounded text-xs font-mono">D</kbd> on any page to open the debug panel.
              It shows the current behavior mode, scroll velocity, idle time, and transformation activity as it happens.
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-text-muted">Loading reports...</div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-6 bg-bronze-spice/10 border border-bronze-spice/20 rounded-lg">
          <div className="text-bronze-spice font-medium">Error</div>
          <div className="text-text-secondary mt-1">{error}</div>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <div className="max-w-4xl">
          <ReportAccordion reports={reports} />
        </div>
      )}

      {/* Stats Summary */}
      {!loading && !error && filteredReports.length > 0 && (
        <div className="mt-12 pt-8 border-t border-soft-linen-dark max-w-4xl">
          <h2 className="text-lg font-bold text-text-primary mb-4">
            Overall statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Total reports"
              value={filteredReports.length}
            />
            <StatCard
              label="Pass rate"
              value={`${Math.round(
                (filteredReports.filter((r) => r.batchSummary.passed).length / filteredReports.length) *
                  100
              )}%`}
              color={
                filteredReports.filter((r) => r.batchSummary.passed).length / filteredReports.length >=
                0.8
                  ? 'palm-leaf'
                  : 'bronze-spice'
              }
            />
            <StatCard
              label="Avg score"
              value={
                (
                  filteredReports.reduce((sum, r) => sum + r.batchSummary.averageScore, 0) /
                  filteredReports.length
                ).toFixed(1)
              }
            />
            <StatCard
              label="Total transforms"
              value={filteredReports.reduce(
                (sum, r) => sum + r.batchSummary.totalTransformations,
                0
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  color = 'text-primary',
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="p-4 bg-soft-linen-light rounded-lg border border-soft-linen-dark">
      <div className={`text-3xl font-bold text-${color}`}>{value}</div>
      <div className="text-sm text-text-muted">{label}</div>
    </div>
  );
}

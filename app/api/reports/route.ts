/**
 * GET /api/reports
 *
 * Fetch evaluation reports from Redis.
 * Supports pagination and filtering.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getRecentReports, getReport, isRedisConfigured } from '@/lib/redis';
import type { EvaluationReport, ReportsResponse } from '@/types/evaluation';

export const runtime = 'nodejs';

export async function GET(request: NextRequest): Promise<NextResponse> {
  // Check if Redis is configured
  if (!isRedisConfigured()) {
    return NextResponse.json(
      { error: 'Redis not configured' },
      { status: 503 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);

    // Get specific report by ID
    const batchId = searchParams.get('batchId');
    if (batchId) {
      const report = await getReport(batchId);
      if (!report) {
        return NextResponse.json(
          { error: 'Report not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ report });
    }

    // Get list of recent reports
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 50;

    // Get recent batch IDs
    const batchIds = await getRecentReports(Math.min(limit, 100));

    // Fetch each report
    const reports: EvaluationReport[] = [];
    for (const id of batchIds) {
      const report = await getReport(id);
      if (report) {
        reports.push(report as EvaluationReport);
      }
    }

    const response: ReportsResponse = { reports };
    return NextResponse.json(response);
  } catch (error) {
    console.error('[Reports] Error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

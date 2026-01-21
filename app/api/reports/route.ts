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
    let batchIds: string[] = [];
    try {
      batchIds = await getRecentReports(Math.min(limit, 100));
    } catch (redisError) {
      console.error('[Reports] Redis error fetching batch IDs:', redisError);
      // Return empty array if Redis fails (e.g., key doesn't exist)
      batchIds = [];
    }

    // If no reports, return empty array
    if (!batchIds || batchIds.length === 0) {
      return NextResponse.json({ reports: [] });
    }

    // Fetch each report
    const reports: EvaluationReport[] = [];
    for (const id of batchIds) {
      try {
        const report = await getReport(id);
        if (report) {
          reports.push(report as EvaluationReport);
        }
      } catch (reportError) {
        console.error(`[Reports] Error fetching report ${id}:`, reportError);
        // Continue with other reports
      }
    }

    const response: ReportsResponse = { reports };
    return NextResponse.json(response);
  } catch (error) {
    console.error('[Reports] Error:', error);

    // Return more detailed error for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch reports', details: errorMessage },
      { status: 500 }
    );
  }
}

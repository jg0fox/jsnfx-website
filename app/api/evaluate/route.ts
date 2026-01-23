/**
 * POST /api/evaluate
 *
 * DEPRECATED: This endpoint is no longer used.
 * Evaluation has been removed as part of the static content transformation refactor.
 *
 * Previously: Evaluate a batch of transformations using Claude Sonnet.
 */

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(): Promise<NextResponse> {
  return NextResponse.json(
    {
      error: 'This endpoint has been deprecated. Evaluation is no longer part of the transformation system.',
      deprecated: true,
      reason: 'Content transformation now uses pre-written static content, eliminating the need for quality evaluation.',
    },
    { status: 410 }
  );
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      error: 'This endpoint has been deprecated.',
      deprecated: true,
    },
    { status: 410 }
  );
}

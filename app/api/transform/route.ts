/**
 * POST /api/transform
 *
 * DEPRECATED: This endpoint is no longer used.
 * Content transformation now uses pre-written static content from jsnfx-content directory.
 *
 * Previously: Transform content using Claude Haiku.
 */

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(): Promise<NextResponse> {
  return NextResponse.json(
    {
      error: 'This endpoint has been deprecated. Content transformation now uses static pre-written content.',
      deprecated: true,
      migration: 'Use /api/static-content instead',
    },
    { status: 410 }
  );
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      error: 'This endpoint has been deprecated.',
      deprecated: true,
      migration: 'Use /api/static-content instead',
    },
    { status: 410 }
  );
}

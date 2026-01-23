/**
 * Static Content API
 *
 * Serves pre-written rewritten content from jsnfx-content directory.
 * Used by client-side ContentTransformer to fetch content at different levels.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  loadStaticContent,
  pathToContentPath,
  type ContentLevel,
} from '@/lib/static-content';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const routePath = searchParams.get('path') || '/';
  const level = parseInt(searchParams.get('level') || '1', 10) as ContentLevel;

  // Validate level
  if (level < 1 || level > 4) {
    return NextResponse.json(
      { error: 'Level must be between 1 and 4' },
      { status: 400 }
    );
  }

  try {
    const content = loadStaticContent(routePath);

    if (!content) {
      return NextResponse.json(
        { error: `Content not found for path: ${routePath}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      path: pathToContentPath(routePath),
      level,
      original: content.original,
      rewritten: content.levels[level],
      metadata: content.metadata,
    });
  } catch (error) {
    console.error('[static-content-api] Error:', error);
    return NextResponse.json(
      { error: 'Failed to load content' },
      { status: 500 }
    );
  }
}

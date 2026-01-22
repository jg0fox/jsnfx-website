/**
 * Expanded Content API
 *
 * Serves pre-generated content expansions for the EXPAND mode feature.
 *
 * GET /api/expanded?hash={contentHash}
 * Returns a random expansion for the given content hash
 *
 * GET /api/expanded?hash={contentHash}&version={n}
 * Returns a specific version
 *
 * GET /api/expanded/stats
 * Returns overall expansion statistics
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  hashContent,
  findChunkByHash,
  getRandomExpansion,
  getExpandedContent,
  getExpansionStats,
  getTotalStats,
} from '@/lib/expanded-content';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const hash = searchParams.get('hash');
  const content = searchParams.get('content');
  const versionParam = searchParams.get('version');
  const statsOnly = searchParams.get('stats');

  // Return overall stats
  if (statsOnly === 'true') {
    const stats = getTotalStats();
    if (!stats) {
      return NextResponse.json(
        { error: 'No expansion data available' },
        { status: 404 }
      );
    }
    return NextResponse.json(stats);
  }

  // Get hash from content if provided
  let contentHash = hash;
  if (!contentHash && content) {
    contentHash = hashContent(content);
  }

  if (!contentHash) {
    return NextResponse.json(
      { error: 'Missing hash or content parameter' },
      { status: 400 }
    );
  }

  // Find chunk by hash
  const chunkId = findChunkByHash(contentHash);
  if (!chunkId) {
    return NextResponse.json(
      { error: 'No expansion found for this content', hash: contentHash },
      { status: 404 }
    );
  }

  // Get specific version or random
  if (versionParam) {
    const version = parseInt(versionParam, 10);
    const expandedContent = getExpandedContent(chunkId, version);

    if (!expandedContent) {
      return NextResponse.json(
        { error: `Version ${version} not found for chunk ${chunkId}` },
        { status: 404 }
      );
    }

    const stats = getExpansionStats(chunkId);
    return NextResponse.json({
      chunkId,
      version,
      content: expandedContent,
      stats,
    });
  }

  // Return random expansion
  const expansion = getRandomExpansion(chunkId);
  if (!expansion) {
    return NextResponse.json(
      { error: 'No passing expansions available for this chunk' },
      { status: 404 }
    );
  }

  const stats = getExpansionStats(chunkId);
  return NextResponse.json({
    chunkId,
    version: expansion.version,
    content: expansion.content,
    stats,
  });
}

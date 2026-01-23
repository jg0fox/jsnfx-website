/**
 * Static Content Loader
 *
 * Loads pre-written rewritten content from jsnfx-content directory.
 * Maps site routes to their corresponding static content at 4 escalation levels.
 */

import fs from 'fs';
import path from 'path';

export type ContentLevel = 1 | 2 | 3 | 4;

export interface StaticContentMetadata {
  title: string;
  page_type: string;
  summary: string;
  tags: string[];
  url: string;
}

export interface StaticContent {
  metadata: StaticContentMetadata;
  original: string;
  levels: {
    1: string; // subtle
    2: string; // noticeable
    3: string; // hostile
    4: string; // very hostile
  };
}

// Level to filename suffix mapping
const LEVEL_SUFFIXES: Record<ContentLevel, string> = {
  1: 'subtle',
  2: 'noticeable',
  3: 'hostile',
  4: 'very-hostile',
};

const CONTENT_DIR = path.join(process.cwd(), 'jsnfx-content');

// Cache for loaded content
const contentCache = new Map<string, StaticContent>();

/**
 * Convert a URL path to the content directory path
 * e.g., '/portfolio/chime' -> 'portfolio/chime'
 *       '/' -> 'index'
 */
export function pathToContentPath(urlPath: string): string {
  const cleanPath = urlPath.replace(/^\/+|\/+$/g, '');
  return cleanPath === '' ? 'index' : cleanPath;
}

/**
 * Load static content for a given route
 */
export function loadStaticContent(routePath: string): StaticContent | null {
  const contentPath = pathToContentPath(routePath);

  // Check cache first
  if (contentCache.has(contentPath)) {
    return contentCache.get(contentPath)!;
  }

  const dirPath = path.join(CONTENT_DIR, contentPath);

  // Check if directory exists
  if (!fs.existsSync(dirPath)) {
    console.warn(`[static-content] Content directory not found: ${dirPath}`);
    return null;
  }

  try {
    // Load metadata
    const metadataPath = path.join(dirPath, 'metadata.json');
    if (!fs.existsSync(metadataPath)) {
      console.warn(`[static-content] Metadata not found: ${metadataPath}`);
      return null;
    }
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));

    // Load original content
    const originalPath = path.join(dirPath, 'content.md');
    const original = fs.existsSync(originalPath)
      ? fs.readFileSync(originalPath, 'utf-8')
      : '';

    // Load all levels
    const levels = {} as StaticContent['levels'];
    for (const [level, suffix] of Object.entries(LEVEL_SUFFIXES)) {
      const levelPath = path.join(dirPath, `content-${suffix}.md`);
      levels[Number(level) as ContentLevel] = fs.existsSync(levelPath)
        ? fs.readFileSync(levelPath, 'utf-8')
        : original; // Fall back to original if level doesn't exist
    }

    const content: StaticContent = {
      metadata,
      original,
      levels,
    };

    // Cache and return
    contentCache.set(contentPath, content);
    return content;
  } catch (error) {
    console.error(`[static-content] Error loading content for ${contentPath}:`, error);
    return null;
  }
}

/**
 * Parse markdown content into individual sections/paragraphs
 * Returns an array of { id, type, content } objects
 */
export interface ContentSection {
  id: string;
  type: 'heading' | 'paragraph' | 'list-item' | 'blockquote';
  content: string;
  level?: number; // For headings (1-6)
}

export function parseMarkdownSections(markdown: string): ContentSection[] {
  const sections: ContentSection[] = [];
  const lines = markdown.split('\n');
  let currentParagraph = '';
  let sectionIndex = 0;

  const flushParagraph = () => {
    if (currentParagraph.trim()) {
      sections.push({
        id: `p-${sectionIndex++}`,
        type: 'paragraph',
        content: currentParagraph.trim(),
      });
      currentParagraph = '';
    }
  };

  for (const line of lines) {
    // Heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      sections.push({
        id: `h-${sectionIndex++}`,
        type: 'heading',
        level: headingMatch[1].length,
        content: headingMatch[2],
      });
      continue;
    }

    // List item
    const listMatch = line.match(/^[-*]\s+(.+)$/);
    if (listMatch) {
      flushParagraph();
      sections.push({
        id: `li-${sectionIndex++}`,
        type: 'list-item',
        content: listMatch[1],
      });
      continue;
    }

    // Blockquote
    const blockquoteMatch = line.match(/^>\s*(.+)$/);
    if (blockquoteMatch) {
      flushParagraph();
      sections.push({
        id: `bq-${sectionIndex++}`,
        type: 'blockquote',
        content: blockquoteMatch[1],
      });
      continue;
    }

    // Empty line = paragraph break
    if (line.trim() === '') {
      flushParagraph();
      continue;
    }

    // Regular text - accumulate into paragraph
    currentParagraph += (currentParagraph ? ' ' : '') + line;
  }

  // Don't forget the last paragraph
  flushParagraph();

  return sections;
}

/**
 * Get a map of original content -> rewritten content at a given level
 * This allows mapping individual chunks/sentences to their rewritten versions
 */
export function getContentMapping(
  routePath: string,
  level: ContentLevel
): Map<string, string> | null {
  const content = loadStaticContent(routePath);
  if (!content) return null;

  const originalSections = parseMarkdownSections(content.original);
  const rewrittenSections = parseMarkdownSections(content.levels[level]);

  const mapping = new Map<string, string>();

  // Match sections by position and type
  for (let i = 0; i < originalSections.length; i++) {
    const original = originalSections[i];
    const rewritten = rewrittenSections[i];

    if (rewritten && original.type === rewritten.type) {
      mapping.set(original.content, rewritten.content);
    }
  }

  return mapping;
}

/**
 * Get all available content paths from the manifest
 */
export function getAllContentPaths(): string[] {
  const manifestPath = path.join(CONTENT_DIR, '_manifest.json');

  if (!fs.existsSync(manifestPath)) {
    console.warn('[static-content] Manifest not found');
    return [];
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    return manifest.pages.map((p: { local_path: string }) => p.local_path);
  } catch (error) {
    console.error('[static-content] Error loading manifest:', error);
    return [];
  }
}

/**
 * Clear the content cache (useful for development)
 */
export function clearContentCache(): void {
  contentCache.clear();
}

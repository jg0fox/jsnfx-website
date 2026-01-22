#!/usr/bin/env npx ts-node

/**
 * Content Scanner for Expansion Pipeline
 *
 * Scans all MDX content and JSX pages to create an inventory of expandable chunks.
 * Outputs: content/expanded/manifest.json
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import matter from 'gray-matter';

// Types
interface ContentChunk {
  chunkId: string;
  sourcePath: string;
  sourceType: 'mdx' | 'jsx';
  elementType: string;
  originalContent: string;
  originalWordCount: number;
  originalHash: string;
  context?: string; // Section heading this belongs to
}

interface Manifest {
  generatedAt: string;
  model: string;
  thinkingEnabled: boolean;
  expansionTarget: string;
  totalChunks: number;
  totalVersions: number;
  chunks: ManifestChunk[];
}

interface ManifestChunk {
  chunkId: string;
  sourcePath: string;
  sourceType: 'mdx' | 'jsx';
  elementType: string;
  originalWordCount: number;
  originalHash: string;
  context?: string;
  versions: ManifestVersion[];
}

interface ManifestVersion {
  version: number;
  strategy: string;
  wordCount: number;
  expansionRatio: number;
  evaluation: {
    adversarialEffectiveness: number;
    contentIntegrity: number;
    technicalQuality: number;
    average: number;
    passed: boolean;
  };
  generatedAt: string;
  retryCount: number;
}

// Directories
const CONTENT_DIR = path.join(process.cwd(), 'content');
const EXPANDED_DIR = path.join(CONTENT_DIR, 'expanded');
const CHUNKS_DIR = path.join(EXPANDED_DIR, 'chunks');
const MANIFEST_PATH = path.join(EXPANDED_DIR, 'manifest.json');

// Minimum word count for a chunk to be worth expanding
const MIN_WORD_COUNT = 8;

/**
 * Generate a short hash from content
 * Normalizes both HTML and Markdown syntax to produce consistent hashes
 * IMPORTANT: This must match lib/expanded-content.ts hashContent()
 */
function hashContent(content: string): string {
  const normalized = content
    // Strip HTML tags
    .replace(/<[^>]*>/g, '')
    // Strip markdown formatting (bold, italic, etc.)
    .replace(/\*\*([^*]+)\*\*/g, '$1')  // **bold**
    .replace(/\*([^*]+)\*/g, '$1')       // *italic*
    .replace(/__([^_]+)__/g, '$1')       // __bold__
    .replace(/_([^_]+)_/g, '$1')         // _italic_
    .replace(/`([^`]+)`/g, '$1')         // `code`
    .replace(/~~([^~]+)~~/g, '$1')       // ~~strikethrough~~
    // Strip markdown links [text](url) → text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Strip markdown images ![alt](url) → alt
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Strip heading markers
    .replace(/^#{1,6}\s+/gm, '')
    // Strip list markers
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    // Lowercase and normalize whitespace
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
  return crypto.createHash('md5').update(normalized).digest('hex').slice(0, 8);
}

/**
 * Count words in content (strip HTML/markdown first)
 */
function countWords(content: string): number {
  const text = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/[#*_`\[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return 0;
  return text.split(/\s+/).length;
}

/**
 * Generate stable chunk ID
 */
function generateChunkId(sourcePath: string, elementType: string, hash: string): string {
  // Extract meaningful path segment
  const pathParts = sourcePath.split('/');
  let prefix = '';

  if (sourcePath.includes('portfolio/')) {
    const idx = pathParts.indexOf('portfolio');
    prefix = `portfolio-${pathParts[idx + 1]}`;
  } else if (sourcePath.includes('projects/')) {
    const idx = pathParts.indexOf('projects');
    prefix = `projects-${pathParts[idx + 1]}`;
  } else if (sourcePath.includes('page.tsx')) {
    prefix = 'home';
  } else {
    prefix = pathParts[pathParts.length - 1].replace(/\.[^.]+$/, '');
  }

  return `${prefix}-${elementType}-${hash}`;
}

/**
 * Parse markdown content into chunks
 */
function parseMarkdownChunks(content: string, sourcePath: string): ContentChunk[] {
  const chunks: ContentChunk[] = [];
  const lines = content.split('\n');

  let currentContext = '';
  let currentParagraph = '';
  let inCodeBlock = false;
  let inList = false;
  let listItems: string[] = [];

  const flushParagraph = () => {
    const trimmed = currentParagraph.trim();
    if (trimmed && countWords(trimmed) >= MIN_WORD_COUNT) {
      // Skip if it's just an image or link
      if (!trimmed.match(/^!\[.*\]\(.*\)$/) && !trimmed.match(/^\[.*\]\(.*\)$/)) {
        const hash = hashContent(trimmed);
        chunks.push({
          chunkId: generateChunkId(sourcePath, 'p', hash),
          sourcePath,
          sourceType: 'mdx',
          elementType: 'p',
          originalContent: trimmed,
          originalWordCount: countWords(trimmed),
          originalHash: hash,
          context: currentContext || undefined,
        });
      }
    }
    currentParagraph = '';
  };

  const flushList = () => {
    if (listItems.length > 0) {
      // Process each list item as a potential chunk
      for (const item of listItems) {
        const trimmed = item.trim();
        if (countWords(trimmed) >= MIN_WORD_COUNT) {
          const hash = hashContent(trimmed);
          chunks.push({
            chunkId: generateChunkId(sourcePath, 'li', hash),
            sourcePath,
            sourceType: 'mdx',
            elementType: 'li',
            originalContent: trimmed,
            originalWordCount: countWords(trimmed),
            originalHash: hash,
            context: currentContext || undefined,
          });
        }
      }
      listItems = [];
    }
    inList = false;
  };

  for (const line of lines) {
    // Skip code blocks
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    // Skip frontmatter delimiter
    if (line === '---') continue;

    // Skip empty lines (but they end paragraphs)
    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      currentContext = text;

      if (countWords(text) >= 3) { // Headings need at least 3 words
        const hash = hashContent(text);
        chunks.push({
          chunkId: generateChunkId(sourcePath, `h${level}`, hash),
          sourcePath,
          sourceType: 'mdx',
          elementType: `h${level}`,
          originalContent: text,
          originalWordCount: countWords(text),
          originalHash: hash,
        });
      }
      continue;
    }

    // List items
    const listMatch = line.match(/^[\s]*[-*+]|\d+\.\s+(.+)$/);
    if (listMatch || line.match(/^\s*[-*+]\s+/) || line.match(/^\s*\d+\.\s+/)) {
      flushParagraph();
      inList = true;
      const itemText = line.replace(/^[\s]*[-*+]\s*/, '').replace(/^\s*\d+\.\s*/, '').trim();
      if (itemText) {
        listItems.push(itemText);
      }
      continue;
    }

    // Blockquotes
    if (line.startsWith('>')) {
      flushParagraph();
      flushList();
      const quoteText = line.replace(/^>\s*/, '').trim();
      if (countWords(quoteText) >= MIN_WORD_COUNT) {
        const hash = hashContent(quoteText);
        chunks.push({
          chunkId: generateChunkId(sourcePath, 'blockquote', hash),
          sourcePath,
          sourceType: 'mdx',
          elementType: 'blockquote',
          originalContent: quoteText,
          originalWordCount: countWords(quoteText),
          originalHash: hash,
          context: currentContext || undefined,
        });
      }
      continue;
    }

    // Skip images and standalone links
    if (line.match(/^!\[.*\]\(.*\)$/)) continue;
    if (line.match(/^\[.*\]\(.*\)$/) && countWords(line) < MIN_WORD_COUNT) continue;

    // Skip italic caption lines (like *Learn more...*)
    if (line.match(/^\*[^*]+\*$/) && countWords(line) < MIN_WORD_COUNT) continue;

    // Regular paragraph content
    if (inList) {
      flushList();
    }
    currentParagraph += (currentParagraph ? ' ' : '') + line.trim();
  }

  // Flush any remaining content
  flushParagraph();
  flushList();

  return chunks;
}

/**
 * Extract prose content from JSX/TSX files
 */
function parseJSXChunks(content: string, sourcePath: string): ContentChunk[] {
  const chunks: ContentChunk[] = [];

  // Extract content from JSX elements
  // Match <p>...</p>, <h1>...</h1>, etc.
  const patterns = [
    { regex: /<p[^>]*>([^<]+(?:<[^/][^>]*>[^<]*<\/[^>]+>)*[^<]*)<\/p>/g, type: 'p' },
    { regex: /<h1[^>]*>([^<]+)<\/h1>/g, type: 'h1' },
    { regex: /<h2[^>]*>([^<]+)<\/h2>/g, type: 'h2' },
    { regex: /<h3[^>]*>([^<]+)<\/h3>/g, type: 'h3' },
    { regex: /<li[^>]*>([^<]+)<\/li>/g, type: 'li' },
  ];

  // Also extract from template literals and string props
  // description: "...", description: `...`
  const stringPatterns = [
    /description:\s*["'`]([^"'`]+)["'`]/g,
    /title:\s*["'`]([^"'`]+)["'`]/g,
  ];

  for (const { regex, type } of patterns) {
    let match;
    while ((match = regex.exec(content)) !== null) {
      const text = match[1]
        .replace(/<[^>]*>/g, '')
        .replace(/\{[^}]*\}/g, '')
        .trim();

      if (countWords(text) >= MIN_WORD_COUNT) {
        const hash = hashContent(text);
        chunks.push({
          chunkId: generateChunkId(sourcePath, type, hash),
          sourcePath,
          sourceType: 'jsx',
          elementType: type,
          originalContent: text,
          originalWordCount: countWords(text),
          originalHash: hash,
        });
      }
    }
  }

  // Extract from string patterns (descriptions, etc.)
  for (const regex of stringPatterns) {
    let match;
    while ((match = regex.exec(content)) !== null) {
      const text = match[1].trim();

      if (countWords(text) >= MIN_WORD_COUNT) {
        const hash = hashContent(text);
        // Check if we already have this chunk
        if (!chunks.find(c => c.originalHash === hash)) {
          chunks.push({
            chunkId: generateChunkId(sourcePath, 'p', hash),
            sourcePath,
            sourceType: 'jsx',
            elementType: 'p',
            originalContent: text,
            originalWordCount: countWords(text),
            originalHash: hash,
          });
        }
      }
    }
  }

  return chunks;
}

/**
 * Scan MDX files in a directory
 */
function scanMDXDirectory(dirPath: string): ContentChunk[] {
  const chunks: ContentChunk[] = [];

  if (!fs.existsSync(dirPath)) {
    console.log(`  Directory not found: ${dirPath}`);
    return chunks;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      // Look for index.mdx in subdirectories
      const mdxPath = path.join(fullPath, 'index.mdx');
      if (fs.existsSync(mdxPath)) {
        console.log(`  Scanning: ${mdxPath}`);
        const content = fs.readFileSync(mdxPath, 'utf-8');
        const { content: mdxContent } = matter(content);
        const relativePath = path.relative(process.cwd(), mdxPath);
        const fileChunks = parseMarkdownChunks(mdxContent, relativePath);
        console.log(`    Found ${fileChunks.length} chunks`);
        chunks.push(...fileChunks);
      }
    } else if (entry.name.endsWith('.mdx')) {
      console.log(`  Scanning: ${fullPath}`);
      const content = fs.readFileSync(fullPath, 'utf-8');
      const { content: mdxContent } = matter(content);
      const relativePath = path.relative(process.cwd(), fullPath);
      const fileChunks = parseMarkdownChunks(mdxContent, relativePath);
      console.log(`    Found ${fileChunks.length} chunks`);
      chunks.push(...fileChunks);
    }
  }

  return chunks;
}

/**
 * Scan JSX/TSX pages
 */
function scanJSXPages(): ContentChunk[] {
  const chunks: ContentChunk[] = [];
  const pagesToScan = [
    'app/page.tsx',
    'app/portfolio/page.tsx',
    'app/projects/page.tsx',
    'app/resources/page.tsx',
    'app/writing/page.tsx',
  ];

  for (const pagePath of pagesToScan) {
    const fullPath = path.join(process.cwd(), pagePath);
    if (fs.existsSync(fullPath)) {
      console.log(`  Scanning: ${pagePath}`);
      const content = fs.readFileSync(fullPath, 'utf-8');
      const fileChunks = parseJSXChunks(content, pagePath);
      console.log(`    Found ${fileChunks.length} chunks`);
      chunks.push(...fileChunks);
    }
  }

  return chunks;
}

/**
 * Main scanner function
 */
async function main() {
  console.log('Content Expansion Pipeline - Scanner');
  console.log('====================================\n');

  // Ensure directories exist
  if (!fs.existsSync(EXPANDED_DIR)) {
    fs.mkdirSync(EXPANDED_DIR, { recursive: true });
  }
  if (!fs.existsSync(CHUNKS_DIR)) {
    fs.mkdirSync(CHUNKS_DIR, { recursive: true });
  }

  const allChunks: ContentChunk[] = [];

  // Scan MDX content
  console.log('Scanning MDX content...');
  console.log('\nPortfolio:');
  allChunks.push(...scanMDXDirectory(path.join(CONTENT_DIR, 'portfolio')));

  console.log('\nProjects:');
  allChunks.push(...scanMDXDirectory(path.join(CONTENT_DIR, 'projects')));

  // Scan JSX pages
  console.log('\nJSX Pages:');
  allChunks.push(...scanJSXPages());

  // Deduplicate by hash (same content might appear multiple times)
  const uniqueChunks = new Map<string, ContentChunk>();
  for (const chunk of allChunks) {
    if (!uniqueChunks.has(chunk.originalHash)) {
      uniqueChunks.set(chunk.originalHash, chunk);
    }
  }

  const finalChunks = Array.from(uniqueChunks.values());

  // Create manifest
  const manifest: Manifest = {
    generatedAt: new Date().toISOString(),
    model: 'claude-opus-4-5-20251101',
    thinkingEnabled: true,
    expansionTarget: '5x',
    totalChunks: finalChunks.length,
    totalVersions: 0,
    chunks: finalChunks.map(chunk => ({
      chunkId: chunk.chunkId,
      sourcePath: chunk.sourcePath,
      sourceType: chunk.sourceType,
      elementType: chunk.elementType,
      originalWordCount: chunk.originalWordCount,
      originalHash: chunk.originalHash,
      context: chunk.context,
      versions: [],
    })),
  };

  // Save manifest
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  // Create chunk directories and save original content
  for (const chunk of finalChunks) {
    const chunkDir = path.join(CHUNKS_DIR, chunk.chunkId);
    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir, { recursive: true });
    }
    fs.writeFileSync(path.join(chunkDir, 'original.md'), chunk.originalContent);
  }

  // Summary
  console.log('\n====================================');
  console.log('Scan Complete!\n');
  console.log(`Total chunks found: ${finalChunks.length}`);
  console.log(`  - Paragraphs: ${finalChunks.filter(c => c.elementType === 'p').length}`);
  console.log(`  - Headings: ${finalChunks.filter(c => c.elementType.startsWith('h')).length}`);
  console.log(`  - List items: ${finalChunks.filter(c => c.elementType === 'li').length}`);
  console.log(`  - Blockquotes: ${finalChunks.filter(c => c.elementType === 'blockquote').length}`);
  console.log(`\nManifest saved to: ${MANIFEST_PATH}`);
  console.log(`Chunk directories created in: ${CHUNKS_DIR}`);

  // Word count stats
  const totalWords = finalChunks.reduce((sum, c) => sum + c.originalWordCount, 0);
  const avgWords = Math.round(totalWords / finalChunks.length);
  console.log(`\nTotal words: ${totalWords}`);
  console.log(`Average words per chunk: ${avgWords}`);
  console.log(`Estimated expanded words (5x): ${totalWords * 5}`);

  // Estimate API usage
  const estimatedExpansions = finalChunks.length * 5;
  console.log(`\nEstimated API calls for generation: ${estimatedExpansions}`);
}

main().catch(console.error);

/**
 * Redis client for Upstash
 *
 * Used for storing evaluation reports and session data.
 */

import { Redis } from '@upstash/redis';

// Lazy initialization to avoid errors when env vars aren't set
let redisClient: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redisClient) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      throw new Error(
        'Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN environment variables'
      );
    }

    redisClient = new Redis({
      url,
      token,
    });
  }

  return redisClient;
}

/**
 * Check if Redis is configured
 */
export function isRedisConfigured(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

/**
 * Key prefixes for different data types
 */
export const REDIS_KEYS = {
  /** Session data: session:{sessionId} */
  session: (sessionId: string) => `session:${sessionId}`,

  /** Evaluation report: report:{batchId} */
  report: (batchId: string) => `report:${batchId}`,

  /** Reports index: reports:index */
  reportsIndex: 'reports:index',

  /** Session reports list: session:{sessionId}:reports */
  sessionReports: (sessionId: string) => `session:${sessionId}:reports`,
};

/**
 * Store an evaluation report
 */
export async function storeReport(
  batchId: string,
  report: unknown
): Promise<void> {
  const redis = getRedisClient();

  // Store the report
  await redis.set(REDIS_KEYS.report(batchId), JSON.stringify(report));

  // Add to reports index (sorted by timestamp)
  await redis.zadd(REDIS_KEYS.reportsIndex, {
    score: Date.now(),
    member: batchId,
  });
}

/**
 * Get an evaluation report by batch ID
 */
export async function getReport(batchId: string): Promise<unknown | null> {
  const redis = getRedisClient();
  const data = await redis.get(REDIS_KEYS.report(batchId));

  if (!data) return null;

  return typeof data === 'string' ? JSON.parse(data) : data;
}

/**
 * Get recent evaluation reports
 */
export async function getRecentReports(
  limit: number = 50
): Promise<string[]> {
  const redis = getRedisClient();

  // Get most recent batch IDs
  const batchIds = await redis.zrange(REDIS_KEYS.reportsIndex, 0, limit - 1, {
    rev: true,
  });

  return batchIds as string[];
}

/**
 * Store session data
 */
export async function storeSession(
  sessionId: string,
  data: unknown
): Promise<void> {
  const redis = getRedisClient();
  await redis.set(REDIS_KEYS.session(sessionId), JSON.stringify(data));
  // Expire after 24 hours
  await redis.expire(REDIS_KEYS.session(sessionId), 60 * 60 * 24);
}

/**
 * Get session data
 */
export async function getSession(sessionId: string): Promise<unknown | null> {
  const redis = getRedisClient();
  const data = await redis.get(REDIS_KEYS.session(sessionId));

  if (!data) return null;

  return typeof data === 'string' ? JSON.parse(data) : data;
}

'use client';

/**
 * AdversarialProvider - Client-side wrapper for adversarial behavior system
 *
 * Wraps children with BehaviorTracker context, ViewportChunker for content
 * tracking, ContentTransformer for applying transformations, and DebugPanel.
 * Use this in the root layout to enable adversarial features site-wide.
 *
 * Includes error boundary for graceful degradation if adversarial system fails.
 */

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { BehaviorTracker } from '@/components/behavior';
import { DebugPanel } from '@/components/debug';
import { ViewportChunker } from './ViewportChunker';
import { ContentTransformer } from './ContentTransformer';
import { AdversarialErrorBoundary } from './AdversarialErrorBoundary';

// Paths where adversarial transformations should be disabled
const EXCLUDED_PATHS = ['/evaluation'];

export interface AdversarialProviderProps {
  children: React.ReactNode;
  /** Disable transformations (useful for development) */
  disableTransformations?: boolean;
  /** Disable the entire adversarial system */
  disabled?: boolean;
  /** Additional paths to exclude from transformations */
  excludedPaths?: string[];
}

export function AdversarialProvider({
  children,
  disableTransformations = false,
  disabled = false,
  excludedPaths = [],
}: AdversarialProviderProps) {
  const [apiAvailable, setApiAvailable] = useState(true);
  const pathname = usePathname();

  // Check if current path should be excluded from transformations
  const allExcludedPaths = [...EXCLUDED_PATHS, ...excludedPaths];
  const isExcludedPath = allExcludedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // Check API availability on mount
  useEffect(() => {
    if (disabled || disableTransformations || isExcludedPath) return;

    // Quick health check - just verify the endpoint exists
    fetch('/api/transform', { method: 'HEAD' })
      .then((res) => {
        // 405 Method Not Allowed is expected (we only support POST)
        // 503 Service Unavailable means API key not configured
        setApiAvailable(res.status !== 503);
      })
      .catch(() => {
        setApiAvailable(false);
      });
  }, [disabled, disableTransformations, isExcludedPath]);

  // If disabled, just render children without any adversarial features
  if (disabled) {
    return <>{children}</>;
  }

  const shouldTransform = !disableTransformations && apiAvailable && !isExcludedPath;

  return (
    <AdversarialErrorBoundary
      onError={(error) => {
        console.error('[Adversarial] System error, degrading gracefully:', error.message);
      }}
    >
      <BehaviorTracker>
        <ViewportChunker>
          {children}
          <ContentTransformer enabled={shouldTransform} />
        </ViewportChunker>
        <DebugPanel />
      </BehaviorTracker>
    </AdversarialErrorBoundary>
  );
}

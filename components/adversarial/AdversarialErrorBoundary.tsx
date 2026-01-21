'use client';

/**
 * AdversarialErrorBoundary - Catches errors in adversarial components
 *
 * Provides graceful degradation when the adversarial system fails,
 * allowing the base site content to remain accessible.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Fallback UI to show on error (defaults to children without adversarial features) */
  fallback?: ReactNode;
  /** Callback when error occurs */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AdversarialErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[Adversarial] Error caught by boundary:', error);
    console.error('[Adversarial] Component stack:', errorInfo.componentStack);

    this.props.onError?.(error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // If fallback provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Otherwise, render children without adversarial features
      // This allows the site to degrade gracefully
      return this.props.children;
    }

    return this.props.children;
  }
}

/**
 * Hook-based error boundary wrapper for functional components
 */
export function withAdversarialErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode
): React.FC<P> {
  return function WithErrorBoundary(props: P) {
    return (
      <AdversarialErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </AdversarialErrorBoundary>
    );
  };
}

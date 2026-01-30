'use client';

/**
 * AdversarialToggle - Toggle switch for adversarial mode with tooltip
 *
 * Shows a toggle to enable/disable adversarial mode, with a clickable
 * info icon that shows a toast explaining the debug console.
 */

import { useState, useEffect, useCallback } from 'react';
import { Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdversarialMode } from '@/components/behavior';

const TOAST_DURATION = 8000; // 8 seconds

export function AdversarialToggle() {
  const { enabled, setEnabled } = useAdversarialMode();
  const [showToast, setShowToast] = useState(false);

  const handleToggle = () => {
    setEnabled(!enabled);
  };

  const handleShowToast = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowToast(true);
  }, []);

  const handleDismissToast = useCallback(() => {
    setShowToast(false);
  }, []);

  // Auto-dismiss toast after duration
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, TOAST_DURATION);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Detect OS for keyboard shortcut display
  const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.userAgent);

  return (
    <>
      <div className="relative">
        <div
          className={cn(
            'flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors duration-200',
            'hover:bg-soft-linen-dark/50',
            enabled
              ? 'text-bronze-spice font-medium'
              : 'text-text-secondary'
          )}
        >
          <span className="flex-1">Content adversary</span>

          {/* Info button */}
          <button
            onClick={handleShowToast}
            className="p-1 -m-1 text-text-muted hover:text-text-secondary transition-colors"
            aria-label="Learn about adversarial mode"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Toggle switch */}
          <button
            onClick={handleToggle}
            role="switch"
            aria-checked={enabled}
            aria-label="Toggle adversarial mode"
            className="ml-1"
          >
            <div
              className={cn(
                'relative w-9 h-5 rounded-full transition-colors duration-200',
                enabled ? 'bg-bronze-spice' : 'bg-soft-linen-dark'
              )}
            >
              <div
                className={cn(
                  'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200',
                  enabled ? 'translate-x-4' : 'translate-x-0.5'
                )}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Toast notification - fixed position */}
      {showToast && (
        <div className="fixed bottom-4 left-4 right-4 z-[9999] md:left-auto md:right-4 md:w-96">
          <div className="bg-soft-linen border border-soft-linen-dark rounded-lg p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <span className="text-xl">💡</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text-primary text-sm">
                  Want to see transformations in real-time?
                </p>
                <p className="text-text-secondary text-sm mt-1">
                  Press{' '}
                  <kbd className="px-1.5 py-0.5 bg-soft-linen-dark rounded text-xs font-mono">
                    {isMac ? '⌘' : 'Ctrl'}
                  </kbd>
                  {' + '}
                  <kbd className="px-1.5 py-0.5 bg-soft-linen-dark rounded text-xs font-mono">
                    Shift
                  </kbd>
                  {' + '}
                  <kbd className="px-1.5 py-0.5 bg-soft-linen-dark rounded text-xs font-mono">
                    D
                  </kbd>
                  {' '}on any page to open the debug panel. It shows the current behavior mode, scroll velocity, idle time, and transformation activity as it happens.
                </p>
              </div>
              <button
                onClick={handleDismissToast}
                className="p-1 -m-1 text-text-muted hover:text-text-secondary transition-colors flex-shrink-0"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

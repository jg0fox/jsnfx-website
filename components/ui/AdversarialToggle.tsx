'use client';

/**
 * AdversarialToggle - Toggle switch for adversarial mode with tooltip
 *
 * Shows a toggle to enable/disable adversarial mode, with a dismissible
 * tooltip explaining the debug console keyboard shortcut.
 */

import { useState, useEffect } from 'react';
import { FlaskConical, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdversarialMode } from '@/components/behavior';

const TOOLTIP_DISMISSED_KEY = 'adversarial_tooltip_dismissed';

export function AdversarialToggle() {
  const { enabled, setEnabled } = useAdversarialMode();
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(true);

  // Check localStorage for dismissed state on mount
  useEffect(() => {
    const dismissed = localStorage.getItem(TOOLTIP_DISMISSED_KEY) === 'true';
    setTooltipDismissed(dismissed);
    // Show tooltip if not dismissed and mode is enabled
    if (!dismissed && enabled) {
      setShowTooltip(true);
    }
  }, [enabled]);

  const handleToggle = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);

    // Show tooltip when enabling (if not previously dismissed)
    if (newEnabled && !tooltipDismissed) {
      setShowTooltip(true);
    } else {
      setShowTooltip(false);
    }
  };

  const handleDismissTooltip = () => {
    setShowTooltip(false);
    setTooltipDismissed(true);
    localStorage.setItem(TOOLTIP_DISMISSED_KEY, 'true');
  };

  // Detect OS for keyboard shortcut display
  const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.userAgent);
  const shortcutKey = isMac ? '⌘+⇧+D' : 'Ctrl+Shift+D';

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className={cn(
          'flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors duration-200 w-full text-left',
          'hover:bg-soft-linen-dark/50',
          enabled
            ? 'text-bronze-spice font-medium'
            : 'text-text-secondary'
        )}
        role="switch"
        aria-checked={enabled}
        aria-label="Toggle adversarial mode"
      >
        <FlaskConical className="w-4 h-4" />
        <span className="flex-1">Adversarial</span>
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

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-0 right-0 mb-2 z-50">
          <div className="bg-text-primary text-soft-linen rounded-lg p-3 shadow-lg text-xs relative">
            <button
              onClick={handleDismissTooltip}
              className="absolute top-1 right-1 p-1 hover:bg-white/10 rounded transition-colors"
              aria-label="Dismiss tooltip"
            >
              <X className="w-3 h-3" />
            </button>
            <p className="pr-4">
              Press <kbd className="px-1 py-0.5 bg-white/20 rounded text-[10px] font-mono">{shortcutKey}</kbd> to open the debug console.
            </p>
            {/* Arrow */}
            <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-text-primary rotate-45" />
          </div>
        </div>
      )}
    </div>
  );
}

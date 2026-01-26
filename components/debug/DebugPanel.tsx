'use client';

/**
 * DebugPanel - Displays adversarial system state
 *
 * Activated: Cmd+Shift+D (Mac) / Ctrl+Shift+D (Windows/Linux)
 *
 * Uses design tokens:
 * - Palm Leaf (#90955e) for text
 * - Soft Linen (#f5f1e8) for background
 */

import React, { useState } from 'react';
import { useDebug } from '@/components/behavior';
import { REWRITE_LEVEL_LABELS, DEFAULT_THRESHOLDS } from '@/types/behavior';
import type { Mode, RewriteLevel } from '@/types/behavior';

function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs.toFixed(0)}s`;
}

function formatVelocity(pxPerSec: number): string {
  return `${Math.round(pxPerSec)}px/s`;
}

function getModeColor(mode: Mode): string {
  switch (mode) {
    case 'NEUTRAL':
      return '#8a9a8c'; // text-muted
    case 'EXPAND':
      return '#c25a28'; // bronze-spice
    case 'REWRITE':
      return '#90955e'; // palm-leaf
  }
}

function getLevelColor(level: RewriteLevel): string {
  switch (level) {
    case 1:
      return '#8a9a8c'; // subtle - muted
    case 2:
      return '#90955e'; // noticeable - palm leaf
    case 3:
      return '#c25a28'; // hostile - bronze spice
    case 4:
      return '#9b2c2c'; // very hostile - dark red
  }
}

/**
 * Calculate time until next level
 */
function getNextLevelInfo(
  idleTime: number,
  currentLevel: RewriteLevel
): { nextLevel: RewriteLevel; secondsUntil: number } | null {
  const thresholds = DEFAULT_THRESHOLDS;

  if (currentLevel === 1 && idleTime < thresholds.rewriteLevel2) {
    return {
      nextLevel: 2,
      secondsUntil: (thresholds.rewriteLevel2 - idleTime) / 1000,
    };
  }

  if (currentLevel === 2 && idleTime < thresholds.rewriteLevel3) {
    return {
      nextLevel: 3,
      secondsUntil: (thresholds.rewriteLevel3 - idleTime) / 1000,
    };
  }

  if (currentLevel === 3 && idleTime < thresholds.rewriteLevel4) {
    return {
      nextLevel: 4,
      secondsUntil: (thresholds.rewriteLevel4 - idleTime) / 1000,
    };
  }

  return null; // Already at max level
}

export function DebugPanel() {
  const { visible, toggle, info } = useDebug();
  const [collapsed, setCollapsed] = useState(false);

  if (!visible) {
    return null;
  }

  const { state } = info;
  const modeColor = getModeColor(state.mode);
  const levelColor = getLevelColor(state.rewriteLevel);
  const nextLevelInfo =
    state.mode === 'REWRITE'
      ? getNextLevelInfo(state.idleTime, state.rewriteLevel)
      : null;

  return (
    <div
      className="fixed z-[9999] font-mono text-xs select-none
        top-2 right-2 max-w-[380px]
        sm:top-2 sm:right-2 sm:bottom-auto sm:left-auto
        max-sm:bottom-2 max-sm:right-2 max-sm:left-2 max-sm:top-auto max-sm:max-w-none"
      style={{
        pointerEvents: 'auto',
      }}
    >
      <div
        className="rounded-lg shadow-lg border overflow-hidden"
        style={{
          backgroundColor: 'rgba(245, 241, 232, 0.95)', // soft-linen with opacity
          borderColor: '#e8e2d5', // soft-linen-dark
          color: '#2d3a2e', // text-primary
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-3 py-2 border-b min-h-[44px]"
          style={{
            borderColor: '#e8e2d5',
            backgroundColor: 'rgba(144, 149, 94, 0.1)', // palm-leaf tint
          }}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity min-h-[44px] -my-2 py-2"
            style={{ color: '#90955e' }} // palm-leaf
          >
            <span className="text-[10px]">{collapsed ? '▸' : '▾'}</span>
            <span className="font-bold tracking-wide">ADVERSARIAL DEBUG</span>
          </button>
          <button
            onClick={toggle}
            className="w-11 h-11 -mr-2 flex items-center justify-center rounded hover:bg-black/5 transition-colors"
            aria-label="Close debug panel"
          >
            ×
          </button>
        </div>

        {/* Content */}
        {!collapsed && (
          <div className="p-3 space-y-3">
            {/* Mode & Status Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider opacity-60">
                  Mode:
                </span>
                <span className="font-bold" style={{ color: modeColor }}>
                  {state.mode}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] uppercase tracking-wider opacity-60">
                  Idle:
                </span>
                <span className="tabular-nums">
                  {formatTime(state.idleTime / 1000)}
                </span>
              </div>
            </div>

            {/* Level Indicator (when in REWRITE mode) */}
            {state.mode === 'REWRITE' && (
              <div
                className="flex items-center justify-between p-2 rounded"
                style={{ backgroundColor: 'rgba(144, 149, 94, 0.1)' }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider opacity-60">
                    Level:
                  </span>
                  <span className="font-bold" style={{ color: levelColor }}>
                    {state.rewriteLevel} ({REWRITE_LEVEL_LABELS[state.rewriteLevel]})
                  </span>
                </div>
                {nextLevelInfo && (
                  <div className="flex items-center gap-1 text-[11px]">
                    <span className="opacity-60">→</span>
                    <span className="font-medium" style={{ color: getLevelColor(nextLevelInfo.nextLevel) }}>
                      L{nextLevelInfo.nextLevel}
                    </span>
                    <span className="tabular-nums opacity-75">
                      in {nextLevelInfo.secondsUntil.toFixed(1)}s
                    </span>
                  </div>
                )}
                {!nextLevelInfo && (
                  <span className="text-[10px] opacity-60 italic">max level</span>
                )}
              </div>
            )}

            {/* Next Mode Timer (when in NEUTRAL) */}
            {state.mode === 'NEUTRAL' && info.nextModeInfo && (
              <div
                className="flex items-center gap-2 text-[11px] p-2 rounded"
                style={{ backgroundColor: 'rgba(144, 149, 94, 0.1)' }}
              >
                <span className="text-[10px] uppercase tracking-wider opacity-60">
                  Next:
                </span>
                <span className="font-medium" style={{ color: '#90955e' }}>
                  {info.nextModeInfo.label}
                </span>
                {info.nextModeInfo.trigger === 'time' &&
                typeof info.nextModeInfo.secondsUntil === 'number' ? (
                  <span className="tabular-nums opacity-75">
                    in {info.nextModeInfo.secondsUntil.toFixed(1)}s
                  </span>
                ) : (
                  <span className="opacity-75 italic">on interaction</span>
                )}
              </div>
            )}

            {/* Scroll & Viewport Row */}
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1">
                <span className="text-[10px] uppercase tracking-wider opacity-60">
                  Scroll:
                </span>
                <span
                  className="tabular-nums"
                  style={{
                    color: state.scrollVelocity > 500 ? '#c25a28' : 'inherit',
                  }}
                >
                  {formatVelocity(state.scrollVelocity)}
                  {state.fastScrollSustained && (
                    <span style={{ color: '#c25a28' }}> ⚡</span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] uppercase tracking-wider opacity-60">
                  Viewport:
                </span>
                <span className="tabular-nums">
                  {info.viewportChunks} chunks, {info.transformedChunks} transformed
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px" style={{ backgroundColor: '#e8e2d5' }} />

            {/* Last Transform Section */}
            <div className="space-y-1 text-[11px]">
              <div className="flex items-center gap-1">
                <span className="text-[10px] uppercase tracking-wider opacity-60">
                  Last Transform:
                </span>
                <span className="tabular-nums">
                  {typeof info.lastTransformAge === 'number'
                    ? `${info.lastTransformAge.toFixed(1)}s ago`
                    : 'none'}
                </span>
              </div>
              {info.lastTransformType && (
                <div className="pl-3 space-y-0.5 opacity-80">
                  <div>
                    ├─ Type:{' '}
                    <span
                      className="font-medium"
                      style={{
                        color: info.lastRewriteLevel
                          ? getLevelColor(info.lastRewriteLevel)
                          : 'inherit',
                      }}
                    >
                      REWRITE L{info.lastRewriteLevel}
                    </span>
                  </div>
                  <div>├─ Chunk: {info.lastTransformChunk}</div>
                  <div>
                    └─ Animation:{' '}
                    <span className="font-medium">scramble</span>{' '}
                    <span className="opacity-75">({info.lastTransformLatency}ms)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-px" style={{ backgroundColor: '#e8e2d5' }} />

            {/* Session Stats */}
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1">
                <span className="text-[10px] uppercase tracking-wider opacity-60">
                  Session:
                </span>
                <span className="tabular-nums">
                  {formatTime(state.sessionDuration / 1000)} |{' '}
                  {info.sessionTransforms} transforms
                </span>
              </div>
              <div
                className="px-2 py-0.5 rounded text-[9px] font-medium"
                style={{
                  backgroundColor: 'rgba(144, 149, 94, 0.2)',
                  color: '#90955e',
                }}
              >
                no API calls
              </div>
            </div>
          </div>
        )}

        {/* Collapsed Summary */}
        {collapsed && (
          <div className="px-3 py-1.5 flex items-center gap-3 text-[11px]">
            <span style={{ color: modeColor }} className="font-bold">
              {state.mode}
              {state.mode === 'REWRITE' && (
                <span style={{ color: levelColor }}>
                  {' '}
                  L{state.rewriteLevel}
                </span>
              )}
            </span>
            <span className="opacity-60">|</span>
            <span className="tabular-nums">
              {formatTime(state.idleTime / 1000)} idle
            </span>
            <span className="opacity-60">|</span>
            <span className="tabular-nums">{info.sessionTransforms} tx</span>
            <span className="opacity-60">|</span>
            <span
              className="text-[9px]"
              style={{ color: '#90955e' }}
            >
              static
            </span>
          </div>
        )}
      </div>

      {/* Keyboard hint - hidden on mobile */}
      <div
        className="text-[9px] text-center mt-1 opacity-50 hidden sm:block"
        style={{ color: '#5a6b5c' }}
      >
        Cmd+Shift+D to toggle
      </div>
    </div>
  );
}

export function DebugPanelIndex() {
  return (
    <div className="fixed top-2 right-2 z-[9999]">
      <DebugPanel />
    </div>
  );
}

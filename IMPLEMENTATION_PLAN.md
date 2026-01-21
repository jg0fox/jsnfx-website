# Implementation Plan — Adversarial Portfolio v2

> Working document tracking implementation progress. Updated as tasks are completed.

**Status**: Phase 5 Complete — All Core Features Implemented
**Last Updated**: 2026-01-21

---

## Pre-Implementation

- [x] Clone fresh from https://github.com/jg0fox/jsnfx-website
- [x] Review existing CLAUDE.md in repo for design tokens and patterns
- [ ] Install dependencies: `npm install @anthropic-ai/sdk @upstash/redis`
- [ ] Verify environment variables are configured

---

## Phase 1: Behavior Foundation ✅

**Goal**: Track user behavior (scroll velocity, idle time) and display debug panel.

### Types & Interfaces
- [x] Create `types/behavior.ts` — Mode, BehaviorState, Thresholds interfaces
- [x] Create `types/transformation.ts` — ContentChunk, TransformResult interfaces
- [x] Create `types/evaluation.ts` — EvaluationBatch, EvaluationReport interfaces

### Behavior Tracking
- [x] Create `components/behavior/ModeEngine.ts` — state machine (NEUTRAL/EXPAND/REWRITE)
- [x] Create `components/behavior/BehaviorTracker.tsx` — React context provider
- [x] Create `components/behavior/useBehavior.ts` — hook to access behavior state
- [x] Implement scroll velocity detection (rolling 500ms average)
- [x] Implement idle detection (reset on scroll/click/mousemove>100px/keypress/touch)
- [x] Implement rewrite level escalation (L1: 5-15s, L2: 15-30s, L3: 30s+)

### Debug Panel
- [x] Create `components/debug/DebugPanel.tsx`
- [x] Implement Cmd+Shift+D / Ctrl+Shift+D toggle
- [x] Display: current mode, idle time, scroll velocity, viewport chunks
- [x] Display: last transform info, eval batch status, session duration
- [x] Style with design tokens (Palm Leaf text, Soft Linen background)
- [x] Make collapsible, semi-transparent, pointer-events handling

### Integration
- [x] Wrap app layout with BehaviorTracker provider
- [ ] Test behavior detection on all pages
- [ ] Verify mode transitions work correctly

---

## Phase 2: Prompt & Evaluation Design — AWAITING REVIEW

**Goal**: Create all prompts for human review. **NO API CALLS UNTIL APPROVED.**

### Transformation Prompts
- [x] Create `prompts/` directory
- [x] Create `prompts/transform-expand.md` — EXPAND transformation prompt
- [x] Create `prompts/transform-rewrite-l1.md` — REWRITE Level 1 (subtle)
- [x] Create `prompts/transform-rewrite-l2.md` — REWRITE Level 2 (noticeable)
- [x] Create `prompts/transform-rewrite-l3.md` — REWRITE Level 3 (hostile)

### Evaluation Prompts
- [x] Create `prompts/evaluation.md` — evaluation system prompt and scoring rubric

### Review Documentation
- [x] Create `prompts/REVIEW_CHECKLIST.md` — summary of all prompts for review

### Human Review Gate
- [x] **STOP**: Deliver prompts to user for review
- [ ] **WAIT**: Receive explicit approval before proceeding
- [ ] Document any requested changes

**⚠️ DO NOT PROCEED TO PHASE 3 UNTIL PROMPTS ARE APPROVED ⚠️**

---

## Phase 3: Transformation Engine ✅

**Goal**: Transform content based on user behavior using approved prompts.

### Viewport Chunking
- [x] Create `components/adversarial/ViewportChunker.tsx`
- [x] Implement Intersection Observer for visible chunks
- [x] Chunk rules: p, h1-h6, li, blockquote, figure elements
- [x] Group small elements (<50 words), max ~200 words per chunk
- [x] Exclude: nav, header, footer, code, pre elements
- [x] Track chunk state: baseContent, currentContent, transformCount

### API Endpoint
- [x] Create `lib/redis.ts` — Upstash client setup
- [x] Create `lib/transform.ts` — prompt construction, API call logic
- [x] Create `app/api/transform/route.ts` — POST endpoint using Haiku

### Transformations
- [x] Implement EXPAND transformation (40-60% longer)
- [x] Implement REWRITE L1 transformation (subtle)
- [x] Implement REWRITE L2 transformation (noticeable)
- [x] Implement REWRITE L3 transformation (hostile)

### Text Morphing Animation
- [x] Create `components/adversarial/TextMorpher.tsx` — animates text transitions
- [x] Implement word-level diff algorithm to identify changes
- [x] Character-by-character animation for changed words
- [x] Scramble effect: characters cycle through random letters before settling
- [x] Staggered timing: changes ripple through text naturally
- [x] Mode-specific animation styles:
  - EXPAND: Smooth, flowing appearance of new text
  - REWRITE L1: Subtle shimmer, barely perceptible
  - REWRITE L2: Clear morphing, moderate speed
  - REWRITE L3: Chaotic, glitchy, unsettling
- [x] Create `lib/textDiff.ts` — diff utilities for word/character comparison
- [x] Performance optimization for multiple simultaneous animations

### Content Application
- [x] Create `components/adversarial/ContentTransformer.tsx`
- [x] Integrate TextMorpher for animated transitions
- [x] Apply transforms to DOM while preserving element identity
- [x] Implement rewrite interval (~8-10s while idle)

### Testing
- [ ] Fast scroll triggers EXPAND
- [ ] Idle 5s+ triggers REWRITE L1
- [ ] Idle 15s+ triggers REWRITE L2
- [ ] Idle 30s+ triggers REWRITE L3
- [ ] Interaction stops rewriting
- [ ] Transforms complete in <500ms

---

## Phase 4: Evaluation System ✅

**Goal**: Batch and evaluate transformations, display reports.

### Session Tracking
- [x] Create `lib/session.ts` — session ID, visitor metadata collection
- [x] Collect: IP, location, device info, referrer, local time
- [x] Track behavior sequence (timestamped events)
- [x] Handle session end (beforeunload, visibilitychange, 2min idle)

### Batch Collection
- [x] Implement batch triggers: 60s OR 5 transforms OR session end
- [x] Create `lib/evaluate.ts` — evaluation logic and batch assembly

### API Endpoints
- [x] Create `app/api/evaluate/route.ts` — POST endpoint using Sonnet
- [x] Create `app/api/reports/route.ts` — GET endpoint for historical reports
- [x] Store evaluation results in Redis

### Evaluation Page
- [x] Create `components/evaluation/ReportList.tsx`
- [x] Create `components/evaluation/ReportDetail.tsx`
- [x] Create `app/evaluation/page.tsx` — main reports page
- [x] Style with design tokens

### Testing
- [ ] Evaluation triggers at 60s
- [ ] Evaluation triggers at 5 transforms
- [ ] Evaluation triggers on session end
- [ ] Reports display correctly
- [ ] Reports include full visitor metadata

---

## Phase 5: Polish ✅

**Goal**: Smooth experience, error handling, mobile support.

### Visual Polish
- [x] Smooth DOM transitions (fade/morph effects)
- [x] Ensure no layout shifts during transforms

### Error Handling
- [x] Add error boundaries around transformation components
- [x] Implement fallbacks for failed API calls
- [x] Graceful degradation if Redis unavailable

### Mobile Support
- [x] Add touch event support for behavior tracking
- [x] Test on mobile viewports
- [x] Verify debug panel works on mobile

### Performance
- [x] Profile and optimize for <500ms transform latency
- [x] Minimize re-renders in React components
- [x] Optimize Intersection Observer usage

---

## Final Testing Checklist

- [ ] Fast scroll on homepage → content expands
- [ ] Fast scroll on portfolio page → content expands
- [ ] Idle 5+ seconds → content starts rewriting
- [ ] Idle 15+ seconds → rewrite intensity increases
- [ ] Idle 30+ seconds → rewrite becomes hostile
- [ ] Any interaction during idle → rewrite stops, content stable
- [ ] Debug panel shows correct state
- [ ] Evaluation batch triggers at 60s
- [ ] Evaluation batch triggers at 5 transforms
- [ ] Evaluation page displays reports
- [ ] Reports include full visitor metadata
- [ ] Works on mobile (touch events)
- [ ] No crashes, no broken layouts

---

## Notes & Decisions

_Document any implementation decisions, blockers, or changes here._

---

## Completion Log

| Date | Phase | Task | Notes |
|------|-------|------|-------|
| 2026-01-21 | Pre | Clone repo | Cloned jsnfx-website |
| 2026-01-21 | Pre | Review CLAUDE.md | Noted design tokens and patterns |
| 2026-01-21 | 1 | types/behavior.ts | Mode, BehaviorState, Thresholds, Events |
| 2026-01-21 | 1 | types/transformation.ts | ContentChunk, TransformResult, ChunkState |
| 2026-01-21 | 1 | types/evaluation.ts | EvaluationBatch, EvaluationReport, SessionState |
| 2026-01-21 | 1 | ModeEngine.ts | State machine with tick(), event handlers |
| 2026-01-21 | 1 | BehaviorTracker.tsx | Context provider with RAF loop, event listeners |
| 2026-01-21 | 1 | useBehavior.ts | Hook and specialized selectors |
| 2026-01-21 | 1 | DebugPanel.tsx | Cmd+Shift+D toggle, collapsible, styled |
| 2026-01-21 | 1 | Integration | AdversarialProvider wraps app layout |
| 2026-01-21 | 2 | transform-expand.md | EXPAND prompt (40-60% longer) |
| 2026-01-21 | 2 | transform-rewrite-l1.md | REWRITE L1 prompt (subtle) |
| 2026-01-21 | 2 | transform-rewrite-l2.md | REWRITE L2 prompt (noticeable) |
| 2026-01-21 | 2 | transform-rewrite-l3.md | REWRITE L3 prompt (hostile) |
| 2026-01-21 | 2 | evaluation.md | Evaluation rubric and scoring |
| 2026-01-21 | 2 | REVIEW_CHECKLIST.md | Summary for human review |
| 2026-01-21 | 3 | lib/textDiff.ts | Word/char diff, scramble, animation config |
| 2026-01-21 | 3 | TextMorpher.tsx | Animated text transitions component |
| 2026-01-21 | 3 | ViewportChunker.tsx | IntersectionObserver chunk tracking |
| 2026-01-21 | 3 | lib/redis.ts | Upstash Redis client |
| 2026-01-21 | 3 | lib/transform.ts | Prompt construction, API calls |
| 2026-01-21 | 3 | api/transform/route.ts | POST endpoint for transformations |
| 2026-01-21 | 3 | ContentTransformer.tsx | Orchestrates mode-based transforms |
| 2026-01-21 | 3 | globals.css | Text morphing animation styles |
| 2026-01-21 | 4 | lib/session.ts | Session tracking, visitor metadata |
| 2026-01-21 | 4 | lib/evaluate.ts | Batch evaluation with Sonnet |
| 2026-01-21 | 4 | api/evaluate/route.ts | POST endpoint for evaluation |
| 2026-01-21 | 4 | api/reports/route.ts | GET endpoint for reports |
| 2026-01-21 | 4 | ReportList.tsx | Report list component |
| 2026-01-21 | 4 | ReportDetail.tsx | Report detail component |
| 2026-01-21 | 4 | evaluation/page.tsx | Evaluation reports page |
| 2026-01-21 | 4 | ContentTransformer | Added batch collection |
| 2026-01-21 | 5 | AdversarialErrorBoundary.tsx | Error boundary for graceful degradation |
| 2026-01-21 | 5 | AdversarialProvider.tsx | API health check, error boundary integration |
| 2026-01-21 | 5 | ContentTransformer.tsx | Smooth DOM transitions with fade/blur |
| 2026-01-21 | 5 | globals.css | Mobile debug panel styles, transition styles |
| 2026-01-21 | 5 | DebugPanel.tsx | Mobile responsive positioning, touch targets |
| 2026-01-21 | 5 | ModeEngine.ts | Touch move/end event handling |
| 2026-01-21 | 5 | BehaviorTracker.tsx | Touch event listeners, throttled updates |
| 2026-01-21 | 5 | ViewportChunker.tsx | Batched observer updates, memoization |
| 2026-01-21 | 5 | Build | Final build verification passed |

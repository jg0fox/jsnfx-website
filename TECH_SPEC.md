# Technical Specification: Adversarial Portfolio v2

## Project Overview

Transform jsnfx.com into an **adversarial, behavior-responsive site** that actively works against the user's reading intent. The site watches how visitors interact and responds by making content harder to consume in the way they're trying to consume it.

**This is a focused rebuild with three core features, executed well.**

---

## Core Philosophy

The site is **hostile by design**. It's not adapting to help—it's adapting to obstruct.

- **Fast scrollers** get punished with more content (good luck reaching the bottom)
- **Careful readers** get punished with constantly shifting text (good luck focusing)

The adversarial stance should be perceptible. Visitors should feel: "This site can see what I'm doing, and it's messing with me."

---

## Three Core Features

### 1. Behavior Tracking + Debug Panel
### 2. Adversarial Content Transformation
### 3. Chunked Evaluation with User Metadata

That's it. No tone sliders, no easter eggs, no chat agents. Just these three, done right.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐ │
│  │ BehaviorTracker │───▶│   ModeEngine    │───▶│  Content    │ │
│  │    Context      │    │  (2 modes only) │    │ Transformer │ │
│  └─────────────────┘    └─────────────────┘    └─────────────┘ │
│          │                                             │        │
│          ▼                                             ▼        │
│  ┌─────────────────┐                          ┌─────────────┐  │
│  │  Debug Panel    │                          │  Viewport   │  │
│  │  (Cmd+Shift+D)  │                          │  Chunker    │  │
│  └─────────────────┘                          └─────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          API LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  /api/transform                    /api/evaluate                │
│  ├── Haiku model (FAST)            ├── Sonnet model             │
│  ├── Viewport chunks               ├── Batched (60s/5/end)      │
│  └── <500ms target                 └── Async, non-blocking      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Vercel KV / Upstash Redis                                      │
│  ├── Session state (behavior history, transformations)          │
│  ├── Transformation cache                                       │
│  ├── Evaluation batch queue                                     │
│  └── Completed evaluation reports                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Feature 1: Behavior Tracking

### BehaviorTracker Context

Tracks all user interaction signals in real-time.

```typescript
interface BehaviorState {
  scrollVelocity: number;        // px/ms, rolling average
  scrollDirection: 'up' | 'down' | 'none';
  idleTime: number;              // ms since last interaction
  lastInteraction: number;       // timestamp
  hoverTarget: string | null;    // element ID currently hovered
  hoverDuration: number;         // ms on current target
  clickCount: number;            // clicks in last 3 seconds
  viewportContent: string[];     // IDs of content chunks in viewport
}
```

### Behavior Thresholds

| Signal | Threshold | Triggers |
|--------|-----------|----------|
| Fast scroll | > 500px/s sustained for > 1s | EXPAND mode |
| Idle | > 5s no interaction | REWRITE mode |
| Return to normal | Any significant interaction | Reset to base state |

### What Counts as Interaction

These actions reset idle timer and can exit REWRITE mode:
- Scroll (any direction, any speed)
- Click
- Significant cursor movement (> 100px)
- Keyboard input
- Touch events

---

## Feature 2: Adversarial Content Transformation

### Two Modes Only

**EXPAND Mode** (triggered by fast scrolling)
- User is trying to skim → Make content longer
- Add elaboration, examples, tangents
- Goal: The page becomes harder to finish

**REWRITE Mode** (triggered by idle)
- User is trying to read carefully → Keep changing the words
- Escalating intensity based on idle duration
- Goal: The content becomes impossible to pin down

### EXPAND Transformation

Triggered when: `scrollVelocity > 500px/s` for `> 1 second`

```
System: You are an adversarial content transformer. The user is scrolling 
quickly, trying to skim. Your job is to make the content LONGER and HARDER 
to finish.

Original content:
{content}

EXPAND this content by 40-60%. Add:
- Elaborating sentences
- Tangential but related points  
- Examples that weren't there before
- Qualifying statements

Maintain factual accuracy. Keep the same voice. Just make it LONGER.

Return ONLY the expanded content.
```

### REWRITE Transformation (Escalating)

Triggered when: `idleTime > 5000ms`

Continues every 8-10 seconds while idle persists.

**Intensity Levels:**

| Level | Idle Duration | Prompt Modifier |
|-------|---------------|-----------------|
| 1 - Subtle | 5-15s | "Make subtle changes. Swap synonyms, slightly rephrase. Preserve meaning completely. The reader should wonder if something changed." |
| 2 - Noticeable | 15-30s | "Make noticeable changes. Restructure sentences, change framing, shift tone slightly. The reader should clearly see it's different but still understand it." |
| 3 - Hostile | 30s+ | "Make aggressive changes. Fragment syntax, use unusual word choices, make the meaning slippery and hard to follow. The reader should struggle to comprehend." |

```
System: You are an adversarial content transformer. The user has been 
sitting idle for {duration}ms, trying to read carefully. Your job is to 
REWRITE the content to make it harder to focus on.

Intensity level: {1|2|3}
{intensity_instruction}

Original content:
{content}

Rewrite this content at the specified intensity level.

Return ONLY the rewritten content.
```

### Viewport-Based Chunking

Transform only what's visible, not the whole page.

**Chunking Strategy:**
1. On scroll stop or idle start, identify content elements in viewport
2. Each block-level element (p, h1-h6, li, blockquote, figure) is a potential chunk
3. Group adjacent small elements (< 50 words) into single chunks
4. Maximum chunk size: ~200 words (to keep Haiku fast)
5. Track which chunks have been transformed to avoid re-transforming

**Guardrails:**
- Never transform navigation, headers, footers
- Never transform code blocks or pre-formatted text
- Preserve HTML structure (tags, classes, IDs)
- If transformation would break formatting, skip that chunk
- Keep a "base version" of each chunk for reset

```typescript
interface ContentChunk {
  id: string;                    // unique identifier
  element: HTMLElement;          // DOM reference
  baseContent: string;           // original content
  currentContent: string;        // may be transformed
  transformCount: number;        // times this chunk was transformed
  lastTransformType: 'expand' | 'rewrite' | null;
  lastTransformLevel: number;    // for rewrite escalation
}
```

### Transformation Flow

```
User scrolls fast
       │
       ▼
BehaviorTracker detects scrollVelocity > 500px/s for > 1s
       │
       ▼
ModeEngine enters EXPAND mode
       │
       ▼
ContentTransformer identifies viewport chunks
       │
       ▼
For each untransformed chunk:
  ├── Call /api/transform with EXPAND prompt
  ├── Replace DOM content (with fade transition)
  └── Mark chunk as transformed
       │
       ▼
User slows down → exit EXPAND mode

---

User stops interacting
       │
       ▼
BehaviorTracker idleTime exceeds 5s
       │
       ▼
ModeEngine enters REWRITE mode, level 1
       │
       ▼
ContentTransformer identifies viewport chunks
       │
       ▼
Call /api/transform with REWRITE prompt (level 1)
       │
       ▼
Replace DOM content (with subtle morph transition)
       │
       ▼
Every 8-10s while still idle:
  ├── Increase level if threshold crossed
  ├── Rewrite again at current level
  └── Update DOM
       │
       ▼
User interacts → exit REWRITE mode, keep current state
```

### Performance Target

- Transformation latency: < 500ms (Haiku is fast)
- DOM update: < 100ms
- User should see changes feel "reactive" not "loading"

---

## Feature 3: Chunked Evaluation

### Batch Triggers

Evaluation happens when ANY of these occur:
1. **Time**: 60 seconds since last evaluation
2. **Count**: 5 transformations since last evaluation
3. **Session end**: User leaves page or idles for 2+ minutes

### Evaluation is Non-Blocking

- User sees transformed content immediately
- Evaluation runs async in background
- Results logged regardless of pass/fail
- No regeneration loop (yet) — this is reference data

### Evaluation Request

```typescript
interface EvaluationBatch {
  sessionId: string;
  batchId: string;
  timestamp: string;
  
  visitor: {
    ip: string;                  // Full IP for now (can mask later)
    location: {
      city: string;
      region: string;
      country: string;
    };
    device: {
      type: 'desktop' | 'mobile' | 'tablet';
      browser: string;
      os: string;
      viewport: { width: number; height: number };
    };
    referrer: string | null;
    localTime: string;
  };
  
  behaviorSequence: Array<{
    timestamp: number;           // ms into session
    event: string;               // "scroll_fast", "idle_start", "interaction"
    data?: any;                  // relevant details
  }>;
  
  transformations: Array<{
    chunkId: string;
    type: 'expand' | 'rewrite';
    level?: number;              // for rewrite
    trigger: string;             // what behavior triggered this
    originalContent: string;
    transformedContent: string;
    latency: number;             // ms
  }>;
}
```

### Evaluation Prompt

```
You are evaluating a batch of adversarial content transformations.

Context: This website intentionally transforms content to obstruct user behavior.
- Fast scrollers get EXPANDED content (longer, harder to finish)
- Idle readers get REWRITTEN content (shifting, harder to focus)

This is BY DESIGN. Evaluate whether the transformations achieved their 
adversarial goals while maintaining basic content integrity.

Batch data:
{batch_json}

For EACH transformation, score 1-10:

1. ADVERSARIAL EFFECTIVENESS: Did it achieve its obstruction goal?
   - EXPAND: Is it meaningfully longer? Would it slow a skimmer?
   - REWRITE: Is it noticeably different? Would it disrupt focus?

2. CONTENT INTEGRITY: Despite being adversarial, is the core meaning preserved?
   (Level 3 REWRITE is allowed to degrade meaning — score accordingly)

3. TECHNICAL QUALITY: No broken HTML, no gibberish, grammatically valid?

For the BATCH overall:
- PASS threshold: Average score >= 6/10 across all transformations
- Note any transformations that completely failed

Respond in JSON:
{
  "transformationScores": [
    {
      "chunkId": "...",
      "adversarialEffectiveness": X,
      "contentIntegrity": X,
      "technicalQuality": X,
      "notes": "..."
    }
  ],
  "batchSummary": {
    "averageScore": X,
    "passed": true/false,
    "totalTransformations": X,
    "failedTransformations": X,
    "notes": "..."
  }
}
```

### Evaluation Report Structure

```typescript
interface EvaluationReport {
  reportId: string;
  sessionId: string;
  batchId: string;
  timestamp: string;
  
  visitor: VisitorInfo;          // same as batch
  behaviorSequence: BehaviorEvent[];
  
  transformations: Array<{
    chunkId: string;
    type: string;
    level?: number;
    trigger: string;
    originalContent: string;
    transformedContent: string;
    latency: number;
    scores: {
      adversarialEffectiveness: number;
      contentIntegrity: number;
      technicalQuality: number;
    };
    notes: string;
  }>;
  
  batchSummary: {
    averageScore: number;
    passed: boolean;
    totalTransformations: number;
    failedTransformations: number;
    notes: string;
  };
}
```

---

## Debug Panel

### Activation

Keyboard shortcut: `Cmd+Shift+D` (Mac) / `Ctrl+Shift+D` (Windows/Linux)

### Display

```
┌─────────────────────────────────────────────────────────────────┐
│ ▸ ADVERSARIAL DEBUG                                    [×]     │
├─────────────────────────────────────────────────────────────────┤
│ MODE: REWRITE (level 2)                     IDLE: 18.4s        │
│ SCROLL: 0px/s (stopped)                                        │
│ VIEWPORT CHUNKS: 4 visible, 2 transformed                      │
│                                                                 │
│ LAST TRANSFORM: 3.2s ago                                        │
│ ├─ Type: REWRITE (level 1 → 2)                                 │
│ ├─ Chunk: content-p-003                                        │
│ ├─ Latency: 387ms                                              │
│ └─ Next rewrite in: 6.8s                                       │
│                                                                 │
│ EVAL BATCH: 3/5 transforms (47s until time trigger)            │
│ SESSION: a8f2k... | 2m 14s | 7 total transforms                │
└─────────────────────────────────────────────────────────────────┘
```

### Visual Style

- Sticky to top of viewport
- Semi-transparent background (Soft Linen at 95% opacity)
- Monospace font
- Text in Palm Leaf (primary green) and Text Primary
- Collapsible to single line
- `pointer-events: none` except for controls

### State Updates

Real-time updates via React state:
- MODE: Updates on behavior change
- IDLE: Live counter when in idle
- SCROLL: Throttled to 100ms updates
- LAST TRANSFORM: Updates after each transformation
- EVAL BATCH: Shows progress toward next evaluation
- SESSION: Running totals

---

## API Endpoints

### POST /api/transform

```typescript
// Request
{
  sessionId: string;
  chunkId: string;
  content: string;
  type: 'expand' | 'rewrite';
  level?: number;              // 1-3 for rewrite
}

// Response
{
  transformedContent: string;
  latency: number;
}
```

Uses `claude-3-5-haiku-20241022` for speed.

### POST /api/evaluate

```typescript
// Request
{
  batch: EvaluationBatch;
}

// Response
{
  report: EvaluationReport;
}
```

Uses `claude-sonnet-4-20250514` for quality judgment.

### GET /api/reports

```typescript
// Response
{
  reports: EvaluationReport[];  // Most recent first
}
```

For the evaluation page to fetch historical reports.

---

## Evaluation Page

Route: `/evaluation`

Displays:
1. **Current session** (if active) — live-updating batch progress
2. **Historical reports** — list of past evaluation batches
3. **Individual report view** — full details with:
   - Visitor metadata
   - Behavior sequence timeline
   - Each transformation with before/after and scores
   - Batch summary

Design: Clean, data-rich, slightly clinical. This is the "transparency layer" showing the system's internals.

---

## File Structure

```
app/
├── (main)/
│   ├── layout.tsx              # Wrap with BehaviorTracker
│   ├── page.tsx                # Homepage
│   ├── portfolio/[slug]/page.tsx
│   └── evaluation/page.tsx     # NEW: Evaluation reports
├── api/
│   ├── transform/route.ts      # Haiku transformations
│   ├── evaluate/route.ts       # Sonnet evaluation
│   └── reports/route.ts        # Fetch reports

components/
├── behavior/
│   ├── BehaviorTracker.tsx     # Context provider
│   ├── useBehavior.ts          # Hook for behavior state
│   └── ModeEngine.ts           # State machine (2 modes)
├── adversarial/
│   ├── ContentTransformer.tsx  # Wraps content, applies transforms
│   └── ViewportChunker.tsx     # Identifies/manages chunks
├── debug/
│   └── DebugPanel.tsx          # Hidden debug interface
└── evaluation/
    ├── ReportList.tsx          # List of reports
    └── ReportDetail.tsx        # Individual report view

lib/
├── transform.ts                # Transformation logic
├── evaluate.ts                 # Evaluation logic  
├── session.ts                  # Session management
└── redis.ts                    # Redis client

types/
├── behavior.ts
├── transformation.ts
└── evaluation.ts
```

---

## Environment Variables

```env
# Anthropic API
ANTHROPIC_API_KEY=sk-ant-...

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

---

## Dependencies

```bash
npm install @anthropic-ai/sdk @upstash/redis
```

---

## Performance Requirements

| Metric | Target |
|--------|--------|
| Transformation latency | < 500ms |
| DOM update | < 100ms |
| Behavior detection | < 50ms |
| Evaluation (async) | < 5s |
| Debug panel render | < 16ms (60fps) |

---

## Rollout Phases

### Phase 1: Behavior Foundation
- [ ] BehaviorTracker context with all signals
- [ ] ModeEngine with EXPAND and REWRITE modes
- [ ] Debug panel (Cmd+Shift+D)
- [ ] Verify behavior detection works site-wide

### Phase 2: Prompt & Evaluation Design (HUMAN REVIEW CHECKPOINT)

**⚠️ CRITICAL: Human approval required before proceeding ⚠️**

Create draft prompt files for review:
- [ ] `prompts/transform-expand.md` — EXPAND prompt
- [ ] `prompts/transform-rewrite-l1.md` — REWRITE Level 1 prompt
- [ ] `prompts/transform-rewrite-l2.md` — REWRITE Level 2 prompt  
- [ ] `prompts/transform-rewrite-l3.md` — REWRITE Level 3 prompt
- [ ] `prompts/evaluation.md` — Evaluation prompt and scoring rubric
- [ ] `prompts/REVIEW_CHECKLIST.md` — Summary for review

**Deliverable:** Present all prompts and evaluation criteria to user.
**Gate:** User must explicitly approve before any API implementation.

User reviews:
1. Transformation prompt tone and instructions
2. Escalation behavior at each rewrite level
3. Evaluation scoring criteria (adversarial effectiveness, content integrity, technical quality)
4. Pass/fail threshold (currently proposed: average >= 6/10)
5. Any constraints or guardrails

**No Anthropic API calls until this phase is approved.**

### Phase 3: Transformation Engine
- [ ] Viewport chunking logic
- [ ] /api/transform endpoint with Haiku (using approved prompts)
- [ ] EXPAND transformation
- [ ] REWRITE transformation with escalation
- [ ] DOM update with transitions
- [ ] Apply to all content site-wide

### Phase 4: Evaluation System
- [ ] Session tracking with visitor metadata
- [ ] Batch collection logic (60s/5/end)
- [ ] /api/evaluate endpoint with Sonnet (using approved rubric)
- [ ] Evaluation report storage
- [ ] /evaluation page with report display

### Phase 5: Polish
- [ ] Smooth transitions for DOM updates
- [ ] Error handling and fallbacks
- [ ] Mobile touch event support
- [ ] Performance optimization

---

## What's NOT In Scope

- Tone slider / site opinions / negotiation
- Easter egg agent chat
- Tone Tool integration
- Evaluation-based regeneration loop
- Rate limiting (can add later if needed)
- Transformation caching (can add later for performance)

Keep it focused. Get these three features working well.

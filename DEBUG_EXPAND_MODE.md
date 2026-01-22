# EXPAND Mode Architecture Debug Report

## Executive Summary

Two critical issues identified in EXPAND mode:

1. **Rapid Mode Toggling**: No hysteresis or cooldown in mode transitions causes unstable state
2. **Quality Gate Errors**: Pre-generated content lookup fails due to hash mismatch, falling back to LLM path

---

## 1. Mode Detection Flow

### Architecture

```
Scroll Event → ModeEngine.handleScroll() → tick() → checkModeTransitions() → Mode Change
```

**Key Files:**
- `components/behavior/ModeEngine.ts` - State machine for mode transitions
- `components/behavior/BehaviorTracker.tsx` - React context provider
- `types/behavior.ts` - Threshold definitions

### Current Thresholds

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `fastScrollVelocity` | 400 px/s | Threshold to detect fast scrolling |
| `fastScrollDuration` | 800 ms | Time velocity must be sustained |
| `expandMinDuration` | 2000 ms | Minimum time in EXPAND mode |
| `idleStart` | 4000 ms | Time to trigger REWRITE mode |

**Location:** `types/behavior.ts:46-55`

### Scroll Velocity Calculation

**Location:** `ModeEngine.ts:242-258`

```typescript
private calculateScrollVelocity(): number {
  // Uses 500ms rolling window
  const cutoff = now - 500;
  this.scrollPositions = this.scrollPositions.filter((p) => p.time > cutoff);

  // Average velocity over window
  const positionDelta = Math.abs(newest.position - oldest.position);
  return (positionDelta / timeDelta) * 1000; // px/s
}
```

**Assessment:** Velocity is smoothed over 500ms window - this is reasonable.

### Mode Transition Logic

**NEUTRAL → EXPAND** (`ModeEngine.ts:281-285`):
```typescript
case 'NEUTRAL':
  if (fastScrollSustained) {
    this.transitionTo('EXPAND', now);
  }
```

**EXPAND → NEUTRAL** (`ModeEngine.ts:292-300`):
```typescript
case 'EXPAND':
  const timeInExpandMode = now - this.state.lastModeChangeTime;
  const minDurationMet = timeInExpandMode >= this.thresholds.expandMinDuration;

  if (!fastScrollSustained && minDurationMet) {
    this.transitionTo('NEUTRAL', now);
  }
```

### ⚠️ CRITICAL ISSUE: No Hysteresis

**Location:** `ModeEngine.ts:260-275`

```typescript
private updateFastScrollSustained(now: number): void {
  const isFastScrolling = this.state.scrollVelocity > this.thresholds.fastScrollVelocity;

  if (isFastScrolling) {
    // Track sustained fast scroll...
  } else {
    this.fastScrollStartTime = null;        // ← IMMEDIATELY RESET
    this.state.fastScrollSustained = false; // ← IMMEDIATELY FALSE
  }
}
```

**Problem:**
- Entry threshold: velocity > 400 px/s for 800ms
- Exit threshold: velocity ≤ 400 px/s (same value!)
- No cooldown after exiting EXPAND mode

**Symptom:** User scrolling near 400 px/s will oscillate between modes.

---

## 2. Content Transformation Flow

### Architecture

```
Mode Change → ContentTransformer.useEffect → handleExpandMode() → applyTransformation()
    ↓
    ├── Try: getPreGeneratedExpansion() → /api/expanded (NO quality gate)
    │
    └── Fallback: callTransformAPI() → /api/transform (HAS quality gate)
```

**Key Files:**
- `components/adversarial/ContentTransformer.tsx` - Orchestration
- `lib/expanded-content.ts` - Pre-generated content lookup
- `app/api/expanded/route.ts` - Serves pre-generated content
- `app/api/transform/route.ts` - LLM transformation with quality gate

### Pre-generated Content Path (Expected for EXPAND)

**Location:** `ContentTransformer.tsx:396-442`

```typescript
// For EXPAND mode, try pre-generated content first (instant!)
if (type === 'expand') {
  const preGenResult = await getPreGeneratedExpansion(previousContent);

  if (preGenResult?.transformedContent) {
    console.log(`[Transform] Using pre-generated expansion (v${preGenResult.preGenVersion})`);
    // ... apply instantly, no LLM call, no quality gate
    return;
  }
}
// Fallback to LLM if pre-generated not found
```

**Assessment:** Code correctly tries pre-generated content first.

### LLM Fallback Path (Has Quality Gate)

**Location:** `ContentTransformer.tsx:445-506`

```typescript
// IMMEDIATE: Show loading state before API call
showLoadingState(chunk.element, type);

// Call API (fallback for EXPAND, or primary for REWRITE)
const result = await callTransformAPI(chunk, type, level);

// Handle gate failures
if (!result.transformedContent || result.gateFailed) {
  if (result.gateFailed) {
    console.log(`[Transform] Skipped due to gate failure: ${result.gateReason}`);
  }
  return;
}
```

---

## 3. Quality Gate Flow

### Architecture

```
/api/transform → transformContent() → gateTransformation()
    ↓
    ├── Tier 1: runHeuristicGate() (<10ms)
    │   ├── checkNotEmpty()
    │   ├── checkHTMLStructure()
    │   ├── checkRepetition()
    │   ├── checkLengthRatio()
    │   └── checkAIMalfunctionPatterns()
    │
    └── Tier 2: runLLMGate() (~300ms) - if enabled
```

**Key Files:**
- `app/api/transform/route.ts` - API endpoint
- `lib/qualityGate.ts` - Gate implementation

### When Quality Gate Runs

**Location:** `app/api/transform/route.ts:80-119`

```typescript
// Run quality gate if enabled
if (isQualityGateEnabled() && result.transformedContent) {
  const gateResult = await gateTransformation(/* ... */);

  if (!gateResult.passed) {
    // Gate failed - return original content with failure info
    return NextResponse.json({
      transformedContent: body.content, // Fallback to original
      gateFailed: true,
      gateReason: gateResult.reason,
    });
  }
}
```

### ✅ Key Insight: Pre-generated Content Bypasses Quality Gate

The `/api/expanded` route (`app/api/expanded/route.ts`) does NOT have any quality gate logic. Pre-generated content was already evaluated during generation, so it goes straight to the client.

**IF we're seeing quality gate errors during EXPAND mode, it means pre-generated content is NOT being found.**

---

## 4. Pre-generated Content Loading

### Hash-based Lookup System

**Location:** `lib/expanded-content.ts:91-98`

```typescript
export function hashContent(content: string): string {
  const normalized = content
    .replace(/<[^>]*>/g, '')    // Strip HTML tags
    .toLowerCase()              // Lowercase
    .replace(/\s+/g, ' ')       // Normalize whitespace
    .trim();
  return crypto.createHash('md5').update(normalized).digest('hex').slice(0, 8);
}
```

### Lookup Flow

1. Client calls `getPreGeneratedExpansion(content)` (`ContentTransformer.tsx:257-287`)
2. Fetches from `/api/expanded?content=<url-encoded-content>`
3. Server hashes content and looks up in manifest
4. Returns pre-generated content if hash matches

### ⚠️ CRITICAL ISSUE: Potential Hash Mismatch

**Problem:** Content sent from client might differ from what was scanned:

1. **HTML Differences**: Different class names, attributes, or structure
2. **Whitespace Differences**: Extra spaces, newlines
3. **Case Differences**: Mixed case vs lowercase

If ANY of these differ, the hash won't match, and LLM fallback triggers.

---

## 5. Root Cause Analysis

### Issue A: Rapid Mode Toggling

**Root Cause:** No hysteresis in mode transition thresholds

**Code Path:**
```
User scrolls at ~400px/s
→ Velocity oscillates: 401, 398, 403, 395...
→ fastScrollSustained flips: true, false, true, false...
→ Mode toggles: EXPAND, NEUTRAL, EXPAND, NEUTRAL...
```

**Evidence:**
- Entry and exit use SAME threshold (400 px/s)
- `fastScrollSustained` resets IMMEDIATELY when velocity drops (`ModeEngine.ts:272-273`)
- No cooldown period after exiting EXPAND mode

### Issue B: LLM Quality Gate Errors in EXPAND Mode

**Root Cause 1:** Hash mismatch causing LLM fallback

The client's DOM content may differ from scanned content:
- Different HTML structure (React hydration, dynamic classes)
- Different whitespace (minification, formatting)
- Case sensitivity issues

When hash doesn't match → No pre-generated content → Falls back to LLM → Quality gate runs

**Root Cause 2:** Rapid toggling causes REWRITE mode to trigger

If mode rapidly toggles:
1. EXPAND → transform chunk
2. NEUTRAL → idle timer starts
3. If idle reaches 4s → REWRITE triggers
4. REWRITE ALWAYS uses LLM + quality gate

So the quality gate errors might actually be from REWRITE mode, triggered by the rapid toggling.

---

## 6. Diagnostic Logging Recommendations

Add these console logs to trace the issue:

### In ModeEngine.ts (around line 277):
```typescript
console.log('[MODE]', {
  timestamp: Date.now(),
  scrollVelocity: this.state.scrollVelocity,
  currentMode: this.state.mode,
  fastScrollSustained: this.state.fastScrollSustained,
  timeInExpandMode: this.state.mode === 'EXPAND'
    ? Date.now() - this.state.lastModeChangeTime
    : null,
});
```

### In ContentTransformer.tsx (around line 397):
```typescript
console.log('[TRANSFORM]', {
  timestamp: Date.now(),
  mode: state.mode,
  chunkId: chunk.id,
  contentLength: chunk.currentContent.length,
  tryingPreGenerated: type === 'expand',
});
```

### In lib/expanded-content.ts (around line 210):
```typescript
console.log('[PREGEN-LOOKUP]', {
  contentHash: hash,
  chunkIdFound: chunkId,
  contentPreview: content.slice(0, 100),
});
```

---

## 7. Proposed Fixes

### Fix A: Add Hysteresis to Mode Transitions

**File:** `types/behavior.ts`

Add new thresholds:
```typescript
export interface BehaviorThresholds {
  // ... existing
  fastScrollExitVelocity: number;  // Lower threshold for exiting EXPAND
  expandCooldown: number;          // Minimum time before re-entering EXPAND
}

export const DEFAULT_THRESHOLDS: BehaviorThresholds = {
  // ... existing
  fastScrollExitVelocity: 250,     // Exit at 250px/s (vs enter at 400px/s)
  expandCooldown: 3000,            // 3s cooldown after exiting EXPAND
};
```

**File:** `ModeEngine.ts`

Modify `updateFastScrollSustained()`:
```typescript
private updateFastScrollSustained(now: number): void {
  const currentMode = this.state.mode;

  // Use different thresholds for hysteresis
  const threshold = currentMode === 'EXPAND'
    ? this.thresholds.fastScrollExitVelocity  // Lower threshold to exit
    : this.thresholds.fastScrollVelocity;     // Higher threshold to enter

  const isFastScrolling = this.state.scrollVelocity > threshold;
  // ... rest of logic
}
```

Add cooldown tracking:
```typescript
private lastExpandExitTime: number | null = null;

private checkModeTransitions(now: number): void {
  // ... in NEUTRAL case:
  case 'NEUTRAL':
    // Check cooldown before allowing EXPAND entry
    const cooldownMet = !this.lastExpandExitTime ||
      (now - this.lastExpandExitTime) >= this.thresholds.expandCooldown;

    if (fastScrollSustained && cooldownMet) {
      this.transitionTo('EXPAND', now);
    }
    // ...

  // ... in EXPAND case:
  case 'EXPAND':
    if (!fastScrollSustained && minDurationMet) {
      this.lastExpandExitTime = now;  // Track exit time
      this.transitionTo('NEUTRAL', now);
    }
}
```

### Fix B: Improve Hash Matching for Pre-generated Content

**Option 1:** More aggressive normalization

**File:** `lib/expanded-content.ts`

```typescript
export function hashContent(content: string): string {
  const normalized = content
    .replace(/<[^>]*>/g, '')           // Strip HTML tags
    .replace(/&[a-z]+;/gi, ' ')        // Strip HTML entities
    .replace(/[^\w\s]/g, '')           // Strip punctuation
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
  return crypto.createHash('md5').update(normalized).digest('hex').slice(0, 8);
}
```

**Option 2:** Fuzzy matching with similarity threshold

Instead of exact hash match, compute text similarity and accept above threshold.

**Option 3:** Debug logging to identify mismatches

Add logging to capture what content is being sent vs what's expected:

```typescript
export function getExpansionForContent(content: string): ... {
  const hash = hashContent(content);
  const chunkId = findChunkByHash(hash);

  if (!chunkId) {
    console.warn('[PREGEN-MISS]', {
      hash,
      contentPreview: content.slice(0, 200),
      normalizedPreview: hashContent.toString(), // Debug
    });
  }
  // ...
}
```

### Fix C: Skip Quality Gate for EXPAND Type Entirely

If we want to ensure EXPAND mode NEVER triggers quality gate (even on LLM fallback):

**File:** `app/api/transform/route.ts`

```typescript
// Run quality gate if enabled (but skip for EXPAND type)
if (isQualityGateEnabled() && result.transformedContent && body.type !== 'expand') {
  // ... quality gate logic
}
```

**Note:** This is a safety bypass. Consider whether expand transforms should still be gated.

---

## 8. Verification Checklist

After implementing fixes:

- [ ] Mode transitions are stable (no rapid toggling at threshold boundary)
- [ ] EXPAND mode uses pre-generated content (confirm via `[Transform] Using pre-generated expansion` log)
- [ ] No quality gate errors in EXPAND mode (no `[Transform] Gate FAILED` logs during EXPAND)
- [ ] REWRITE mode still functions correctly (transformations happen after idle)
- [ ] Debug panel shows correct state (mode, velocity, chunk counts)
- [ ] Minimum time in EXPAND mode is respected (2s before exit allowed)
- [ ] Cooldown prevents immediate re-entry after EXPAND exit

---

## 9. Expected Behavior Reference

### Correct EXPAND Mode Flow:

1. User scrolls fast (>400px/s sustained for 800ms)
2. Mode changes to EXPAND (with cooldown preventing immediate exit)
3. Viewport chunks identified
4. **Pre-generated expanded content loaded from `content/expanded/`**
5. **Content injected instantly (NO LLM call)**
6. **NO quality gate evaluation** (already pre-evaluated)
7. Debug panel shows "EXPAND" mode and latency: 0ms

### Correct EXPAND Mode Exit:

1. User slows scroll velocity below exit threshold (250px/s with hysteresis)
2. Minimum duration (2s) has passed
3. Mode returns to NEUTRAL
4. Expanded content remains (don't revert)
5. 3s cooldown before EXPAND can be re-entered

---

## 10. Files Modified

| File | Changes |
|------|---------|
| `types/behavior.ts` | Add `fastScrollExitVelocity`, `expandCooldown` thresholds |
| `components/behavior/ModeEngine.ts` | Add hysteresis + cooldown logic |
| `lib/expanded-content.ts` | Add debug logging for hash mismatches |
| `app/api/transform/route.ts` | Optional: skip gate for expand type |

---

## 11. Implementation Status

### ✅ Implemented Fixes

#### Fix A: Hysteresis + Cooldown (Rapid Toggling)

**Changes made:**

1. **`types/behavior.ts`**:
   - Added `fastScrollExitVelocity: 250` (lower threshold to exit EXPAND)
   - Added `expandCooldown: 3000` (3s cooldown before re-entering EXPAND)

2. **`components/behavior/ModeEngine.ts`**:
   - Added `lastExpandExitTime` field to track cooldown
   - Modified `updateFastScrollSustained()` to use hysteresis:
     - Entry threshold: 400 px/s (must exceed to enter EXPAND)
     - Exit threshold: 250 px/s (must drop below to exit EXPAND)
   - Modified `checkModeTransitions()` to respect cooldown:
     - Checks if 3s has passed since last EXPAND exit before allowing re-entry
   - Added diagnostic logging in `transitionTo()` for debugging

#### Fix B: Hash Algorithm + Debug Logging (Hash Mismatches)

**Root Cause Found:** The scanner hashed raw MDX (with `**bold**` markdown syntax), but the client sends rendered HTML (with `<strong>bold</strong>`). The old hash function only stripped HTML tags, not markdown syntax, so hashes could never match for formatted content.

**Changes made:**

1. **`lib/expanded-content.ts`** and **`scripts/scan-content.ts`**:
   - Updated `hashContent()` to strip BOTH HTML tags AND markdown syntax
   - Added normalization for: `**bold**`, `*italic*`, `__underline__`, `` `code` ``, `~~strikethrough~~`
   - Added stripping of markdown links `[text](url)` and images `![alt](url)`
   - Added stripping of heading markers `#`, list markers `-/*`

2. **`scripts/migrate-manifest-hashes.ts`** (new file):
   - Migration script to update existing manifest hashes to new algorithm
   - Run: `npx tsx scripts/migrate-manifest-hashes.ts`
   - Updated 96 of 337 chunks with new hashes

3. **`lib/expanded-content.ts`**:
   - Added `[PREGEN-MISS]` log when hash lookup fails (shows hash, content preview, available hashes)
   - Added `[PREGEN-EMPTY]` log when chunk exists but has no passing versions
   - Added `[PREGEN-HIT]` log on successful lookup

4. **`components/behavior/ModeEngine.ts`**:
   - Added `[MODE-TRANSITION]` log on every mode change (shows from/to, velocity, cooldown state)

### Console Log Reference

After deploying, look for these logs to diagnose issues:

```
[MODE-TRANSITION] {from: "NEUTRAL", to: "EXPAND", scrollVelocity: 450, ...}
[PREGEN-HIT] {chunkId: "abc123", hash: "f1e2d3c4", version: 1}
[Transform] Using pre-generated expansion (v1)
```

**Success indicators:**
- `[MODE-TRANSITION]` shows stable transitions (no rapid flipping)
- `[PREGEN-HIT]` appears for EXPAND transforms
- No `[Transform] Gate FAILED` messages during EXPAND mode

**Failure indicators:**
- `[MODE-TRANSITION]` rapidly alternating EXPAND ↔ NEUTRAL
- `[PREGEN-MISS]` appearing frequently (hash mismatch issue)
- `[Transform] Gate FAILED` appearing during EXPAND (means LLM fallback is being used)

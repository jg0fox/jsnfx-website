# Debug: 4-Stage Transformation Not Progressing

## Problem Statement

Only 2 content revisions appear visible when the transformation should progress through 4 distinct stages (Subtle → Noticeable → Hostile → Very Hostile).

---

## Investigation 1: Pre-Generated Content Audit

### 1.1 Directory Structure

```
jsnfx-content/
├── _manifest.json
├── evaluation/
│   ├── content.md
│   ├── content-subtle.md
│   ├── content-noticeable.md
│   ├── content-hostile.md
│   ├── content-very-hostile.md
│   └── metadata.json
├── index/
│   ├── content.md
│   ├── content-subtle.md
│   ├── content-noticeable.md
│   ├── content-hostile.md
│   ├── content-very-hostile.md
│   └── metadata.json
├── portfolio/
│   ├── [each item has 5 .md files + metadata.json]
│   ├── chime/
│   ├── netflix/
│   ├── oracle/
│   ├── robinhood/
│   └── atlassian/
├── projects/
│   ├── [each item has 5 .md files + metadata.json]
│   ├── content-journey/
│   ├── jsnfx-website/
│   ├── tone-spectrum/
│   ├── word-wrangler-game/
│   └── check-content/
├── resources/
└── writing/
```

**Answers:**
- ✅ **4 levels of content exist** (subtle, noticeable, hostile, very-hostile)
- ✅ **Levels differentiated by filename suffix**: `content-{level}.md`
- ✅ **Naming convention**: `content.md` (original), `content-subtle.md`, `content-noticeable.md`, `content-hostile.md`, `content-very-hostile.md`

### 1.2 Level to Filename Mapping

From `lib/static-content.ts:33-38`:
```typescript
const LEVEL_SUFFIXES: Record<ContentLevel, string> = {
  1: 'subtle',
  2: 'noticeable',
  3: 'hostile',
  4: 'very-hostile',
};
```

✅ **All 4 levels properly mapped to filenames**

---

## Investigation 2: Transformation Function Audit

### 2.1 Level Calculation (ModeEngine.ts:311-330)

```typescript
private updateRewriteLevel(): void {
  const { idleTime, rewriteLevel } = this.state;
  let newLevel: RewriteLevel = 1;

  // Escalate through 4 levels based on idle duration
  if (idleTime >= this.thresholds.rewriteLevel4) {
    newLevel = 4;
  } else if (idleTime >= this.thresholds.rewriteLevel3) {
    newLevel = 3;
  } else if (idleTime >= this.thresholds.rewriteLevel2) {
    newLevel = 2;
  }

  if (newLevel !== rewriteLevel) {
    const prevLevel = rewriteLevel;
    this.state.rewriteLevel = newLevel;
    // ... emit event
  }
}
```

✅ **Level calculation is correct** - properly escalates 1→2→3→4 based on idle thresholds

### 2.2 Thresholds (types/behavior.ts:63-75)

```typescript
export const DEFAULT_THRESHOLDS: BehaviorThresholds = {
  idleStart: 5000,       // 5s to enter REWRITE mode at Level 1
  rewriteLevel2: 15000,  // 15s idle for L2 (noticeable)
  rewriteLevel3: 30000,  // 30s idle for L3 (hostile)
  rewriteLevel4: 45000,  // 45s idle for L4 (very hostile)
  // ...
};
```

✅ **Thresholds are correct**: 5s→L1, 15s→L2, 30s→L3, 45s→L4

---

## Investigation 3: ROOT CAUSE IDENTIFIED

### 3.1 The Bug Location

**File:** `components/adversarial/ContentTransformer.tsx`
**Lines:** 349-356

```typescript
const applyTransformation = useCallback(
  async (chunk: ContentChunk, level: RewriteLevel) => {
    // ...

    // Find matching rewritten content
    const currentText = chunk.element.innerText;  // ❌ BUG HERE
    const rewrittenContent = findRewrittenContent(currentText, contentMap);

    if (!rewrittenContent || rewrittenContent === currentText) {
      console.log(`[Transform] No change needed for chunk ${chunk.id}`);
      return;
    }
    // ...
  }
);
```

### 3.2 Why This Causes the Problem

The content mapping works by matching **original text** → **rewritten text** at each level.

**What happens:**

1. **First transform (L1):**
   - `currentText` = "I design content systems" (original DOM text)
   - Content map has: "i design content systems" → "I craft content frameworks" (L1 subtle)
   - ✅ Match found, transform applied
   - DOM now shows: "I craft content frameworks"

2. **Level escalates to L2:**
   - `currentText` = "I craft content frameworks" (TRANSFORMED text from L1)
   - Content map has: "i design content systems" → "I architect comprehensive content ecosystems" (L2)
   - ❌ **No match found** because "I craft content frameworks" doesn't exist in the original content map
   - Logs: "No change needed for chunk"

3. **Level escalates to L3, L4:**
   - Same problem - looking up transformed text instead of original

### 3.3 Console Log Evidence

From the user's screenshot:
```
[Transform] chunk-p-0035 → L1 (4297ms, scramble animation)
[Transform] chunk-p-0036 → L1 (1538ms, scramble animation)
[Adversarial] Rewrite Level: 1 → 2
[Transform] Level change: L1 → L2
[Transform] chunk-p-0038 → L2 (2115ms, scramble animation)
[Adversarial] Rewrite Level: 2 → 3
[Transform] Level change: L2 → L3
[Transform] chunk-p-0047 → L3 (3665ms, scramble animation)
[Transform] No change needed for chunk chunk-p-0035  ❌
[Transform] No change needed for chunk chunk-p-0036  ❌
[Adversarial] Rewrite Level: 3 → 4
[Transform] Level change: L3 → L4
[Transform] No change needed for chunk chunk-p-0038  ❌
```

Chunks that were transformed at L1 cannot be transformed at L2/L3/L4 because their DOM text no longer matches the original.

---

## Root Cause Statement

**The `applyTransformation` function uses `chunk.element.innerText` (current DOM text, which may already be transformed) instead of `chunk.baseContent` (the original text stored when the chunk was registered). This means after the first transformation, subsequent level escalations cannot find matching content because the lookup key has changed.**

---

## Proposed Fix

**File:** `components/adversarial/ContentTransformer.tsx`
**Line:** 350

**Change from:**
```typescript
const currentText = chunk.element.innerText;
```

**Change to:**
```typescript
// Use baseContent (original text) for matching, not current DOM text
// This allows re-transformation at higher levels
const originalText = chunk.baseContent.replace(/<[^>]*>/g, '').trim();
```

This ensures we always look up content using the **original text**, regardless of what the DOM currently shows.

---

## Verification Checklist

- [x] Content files exist for all 4 levels (subtle, noticeable, hostile, very-hostile)
- [x] Level calculation is correct (1→2→3→4 based on idle time)
- [x] Thresholds are properly defined (5s, 15s, 30s, 45s)
- [x] Content mapping uses correct file suffixes
- [x] **Root cause identified**: Using DOM text instead of original text for lookup

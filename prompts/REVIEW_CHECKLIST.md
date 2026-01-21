# Prompt Review Checklist

> Summary of all prompts for human review before Phase 3 implementation

**Status**: AWAITING REVIEW
**Date Created**: 2026-01-21

---

## Overview

This document summarizes all prompts that will be used for API calls in the adversarial portfolio system. **No API calls will be made until you explicitly approve these prompts.**

### Files to Review

| File | Purpose | Model |
|------|---------|-------|
| `transform-expand.md` | Expand content for fast scrollers | Haiku |
| `transform-rewrite-l1.md` | Subtle rewrites (5-15s idle) | Haiku |
| `transform-rewrite-l2.md` | Noticeable rewrites (15-30s idle) | Haiku |
| `transform-rewrite-l3.md` | Hostile rewrites (30s+ idle) | Haiku |
| `evaluation.md` | Evaluate transformation batches | Sonnet |

---

## Transformation Prompts Summary

### EXPAND (`transform-expand.md`)

**Trigger**: Scroll velocity > 500px/s sustained for > 1 second

**Goal**: Make content 40-60% longer to obstruct skimming

**Key Constraints**:
- Maintain factual accuracy
- Preserve author's voice
- No meta-commentary in output

**Review Questions**:
- [ ] Is 40-60% expansion appropriate?
- [ ] Should there be a max word count cap?
- [ ] Are the expansion techniques acceptable?

---

### REWRITE Level 1 (`transform-rewrite-l1.md`)

**Trigger**: Idle 5-15 seconds

**Goal**: Subtle changes that make reader doubt their memory

**Key Constraints**:
- Meaning must be 100% identical
- Changes nearly imperceptible
- ~10-20% of words may change

**Review Questions**:
- [ ] Is "doubt their memory" framing appropriate?
- [ ] Should certain words be off-limits (names, numbers)?
- [ ] Is this achievable consistently?

---

### REWRITE Level 2 (`transform-rewrite-l2.md`)

**Trigger**: Idle 15-30 seconds

**Goal**: Noticeable changes that are clearly different but comprehensible

**Key Constraints**:
- Core meaning preserved
- ~40-60% restructured
- Still fully comprehensible

**Review Questions**:
- [ ] Is 40-60% restructuring appropriate?
- [ ] Should tone shifts be more constrained?
- [ ] Any techniques to forbid?

---

### REWRITE Level 3 (`transform-rewrite-l3.md`)

**Trigger**: Idle 30+ seconds

**Goal**: Hostile changes that make content actively difficult to read

**Key Constraints**:
- Grammatically valid (not gibberish)
- Meaning becomes elusive but not absent
- Requires effort to parse

**Review Questions**:
- [ ] Is this level of hostility appropriate?
- [ ] Should there be a "floor" of comprehensibility?
- [ ] Could this be perceived as mocking readers?
- [ ] Should any elements be preserved (names, numbers)?

---

## Evaluation Prompt Summary

### Evaluation (`evaluation.md`)

**Trigger**: 60 seconds OR 5 transformations OR session end

**Goal**: Score transformations on effectiveness, integrity, and quality

**Scoring Criteria** (each 1-10):
1. **Adversarial Effectiveness**: Did it achieve its obstruction goal?
2. **Content Integrity**: Was appropriate meaning preserved?
3. **Technical Quality**: Grammar, HTML, professionalism

**Pass Threshold**: Average score >= 6.0

**Review Questions**:
- [ ] Is 6.0 the right pass threshold?
- [ ] Should different types have different thresholds?
- [ ] Should criteria be weighted differently?
- [ ] Is L3's lower integrity bar explicitly handled?

---

## Decision Points

Please confirm or adjust the following:

### 1. Expansion Target
Current: **40-60% longer**
- [ ] Approve as-is
- [ ] Adjust to: ___________

### 2. Rewrite Intensity
Current levels:
- L1: Subtle (doubt memory)
- L2: Noticeable (clearly different)
- L3: Hostile (actively difficult)
- [ ] Approve as-is
- [ ] Adjust: ___________

### 3. Pass/Fail Threshold
Current: **Average >= 6.0**
- [ ] Approve as-is
- [ ] Adjust to: ___________

### 4. Hostile Rewrite Constraints
Current: Grammatically valid, meaning elusive but present
- [ ] Approve as-is
- [ ] Add constraints: ___________

### 5. Protected Content
Current: Technical terms and proper nouns preserved
- [ ] Approve as-is
- [ ] Add protections: ___________

---

## Approval

To approve these prompts and proceed to Phase 3:

**[ ] I have reviewed all prompt files**
**[ ] I approve the transformation prompts**
**[ ] I approve the evaluation prompt and scoring rubric**
**[ ] Proceed to Phase 3 implementation**

Or note any changes required:

```
Changes requested:
-
-
-
```

---

## Next Steps After Approval

Once approved, Phase 3 will implement:
1. Viewport chunking to identify transformable content
2. API endpoint using these prompts with Haiku
3. Content transformer to apply changes to DOM
4. Evaluation endpoint using Sonnet

No API calls will be made until this checklist is approved.

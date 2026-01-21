# Project Brief: Adversarial Portfolio v2

## The Concept

A portfolio site that **actively fights the user**.

- Scrolling fast? The content gets longer.
- Reading carefully? The words keep changing.

The site can see what you're doing, and it's going to mess with you.

---

## Why This Matters

This isn't UX optimization. It's the opposite. It's a demonstration that content systems can be responsive, dynamic, and have personality—even an adversarial one.

For Jason Fox (Lead Content Designer, systems thinker), this site becomes a portfolio piece that demonstrates:
- Real-time behavior detection
- AI-powered content transformation
- Quality evaluation frameworks
- The ability to build something genuinely novel

When someone asks "What makes you different?", the answer is: "Go to my website and try to read it."

---

## The Experience

### Fast Scrollers Get Punished

User scrolls quickly, trying to skim to the bottom.

The site notices. Content in the viewport **expands**. Paragraphs grow. New sentences appear. The page gets longer.

The harder they try to rush, the more content appears. Good luck finishing.

### Careful Readers Get Punished

User stops scrolling. They're trying to read carefully.

After 5 seconds, the content **starts changing**. At first, subtle—synonyms swap, phrasing shifts. "Wait, did that say something different?"

The longer they sit, the more aggressive it gets:
- **5-15 seconds**: Subtle. Same meaning, different words.
- **15-30 seconds**: Noticeable. Restructured sentences, different framing.
- **30+ seconds**: Hostile. Fragmented syntax, slippery meaning.

The text rewrites itself every 8-10 seconds while they remain idle. The only escape is to move.

### The Moment of Interaction

Any interaction—scroll, click, cursor movement—snaps the site back to stability. The escalation resets. But the transformed content remains.

The user is always playing against the site. The site is always watching.

---

## Three Features, Done Well

### 1. Behavior Tracking + Debug Panel

The foundation. Track:
- Scroll velocity (how fast are they moving?)
- Idle time (how long since they did anything?)
- What content is in the viewport

Hidden debug panel (Cmd+Shift+D) shows the system's internals in real-time. Terminal aesthetic, site colors, all the data exposed.

### 2. Adversarial Content Transformation

The core mechanic. Two modes:
- **EXPAND**: Fast scroll → content gets longer
- **REWRITE**: Idle → content keeps changing (escalating intensity)

Powered by Claude Haiku for speed. Target < 500ms per transformation. Should feel reactive, not loading.

Transforms only what's in the viewport. The whole page is a potential target.

### 3. Evaluation with User Metadata

The transparency layer. Every transformation gets logged and evaluated.

Batched evaluation (every 60 seconds, or every 5 transformations, or when session ends). Includes:
- Full visitor metadata (IP, location, device, browser, referrer)
- Behavior sequence (what they did, in order)
- Each transformation (before/after, scores)

Dedicated `/evaluation` page displays reports. This is the "here's what the system did" reveal.

---

## What's NOT In This Version

- Tone slider with site opinions
- Easter egg chat
- Tone Tool integration
- Regeneration based on failed evaluations

Those were v1 scope creep. This version is focused.

---

## Tone of the Experience

**Adversarial, not hostile.** The site is messing with you, but it's not malicious. It's playful antagonism. "I see you. I'm going to make this harder."

**Perceptible.** The user should notice something is happening. The debug panel existing (even hidden) signals that this is intentional, not broken.

**Functional.** Despite the adversarial behavior, the site still works. Navigation works. Links work. Content is readable (at least initially). The adversarial layer sits on top of a functioning portfolio.

---

## Technical Approach

- **Framework**: Next.js 14 (App Router) — already in place
- **AI**: Claude Haiku for transformations (fast), Claude Sonnet for evaluations (quality)
- **Storage**: Upstash Redis for sessions and evaluation data
- **Deployment**: Vercel

Fresh clone from the original repo. No salvaging from v1.

---

## Success Criteria

1. **Reactive**: Transformations feel instant (< 500ms perceived)
2. **Pervasive**: Works across the entire site, all content
3. **Perceptible**: Users notice the adversarial behavior
4. **Documented**: Evaluation page shows what happened
5. **Stable**: No crashes, no broken layouts, no gibberish

---

## The Meta Point

The site itself is the portfolio piece. It demonstrates:
- Systems thinking (behavior → mode → transformation pipeline)
- AI integration (real-time LLM content manipulation)
- Quality governance (evaluation framework)
- Craft and novelty (no one else has a site like this)

It's memorable. It's demonstrative. It's a little bit unhinged.

That's the point.

# Content Testing Protocol Generator

## What We're Building

A tool that generates lightweight testing protocols for content—whether that's product copy, learning materials, UI text, or marketing messages. The tool takes basic information about what you're testing (your research question, the content itself, and who you want to test it with) and generates a complete protocol you can run immediately.

The output is actionable: test scripts, specific questions to ask, screener criteria for participants, and guidance on interpreting results. No boilerplate. No busy work.

## Why This Matters

Content designers typically need to choose between spending weeks designing a "proper" study (interviews with a research firm, statistical rigor) or shipping untested (guessing). This tool fills the middle ground: you can validate whether your content actually works in 2-3 hours of testing with 5-8 people.

## How We're Building It: Two Versions

**Version 1 (Static, Conditional Logic):**
- Single HTML file
- User selects a testing method from a dropdown: cloze tests, comprehension checks, preference tests, five-second tests, think-aloud protocols
- System conditionally generates the protocol based on that choice
- Fast, no external dependencies, works offline

**Version 2 (API-Enhanced):**
- Same interface, now with API calls to Claude
- Sends the user's inputs + selected method to Claude API
- Claude generates a richer, more contextual protocol
- Same single-file architecture, but with network call
- Requires API key from user (they manage their own)

Both versions produce identical output structure and format. Version 1 is perfect for a workshop demo and teaches the core logic. Version 2 shows how to scale the thinking without changing the UX.

## Output Format and Constraints

Every protocol includes:

1. **Research Question** – The specific thing you want to know
2. **Method + Rationale** – Which testing approach and why it fits
3. **Stimulus Format** – How you'll show the content to participants
4. **Test Questions** – 3–5 specific questions to ask (exact wording)
5. **Success Criteria** – What "good" looks like in the data
6. **Participant Screener** – Demographics/context questions to filter participants
7. **What to Do with Results** – How to interpret findings and act on them

Output is always in plain text, structured with clear section headers. Protocols are designed to be read once, then printed or shared with a testing partner. No interactive UI in the output itself.

## Four Rules Specific to Content Testing

**1. Primacy of the Research Question**
Every element of the protocol—method choice, question wording, success criteria—flows from the research question. If you're unclear about *what you actually want to know*, stop and rewrite the question. A vague research question produces a vague protocol. This tool will not let you proceed without naming it.

**2. No Method Fetishism**
The method (cloze test, think-aloud, etc.) is a means to answer the research question, not an end in itself. A five-second test is useless if you're testing comprehension of complex material. The tool recommends a method based on the question you've posed; if that recommendation doesn't match your intuition, you might have the wrong question.

**3. Test with Real Context**
The stimulus must be presented in the context where the content will actually live. Testing a UI label in isolation from the UI is performative testing. The protocol will ask you to specify the context (in-product, on a web page, printed, etc.) because the answer changes if the context changes.

**4. Bias Toward Action**
A protocol is not a research deliverable; it's a tool for making a decision. Success criteria must be tied to a decision rule: if X happens, we ship; if Y happens, we iterate; if Z, we punt. The protocol asks you to name the threshold (e.g., "80% comprehension" or "no participant took more than 15 seconds") because without it, you'll spend time gathering data you won't use.

---

## Scope and Fit

This tool generates *lightweight, tactical* protocols for *content validation*. It assumes:
- You have the content draft already (or a close version)
- You can recruit 5–10 participants yourself or cheaply
- You want an answer in days, not months
- Your research question is about content clarity, comprehension, preference, or usability—not complex behavioral causation

If you're testing messaging strategy across markets, designing a large-scale brand study, or validating a theory about persuasion, you need a research firm or a dedicated methodologist. This tool is the scrappy version.

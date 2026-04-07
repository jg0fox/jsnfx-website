# Content Testing Protocol Generator – Technical Specification

## Overview

A single-file HTML application that generates lightweight content testing protocols. Two versions share identical user interface and output format; Version 1 uses conditional logic, Version 2 adds Claude API integration. Users input a research question, content, desired test method, and target audience. The tool outputs a complete testing protocol in structured plain text.

## Architecture

**Single-File Deployment**
- One HTML file per version (index-v1.html, index-v2.html)
- Includes embedded CSS and JavaScript
- No build step, no dependencies beyond the browser (V1) or network call (V2)
- Version 1 runs entirely offline; Version 2 requires network access to Claude API

**Two-Version Approach**

| Aspect | Version 1 | Version 2 |
|--------|-----------|----------|
| Logic | Conditional templates (if-else) | API call to Claude |
| Dependencies | None | Anthropic Claude API |
| Speed | Instant | 3–5 second wait |
| Scope | Bootstrap protocol | Full, contextual protocol |
| API Key | N/A | User-provided |

Both versions produce output in identical format and structure.

## User Interface: Four Input Fields

**Field 1: Research Question (text area, required)**
- Placeholder: "What do you want to know about this content?"
- Max 500 characters (soft limit, enforced with counter)
- Validation: Cannot be empty; must contain at least 10 characters
- Error message if invalid: "Research question required (10+ characters)"

**Field 2: Content to Test (text area, required)**
- Placeholder: "Paste the content (copy, UI label, headline, etc.)"
- Max 2000 characters
- Validation: Cannot be empty
- Error message: "Content required"

**Field 3: Testing Method (dropdown select, required)**
- Options (in order):
  - "Select a method..."
  - "Cloze Test"
  - "Comprehension Check"
  - "Preference Test"
  - "Five-Second Test"
  - "Think-Aloud Protocol"
- Validation: Cannot remain on default option
- Error message: "Select a testing method"

**Field 4: Target Audience (text input, required)**
- Placeholder: "e.g., 'First-time app users' or 'Product managers with 2+ years experience'"
- Max 200 characters
- Validation: Cannot be empty
- Error message: "Target audience required"

## Output Structure

Output sections appear in this order, with these exact headers:

1. **Research Question** – Echoes user input or clarified version
2. **Method + Rationale** – Method name and 1-2 sentence explanation
3. **Stimulus Format** – Exact presentation details (context, format, setup)
4. **Test Questions** – 3-5 numbered questions with exact wording
5. **Success Criteria** – Measurable threshold and decision rule
6. **Participant Screener** – 3-5 screener questions (exact wording)
7. **What to Do with Results** – Interpretation and decision guidance

Output is rendered as plain text in a `<pre>` or `<textarea>` element. User can copy, print, or download as .txt file.

## Version 1: Conditional Logic

**Method-to-Template Mapping**

When user selects a method, the app conditionally populates a template:

- **Cloze Test**: Stimulus is the content with 2-3 key words removed; test questions ask participant to fill blanks; success criteria is based on accuracy and speed.
- **Comprehension Check**: Stimulus is content presented once; questions ask about specific facts/instructions; success criteria is accuracy threshold (e.g., 80%).
- **Preference Test**: Stimulus is two variants side-by-side or sequential; questions ask which participant prefers and why; success criteria is preference vote distribution.
- **Five-Second Test**: Stimulus is content shown for 5 seconds exactly, then hidden; questions ask what participant remembers/felt; success criteria is recall or impression metrics.
- **Think-Aloud Protocol**: Stimulus is content; participant talks while reading; questions prompt thinking aloud ("Tell me what you're reading," "What does this mean?"); success criteria is absence of confusion.

Each template includes:
- Stimulus format paragraph (specific to method)
- 3-5 test question templates (with optional branching)
- Standard success criteria (e.g., "All participants can [action] without clarification" or "≥75% accuracy on comprehension")
- Boilerplate screener (demographics, prior exposure, relevant context)
- Standard results interpretation (what each outcome means)

Templates are human-readable and adapted for the audience input.

## Version 2: API Integration

**API Call Pattern**

When user submits form (V2):

1. Validate all four fields (same as V1)
2. If invalid, display error; do not proceed
3. If valid, construct payload:
   ```
   {
     "research_question": "[user input]",
     "content": "[user input]",
     "method": "[dropdown selection]",
     "audience": "[user input]"
   }
   ```
4. Send POST request to Claude API with:
   - User payload + system prompt (system-prompt.txt, stored as a string in the app)
   - Model: claude-3-5-sonnet-20241022 (or latest stable)
   - Max tokens: 1500
   - Timeout: 10 seconds
5. On success, render API response in output area
6. On error, display user-friendly message ("Unable to generate protocol. Check API key and try again.")

**API Key Safety**

- API key is required for Version 2; user provides it via a single input field (labeled "Claude API Key")
- Key is never stored, logged, or sent anywhere except to Claude API
- Key is discarded when page is closed
- Add a note: "Your API key is used only for this session and never saved."
- Do not validate key format (Claude API rejects invalid keys with clear error)

## Conditional Logic: Method Selection (V1 Only)

For Version 1, after user selects method, the app:

1. Looks up method in a data structure (object or array of templates)
2. Pulls the method-specific template
3. Inserts user's audience and content into relevant placeholders
4. Renders the full protocol in the output area

Example pseudo-code:
```
templates = {
  "cloze-test": { stimulus: "...", questions: [...], criteria: "..." },
  "comprehension-check": { ... },
  ...
}

selectedMethod = form.method.value
template = templates[selectedMethod]
output = template
  .replace("[CONTENT]", form.content.value)
  .replace("[AUDIENCE]", form.audience.value)
```

## Out-of-Scope

The following are explicitly not included in this tool:

1. **Statistical Analysis**: The tool does not perform quantitative analysis, calculate significance, or generate p-values. Users manually count responses and compare against success criteria.

2. **Participant Recruitment**: The tool does not recruit, screen, or pay participants. Users are responsible for finding their own 5-10 testers through personal networks, tools like Respondent or UserTesting, or in-house panels.

3. **Multi-Language Support**: The tool generates protocols in English only. Content to be tested may be in any language; output is in English.

## Success Criteria for Deployment

- Form validation prevents submission without all four fields populated
- Version 1 renders output instantly (~100ms)
- Version 2 API call completes and renders output within 8 seconds (or shows timeout error)
- Output is readable as plain text and copyable to clipboard
- Output structure matches specification exactly (all seven sections, in order)
- User can understand what to do next from the output alone (no additional help text needed)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile): responsive, touch-friendly input

No IE11 support required.

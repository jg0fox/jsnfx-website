# Content quality validator for development environments

Empowering interdisciplinary teams to verify their content standards.

*Check content* represents a command line interface (CLI) utility that analyzes codebases for content-related problems. Initially it retrieves text from HTML, JSX, or TSX documents, subsequently it automatically identifies industry context, and ultimately it transmits extracted content alongside a system prompt to a GPT-4o API. The API assesses the text against industry best-practice content guidelines, inclusive terminology, clear communication, and accessibility requirements, delivering violations accompanied by recommendations.

It constitutes one of my responses to the deterioration in interdisciplinary collaboration.

[View on NPM](https://www.npmjs.com/package/check-content)

## Go ahead, explore a demonstration

[Check content walkthrough video](https://www.loom.com/embed/7d9d1426273245daae76ee2eec309e23)

## Pattern recognition industry identification

*Check content* endeavors to automatically determine an application's industry context so that it can deliver industry-specific content guidelines.

Initially, it searches for definitive markers like ticker symbols or medical terminology that clearly establish an industry. If it fails to locate any, it reverts to weighted pattern recognition across content, dependencies, and file architectures.

```javascript
function detectIndustry(codebaseData) {
  const allText = combineAllSources(codebaseData);

  for (const [industry, patterns] of industries) {
    // Check definitive indicators first
    const definitiveMatches = patterns.definitiveIndicators
      .filter(term => allText.includes(term.toLowerCase()));

    if (definitiveMatches.length > 0) {
      return {
        industry,
        confidence: 0.9 + bonusCalculation(definitiveMatches),
        source: 'definitive_indicators'
      };
    }

    // Fall back to pattern matching
    const patternScore = calculatePatternScore(codebaseData, patterns);
  }
}
```

The utility currently accommodates six industries, each with specialized regulations. Healthcare applications receive HIPAA compliance content guidelines and person-first language verification. Finance receives regulatory compliance and risk disclosure protocols. E-commerce applications receive product clarity and conversion optimization direction.

### Enhancement: fintech trading platform

I evaluated *Check content* using a colleague's cryptocurrency trading prototype. I was fascinated to discover that the industry identification algorithm consistently categorized it as a gaming application with 70% confidence despite containing obvious financial vocabulary.

Following investigation, it emerged that the application incorporated gaming terminology like "Alpha Leaderboard", "Win Rate", and "Trading Arena" that overshadowed financial indicators such as "Stock Symbol", "TSLA Position Alert", and "Total Portfolio", producing an inaccurate assessment.

```javascript
// Content that triggered gaming detection:
"Alpha Leaderboard"     // Strong gaming signal
"Win Rate"              // Gaming terminology
"Trading Arena"         // "Arena" suggests competitive gaming

// Financial signals that were overwhelmed:
"Stock Symbol"          // Should indicate finance
"TSLA Position Alert"   // Clear stock reference
"Total Portfolio"       // Financial terminology
```

I utilized Claude Code and logical reasoning to strengthen the definitive indicator framework to emphasize financial terminology and incorporated specialized handling for ticker symbols.

## Guidelines and evaluation

The guidelines derive from three authoritative references:

1. **Atlassian Design System** - Bold, optimistic, practical voice with inclusive terminology
2. **Atlassian Inclusive Writing Guidelines** - Gender-neutral pronouns, avoiding exclusionary language
3. **California Innovation Hub Principles** - Clear communication (8th grade reading level), conversational approach

The system prompt constitutes a ~210-line constant that gets transmitted to GPT-4o as the system message in the OpenAI chat completion request.

### Primary Guidelines Categories

| Category | Severity | Examples |
|----------|----------|----------|
| **Inclusive Terminology** | error | guys→everyone, blacklist→blocklist, manpower→workforce |
| **Pronoun Guidelines** | warning | he/she→they, his/her→their |
| **Clear Communication** | warning | utilize→use, facilitate→help, paradigm→model |
| **Active Voice** | warning | "was created"→"created", "is being processed"→"processes" |
| **Missing Alt Text** | error | Images without alt attributes |
| **Non-descriptive Links** | warning | "click here"→descriptive text |

### Restricted Terms (Partial Collection)

The system prompt encompasses 50+ restricted terms:

**Gender-exclusive terminology:**

- guys, dudes, bros → team, everyone, folks
- mankind → humanity, people
- manpower → workforce, staff
- businessman, freshman → business people, first-year student

**Technical legacy terminology:**

- master/slave → primary/secondary, main/replica
- blacklist/whitelist → blocklist/allowlist

**Ableist terminology:**

- crazy/insane → surprising, unexpected
- blind spot → gap, oversight
- lame → disappointing, weak

**Jargon requiring simplification:**

- utilize, leverage → use
- facilitate → help, enable
- optimize, streamline → improve, simplify
- synergize, ideate → collaborate, brainstorm
- paradigm, methodology → model, approach

## Project specifications

**Status:** Active  
**Category:** Content tools  
**Technologies:** TypeScript, Regex, AI, System prompting, Pattern recognition, Content guidelines
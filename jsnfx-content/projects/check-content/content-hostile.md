# Content standards verification apparatus for developmental environments

Facilitating interdisciplinary practitioners in the evaluation of their textual composition caliber.

*Check content* constitutes a command-line interface (CLI) utility that systematically scrutinizes codebases for compositional deficiencies. Initially, it performs textual extraction from HTML, JSX, or TSX file formats, subsequently implements automated industry classification algorithms, and ultimately transmits the extracted material in conjunction with systematically engineered prompts to a GPT-4o application programming interface. The API conducts comprehensive evaluation of textual elements against industry-recognized compositional standards, linguistically inclusive methodologies, plain-language conventions, and accessibility compliance protocols, subsequently returning infractions accompanied by ameliorative recommendations.

This represents one of my responses to the deterioration in interdisciplinary collaborative consultation practices.

[View on NPM](https://www.npmjs.com/package/check-content)

## Proceed with demonstration exploration

[Check content walkthrough video](https://www.loom.com/embed/7d9d1426273245daae76ee2eec309e23)

## Pattern-based algorithmic industry identification

*Check content* endeavors to autonomously ascertain an application's industrial classification to facilitate the provision of sector-specific compositional standards.

Initially, it conducts systematic scanning for unambiguous indicators such as equity symbols or medical terminology that definitively establish industrial categorization. In the absence of such deterministic markers, it implements weighted pattern-matching algorithms across compositional elements, dependency structures, and hierarchical file architectures.

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

The utility presently accommodates six industrial classifications, each incorporating specialized regulatory frameworks. Healthcare applications receive HIPAA compliance compositional standards and person-first linguistic verification protocols. Financial applications receive regulatory adherence requirements and risk disclosure stipulations. Electronic commerce applications receive product articulation clarity and conversion optimization directives.

### Algorithmic refinement: fintech trading platform

I conducted experimental validation of *Check content* utilizing a colleague's cryptocurrency trading prototype. I observed with considerable interest that the industry detection algorithm persistently categorized it as a gaming application with 70% confidence despite the presence of unambiguous financial terminology.

Following investigative analysis, it was determined that the application contained gaming-related terminology such as "Alpha Leaderboard", "Win Rate", and "Trading Arena" that overshadowed financial indicators including "Stock Symbol", "TSLA Position Alert", and "Total Portfolio", consequently generating inaccurate analytical classification.

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

I employed Claude Code in conjunction with empirical reasoning to augment the definitive indicator architecture, prioritizing financial terminology and implementing specialized handling protocols for equity symbols.

## Standards framework and analytical methodology

The compositional standards derive from three authoritative documentation sources:

1. **Atlassian Design System** - Assertive, optimistic, pragmatic voice incorporating inclusive linguistic practices
2. **Atlassian Inclusive Writing Guidelines** - Gender-neutral pronominal usage, exclusionary terminology avoidance
3. **California Innovation Hub Principles** - Plain language accessibility (eighth-grade comprehension level), conversational tonality

The system prompt constitutes an approximately 210-line constant transmitted to GPT-4o as the system message within the OpenAI chat completion invocation.

### Principal Standards Classifications

| Category | Severity | Examples |
|----------|----------|----------|
| **Inclusive Language** | error | guys→everyone, blacklist→blocklist, manpower→workforce |
| **Pronoun Guidelines** | warning | he/she→they, his/her→their |
| **Plain Language** | warning | utilize→use, facilitate→help, paradigm→model |
| **Active Voice** | warning | "was created"→"created", "is being processed"→"processes" |
| **Missing Alt Text** | error | Images without alt attributes |
| **Non-descriptive Links** | warning | "click here"→descriptive text |

### Prohibited Terminology (Partial Enumeration)

The system prompt incorporates 50+ proscribed terms:

**Gender-exclusionary:**

- guys, dudes, bros → team, everyone, folks
- mankind → humanity, people
- manpower → workforce, staff
- businessman, freshman → business people, first-year student

**Technical legacy terminology:**

- master/slave → primary/secondary, main/replica
- blacklist/whitelist → blocklist/allowlist

**Ableist linguistic constructions:**

- crazy/insane → surprising, unexpected
- blind spot → gap, oversight
- lame → disappointing, weak

**Jargon requiring simplification:**

- utilize, leverage → use
- facilitate → help, enable
- optimize, streamline → improve, simplify
- synergize, ideate → work together, brainstorm
- paradigm, methodology → model, method

## Project specifications

**Status:** Active  
**Category:** Content tools  
**Technologies:** TypeScript, Regex, AI, System prompting, Pattern detection, Content standards
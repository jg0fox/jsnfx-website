# Tone spectrum explorer

A standalone HTML tool that helps people find a position on the tone spectrum, look at examples, then create a standards document in markdown.

## Inspiration

I spent years learning how to place the tone needle at a specific spot on the spectrum. it became natural for me, working out how to be more serious or playful, and all of the different language and literary tools that I might use to do that, or to reverse engineer content to understand how they did that.

And over the years, I even wrote down this knowledge so that I could share it with other people. But not everyone had the time, interest, or chance to learn the details of tone in the way that I had created. And then, it all made sense. This interactive tool, which is really just a standalone HTML page with some CSS and JavaScript, takes my years of literary and language documentation around tone of voice and puts it into a tool that feels interactive, easy to navigate, and also filled with examples.

## It's a starting point

I wanted this tool to be a starting point for people to think more carefully about tone of voice in a way that would let them document their preferred tone of voice choices and then take those choices forward into human and machine-readable formats. This is why I put together a tone of voice standard schema so that, based on where a user sets their specific spectrum, they can create a content standard for that type of tone of voice and make good things happen.

Here's an example of a content standard created by this tool:

# Tone of voice standards for _Spectrum: Playful vs. Serious | Position: 9/100 | Configuration: Strongly Playful_

## 1. Metadata

```yaml
id: TONE-346
type: tone_voice
spectrum: playful-serious
position: 9
level: Global
owner: Jason's team
version: 3.0
created: 2026-01-08
last_updated: 2026-01-08
related_standards: []
```

---

## 2. Context

- **Domain**: UX writing
- **Content types**: Interface text, notifications
- **Target audience**: End users, internal teams
- **Channel**: Web interface, mobile app
- **Scope boundaries**: Applies to interface text, notifications across ux writing contexts

---

## 3. Tone Configuration

### 3.1 Primary Positioning

- **Spectrum**: Playful vs. Serious
- **Position**: 9 out of 100 (Strongly Playful)
- **Rationale**: This positioning creates highly engaging, expressive content that focuses on connection and personality that matches user needs and brand voice requirements for ux writing.

### 3.2 Sub-Dimension Breakdown

#### Sub-Dimension: Creative Expression

- **Spectrum**: Imaginative ← → Literal
- **Positioning**: Strongly Imaginative
- **Active Devices** (3-5 specific techniques):
1. **Metaphorical language**: Apply in creative expression to reach imaginative quality
2. **Wordplay**: Apply in creative expression to reach imaginative quality
3. **Anthropomorphism**: Apply in creative expression to reach imaginative quality
- **Manifestation**: Content creative expression shows strongly imaginative characteristics through metaphorical language

#### Sub-Dimension: Rhythmic Quality

- **Spectrum**: Varied ← → Consistent
- **Positioning**: Strongly Varied
- **Active Devices** (3-5 specific techniques):
1. **Dynamic sentence length**: Apply in rhythmic quality to reach varied quality
2. **Alliteration**: Apply in rhythmic quality to reach varied quality
3. **Tempo variation**: Apply in rhythmic quality to reach varied quality
- **Manifestation**: Content rhythmic quality shows strongly varied characteristics through dynamic sentence length

#### Sub-Dimension: Structural Approach

- **Spectrum**: Non-linear ← → Hierarchical
- **Positioning**: Strongly Non-linear
- **Active Devices** (3-5 specific techniques):
1. **Unexpected information hierarchy**: Apply in structural approach to reach non-linear quality
2. **Narrative flow**: Apply in structural approach to reach non-linear quality
3. **Interrupt patterns**: Apply in structural approach to reach non-linear quality
- **Manifestation**: Content structural approach shows strongly non-linear characteristics through unexpected information hierarchy

#### Sub-Dimension: Information Density

- **Spectrum**: Spacious ← → Concentrated
- **Positioning**: Strongly Spacious
- **Active Devices** (3-5 specific techniques):
1. **Elaborative details**: Apply in information density to reach spacious quality
2. **Breathing room**: Apply in information density to reach spacious quality
3. **Contextual storytelling**: Apply in information density to reach spacious quality
- **Manifestation**: Content information density shows strongly spacious characteristics through elaborative details

---

## 4. Linguistic Guidance

### 4.1 Primary Devices (DO Use)

**Metaphorical language**
- **Definition**: A language technique in creative expression that creates specific tone effects
- **Application**: Use metaphorical language in your content to strengthen the desired tone positioning
- **Example**: "Example text showing this device"

**Wordplay**
- **Definition**: A language technique in creative expression that creates specific tone effects
- **Application**: Use wordplay in your content to strengthen the desired tone positioning
- **Example**: "Example text showing this device"

**Dynamic sentence length**
- **Definition**: A language technique in rhythmic quality that creates specific tone effects
- **Application**: Use dynamic sentence length in your content to strengthen the desired tone positioning
- **Example**: "Example text showing this device"

**Alliteration**
- **Definition**: A language technique in rhythmic quality that creates specific tone effects
- **Application**: Use alliteration in your content to strengthen the desired tone positioning
- **Example**: "Example text showing this device"

**Unexpected information hierarchy**
- **Definition**: A language technique in structural approach that creates specific tone effects
- **Application**: Use unexpected information hierarchy in your content to strengthen the desired tone positioning
- **Example**: "Example text showing this device"

**Narrative flow**
- **Definition**: A language technique in structural approach that creates specific tone effects
- **Application**: Use narrative flow in your content to strengthen the desired tone positioning
- **Example**: "Example text showing this device"

**Elaborative details**
- **Definition**: A language technique in information density that creates specific tone effects
- **Application**: Use elaborative details in your content to strengthen the desired tone positioning
- **Example**: "Example text showing this device"

**Breathing room**
- **Definition**: A language technique in information density that creates specific tone effects
- **Application**: Use breathing room in your content to strengthen the desired tone positioning
- **Example**: "Example text showing this device"

### 4.2 Secondary Devices (Use Sparingly)

- Modal verbs: Use sometimes to soften commands
- Rhetorical questions: Use sparingly for engagement
- Transitional phrases: Use when linking complex ideas

### 4.3 Avoid (Anti-Patterns)

- ❌ **Technical precision**: Conflicts with strongly playful positioning by bringing in literal characteristics
- ❌ **Functional descriptions**: Conflicts with strongly playful positioning by bringing in literal characteristics
- ❌ **Uniform sentence structure**: Conflicts with strongly playful positioning by bringing in consistent characteristics
- ❌ **Steady rhythm**: Conflicts with strongly playful positioning by bringing in consistent characteristics
- ❌ **Logical information architecture**: Conflicts with strongly playful positioning by bringing in hierarchical characteristics
- ❌ **Conventional presentation patterns**: Conflicts with strongly playful positioning by bringing in hierarchical characteristics
- ❌ **Dense information packaging**: Conflicts with strongly playful positioning by bringing in concentrated characteristics
- ❌ **Minimal exposition**: Conflicts with strongly playful positioning by bringing in concentrated characteristics

### 4.4 Content Patterns

**Sentence structure**: Mixed length, fragments okay, conversational flow
**Punctuation preferences**: Generous use of exclamation points, em dashes, and ellipses for expressiveness
**Word choice principles**: Everyday language, contractions, accessible vocabulary
**Rhythm/Pacing**: Quick tempo, mixed rhythm, conversational pacing

---

## 5. Examples

### 5.1 Correct Usage

#### Interface Labels

```
Context: Primary navigation and action buttons
- "Let's get your account set up!"
- "You're doing great so far"
- "Oops! Something went wrong, but we'll fix it right up"
Why it works: Shows strongly playful positioning through proper device usage
```

#### Notifications

```
Context: System messages and status updates
- "Woohoo! Your file uploaded successfully"
- "Just a heads up - your session expires in 5 minutes"
Why it works: Keeps consistency with strongly playful tone across all touchpoints
```

#### Error Messages

```
Context: Input validation and system errors
Example: "Oops! That didn't work. Let's try again."
Why it works: Uses casual language and contractions
Why it works: Balances playful characteristics with user needs
```

### 5.2 Incorrect Usage with Corrections

```
❌ Incorrect: "Your request has been processed according to standard protocol."
Why it fails: Too formal - uses technical language that conflicts with playful/casual positioning
✓ Correct: "Got it! We're on it."
How it's fixed: Used contractions, casual phrasing, and exclamation point
```

```
❌ Incorrect: "Please refer to section 4.2.1 of the documentation."
Why it fails: Too technical reference undermines approachable tone
✓ Correct: "Check out our help docs for more info!"
How it's fixed: Used casual phrasing, contractions, and friendly punctuation
```

---

## 6. Sub-Dimension Matrix

| Sub-Dimension | Position | Key Devices | How It Appears |
|---|---|---|---|
| Creative Expression | Strongly Imaginative | Metaphorical language, Wordplay, Anthropomorphism | Strongly imaginative quality in creative expression |
| Rhythmic Quality | Strongly Varied | Dynamic sentence length, Alliteration, Tempo variation | Strongly varied quality in rhythmic quality |
| Structural Approach | Strongly Non-linear | Unexpected information hierarchy, Narrative flow, Interrupt patterns | Strongly non-linear quality in structural approach |
| Information Density | Strongly Spacious | Elaborative details, Breathing room, Contextual storytelling | Strongly spacious quality in information density |

---

## 7. Implementation

### 7.1 Validation Rules

```json
{
  "tone_positioning": {
    "spectrum": "playful-serious",
    "target_position": 9,
    "acceptable_range": [0, 19],
    "sub_dimensions": {
      "creativity": {
        "name": "Creative Expression",
        "target_stance": "Strongly Imaginative",
        "required_devices": ["Metaphorical language","Wordplay","Anthropomorphism"],
        "minimum_device_count": 2
      },
      "rhythm": {
        "name": "Rhythmic Quality",
        "target_stance": "Strongly Varied",
        "required_devices": ["Dynamic sentence length","Alliteration","Tempo variation"],
        "minimum_device_count": 2
      },
      "structure": {
        "name": "Structural Approach",
        "target_stance": "Strongly Non-linear",
        "required_devices": ["Unexpected information hierarchy","Narrative flow","Interrupt patterns"],
        "minimum_device_count": 2
      },
      "density": {
        "name": "Information Density",
        "target_stance": "Strongly Spacious",
        "required_devices": ["Elaborative details","Breathing room","Contextual storytelling"],
        "minimum_device_count": 2
      }

    },
    "anti_patterns": ["Technical precision","Functional descriptions","Uniform sentence structure","Steady rhythm","Logical information architecture","Conventional presentation patterns","Dense information packaging","Minimal exposition"]
  }
}
```

### 7.2 Automated Checks

```yaml
content_rules:
  - name: overall_spectrum_position
    trigger: content_analysis
    validation: position_within_acceptable_range
    error: "Content tone does not match target positioning"

  - name: subdimension_device_presence
    trigger: linguistic_analysis
    validation: minimum_devices_present_per_dimension
    warning: "Consider using more recommended devices for sub-dimensions"

  - name: anti_pattern_detection
    trigger: linguistic_analysis
    validation: no_opposite_spectrum_devices
    error: "Found conflicting devices that undermine strongly playful positioning"

  - name: consistency_check
    trigger: multi_content_analysis
    validation: tone_consistent_across_content_types
    warning: "Tone differences found across different content types"
```

---

## 8. Testing Criteria

**Spectrum Position**
- [ ] Overall position within acceptable range (9 ±10 points)
- [ ] Tone strength matches strongly playful level

**Sub-Dimension Adherence**
- [ ] Each sub-dimension shows correct stance
- [ ] Minimum 60% of recommended devices present per sub-dimension
- [ ] Devices used properly in context

**Quality Checks**
- [ ] No anti-pattern devices from opposite spectrum
- [ ] Consistent use across all content types in scope
- [ ] Context appropriateness score above 75%
- [ ] User understanding validated (if applicable)

**Integration**
- [ ] Matches with related standards
- [ ] Works across defined channels
- [ ] Can scale to team implementation

---

## 9. Maintenance

- **Review Cycle**: Quarterly
- **Trigger Events**:
  - Major product/brand changes
  - Audience shift
  - Tone positioning adjustment
  - Sub-dimension rebalancing
- **Approval Process**: Jason's team, Content standards governance committee
- **Communication Plan**: Share updates via team channels, update documentation

---

_Created on 2026-01-08 using Tone of Voice Engine_
_Spectrum: Playful vs. Serious | Position: 9/100 | Configuration: Strongly Playful_

---

The Tone Spectrum Explorer is an interactive tool built for anyone interested in tone of voice to:

- **Define and explore tone of voice positioning** across 5 different tone spectrums using interactive sliders
- **Look at sub-dimensions** of tone (4 unique sub-dimensions per spectrum)
- **Explore 50+ language devices** with definitions, examples, and UX impact
- **Create complete content standards** following a structured schema
- **Find anti-patterns** to identify conflicting tone signals
- **Export standards** as markdown files or copy to clipboard
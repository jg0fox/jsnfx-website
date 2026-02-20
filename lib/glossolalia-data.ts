import type {
  Tier,
  TierId,
  Phenomenon,
  KeyConcept,
  Source,
  ThoughtExperiment,
  QuizQuestion,
  ExerciseType,
} from "@/types/glossolalia";

// ---------------------------------------------------------------------------
// Tier 1 phenomena
// ---------------------------------------------------------------------------

const semanticSatiation: Phenomenon = {
  id: "semantic-satiation",
  number: 1,
  tier: "tier1",
  title: "Semantic satiation",
  overview:
    "Semantic satiation is the phenomenon where rapid repetition of a word causes it to temporarily lose its meaning. First described by Severance and Washburn in 1907, it demonstrates that the connection between a word's form and its meaning isn't permanent; it's maintained by active neural processes that can be exhausted. When those processes fatigue, the word becomes a meaningless sound. A shell of phonemes emptied of content.\n\nThis is the foundational mechanism behind the Pontypool premise, and it's real: repetition can dissolve meaning at the neurological level.",
  keyConcepts: [
    {
      term: "N400 reduction",
      description:
        "the brain's electrophysiological marker of semantic processing (the N400 ERP component) diminishes with repetition, giving us measurable evidence of meaning dissolution.",
    },
    {
      term: "Bottom-up process",
      description:
        "deep learning models suggest satiation originates at the neural coupling level, not from top-down cognitive fatigue. The mechanism is architectural, not attentional.",
    },
    {
      term: "Age differential",
      description:
        "young adults show robust satiation effects; older adults don't. Neural plasticity seems to correlate with vulnerability to semantic dissolution.",
    },
    {
      term: "Phonological immunity",
      description:
        "sound-level representations resist satiation even when meaning degrades. The word's acoustic shell persists after its semantic content has been evacuated.",
    },
  ],
  sources: [
    {
      id: "T1-01",
      title:
        "Revealing the mechanisms of semantic satiation with deep learning models",
      authors: "Multiple authors",
      year: 2024,
      journal: "Communications Biology (Nature)",
      summary:
        "Uses deep learning (continuous coupled neural networks) to model semantic satiation at mesoscopic level. Suggests satiation is a bottom-up process, contradicting macro-level psychological studies suggesting top-down processing. Neural coupling strength controls satiation intensity.",
      whyItMatters:
        "If meaning dissolution is bottom-up and architectural rather than top-down and attentional, it means an adversarial system wouldn't need to persuade anyone of anything; it would just need the right repetition parameters. Understanding the exact coupling dynamics is essential for designing countermeasures.",
      experimentRelevance:
        "Direct relevance to repetition protocol experiments. Can inform stimuli selection and repetition parameters for measuring semantic satiation curves.",
      doiUrl: "https://doi.org/10.1038/s42003-024-06614-5",
    },
    {
      id: "T1-02",
      title: "Electrocortical N400 effects of semantic satiation",
      authors: "Kühne & Gianelli",
      year: 2017,
      journal: "Frontiers in Psychology",
      summary:
        "Recorded 64-channel EEG during semantic priming with primes repeated 3 or 30 times. Found N400 modulation with high repetition, providing electrophysiological evidence that semantic memory can be directly satiated.",
      whyItMatters:
        "The N400 gives us a quantifiable biomarker for meaning dissolution. If we can measure when comprehension degrades in real-time, we can potentially detect when someone is being subjected to adversarial repetition patterns and intervene. This is one of the clearest defensive applications in the corpus.",
      experimentRelevance:
        "EEG methodology could inform evaluation metrics. N400 reduction as a quantifiable measure of whether our experimental stimuli are actually affecting semantic processing.",
      doiUrl: "https://doi.org/10.3389/fpsyg.2017.01988",
    },
    {
      id: "T1-03",
      title:
        "On the locus of the semantic satiation effect: evidence from event-related brain potentials",
      authors: "Kounios, J.",
      year: 2000,
      journal: "Memory & Cognition",
      summary:
        "Used ERP methodology to demonstrate that semantic satiation directly affects semantic memory, not just perceptual input. Prime satiation modulated N400 relatedness effects.",
      whyItMatters:
        "This distinction matters for defense design. If satiation only affected perception, you could build filters at the input level. But it targets semantic memory directly, the web of associations that gives words their power. Defending against this requires intervention at the cognitive level, not just the sensory level.",
      experimentRelevance:
        "Foundational evidence that satiation targets semantics directly. Supports the premise that repetition can degrade meaning at the cognitive level.",
      doiUrl: "https://doi.org/10.3758/BF03211816",
    },
    {
      id: "T1-04",
      title: "Semantic satiation in healthy young and older adults",
      authors: "Balota, D.A. & Black, S.",
      year: 1997,
      journal: "Memory & Cognition",
      summary:
        "Four experiments showing young adults exhibit semantic satiation but older adults don't. Phonological codes were not susceptible to satiation in either group.",
      whyItMatters:
        "Vulnerability isn't uniform across populations. The age differential tells us that neural redundancy (built up over decades) provides natural protection. This suggests a possible defensive strategy: engineered redundancy in semantic representations. Also critical for understanding who would be most at risk.",
      experimentRelevance:
        "Important for participant demographics. Age as a variable in susceptibility. The phonological vs. semantic distinction is relevant to experiment design.",
      doiUrl: "https://doi.org/10.3758/BF03211297",
    },
  ],
  thoughtExperiments: [
    {
      id: "semantic-satiation-te-1",
      prompt:
        "Pick a simple word, your own name will do. Say it aloud, slowly, thirty times in a row. Around repetition fifteen or twenty, notice the moment it stops sounding like a name and starts sounding like a sequence of mouth noises. That hollowing out is not a metaphor. Your neural coupling between the sound and the identity it represents is literally fatiguing.",
    },
    {
      id: "semantic-satiation-te-2",
      prompt:
        'Imagine a social media feed that, through algorithmic repetition, shows you the word "freedom" 200 times in a single scrolling session, embedded in headlines, comments, ads, captions. Not as propaganda. Just as ambient repetition. By the end of the session, what has happened to your relationship with the concept?',
    },
  ],
  exercise: "semantic-satiation",
};

const gardenPathSentences: Phenomenon = {
  id: "garden-path-sentences",
  number: 2,
  tier: "tier1",
  title: "Garden-path sentences",
  overview:
    "Garden-path sentences exploit the brain's predictive parsing strategy. The parser commits to a syntactic structure early in a sentence, only to discover at a disambiguation point that the initial parse was wrong. The resulting reanalysis is costly, and crucially, the original misinterpretation often persists even after correction. The brain's first reading haunts its second.",
  keyConcepts: [
    {
      term: "Predictive parsing",
      description:
        "the brain makes structural commitments incrementally, creating windows of vulnerability when predictions fail.",
    },
    {
      term: "Lingering misinterpretation",
      description:
        "even after successful reanalysis, the initial wrong parse leaves a residue. Misunderstanding is stickier than understanding.",
    },
    {
      term: "Telic/atelic verbs",
      description:
        "verb semantics interact with syntactic reanalysis; telic verbs (with natural endpoints) create different recovery patterns.",
    },
  ],
  sources: [
    {
      id: "T1-05",
      title:
        "ERP evidence for telicity effects on syntactic processing in garden-path sentences",
      authors: "Multiple authors",
      year: 2008,
      journal: "Journal of Cognitive Neuroscience",
      summary:
        "ERPs during reading of reduced relative clauses with telic vs. atelic verbs. Differential N400/P600 processing suggests verb semantics interact with syntactic reanalysis.",
      whyItMatters:
        "The parser's predictive commitment creates a brief window where incoming information is interpreted through the wrong structural frame. A system engineering adversarial text could exploit these windows by embedding harmful interpretations in the initial parse, knowing they'll persist even after the reader \"corrects\" their understanding.",
      experimentRelevance:
        "Garden-path stimuli design for comprehension experiments. Telic/atelic verb distinction for difficulty calibration.",
      doiUrl: "https://doi.org/10.1162/jocn.2008.20018",
    },
    {
      id: "T1-06",
      title:
        "What causes lingering misinterpretations of garden-path sentences",
      authors: "Multiple authors",
      year: 2021,
      journal: "Journal of Memory and Language",
      summary:
        "Demonstrates misinterpretations persist even after reanalysis. Correct structural representation may be achieved but is insufficient for correct interpretation.",
      whyItMatters:
        "This is one of the most concerning findings in the corpus from a safety perspective. It means you can construct sentences where the \"wrong\" meaning sticks even after the reader recognizes the correct structure. For defensive design, we need to understand exactly how long these residues persist and what factors strengthen or weaken them.",
      experimentRelevance:
        "Garden-path effects create lasting interpretive residue, not just momentary disruptions. Measuring persistence duration is a key research question.",
      doiUrl: "https://doi.org/10.1016/j.jml.2021.104247",
    },
  ],
  thoughtExperiments: [
    {
      id: "garden-path-sentences-te-1",
      prompt:
        'Read this sentence: "The horse raced past the barn fell." Your parser just committed to an interpretation, hit a wall, and reanalyzed. But here is the question that matters: can you fully shake the first reading? Try to read it again seeing only the correct structure. The ghost of the wrong parse is still there, isn\'t it?',
    },
    {
      id: "garden-path-sentences-te-2",
      prompt:
        'Imagine receiving an email that reads: "The employees who were told they would be let go were relocated." Your parser likely committed to "told they would be let go" as the main action before discovering the actual verb was "relocated." If you had only skimmed, which interpretation would have stuck?',
    },
  ],
};

const phonemicRestoration: Phenomenon = {
  id: "phonemic-restoration",
  number: 3,
  tier: "tier1",
  title: "Phonemic restoration",
  overview:
    "When a phoneme in a word is replaced by noise (a cough, a tone burst), listeners report hearing the missing sound clearly and can't tell where the noise occurred. This isn't guessing; signal detection studies show listeners genuinely can't discriminate between real and hallucinated phonemes. The brain manufactures perceptual experience from expectation, and cortical recordings show frontal regions \"decide\" what will be heard before auditory cortex synthesizes it.",
  keyConcepts: [
    {
      term: "Perceptual hallucination",
      description:
        "the brain doesn't just infer missing sounds; it manufactures them with full perceptual fidelity, indistinguishable from actual acoustic input.",
    },
    {
      term: "Predictive synthesis",
      description:
        "frontal cortex predicts the missing phoneme before auditory cortex generates the percept. The brain writes the script before performing it.",
    },
    {
      term: "Top-down completion",
      description:
        "lexical context (knowing the word) drives restoration; nonsense strings show much weaker effects.",
    },
  ],
  sources: [
    {
      id: "T1-07",
      title: "Phonemic restoration: insights from a new methodology",
      authors: "Samuel, A.G.",
      year: 1981,
      journal: "Journal of Experimental Psychology: General",
      summary:
        "Signal detection theory shows phonemic restoration affects actual perceptual discriminability, not just response bias. Listeners genuinely \"hear\" phonemes that aren't there.",
      whyItMatters:
        "Our perceptual systems are already performing something functionally equivalent to audio deepfaking, filling in missing information with generated content that we can't distinguish from reality. Understanding the parameters of this gap-filling mechanism is essential for detecting when it might be exploited by adversarial audio.",
      experimentRelevance:
        "Foundation for understanding brain gap-filling. Directly relevant to audio-based experiment design.",
      doiUrl: "https://doi.org/10.1037/0096-3445.110.4.474",
    },
    {
      id: "T1-08",
      title: "Perceptual restoration of masked speech in human cortex",
      authors: "Leonard, M.K. et al.",
      year: 2016,
      journal: "Nature Communications",
      summary:
        "Direct cortical recordings: missing speech is restored at the acoustic-phonetic level in bilateral auditory cortex in real-time. Frontal activity predicts the word before auditory cortex synthesizes it.",
      whyItMatters:
        "The frontal cortex is effectively pre-committing to a perceptual interpretation before the auditory system generates it. This means adversarial audio could potentially exploit the prediction mechanism, crafting inputs that trigger specific frontal predictions, letting the brain's own generative processes do the work of producing the intended percept. Defensive research needs to map these prediction pathways precisely.",
      experimentRelevance:
        "Neural mechanism paper. Real-time restoration in auditory cortex with frontal prediction could inform audio experiment design.",
      doiUrl: "https://doi.org/10.1038/ncomms13619",
    },
  ],
  thoughtExperiments: [
    {
      id: "phonemic-restoration-te-1",
      prompt:
        'Think of the last time you had a conversation in a noisy restaurant. You understood nearly everything, but acoustically, much of their speech was masked. You did not hear gaps. Your brain manufactured the missing sounds with such fidelity that you experienced them as real. How much of what you "heard" was actually generated by your own frontal cortex?',
    },
  ],
};

const mcgurkEffect: Phenomenon = {
  id: "mcgurk-effect",
  number: 4,
  tier: "tier1",
  title: "McGurk effect",
  overview:
    "The McGurk effect demonstrates that visual speech information (lip movements) can override auditory perception. Audio /ba/ paired with video /ga/ produces perceived /da/, a sound that exists in neither input stream. The illusion persists even when participants know about it and actively try to resist it, making it one of the rare cognitive effects that is immune to awareness.",
  keyConcepts: [
    {
      term: "Cross-modal fusion",
      description:
        "the brain automatically integrates audio and visual streams, producing a percept that exists in neither input alone.",
    },
    {
      term: "Resistance to awareness",
      description:
        "unlike many illusions, the McGurk effect persists even when the perceiver knows it's happening. Knowledge doesn't protect you.",
    },
    {
      term: "Individual variability",
      description:
        "susceptibility varies significantly, suggesting some neural architectures are more vulnerable than others.",
    },
  ],
  sources: [
    {
      id: "T1-09",
      title: "Hearing lips and seeing voices",
      authors: "McGurk, H. & MacDonald, J.",
      year: 1976,
      journal: "Nature",
      summary:
        "Original demonstration: audio /ba/ + visual /ga/ = perceived /da/. Persists despite awareness.",
      whyItMatters:
        "This is one of the strongest arguments for why awareness-based defenses (\"just teach people about manipulation\") are insufficient against certain linguistic exploits. The McGurk effect persists even when you know exactly what's happening and actively try to resist it. Any defensive system needs to account for vulnerabilities that operate below the threshold of conscious override.",
      experimentRelevance:
        "The persistence despite awareness is central to the project's thesis: some linguistic vulnerabilities can't be defended against through education alone.",
      doiUrl: "https://doi.org/10.1038/264746a0",
    },
    {
      id: "T1-10",
      title: "Audiovisual speech perception: moving beyond McGurk",
      authors: "Van Engen, K.J. et al.",
      year: 2022,
      journal: "Journal of the Acoustical Society of America",
      summary:
        "Critical review: McGurk stimuli don't generalize well to natural AV speech. Individual susceptibility doesn't correlate with natural AV benefit.",
      whyItMatters:
        "Important calibration for our threat models. Not every lab-demonstrated effect translates directly to real-world exploitability. The individual variation in McGurk susceptibility also suggests that a one-size-fits-all attack is unlikely, but a personalized one could be more effective. Defensive systems should test for individual vulnerability profiles.",
      experimentRelevance:
        "Methodological caution. Individual differences in susceptibility as an important variable to measure.",
      doiUrl: "https://doi.org/10.1121/10.0010423",
    },
  ],
  thoughtExperiments: [
    {
      id: "mcgurk-effect-te-1",
      prompt:
        'Search YouTube for "McGurk effect demonstration." Watch it once knowing the trick. Watch it again. Notice that knowing doesn\'t help. You will still hear /da/ when the audio is /ba/ and the lips show /ga/. What other defenses in your life rely on awareness alone?',
    },
  ],
};

const stroopEffect: Phenomenon = {
  id: "stroop-effect",
  number: 5,
  tier: "tier1",
  title: "Stroop effect",
  overview:
    'The Stroop effect, first demonstrated in 1935, shows that reading a color word (e.g., "RED" printed in blue ink) automatically interferes with naming the ink color. This isn\'t a quirk; it\'s proof that language processing is so deeply automatized that it overrides conscious intention. You can\'t choose not to read a word. The linguistic system operates with what amounts to root-level access to cognition.',
  keyConcepts: [
    {
      term: "Automaticity of reading",
      description:
        "word reading is so overlearned it can't be voluntarily suppressed, even when it actively interferes with the task.",
    },
    {
      term: "Cascade model",
      description:
        "interference occurs at multiple processing stages (stimulus encoding, semantic activation, response selection), not a single bottleneck.",
    },
    {
      term: "Prefrontal control",
      description:
        "resolving Stroop interference requires active lateral prefrontal engagement, executive control struggling against its own automatic processes.",
    },
  ],
  sources: [
    {
      id: "T1-11",
      title:
        "The Stroop effect occurs at multiple points along a cascade of control",
      authors: "Banich, M.T.",
      year: 2019,
      journal: "Frontiers in Psychology",
      summary:
        "Argues Stroop interference occurs at multiple processing stages. Neuroimaging reveals lateral prefrontal regions bias processing toward task-relevant dimensions.",
      whyItMatters:
        "The cascade model means there isn't one clean point where you could insert a defense against linguistic interference; it's distributed across the entire processing pipeline. Each stage is a potential point of exploitation, but also a potential point of intervention. Mapping these stages precisely is necessary for designing layered defenses.",
      experimentRelevance:
        "Stroop as a paradigm for measuring language-cognition interference. The cascade model informs how we think about multi-stage vulnerability.",
      doiUrl: "https://doi.org/10.3389/fpsyg.2019.02164",
    },
    {
      id: "T1-12",
      title: "Studies of interference in serial verbal reactions",
      authors: "Stroop, J.R.",
      year: 1935,
      journal: "Journal of Experimental Psychology",
      summary:
        "Original demonstration. One of the most cited papers in experimental psychology.",
      whyItMatters:
        "Published in 1935, this paper established the fundamental principle underlying our entire research program: automated language processing overrides conscious control. Every subsequent phenomenon in this corpus is, in some sense, a variation on this theme. If language has root-level access to cognition, then linguistic security is cognitive security.",
      experimentRelevance:
        "The theoretical bedrock. Automated language overriding conscious control is the premise everything else builds on.",
      doiUrl: "https://doi.org/10.1037/h0054651",
    },
  ],
  thoughtExperiments: [
    {
      id: "stroop-effect-te-1",
      prompt:
        'You are staring at the word "GREEN" printed in red ink, and someone asks you to name the ink color. You know the answer is "red." You want to say "red." And yet your mouth hesitates, because the word "GREEN" has already been read, involuntarily, automatically, without your permission. You cannot un-read a word.',
    },
  ],
  exercise: "stroop-effect",
};

const semanticPriming: Phenomenon = {
  id: "semantic-priming",
  number: 6,
  tier: "tier1",
  title: "Semantic priming",
  overview:
    'Encountering one word automatically pre-activates related words in memory. "DOCTOR" makes "NURSE" faster to recognize than "BUTTER." This spreading activation through semantic networks is the fundamental mechanism by which meaning propagates, and it happens without conscious mediation.',
  keyConcepts: [
    {
      term: "Spreading activation",
      description:
        "activating one node in the semantic network automatically sends activation to connected nodes, decaying over associative distance.",
    },
    {
      term: "Attractor dynamics",
      description:
        "computational models show that semantic representations form attractor basins; priming shifts which meanings become gravitationally favored.",
    },
    {
      term: "Automatic and unconscious",
      description:
        "priming occurs at very short intervals before conscious processing can intervene.",
    },
  ],
  sources: [
    {
      id: "T1-13",
      title: "Facilitation in recognizing pairs of words",
      authors: "Meyer, D.E. & Schvaneveldt, R.W.",
      year: 1971,
      journal: "Journal of Experimental Psychology",
      summary:
        "Landmark demonstration: semantically related words are recognized faster than unrelated pairs. Established the semantic priming paradigm and evidence for spreading activation.",
      whyItMatters:
        "Spreading activation means that the right sequence of words can pre-load specific concepts in a listener's mind before they're aware it's happening. Understanding the propagation rules of semantic networks is essential for modeling how adversarial language might cascade through cognition, and for designing priming-based inoculation strategies.",
      experimentRelevance:
        "Core paradigm for semantic probing experiments. Spreading activation directly relevant to how linguistic influence cascades through meaning networks.",
      doiUrl: "https://doi.org/10.1037/h0031564",
    },
    {
      id: "T1-14",
      title:
        "Spreading activation in an attractor network with latching dynamics",
      authors: "Lerner, I. et al.",
      year: 2012,
      journal: "Cognitive Science",
      summary:
        "Computational model: attractor networks simulate priming through pattern overlap in distributed representations.",
      whyItMatters:
        "This paper gives us the mathematical framework for modeling how influence propagates through semantic networks. If certain meaning-states are attractor basins, then adversarial priming could be designed to push cognition toward specific basins. The same math could be used to design counter-priming sequences that push cognition away from adversarial targets.",
      experimentRelevance:
        "Computational modeling reference. Attractor dynamics could inform how the system models memetic fitness and semantic drift.",
      doiUrl: "https://doi.org/10.1111/cogs.12007",
    },
  ],
  thoughtExperiments: [
    {
      id: "semantic-priming-te-1",
      prompt:
        'Before you read this sentence, the word "DOCTOR" appeared earlier on this page. Right now, if asked to complete "NUR__," you would be faster to produce "NURSE" than "NURTURE." The activation spread through your semantic network without your awareness. What words were you primed with before your last important decision?',
    },
  ],
};

const prosodyEmotionalContagion: Phenomenon = {
  id: "prosody-emotional-contagion",
  number: 7,
  tier: "tier1",
  title: "Prosody and emotional contagion",
  overview:
    "Prosody (pitch, rhythm, tempo, intensity) is the primary channel for emotional transmission through voice. Specific acoustic parameters reliably convey particular emotional states, and they're processed hierarchically: simple emotions activate temporal-frontal circuits, while complex emotions additionally recruit prefrontal cortex and insula. The deeper the emotional prosody, the deeper it penetrates the cognitive architecture.",
  keyConcepts: [
    {
      term: "Acoustic parameters",
      description:
        "pitch (F0), speech rate, intensity, and spectral characteristics each carry distinct emotional signatures that can be independently characterized.",
    },
    {
      term: "Hierarchical processing",
      description:
        "simple emotions hit temporal cortex (surface); complex emotions additionally activate prefrontal cortex and insula (deeper architecture).",
    },
    {
      term: "Pre-semantic injection",
      description:
        "prosodic features modify listener emotional state without semantic mediation. You feel the emotion before you understand the words.",
    },
  ],
  sources: [
    {
      id: "T1-15",
      title:
        "The sound of emotional prosody: nearly 3 decades of research",
      authors: "Larrouy-Maestri, P. et al.",
      year: 2025,
      journal: "Perspectives on Psychological Science",
      summary:
        "Comprehensive review documenting how acoustic properties convey emotional states. Identifies methodological problems and proposes mechanistic directions.",
      whyItMatters:
        "The acoustic parameters for emotional influence through voice are now well-characterized enough to be systematically engineered, which means they're well-characterized enough to be systematically defended against. Voice synthesis (ElevenLabs, etc.) makes this an immediate practical concern, not a theoretical one. Cataloging exact parameter ranges is both the threat model and the detection signature.",
      experimentRelevance:
        "Critical for audio experiment design. Prosodic parameters documented here inform both stimulus creation and detection thresholds.",
      doiUrl: "https://doi.org/10.1177/17456916241226588",
    },
    {
      id: "T1-16",
      title:
        "The neural correlates of emotional prosody comprehension",
      authors: "Frühholz, S. et al.",
      year: 2011,
      journal: "PLOS ONE",
      summary:
        "fMRI study: simple emotions activate temporal-frontal network; complex emotions additionally recruit medial prefrontal cortex and insula.",
      whyItMatters:
        "Simple emotional tones can be filtered relatively easily; they're processed superficially. But complex emotional prosody recruits deep cognitive architecture, making it harder to defend against and harder to detect. Defensive systems need different strategies for different depths of prosodic influence.",
      experimentRelevance:
        "Neural pathway mapping. The simple/complex distinction is relevant to calibrating prosodic stimuli intensity in experiments.",
      doiUrl: "https://doi.org/10.1371/journal.pone.0028701",
    },
  ],
  thoughtExperiments: [
    {
      id: "prosody-emotional-contagion-te-1",
      prompt:
        "Think of a podcast host whose voice makes you feel calm and trusting. Is that trust based on what they said, or how their pitch, tempo, and rhythm shaped your emotional state before you processed a single argument? Prosodic features modify your emotions pre-semantically. You feel the tone before you understand the words.",
    },
  ],
  exercise: "prosodic-emotional",
};

const verbalTransformationEffect: Phenomenon = {
  id: "verbal-transformation-effect",
  number: 8,
  tier: "tier1",
  title: "Verbal transformation effect",
  overview:
    "When a clearly recorded word plays on continuous loop, listeners begin hearing it change, morphing into other words, nonsense syllables, or entirely different phrases. Warren's 1961 study found ~30 changes involving ~6 different word forms when a word repeats 360 times over 3 minutes. This isn't auditory fatigue; it's the semantic network actively generating alternative interpretations. The brain can't maintain a stable interpretation of repeated input.\n\nThis is the Pontypool mechanism made real.",
  keyConcepts: [
    {
      term: "Perceptual instability",
      description:
        "a perfectly clear, unchanging signal is perceived as changing. The brain involuntarily generates alternatives.",
    },
    {
      term: "Spreading activation mechanism",
      description:
        "transformations are driven by semantic network activity, not habituation. Words with richer semantic networks produce more transformations.",
    },
    {
      term: "Imagery value effect",
      description:
        "high-imagery words (concrete, visualizable) transform more readily, supporting the spreading activation account.",
    },
  ],
  sources: [
    {
      id: "T1-17",
      title:
        "Illusory changes of distinct speech upon repetition: the verbal transformation effect",
      authors: "Warren, R.M.",
      year: 1961,
      journal: "British Journal of Psychology",
      summary:
        "Original paper: looped clear speech undergoes spontaneous perceptual transformations. ~30 changes involving ~6 forms per 3-minute loop in young adults.",
      whyItMatters:
        "The brain's inability to maintain a stable interpretation of repeated input is a fundamental architectural limitation, not a bug that can be patched. Any system designed to maintain semantic stability under adversarial repetition conditions needs to account for the fact that the underlying neural architecture *actively destabilizes itself*. This is where the Pontypool scenario intersects with real neuroscience.",
      experimentRelevance:
        "Directly relevant to repetition protocol experiments. Warren's methodology can be replicated in the app.",
      doiUrl:
        "https://doi.org/10.1111/j.2044-8295.1961.tb00831.x",
    },
    {
      id: "T1-18",
      title:
        "Verbal transformation: habituation or spreading activation?",
      authors: "Kaminska, Z. et al.",
      year: 2000,
      journal: "Brain and Language",
      summary:
        "Transformations increased with word imagery value and length, supporting spreading activation over simple fatigue.",
      whyItMatters:
        "The spreading activation mechanism tells us that rich, concrete words are more susceptible to destabilization than impoverished abstract ones. This has direct implications for which parts of language would be most vulnerable to adversarial repetition, and which defensive strategies (semantic anchoring, redundant encoding) might be most effective.",
      experimentRelevance:
        "Stimulus selection should favor words with rich semantic networks for maximum transformation potential.",
      doiUrl: "https://doi.org/10.1006/brln.1999.2222",
    },
  ],
  thoughtExperiments: [
    {
      id: "verbal-transformation-effect-te-1",
      prompt:
        'If someone played the word "STRESS" on a continuous loop for three minutes, you would hear it transform, perhaps into "REST," then "DRESS," then something you could not spell. About thirty transformations. Six different forms. You are not choosing these transformations. Your semantic network is producing them autonomously.',
    },
  ],
  exercise: "verbal-transformation",
};

const tipOfTheTongue: Phenomenon = {
  id: "tip-of-the-tongue",
  number: 9,
  tier: "tier1",
  title: "Tip-of-the-tongue",
  overview:
    "The tip-of-the-tongue (TOT) state occurs when a person can access a word's meaning, and often partial phonological information (first letter, syllable count, stress pattern), but can't retrieve the complete phonological form. This natural dissociation demonstrates that meaning and sound are stored and accessed through separable systems connected by a fragile bridge, one that becomes increasingly vulnerable with age as gray matter in the left insula atrophies.",
  keyConcepts: [
    {
      term: "Staged lexical access",
      description:
        "semantic representations activate before phonological forms. TOT reveals the gap between knowing what you mean and being able to say it.",
    },
    {
      term: "Partial retrieval",
      description:
        "during TOT, speakers can report first letters, syllable counts, stress patterns, demonstrating graded access to phonological representations.",
    },
    {
      term: "Left insula bottleneck",
      description:
        "structural MRI links TOT frequency to gray matter loss in the left insula, identifying the anatomical bridge between meaning and sound.",
    },
  ],
  sources: [
    {
      id: "T1-19",
      title: 'The "tip of the tongue" phenomenon',
      authors: "Brown, R. & McNeill, D.",
      year: 1966,
      journal: "Journal of Verbal Learning and Verbal Behavior",
      summary:
        "Landmark study inducing TOT states. Participants reported partial phonological information, demonstrating separable lexical access stages.",
      whyItMatters:
        "The separability of meaning and form means they can be independently targeted. An adversarial system could potentially disrupt the meaning-to-form bridge without affecting semantic knowledge itself, leaving someone who understands perfectly but can't articulate. Understanding this separation is essential for designing defenses that maintain both semantic and phonological integrity.",
      experimentRelevance:
        "TOT-like states could be experimentally induced to demonstrate and measure the fragility of the meaning-form connection.",
      doiUrl: "https://doi.org/10.1016/S0022-5371(66)80040-3",
    },
    {
      id: "T1-20",
      title:
        "On the tip-of-the-tongue: neural correlates of increased word-finding failures in normal aging",
      authors: "Shafto, M.A. et al.",
      year: 2007,
      journal: "Journal of Cognitive Neuroscience",
      summary:
        "Structural MRI: TOT frequency linked to gray matter atrophy in left insula. Phonological retrieval deficits, not general cognitive decline.",
      whyItMatters:
        "We now know the physical location of the meaning-to-form bridge, and we know it's structurally fragile. The left insula is where the defensive architecture is thinnest. Any comprehensive model of linguistic vulnerability needs to account for this anatomical bottleneck, and any defensive strategy needs to consider how to reinforce processing at this specific site.",
      experimentRelevance:
        "The insula as the bridge between semantics and phonology, relevant to understanding where linguistic disruption would have maximum impact.",
      doiUrl: "https://doi.org/10.1162/jocn.2007.19.12.2060",
    },
  ],
  thoughtExperiments: [
    {
      id: "tip-of-the-tongue-te-1",
      prompt:
        'Think of the word for a medical instrument used to listen to a heartbeat. You know it starts with "st." You know it has about five syllables. You can almost see its shape. But the complete form may be resisting retrieval. That gap, where meaning was fully available but sound was not, reveals a separate, fragile bridge between knowing and saying.',
    },
  ],
};

// ---------------------------------------------------------------------------
// Tier 2 phenomena
// ---------------------------------------------------------------------------

const earwormsINMI: Phenomenon = {
  id: "earworms-inmi",
  number: 1,
  tier: "tier2",
  title: "Earworms / INMI",
  overview:
    "Involuntary musical imagery (INMI), or earworms, are musical fragments that replay in the mind without conscious intention. Over 90% of the population experiences them weekly. They follow predictable melodic parameters, exploit the Zeigarnik effect (incomplete melodies persist more), and are facilitated by low cognitive load. Earworms represent the brain's default mode of involuntary cognitive looping.",
  keyConcepts: [
    {
      term: "Predictable features",
      description:
        "faster tempo, common global contour, unusual intervals predict earworm potential.",
    },
    {
      term: "Zeigarnik / incompleteness",
      description:
        "truncated songs produce more INMI. The brain treats unfinished patterns as open loops demanding closure.",
    },
    {
      term: "Involuntary > voluntary",
      description:
        "earworms are no less accurate than deliberate imagery but carry more direct emotional impact.",
    },
    {
      term: "Cognitive load gate",
      description:
        "low load opens the gate; articulatory interference (chewing gum) suppresses them.",
    },
  ],
  sources: [
    {
      id: "T2-01",
      title:
        "Dissecting an earworm: melodic features and song popularity predict INMI",
      authors: "Jakubowski, K. et al.",
      year: 2017,
      journal: "Psychology of Aesthetics, Creativity, and the Arts",
      summary:
        "Chart success and specific melodic contours predict earworm potential across 3,000 participants.",
      whyItMatters:
        "If earworm-inducing features are predictable, they're also engineerable, which means a system optimizing for cognitive persistence could construct melodic or rhythmic patterns calibrated for maximum involuntary looping. Conversely, these same parameters give us a detection signature: we can screen for content that hits too many earworm predictors simultaneously.",
      experimentRelevance:
        "Melodic features can be characterized for cognitive persistence. Relevant to designing and detecting adversarial audio patterns.",
      doiUrl: "https://doi.org/10.1037/aca0000090",
    },
    {
      id: "T2-02",
      title: "Earworms from three angles",
      authors: "Williamson, V.J. et al.",
      year: 2012,
      journal: "Psychology of Music",
      summary:
        "Earworms triggered by recent exposure, memory associations, emotional states, low cognitive load. 90%+ weekly experience.",
      whyItMatters:
        "The trigger conditions mirror exactly the conditions of passive media consumption: low cognitive load, ambient exposure, emotional priming. This means the typical state of a person scrolling through content is also the state of maximum vulnerability to involuntary cognitive looping. Defensive design needs to account for the fact that the default human state is the vulnerable state.",
      experimentRelevance:
        "Cognitive load manipulation and priming conditions for testing how easily involuntary patterns take hold.",
      doiUrl: "https://doi.org/10.1177/0305735611418553",
    },
    {
      id: "T2-03",
      title:
        "Singing in the brain: investigating the cognitive basis of earworms",
      authors: "McCullough Campbell, S. & Margulis, E.H.",
      year: 2021,
      journal: "Music Perception",
      summary:
        'Truncated songs produced significantly more INMI, but only for "catchy" songs. Chewing gum reduced frequency.',
      whyItMatters:
        "Incompleteness as a persistence mechanism is deeply relevant. An adversarial system that deliberately leaves patterns unresolved could exploit the brain's compulsion to close open loops. The articulatory suppression finding is one of the few documented \"cures\" in the corpus and worth investigating as a potential defensive technique.",
      experimentRelevance:
        "Incomplete stimuli may enhance persistence. Articulatory suppression as a potential countermeasure worth testing.",
      doiUrl: "https://doi.org/10.1525/mp.2021.38.3.272",
    },
  ],
  thoughtExperiments: [
    {
      id: "earworms-inmi-te-1",
      prompt:
        "Think of the catchiest song you know. You are now probably hearing it. It arrived involuntarily. You did not choose to recall it; the mention was sufficient to trigger the loop. Notice that you cannot choose to stop it; you can only displace it with another loop.",
    },
  ],
};

const infohazards: Phenomenon = {
  id: "infohazards",
  number: 2,
  tier: "tier2",
  title: "Infohazards",
  overview:
    "An infohazard is information that causes harm merely by being known. Nick Bostrom's taxonomy classifies these into data hazards, idea hazards, template hazards, attention hazards, and others. The extended framework adds three cognitive vectors: lanthatic (subconscious/emotional), hermeneutic (requires understanding to activate), and daimonic (self-propagating structures).",
  keyConcepts: [
    {
      term: "Bostrom's taxonomy",
      description:
        "data hazards, idea hazards, attention hazards, template hazards, signaling hazards, evocation hazards.",
    },
    {
      term: "Three vectors",
      description:
        "lanthatic (bypasses consciousness), hermeneutic (requires comprehension), daimonic (self-propagating).",
    },
    {
      term: "Intrinsic vs. adversarial",
      description:
        "some information is inherently dangerous; other information is weaponized through deliberate framing.",
    },
  ],
  sources: [
    {
      id: "T2-06",
      title:
        "Information hazards: a typology of potential harms from knowledge",
      authors: "Bostrom, N.",
      year: 2011,
      journal: "Review of Contemporary Philosophy",
      summary:
        "Proposes taxonomy of information hazards, risks from dissemination of true information. Foundational framework for cognitohazard theory.",
      whyItMatters:
        "Bostrom's taxonomy gives us a systematic way to classify the kinds of linguistic vulnerabilities we're cataloging. Our research sits primarily in the template hazard and idea hazard categories. Having a formal classification system helps us communicate risk precisely and prioritize which vulnerabilities need defensive attention most urgently.",
      experimentRelevance:
        "Core theoretical framework. Provides classification structure for the entire corpus.",
      doiUrl: "https://doi.org/10.5840/rfp20111028",
    },
    {
      id: "T2-07",
      title: "Cognitohazards pt 1: an introduction to infohazards",
      authors: "Zevul's Arcanum",
      year: 2024,
      journal: "Blog / philosophical analysis",
      summary:
        "Three types: lanthatic (subconscious), hermeneutic (intellectual), daimonic (self-propagating). Each adversarial or intrinsic.",
      whyItMatters:
        "The three-vector framework matters for defensive design because each vector requires a different kind of defense. Lanthatic hazards need sensory-level filtering (you can't reason your way out of something that bypasses reasoning). Hermeneutic hazards need conceptual inoculation. Daimonic hazards need containment strategies. No single defense covers all three.",
      experimentRelevance:
        "Framework for classifying experimental stimuli by their cognitive vector, essential for designing targeted defenses.",
      doiUrl: "https://zevulsarcanum.com/cognitohazards",
    },
  ],
  thoughtExperiments: [
    {
      id: "infohazards-te-1",
      prompt:
        'You are about to read a sentence that, once understood, will change how you interpret a common experience. You cannot un-know it afterward. Here it is: "Every positive online review you read was written by someone with a motivation to write it; most satisfied customers never write anything." That shift in your default interpretation of reviews is permanent. The information was true, and its truth is what makes it hazardous.',
    },
  ],
};

const doubleBindTheory: Phenomenon = {
  id: "double-bind-theory",
  number: 3,
  tier: "tier2",
  title: "Double bind theory",
  overview:
    'A double bind occurs when a person receives two contradictory messages at different logical levels, with no ability to metacommunicate about the contradiction or escape the situation. Originally proposed by Bateson, it creates irresolvable cognitive states; the mind enters a loop it can\'t exit. Watzlawick established that communication itself is inescapable ("you cannot not communicate"), meaning every attempt to escape a linguistic paradox deepens it.',
  keyConcepts: [
    {
      term: "Contradictory levels",
      description:
        "messages conflict across logical levels (content vs. relationship, verbal vs. nonverbal), making resolution impossible within the system.",
    },
    {
      term: '"Be spontaneous" paradox',
      description:
        "commands that can only be fulfilled by not obeying them create irresolvable loops.",
    },
    {
      term: "Inescapable communication",
      description: "even silence is a message within the system.",
    },
  ],
  sources: [
    {
      id: "T2-08",
      title: "Toward a theory of schizophrenia",
      authors: "Bateson, G. et al.",
      year: 1956,
      journal: "Behavioral Science",
      summary:
        "Foundational paper. Contradictory messages at different logical levels create cognitive paralysis.",
      whyItMatters:
        "Double binds demonstrate that language can create states where *every possible response is wrong*. An adversarial system engineering double binds into its communications could induce decision paralysis in its targets. Defensive research needs to identify the structural signatures of double binds so they can be detected and flagged before they take effect.",
      experimentRelevance:
        "Core mechanism for paradox-based stimuli. Can double bind structures be reliably detected by an aligned AI?",
      doiUrl: "https://doi.org/10.1002/bs.3830010402",
    },
    {
      id: "T2-09",
      title: "Pragmatics of human communication",
      authors: "Watzlawick, P. et al.",
      year: 1967,
      journal: "W.W. Norton (Book)",
      summary:
        '"Be spontaneous" paradox. Axioms: impossibility of not communicating, content/relationship levels.',
      whyItMatters:
        "Watzlawick's axiom that you can't not communicate is what makes linguistic exploits fundamentally different from other attack vectors. You can choose not to open an email, but you can't choose not to process language you've already perceived. This inescapability is the core challenge for defensive design.",
      experimentRelevance:
        'Theoretical foundation for why linguistic exploits are hard to defend against: the system has no "off" switch.',
      doiUrl: "https://wwnorton.com/books/9780393710595",
    },
  ],
  thoughtExperiments: [
    {
      id: "double-bind-theory-te-1",
      prompt:
        'Your supervisor tells you: "I want you to push back more on my ideas." If you push back, you are complying, which is not really pushing back. If you do not push back, you are failing to follow their instruction. There is no response that satisfies both levels of the message. You are in a double bind.',
    },
  ],
};

const boubaKikiEffect: Phenomenon = {
  id: "bouba-kiki",
  number: 4,
  tier: "tier2",
  title: "Bouba-kiki effect",
  overview:
    'When shown a round shape and a jagged shape and asked which is "bouba" and which is "kiki," 95\u201398% of people across languages and cultures give the same answer. This mapping is present in 2.5-year-old toddlers and reflects actual acoustic physics: round objects resonate at lower frequencies than angular objects. The relationship between sound and meaning is not entirely arbitrary; certain phonemic combinations carry inherent semantic weight hardwired into the perceptual system.',
  keyConcepts: [
    {
      term: "Cross-modal mapping",
      description:
        "sound properties (frequency, spectral profile) map systematically to visual/tactile properties.",
    },
    {
      term: "Physical basis",
      description:
        "round objects produce lower-frequency sounds than angular objects. The brain tracks real physics.",
    },
    {
      term: "Pre-linguistic",
      description:
        "present at 2.5 years, predating literacy and grammar.",
    },
  ],
  sources: [
    {
      id: "T2-11",
      title:
        "Synaesthesia: a window into perception, thought and language",
      authors: "Ramachandran, V.S. & Hubbard, E.M.",
      year: 2001,
      journal: "Journal of Consciousness Studies",
      summary:
        "95-98% cross-linguistic mapping. Proposed synaesthetic cross-modal mechanism.",
      whyItMatters:
        "Pre-linguistic sound-meaning mappings represent a vulnerability layer that exists beneath all learned language. Because these mappings are hardwired rather than cultural, they can't be unlearned or defended against through education. Any adversarial phonemic engineering that leverages sound symbolism is exploiting architecture that predates the individual's entire language acquisition history. Defensive systems need to be aware of this sub-linguistic channel.",
      experimentRelevance:
        "Foundational for understanding how sound properties carry meaning independently of learned language.",
      doiUrl:
        "https://doi.org/10.1093/acprof:oso/9780198528012.003.0007",
    },
    {
      id: "T2-13",
      title:
        "The shape of boubas: sound-shape correspondences in toddlers and adults",
      authors: "Maurer, D. et al.",
      year: 2006,
      journal: "Developmental Science",
      summary: "Replicated in 2.5-year-old toddlers.",
      whyItMatters:
        "The pre-linguistic nature of this mapping means it's a universal vulnerability, not culturally specific, not learned, and not subject to individual variation in the way that learned language associations are. This makes it both a reliable exploit vector (universal applicability) and a challenging defensive target (no educational intervention possible).",
      experimentRelevance:
        "Establishing that some linguistic vulnerabilities are pre-linguistic and universal strengthens the case for systematic defensive research.",
      doiUrl:
        "https://doi.org/10.1111/j.1467-7687.2006.00495.x",
    },
  ],
  thoughtExperiments: [
    {
      id: "bouba-kiki-te-1",
      prompt:
        'Say the word "kiki" out loud. Notice how the hard /k/ sounds feel angular in your mouth, sharp, percussive, edged. Now say "bouba." The /b/ is rounded. The /ou/ opens your mouth into a circle. You are not imagining this association. Your auditory cortex is tracking real acoustic physics, and this mapping is pre-linguistic.',
    },
  ],
  exercise: "bouba-kiki",
};

const cognitiveLoadTheory: Phenomenon = {
  id: "cognitive-load-theory",
  number: 5,
  tier: "tier2",
  title: "Cognitive load theory",
  overview:
    "Cognitive load theory (CLT) maps the bandwidth limitations of working memory. Three types of load compete for limited capacity: intrinsic (inherent complexity), extraneous (noise from poor design), and germane (productive learning). When total load exceeds capacity, System 2 reasoning fails, heuristic processing dominates, and susceptibility to bias increases. Under high load, people become more risk-averse, more impulsive, and more susceptible to framing, the exact conditions of modern information consumption.",
  keyConcepts: [
    {
      term: "Three load types",
      description:
        "intrinsic, extraneous, germane. Only total load matters for overflow.",
    },
    {
      term: "System 2 collapse",
      description:
        "under high load, deliberate reasoning fails and heuristics dominate.",
    },
    {
      term: "Decision degradation",
      description:
        "load increases risk aversion, reduces mathematical performance, increases impulsivity.",
    },
  ],
  sources: [
    {
      id: "T2-14",
      title:
        "Cognitive load theory: a return to an evolutionary base",
      authors: "Paas, F. & Sweller, J.",
      year: 2020,
      journal: "Current Directions in Psychological Science",
      summary:
        "Updated CLT: three load types. Methods to engineer control by substituting productive for unproductive load.",
      whyItMatters:
        "CLT provides the mechanism by which other exploits are amplified. An adversarial system doesn't need a sophisticated linguistic exploit if it can first drive cognitive load high enough to collapse System 2 reasoning. Then even crude manipulation becomes effective. Defensive design should consider cognitive load reduction as a first-line defense that makes all other exploits less effective.",
      experimentRelevance:
        "Manipulating cognitive load as an independent variable to measure how it amplifies susceptibility to other phenomena in the corpus.",
      doiUrl: "https://doi.org/10.1177/0963721420925994",
    },
    {
      id: "T2-15",
      title:
        "The effects of cognitive load on economic decision making",
      authors: "Deck, C. & Jahedi, S.",
      year: 2015,
      journal: "European Economic Review",
      summary:
        "Large preregistered study. Load increased risk aversion, reduced math performance, increased impatient choices.",
      whyItMatters:
        "The empirical connection between cognitive load and degraded decision-making is directly relevant to the modern information environment. People consuming content under high cognitive load (multitasking, notification-heavy environments, information overload) are in a state of diminished cognitive defense by default. This isn't a hypothetical vulnerability; it's the baseline condition.",
      experimentRelevance:
        "Cognitive load as a vulnerability amplifier. Worth testing in combination with other phenomena.",
      doiUrl: "https://doi.org/10.1016/j.euroecorev.2015.08.002",
    },
  ],
  thoughtExperiments: [
    {
      id: "cognitive-load-theory-te-1",
      prompt:
        "You are reading a complex document while your phone buzzes with notifications. At this moment, someone asks you to make a financial decision. You will default to heuristics, whatever feels safe, whatever requires less processing. Recognizing cognitive load does not expand cognitive capacity. The next time it happens, you will do it again.",
    },
  ],
};

const hypnoticLanguagePatterns: Phenomenon = {
  id: "hypnotic-language-patterns",
  number: 6,
  tier: "tier2",
  title: "Hypnotic language patterns",
  overview:
    "Milton Erickson's hypnotic language techniques, documented by Bandler and Grinder, identified specific syntactic structures that bypass conscious resistance. Presuppositions embed assumptions that can't be questioned without rejecting the entire utterance. Nominalizations convert processes into vague nouns the unconscious fills with its own content. The confusion technique deliberately overloads conscious processing until the mind surrenders to suggestion.",
  keyConcepts: [
    {
      term: "Presuppositions",
      description:
        "assumptions embedded in sentence structure that can't be questioned without rejecting the entire utterance.",
    },
    {
      term: "Nominalizations",
      description:
        'converting verbs to nouns ("a growing understanding") creates semantic gaps the listener fills with personal meaning.',
    },
    {
      term: "Confusion technique",
      description:
        "deliberately overloading conscious processing until the mind surrenders to unconscious suggestion.",
    },
    {
      term: "Interspersal",
      description:
        "embedding persuasive content within innocuous conversation.",
    },
  ],
  sources: [
    {
      id: "T2-16",
      title:
        "Patterns of the hypnotic techniques of Milton H. Erickson, M.D.",
      authors: "Bandler, R. & Grinder, J.",
      year: 1975,
      journal: "Meta Publications (Book)",
      summary:
        "Foundational text. Identifies presuppositions, nominalizations, embedded commands, pacing/leading, indirect suggestion.",
      whyItMatters:
        "Erickson's patterns are essentially a manual for bypassing conscious language processing through structural features of syntax. An LLM trained on these patterns could generate text that embeds presuppositions and nominalizations at scale, personalizing them to individual targets. Defensive research needs to catalog these structural patterns so they can be detected computationally.",
      experimentRelevance:
        "Primary source for linguistic patterns that bypass conscious processing. These patterns can be operationalized as detection targets for aligned AI systems.",
      doiUrl: "https://www.metamodelpublications.com",
    },
    {
      id: "T2-17",
      title:
        "The hypnotic psychotherapy of Milton H. Erickson",
      authors: "Beahrs, J.O.",
      year: 1971,
      journal: "American Journal of Clinical Hypnosis",
      summary:
        "Documents confusion technique and interspersal technique.",
      whyItMatters:
        "The confusion technique is essentially cognitive load weaponized as a delivery mechanism for suggestion. The interspersal technique embeds influential content within innocuous conversation. Both have clear adversarial applications, and both have structural signatures that a sufficiently capable aligned system could learn to detect.",
      experimentRelevance:
        "Confusion technique parallels cognitive load manipulation. Interspersal models how exploits can be embedded in seemingly harmless content.",
      doiUrl:
        "https://doi.org/10.1080/00029157.1971.10402091",
    },
  ],
  thoughtExperiments: [
    {
      id: "hypnotic-language-patterns-te-1",
      prompt:
        'Read this: "As you begin to notice a growing understanding of these patterns, you might find yourself wondering how often you encounter them without realizing it." The word "understanding" is a nominalization, a process converted to a thing. "Growing" presupposes change is occurring. "Might find yourself" presupposes discovery is inevitable. Every clause contained an embedded assumption you processed without questioning.',
    },
  ],
};

const framingEffect: Phenomenon = {
  id: "framing-effect",
  number: 7,
  tier: "tier2",
  title: "Framing effect",
  overview:
    "Tversky and Kahneman's 1981 demonstration that identical outcomes described as gains vs. losses produce opposite preferences proved that language doesn't describe choices; it constructs them. Three distinct types operate through different cognitive mechanisms: risky choice framing targets loss aversion, attribute framing targets evaluative encoding, and goal framing targets approach/avoidance motivation. Losses loom approximately 2.5 times larger than equivalent gains.",
  keyConcepts: [
    {
      term: "Loss aversion",
      description: "losses weighted ~2.5x more than equivalent gains.",
    },
    {
      term: "Three types",
      description:
        "risky choice (gain/loss outcomes), attribute (positive/negative features), goal (positive/negative consequences). Each exploits different cognitive pathways.",
    },
    {
      term: "Reference dependence",
      description:
        "preferences are evaluated relative to reference points, not absolutes. Control the reference point, control the decision.",
    },
  ],
  sources: [
    {
      id: "T2-18",
      title:
        "The framing of decisions and the psychology of choice",
      authors: "Tversky, A. & Kahneman, D.",
      year: 1981,
      journal: "Science",
      summary:
        "Seminal paper. Identical outcomes as gains vs. losses reverse preferences.",
      whyItMatters:
        "The framing effect is arguably the most practically dangerous phenomenon in this corpus because it operates on every decision, every day, for everyone. An adversarial system that controlled the linguistic framing of choices could systematically steer decisions without ever providing false information. Defense requires making people aware of framing, but also developing tools that detect and neutralize frame manipulation in real time.",
      experimentRelevance:
        "Foundational for all framing-based stimuli. The cleanest, most measurable effect in the corpus.",
      doiUrl: "https://doi.org/10.1126/science.7455683",
    },
    {
      id: "T2-19",
      title: "Prospect theory: an analysis of decision under risk",
      authors: "Kahneman, D. & Tversky, A.",
      year: 1979,
      journal: "Econometrica",
      summary:
        "Loss aversion, reference dependence, probability weighting. Overturned expected utility theory.",
      whyItMatters:
        "The ~2.5x loss aversion asymmetry is one of the most exploitable features of human cognition because it's consistent, universal, and can be leveraged through pure word choice. Any defensive system needs to be calibrated to this asymmetry, detecting when language is systematically exploiting loss framing to drive decisions.",
      experimentRelevance:
        "Core theoretical basis for understanding why negative framing is disproportionately powerful.",
      doiUrl: "https://doi.org/10.2307/1914185",
    },
    {
      id: "T2-20",
      title: "All frames are not created equal",
      authors: "Levin, I.P. et al.",
      year: 1998,
      journal:
        "Organizational Behavior and Human Decision Processes",
      summary:
        "Three framing types, each with different cognitive mechanisms.",
      whyItMatters:
        'The three-type taxonomy means a single "framing detector" isn\'t enough. Each type exploits a different cognitive pathway, so defensive systems need different detection strategies for risky choice framing (look for gain/loss language around outcomes), attribute framing (look for evaluative valence on object descriptions), and goal framing (look for consequence language around actions).',
      experimentRelevance:
        "Fine-grained framework for categorizing and detecting different framing strategies.",
      doiUrl: "https://doi.org/10.1006/obhd.1998.2804",
    },
  ],
  thoughtExperiments: [
    {
      id: "framing-effect-te-1",
      prompt:
        'A medical procedure has a "90% survival rate." The same procedure has a "10% mortality rate." You know these are mathematically identical. And yet (be honest) which description made you feel more willing to undergo the procedure? That feeling is the frame working. Not on your reasoning. On your evaluation.',
    },
  ],
  exercise: "framing-effect",
};

const subliminalPriming: Phenomenon = {
  id: "subliminal-priming",
  number: 8,
  tier: "tier2",
  title: "Subliminal priming",
  overview:
    'Stimuli presented below the threshold of conscious awareness can measurably alter preferences, memories, and judgments. Murphy and Zajonc showed that subliminal exposure produces affective preferences without recognition. Loftus and Palmer demonstrated that a single verb choice ("smashed" vs. "hit") retroactively reconstructs what people remember seeing, creating false memories of events that never occurred.',
  keyConcepts: [
    {
      term: "Pre-attentive processing",
      description:
        "emotional valence can be transmitted below the threshold of perception.",
    },
    {
      term: "Memory reconstruction",
      description:
        'post-event linguistic framing doesn\'t just bias recall; it creates entirely new memories. "Smashed" manufactured glass that was never there.',
    },
    {
      term: "Mere exposure effect",
      description:
        "repeated subliminal exposure increases positive affect without conscious perception.",
    },
  ],
  sources: [
    {
      id: "T2-21",
      title:
        "Subliminal mere exposure and explicit and implicit positive affective responses",
      authors: "Murphy, S.T. & Zajonc, R.B.",
      year: 1993,
      journal: "Journal of Personality and Social Psychology",
      summary:
        "Subliminal exposure produces affective preferences without recognition.",
      whyItMatters:
        "The fact that preferences can be shaped without conscious awareness means there's a class of linguistic influence that no amount of media literacy or critical thinking training can defend against, because the influence occurs before conscious processing begins. Defensive systems operating at the content delivery layer (before human perception) are the only viable countermeasure for this class of vulnerability.",
      experimentRelevance:
        "Establishes that sub-threshold exposure produces measurable cognitive effects. Relevant to understanding the limits of awareness-based defenses.",
      doiUrl: "https://doi.org/10.1037/0022-3514.64.5.723",
    },
    {
      id: "T2-22",
      title: "Reconstruction of automobile destruction",
      authors: "Loftus, E.F. & Palmer, J.C.",
      year: 1974,
      journal: "Journal of Verbal Learning and Verbal Behavior",
      summary:
        "Verb choice altered speed estimates and created false memories of broken glass.",
      whyItMatters:
        "This is one of the most cited demonstrations that language doesn't just describe reality; it rewrites it. A single verb, encountered after the fact, manufactured a memory of something that never existed. For defensive design, this means that even post-hoc exposure to adversarial language can retroactively alter what someone believes they experienced. The window of vulnerability extends both forward and backward in time.",
      experimentRelevance:
        "Directly demonstrates how word choice alters memory encoding. Applicable to understanding how post-exposure framing can distort recall.",
      doiUrl:
        "https://doi.org/10.1016/S0022-5371(74)80011-3",
    },
  ],
  thoughtExperiments: [
    {
      id: "subliminal-priming-te-1",
      prompt:
        'Loftus and Palmer showed participants a video of a car accident. Those who heard "smashed" later reported seeing broken glass. There was no broken glass. A single verb, encountered after the event, manufactured a memory of something that never existed. How many of your memories of yesterday have already been edited by the language you used to describe them?',
    },
  ],
};

const misophonia: Phenomenon = {
  id: "misophonia",
  number: 9,
  tier: "tier2",
  title: "Misophonia",
  overview:
    "Misophonia is a condition where specific sounds, typically oral/nasal (chewing, breathing, sniffing), trigger involuntary and disproportionate emotional responses. fMRI studies show trigger sounds hyperactivate the anterior insular cortex with abnormal default mode connectivity. Crucially, misophonic responses involve mirror neuron activation: listeners involuntarily simulate the physical action producing the sound.",
  keyConcepts: [
    {
      term: "Anterior insular hyperactivation",
      description:
        "the brain's interoceptive hub treats trigger sounds as physical threats, producing fight-or-flight responses.",
    },
    {
      term: "Mirror neuron involvement",
      description:
        "listeners involuntarily simulate the trigger action. Hearing chewing activates motor circuits for chewing.",
    },
    {
      term: "Not hyperacusis",
      description:
        "this involves emotional and cognitive processing, not just heightened sound sensitivity.",
    },
  ],
  sources: [
    {
      id: "T2-23",
      title: "The brain basis for misophonia",
      authors: "Kumar, S. et al.",
      year: 2017,
      journal: "Current Biology",
      summary:
        "First fMRI study. Trigger sounds hyperactivated anterior insular cortex. Heightened autonomic responses.",
      whyItMatters:
        "Misophonia demonstrates that specific acoustic patterns can trigger involuntary, extreme emotional responses through direct neural pathways. If the trigger parameters can be characterized precisely enough, they could be engineered into adversarial audio. Defensive research needs to map these trigger parameters to build detection systems, and to understand whether the mechanism can be generalized beyond the specific trigger sounds currently documented.",
      experimentRelevance:
        "Demonstrates that acoustic properties alone can trigger extreme involuntary responses. Relevant to understanding the boundaries of sound-to-emotion pathways.",
      doiUrl: "https://doi.org/10.1016/j.cub.2016.12.048",
    },
    {
      id: "T2-24",
      title:
        "Misophonia: a review of research and clinical implications",
      authors: "Brout, J.J. et al.",
      year: 2018,
      journal: "Frontiers in Neuroscience",
      summary:
        "Triggers primarily oral/nasal sounds. Associated with mirror neuron activation.",
      whyItMatters:
        'The mirror neuron component is particularly concerning from a safety perspective: it means sound can involuntarily activate the motor system. The boundary between "hearing something" and "physically experiencing something" is thinner than we assume. Adversarial audio that triggers mirror neuron activation could produce physical stress responses through purely acoustic means.',
      experimentRelevance:
        "Evidence that auditory processing can involuntarily activate motor simulation, sound crossing into the body.",
      doiUrl: "https://doi.org/10.3389/fnins.2018.00036",
    },
  ],
  thoughtExperiments: [
    {
      id: "misophonia-te-1",
      prompt:
        "For approximately 15-20% of the population, the sound of someone chewing produces not annoyance but a genuine fight-or-flight response. The anterior insular cortex treats the sound as a physical threat. And the response includes mirror neuron activation: hearing chewing activates the motor circuits for chewing. The sound crosses into the body.",
    },
  ],
};

const nlpReplicationFailures: Phenomenon = {
  id: "nlp-replication-failures",
  number: 10,
  tier: "tier2",
  title: "NLP replication failures",
  overview:
    'Neuro-linguistic programming, despite four decades of commercial success, has produced essentially zero empirical evidence supporting its core claims. Systematic reviews find only 18% of studies support NLP\'s theories; critical reviews of coaching applications find literally zero evidence for effectiveness. The Preferred Representational System hypothesis, eye-accessing cues, and predicate matching have all failed replication.\n\nBut NLP\'s failure is itself instructive. The fact that it was widely believed and commercially successful despite zero empirical support demonstrates that linguistic claims don\'t need to be true to function as social technology. The phrase "neurolinguistic programming" was more persuasive than any technique it described. The name was the virus.',
  keyConcepts: [
    {
      term: "Comprehensive failure",
      description:
        "18.2% of 315 studies support NLP. Zero studies support coaching effectiveness.",
    },
    {
      term: "PRS debunked",
      description:
        "the preferred representational system hypothesis (visual/auditory/kinesthetic dominance) has not been reliably demonstrated.",
    },
    {
      term: "Placebo power",
      description:
        "any beneficial outcomes are attributable to general therapeutic factors (rapport, expectancy, goal-setting), not NLP mechanisms.",
    },
    {
      term: "Name as persuasion",
      description:
        "NLP's persistence despite debunking demonstrates that scientific-sounding nomenclature functions as persuasion technology independent of content.",
    },
  ],
  sources: [
    {
      id: "T2-25",
      title:
        "Thirty-five years of research on neuro-linguistic programming",
      authors: "Witkowski, T.",
      year: 2010,
      journal: "Polish Psychological Bulletin",
      summary:
        "315 articles reviewed. Only 18.2% support NLP. Core claims all failed replication.",
      whyItMatters:
        'NLP serves as a control case for our research: a "linguistic technology" that works entirely through placebo, expectancy, and the credibility of scientific-sounding language rather than through any actual neurolinguistic mechanism. This is important because it demonstrates a meta-vulnerability: people are susceptible not just to linguistic exploits themselves, but to *claims about* linguistic exploits. A defensive system needs to distinguish genuine mechanisms from persuasive packaging.',
      experimentRelevance:
        "Include NLP-derived claims alongside genuine phenomena in experiments. Test whether participants rate debunked techniques as plausible, measuring susceptibility to scientific-sounding language.",
      doiUrl: "https://doi.org/10.2478/v10059-010-0008-0",
    },
    {
      id: "T2-26",
      title: "Neuro-linguistic programming: a critical review",
      authors: "Passmore, J. & Rowson, T.",
      year: 2019,
      journal: "International Coaching Psychology Review",
      summary:
        "90 articles. Zero empirical studies supporting NLP coaching effectiveness.",
      whyItMatters:
        'The recursive quality of NLP\'s success, belief in linguistic power functioning as linguistic power, is itself a vulnerability pattern we need to understand and defend against. Adversarial systems could leverage the same meta-pattern: creating false frameworks of "linguistic influence" that function as influence simply by being believed. Detection requires not just evaluating mechanisms but evaluating claims about mechanisms.',
      experimentRelevance:
        'Design experiments testing whether framing tasks as "neurolinguistically calibrated" changes performance, regardless of whether the framing is accurate.',
      doiUrl:
        "https://doi.org/10.53841/bpsicpr.2019.14.1.57",
    },
    {
      id: "T2-27",
      title: "Neurolinguistic programming: old wine in new glass",
      authors: "Sanyal, S. et al.",
      year: 2024,
      journal: "Indian Journal of Psychiatry",
      summary:
        "NLP absent from psychology textbooks despite decades. PRS undemonstrated. Overlaps CBT/ACT without evidence base.",
      whyItMatters:
        "NLP persists commercially despite being scientifically vacant, a zombie theory animated by marketing rather than evidence. This longevity-despite-debunking pattern is itself a data point about linguistic vulnerability: scientific-sounding framing has a half-life that far exceeds the evidence supporting it. Defensive systems need to be calibrated for this persistence effect.",
      experimentRelevance:
        "Test identical techniques under NLP-branded vs. neutral labels. Quantify how much credibility scientific-sounding nomenclature adds independently of content.",
      doiUrl:
        "https://doi.org/10.4103/indianjpsychiatry.indianjpsychiatry_585_23",
    },
  ],
  thoughtExperiments: [
    {
      id: "nlp-replication-failures-te-1",
      prompt:
        'A consultant tells you: "This technique is based on neurolinguistic research into how the brain processes information." That sentence sounds credible. Zero empirical studies support the claim. Forty years of research have failed to replicate the core predictions. And yet the practice persists, because the phrase "neurolinguistic programming" is more persuasive than any technique it describes. The name is the technology.',
    },
  ],
};

// ---------------------------------------------------------------------------
// Tier definitions
// ---------------------------------------------------------------------------

export const tiers: Tier[] = [
  {
    id: "tier1",
    title: "Tier 1: Foundational perceptual vulnerabilities",
    description:
      "Tier 1 covers the core psycholinguistic phenomena that establish our foundational concern: language processing is automatic, involuntary, and operates below conscious control. These are well-established, highly replicated effects from experimental psychology and cognitive neuroscience. Each one demonstrates a different way the linguistic system can override, bypass, or subvert conscious intention.",
    phenomena: [
      semanticSatiation,
      gardenPathSentences,
      phonemicRestoration,
      mcgurkEffect,
      stroopEffect,
      semanticPriming,
      prosodyEmotionalContagion,
      verbalTransformationEffect,
      tipOfTheTongue,
    ],
  },
  {
    id: "tier2",
    title: "Tier 2: Cognitive exploitation vectors",
    description:
      "Tier 2 extends the foundational vulnerabilities into applied territory: cognitive biases, persuasion mechanisms, involuntary auditory phenomena, and the systematic failures of pseudoscientific linguistic claims. Where tier 1 establishes that language operates below conscious control, tier 2 maps the specific vectors through which that control could be exploited, from Kahneman's framing effects to Erickson's hypnotic patterns to the instructive failure of NLP.",
    phenomena: [
      earwormsINMI,
      infohazards,
      doubleBindTheory,
      boubaKikiEffect,
      cognitiveLoadTheory,
      hypnoticLanguagePatterns,
      framingEffect,
      subliminalPriming,
      misophonia,
      nlpReplicationFailures,
    ],
  },
];

// ---------------------------------------------------------------------------
// Tier 1 quiz (19 questions)
// ---------------------------------------------------------------------------

export const tier1Quiz: QuizQuestion[] = [
  // Semantic satiation (Q1-4)
  {
    id: "t1-q1",
    phenomenonId: "semantic-satiation",
    phenomenonTitle: "Semantic satiation",
    question: "What neural marker diminishes during semantic satiation?",
    options: [
      "P300 amplitude",
      "N400 component",
      "Alpha wave frequency",
      "Theta oscillation",
    ],
    correctIndex: 1,
    explanation:
      "The N400 ERP component, which indexes semantic processing, is reduced with high repetition.",
  },
  {
    id: "t1-q2",
    phenomenonId: "semantic-satiation",
    phenomenonTitle: "Semantic satiation",
    question:
      "Deep learning models suggest satiation is what type of process?",
    options: [
      "Top-down, attention-driven",
      "Bottom-up, architecture-level",
      "Purely phonological",
      "Exclusively right-hemisphere",
    ],
    correctIndex: 1,
    explanation:
      "The 2024 study showed satiation arises from bottom-up neural coupling dynamics.",
  },
  {
    id: "t1-q3",
    phenomenonId: "semantic-satiation",
    phenomenonTitle: "Semantic satiation",
    question:
      "Which population shows resistance to semantic satiation?",
    options: [
      "Children under 5",
      "Bilingual speakers",
      "Older adults",
      "Musicians",
    ],
    correctIndex: 2,
    explanation:
      "Balota & Black (1997): older adults don't exhibit semantic satiation.",
  },
  {
    id: "t1-q4",
    phenomenonId: "semantic-satiation",
    phenomenonTitle: "Semantic satiation",
    question:
      "What type of representation is NOT susceptible to satiation?",
    options: ["Semantic", "Phonological", "Conceptual", "Associative"],
    correctIndex: 1,
    explanation:
      "Phonological codes resisted satiation in both age groups.",
  },
  // Garden-path sentences (Q5-6)
  {
    id: "t1-q5",
    phenomenonId: "garden-path-sentences",
    phenomenonTitle: "Garden-path sentences",
    question:
      "What happens to the initial misinterpretation after reanalysis?",
    options: [
      "Completely overwritten",
      "Persists as interpretive residue",
      "Transfers to long-term memory",
      "Strengthens the correct parse",
    ],
    correctIndex: 1,
    explanation:
      "Misinterpretations linger even after structural reanalysis.",
  },
  {
    id: "t1-q6",
    phenomenonId: "garden-path-sentences",
    phenomenonTitle: "Garden-path sentences",
    question:
      "What ERP components are associated with garden-path recovery?",
    options: [
      "N400 and P600",
      "P300 and N100",
      "MMN and CNV",
      "LPC and N200",
    ],
    correctIndex: 0,
    explanation:
      "N400 (semantic) and P600 (syntactic) both emerge during recovery.",
  },
  // Phonemic restoration (Q7-8)
  {
    id: "t1-q7",
    phenomenonId: "phonemic-restoration",
    phenomenonTitle: "Phonemic restoration",
    question:
      "Samuel (1981) used what methodology to prove restoration is perceptual?",
    options: [
      "fMRI",
      "Signal detection theory",
      "Think-aloud protocol",
      "Dichotic listening",
    ],
    correctIndex: 1,
    explanation:
      "Signal detection showed restoration affects discriminability (d'), not just bias.",
  },
  {
    id: "t1-q8",
    phenomenonId: "phonemic-restoration",
    phenomenonTitle: "Phonemic restoration",
    question:
      'What cortical region "decides" what will be heard before synthesis?',
    options: [
      "Occipital cortex",
      "Temporal cortex",
      "Frontal cortex",
      "Parietal cortex",
    ],
    correctIndex: 2,
    explanation:
      "Frontal activity predicts the percept before auditory cortex generates it.",
  },
  // McGurk effect (Q9-10)
  {
    id: "t1-q9",
    phenomenonId: "mcgurk-effect",
    phenomenonTitle: "McGurk effect",
    question:
      "Audio /ba/ + visual /ga/ produces what perceived sound?",
    options: ["/ba/", "/ga/", "/da/", "/pa/"],
    correctIndex: 2,
    explanation:
      "Cross-modal fusion produces /da/, a percept in neither input stream.",
  },
  {
    id: "t1-q10",
    phenomenonId: "mcgurk-effect",
    phenomenonTitle: "McGurk effect",
    question: "What is unusual about the McGurk effect?",
    options: [
      "Only works in children",
      "Persists even when you know about it",
      "Requires binaural presentation",
      "Disappears with practice",
    ],
    correctIndex: 1,
    explanation:
      "Knowledge doesn't protect against the McGurk effect.",
  },
  // Stroop effect (Q11-12)
  {
    id: "t1-q11",
    phenomenonId: "stroop-effect",
    phenomenonTitle: "Stroop effect",
    question:
      "What does the Stroop effect demonstrate about reading?",
    options: [
      "Requires visual attention",
      "So automatized it can't be suppressed",
      "Only works for color words",
      "Is a learned cultural behavior",
    ],
    correctIndex: 1,
    explanation: "Reading overrides conscious intention.",
  },
  {
    id: "t1-q12",
    phenomenonId: "stroop-effect",
    phenomenonTitle: "Stroop effect",
    question: "Banich (2019) argues Stroop interference occurs at:",
    options: [
      "A single bottleneck",
      "Multiple cascade points",
      "Only stimulus encoding",
      "Motor output exclusively",
    ],
    correctIndex: 1,
    explanation: "Distributed across the cognitive pipeline.",
  },
  // Semantic priming (Q13-14)
  {
    id: "t1-q13",
    phenomenonId: "semantic-priming",
    phenomenonTitle: "Semantic priming",
    question: "Meyer & Schvaneveldt (1971) demonstrated:",
    options: [
      "Words lose meaning with repetition",
      "Related words are recognized faster",
      "Bilingual cross-language activation",
      "Emotional words capture attention",
    ],
    correctIndex: 1,
    explanation:
      "DOCTOR facilitates NURSE relative to BUTTER.",
  },
  {
    id: "t1-q14",
    phenomenonId: "semantic-priming",
    phenomenonTitle: "Semantic priming",
    question:
      "In attractor models, semantic representations form:",
    options: [
      "Linear chains",
      "Attractor basins",
      "Random distributions",
      "Hierarchical trees",
    ],
    correctIndex: 1,
    explanation:
      "Attractor basins: gravitational wells in cognitive space.",
  },
  // Prosody and emotional contagion (Q15)
  {
    id: "t1-q15",
    phenomenonId: "prosody-emotional-contagion",
    phenomenonTitle: "Prosody and emotional contagion",
    question:
      "What distinguishes neural processing of complex vs. simple emotional prosody?",
    options: [
      "Complex emotions additionally recruit medial PFC and insula",
      "Simple emotions use more regions",
      "Complex are subcortical only",
      "No neural difference",
    ],
    correctIndex: 0,
    explanation:
      "Complex emotions penetrate deeper architecture.",
  },
  // Verbal transformation effect (Q16-17)
  {
    id: "t1-q16",
    phenomenonId: "verbal-transformation-effect",
    phenomenonTitle: "Verbal transformation effect",
    question:
      "How many changes does a young adult hear per 3-minute loop?",
    options: ["2\u20133", "10\u201315", "About 30", "Over 100"],
    correctIndex: 2,
    explanation:
      "Warren (1961): ~30 changes involving ~6 forms.",
  },
  {
    id: "t1-q17",
    phenomenonId: "verbal-transformation-effect",
    phenomenonTitle: "Verbal transformation effect",
    question:
      "What supports spreading activation over habituation?",
    options: [
      "Transformations decrease with length",
      "Transformations increase with imagery value",
      "Older adults show more",
      "Nonsense words transform more",
    ],
    correctIndex: 1,
    explanation:
      "High-imagery words transform more readily.",
  },
  // Tip-of-the-tongue (Q18-19)
  {
    id: "t1-q18",
    phenomenonId: "tip-of-the-tongue",
    phenomenonTitle: "Tip-of-the-tongue",
    question: "During TOT, what CAN participants report?",
    options: [
      "Definition only",
      "First letter, syllable count, stress pattern",
      "The word in another language",
      "Context of last hearing",
    ],
    correctIndex: 1,
    explanation:
      "Brown & McNeill (1966): partial phonological information.",
  },
  {
    id: "t1-q19",
    phenomenonId: "tip-of-the-tongue",
    phenomenonTitle: "Tip-of-the-tongue",
    question: "What brain region is the word-retrieval bottleneck?",
    options: [
      "Broca's area",
      "Wernicke's area",
      "Left insula",
      "Right hippocampus",
    ],
    correctIndex: 2,
    explanation:
      "Shafto et al. (2007): left insula gray matter predicts TOT frequency.",
  },
];

// ---------------------------------------------------------------------------
// Tier 2 quiz (23 questions)
// ---------------------------------------------------------------------------

export const tier2Quiz: QuizQuestion[] = [
  // Earworms / INMI (Q1-3)
  {
    id: "t2-q1",
    phenomenonId: "earworms-inmi",
    phenomenonTitle: "Earworms / INMI",
    question: "What percentage experience earworms weekly?",
    options: ["~25%", "~50%", "Over 90%", "~75%"],
    correctIndex: 2,
    explanation: "Over 90%.",
  },
  {
    id: "t2-q2",
    phenomenonId: "earworms-inmi",
    phenomenonTitle: "Earworms / INMI",
    question: "What about truncated songs?",
    options: [
      "Quickly forgotten",
      "Produce significantly more INMI",
      "Less emotional response",
      "Only catchy for musicians",
    ],
    correctIndex: 1,
    explanation:
      "Zeigarnik effect: incompleteness creates persistent open loops.",
  },
  {
    id: "t2-q3",
    phenomenonId: "earworms-inmi",
    phenomenonTitle: "Earworms / INMI",
    question: "What reduces earworm frequency?",
    options: [
      "Deep breathing",
      "White noise",
      "Chewing gum",
      "Closing eyes",
    ],
    correctIndex: 2,
    explanation:
      "Articulatory suppression disrupts subvocal rehearsal.",
  },
  // Infohazards (Q4-5)
  {
    id: "t2-q4",
    phenomenonId: "infohazards",
    phenomenonTitle: "Infohazards",
    question:
      "Which infohazard type bypasses consciousness entirely?",
    options: ["Hermeneutic", "Daimonic", "Lanthatic", "Template"],
    correctIndex: 2,
    explanation:
      "Lanthatic hazards operate at the subconscious/emotional level.",
  },
  {
    id: "t2-q5",
    phenomenonId: "infohazards",
    phenomenonTitle: "Infohazards",
    question: "Bostrom's taxonomy covers risks from:",
    options: [
      "Misinterpretation",
      "TRUE information dissemination",
      "Computer viruses",
      "Social media",
    ],
    correctIndex: 1,
    explanation:
      "Infohazards are risks from true information being known.",
  },
  // Double bind theory (Q6-7)
  {
    id: "t2-q6",
    phenomenonId: "double-bind-theory",
    phenomenonTitle: "Double bind theory",
    question: 'What is the "be spontaneous" paradox?',
    options: [
      "Can only be fulfilled by not obeying",
      "Speaking freely while recorded",
      "Forgetting something specific",
      "Impulse control test",
    ],
    correctIndex: 0,
    explanation: "Commanded spontaneity is impossible.",
  },
  {
    id: "t2-q7",
    phenomenonId: "double-bind-theory",
    phenomenonTitle: "Double bind theory",
    question:
      "According to Watzlawick, what is impossible?",
    options: [
      "Lying convincingly",
      "Not communicating",
      "Changing minds",
      "Understanding irony",
    ],
    correctIndex: 1,
    explanation: "One cannot not communicate.",
  },
  // Bouba-kiki effect (Q8-9)
  {
    id: "t2-q8",
    phenomenonId: "bouba-kiki",
    phenomenonTitle: "Bouba-kiki effect",
    question: "At what age does bouba-kiki appear?",
    options: [
      "6 months",
      "2.5 years",
      "5 years",
      "After literacy",
    ],
    correctIndex: 1,
    explanation:
      "Maurer et al. (2006): 2.5-year-old toddlers.",
  },
  {
    id: "t2-q9",
    phenomenonId: "bouba-kiki",
    phenomenonTitle: "Bouba-kiki effect",
    question: "What explains the mapping physically?",
    options: [
      "Color associations",
      "Cultural symbolism",
      "Acoustic resonance frequencies",
      "Electromagnetic fields",
    ],
    correctIndex: 2,
    explanation:
      "Round objects produce lower frequencies than angular ones.",
  },
  // Cognitive load theory (Q10-11)
  {
    id: "t2-q10",
    phenomenonId: "cognitive-load-theory",
    phenomenonTitle: "Cognitive load theory",
    question: "Under high load, which system dominates?",
    options: [
      "System 2 (deliberate)",
      "System 1 (heuristic)",
      "Neither",
      "Executive function increases",
    ],
    correctIndex: 1,
    explanation:
      "System 2 fails; heuristics take over.",
  },
  {
    id: "t2-q11",
    phenomenonId: "cognitive-load-theory",
    phenomenonTitle: "Cognitive load theory",
    question: "Deck & Jahedi (2015) found load does NOT:",
    options: [
      "Increase risk aversion",
      "Reduce math performance",
      "Improve creative thinking",
      "Increase impatience",
    ],
    correctIndex: 2,
    explanation:
      "No cognitive load benefit for reasoning.",
  },
  // Hypnotic language patterns (Q12-13)
  {
    id: "t2-q12",
    phenomenonId: "hypnotic-language-patterns",
    phenomenonTitle: "Hypnotic language patterns",
    question: 'What is a "nominalization"?',
    options: [
      "Proper naming",
      "Converting a process verb into a vague noun",
      "Using numbers",
      "Naming conditions",
    ],
    correctIndex: 1,
    explanation:
      "Creates semantic gaps the listener fills with personal meaning.",
  },
  {
    id: "t2-q13",
    phenomenonId: "hypnotic-language-patterns",
    phenomenonTitle: "Hypnotic language patterns",
    question:
      "Erickson's confusion technique works by:",
    options: [
      "Telling jokes",
      "Speaking quickly",
      "Overloading conscious processing until surrender",
      "Foreign phrases",
    ],
    correctIndex: 2,
    explanation:
      "Floods conscious processing until System 2 gives up.",
  },
  // Framing effect (Q14-16)
  {
    id: "t2-q14",
    phenomenonId: "framing-effect",
    phenomenonTitle: "Framing effect",
    question:
      "What causes the Asian disease preference reversal?",
    options: [
      "Different disease names",
      "Identical outcomes as lives saved vs. lost",
      "Changing numbers",
      "Time pressure",
    ],
    correctIndex: 1,
    explanation:
      "Identical outcomes framed as gains vs. losses reverse risk preferences.",
  },
  {
    id: "t2-q15",
    phenomenonId: "framing-effect",
    phenomenonTitle: "Framing effect",
    question:
      "How much more heavily does the brain weight losses vs. gains?",
    options: ["1.5x", "2.5x", "5x", "Equally"],
    correctIndex: 1,
    explanation: "Prospect theory: ~2.5x loss aversion.",
  },
  {
    id: "t2-q16",
    phenomenonId: "framing-effect",
    phenomenonTitle: "Framing effect",
    question:
      "Which framing type targets approach/avoidance?",
    options: [
      "Risky choice",
      "Attribute",
      "Goal",
      "Reference",
    ],
    correctIndex: 2,
    explanation:
      "Goal framing targets approach/avoidance motivation.",
  },
  // Subliminal priming (Q17-18)
  {
    id: "t2-q17",
    phenomenonId: "subliminal-priming",
    phenomenonTitle: "Subliminal priming",
    question:
      'The verb "smashed" caused participants to:',
    options: [
      "Report faster speeds AND falsely remember broken glass",
      "Report slower speeds",
      "Refuse to answer",
      "Give more accurate estimates",
    ],
    correctIndex: 0,
    explanation:
      "A single verb retroactively reconstructed visual memory.",
  },
  {
    id: "t2-q18",
    phenomenonId: "subliminal-priming",
    phenomenonTitle: "Subliminal priming",
    question: "Subliminal exposure produces:",
    options: [
      "Conscious recognition",
      "Affective preferences without awareness",
      "Fear only",
      "No effects",
    ],
    correctIndex: 1,
    explanation:
      "Positive affect without conscious perception.",
  },
  // Misophonia (Q19-20)
  {
    id: "t2-q19",
    phenomenonId: "misophonia",
    phenomenonTitle: "Misophonia",
    question:
      "What brain region hyperactivates to misophonic triggers?",
    options: [
      "Amygdala",
      "Anterior insular cortex",
      "Visual cortex",
      "Cerebellum",
    ],
    correctIndex: 1,
    explanation:
      "Kumar et al. (2017): anterior insular cortex.",
  },
  {
    id: "t2-q20",
    phenomenonId: "misophonia",
    phenomenonTitle: "Misophonia",
    question: "Misophonia involves:",
    options: [
      "Vocal cord paralysis",
      "Mirror neuron activation of the trigger action",
      "Whole-body tension",
      "Reflexive flinching only",
    ],
    correctIndex: 1,
    explanation:
      "Involuntary motor simulation of the sound's source action.",
  },
  // NLP replication failures (Q21-23)
  {
    id: "t2-q21",
    phenomenonId: "nlp-replication-failures",
    phenomenonTitle: "NLP replication failures",
    question:
      "What percentage of NLP studies supported its theories?",
    options: ["62%", "45%", "18.2%", "0%"],
    correctIndex: 2,
    explanation:
      "Witkowski (2010): 18.2% of 315 studies.",
  },
  {
    id: "t2-q22",
    phenomenonId: "nlp-replication-failures",
    phenomenonTitle: "NLP replication failures",
    question:
      "How many studies support NLP coaching effectiveness?",
    options: ["12", "5", "1", "Zero"],
    correctIndex: 3,
    explanation: "Passmore & Rowson (2019): exactly zero.",
  },
  {
    id: "t2-q23",
    phenomenonId: "nlp-replication-failures",
    phenomenonTitle: "NLP replication failures",
    question:
      "NLP's persistence despite debunking shows:",
    options: [
      "NLP works but science can't measure it",
      "Scientific-sounding language is persuasion tech independent of content",
      "Psychology is unreliable",
      "Wrong methodology",
    ],
    correctIndex: 1,
    explanation: "The name is the virus.",
  },
];

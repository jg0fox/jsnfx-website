# jsnfx.com redesign

A bespoke portfolio manifestation architected with Next.js and MDX, complemented by an LLM-orchestrated web crawler for content transmigration from the antecedent Webflow instantiation.

## The fundamental inadequacy of portfolio paradigms

Prevailing portfolio templates optimize toward erroneous objectives. They manifest either as over-engineered monstrosities replete with nauseating kinetic embellishments or under-conceptualized presentations emphasizing reductive thumbnail matriculations. Neither methodology accommodated my predilections (nor my compulsive tendency toward unnecessarily byzantine elaborations of recreational endeavors).

## My methodological framework

Indeed, we may characterize this as a "methodological framework." I commenced with logotype ideation generated via Gemini's algorithmic processes.

Subsequently, I leveraged [Coolors](https://coolors.com) to synthesize a chromatic palette predicated upon Gemini's aforementioned logomark creation.

You may discern an emergent pattern, and it decidedly eschews deliberate or meticulous strategization.

Prior to engaging Claude, my inadvertent collaborator in all undertakings, I solicited Google Stitch for preliminary mockup exemplifications. My primary objective was establishing the sidebar pagetree navigational paradigm and overarching layout achieving sufficient adequacy before initiating development protocols.

Your participation is requisitioned, Claude.

Armed with my technical specifications and agent.md documentation, I executed a handoff from Claude to Claude and constructed a localized iteration within VS Code.

Following several hours of iterative refinement, my digital presence achieved completion. I deployed to Vercel, which remains inexplicably gratuitous. Regrettably, Webflow, our association has reached termination.

## The technological stack (with accompanying rationale)

**Next.js 14+** incorporating App Router architecture. React Server Components demonstrate optimal compatibility with content-centric applications, while Vercel deployment necessitates essentially zero configuration overhead.

**Tailwind CSS v4** — Utility-first methodology enables rapid iteration of visual minutiae without cognitive context-switching between disparate files. Thematic implementation remains straightforward.

**MDX for content orchestration** — Markdown syntax enhanced with embedded React component functionality. This constitutes the pivotal architectural determination. Content resides within `.mdx` files accompanied by frontmatter metadata schemas, signifying that portfolio augmentation requires merely: directory creation, `index.mdx` addition, completion. The system autonomously manages routing, navigation, and metadata processing.

**TypeScript in strict mode** — Preemptively eliminates comprehensive bug taxonomies before deployment.

## Content transmigration: constructing an enhanced crawler apparatus

I possessed an extant Webflow installation containing approximately twelve pages and nearly ninety image assets. The manual methodology involving copying, reformatting, renaming, and organizing would have necessitated unavailable temporal resources and introduced extensive typographical errors and organizational confusion.

Consequently, I developed a cognitively-enhanced crawler system.

The architecture employs **Playwright** for JavaScript-intensive page rendering, subsequently transmitting each page to **Claude** for intelligent extraction processing. Two instrumental utilities collaborate:

1. **extract_page_content** — Produces structured output encompassing: sanitized markdown, title metadata, page taxonomy, synopsis, and taxonomical tags
2. **name_images** — Metamorphoses meaningless CDN identifiers (`cdn.prod.website-files.com/abc123.png`) into contextually-relevant filenames (`robinhood-trading-dashboard.png`)

### The decorative imagery conundrum

Not every visual element within a page merits content inclusion. Iconography, verification indicators, navigational sprites — these require systematic filtration. URL pattern analysis proves insufficient in isolation.

The solution implements multiple signal stratification: dimensional threshold parameters (excluding elements below 100×100 pixel specifications), URL pattern recognition, accessibility attribute evaluation, and alternative text analysis. No singular signal demonstrates reliability; the combinatorial approach proves efficacious.

### Quantitative outcomes

Twelve pages processed successfully. Eighty-seven images downloaded with semantically meaningful nomenclature. Approximately $0.80 in API expenditures. Seven minutes total processing duration.

Each page generated sanitized markdown with appropriately positioned imagery, prepared for seamless integration into the MDX architecture without manual remediation requirements.

### Operationally successful methodologies

- **Prompt for inclusion paradigms, eschewing exclusion frameworks** — "Include substantive imagery, omit exclusively diminutive iconography" demonstrated superior performance compared to "exclude decorative elements"
- **Playwright supersedes requests libraries** — Headless browser implementations remain non-negotiable for contemporary JavaScript-rendered applications
- **Construct fallback mechanisms within multi-tool workflows** — LLMs exhibit inconsistency regarding parallel tool invocations; architect for graceful degradation scenarios

## The content management system: GitHub as database infrastructure (consider this proposition)

I required content management capabilities without database instantiation, headless CMS subscription fees, or direct MDX file manipulation resembling coffeeshop laptop aesthetics.

The solution comprised a bespoke CMS utilizing GitHub as backend infrastructure. Content maintains repository residence. Editorial modifications commit directly via GitHub API protocols. No database requirements, synchronization complications, or recurring invoicing. FAREWELL WEBFLOW.

**The technological stack:** Next.js + TypeScript implementation, JWT authentication via `jose` library, GitHub Contents API for CRUD operations. Image assets undergo client-side compression before repository commitment.

**The operational workflow:** Authentication → editorial interface interaction → preservation action → automated commitment and deployment via Vercel integration. Draft/publication workflow incorporated.

This represents not ingenious infrastructure, but rather *absent* infrastructure. That constitutes the fundamental advantage.

## Architectural determinations yielding positive outcomes

**Component-driven interface architecture** — Reusable component libraries enforce consistency without requiring disciplinary adherence. The system facilitates optimal practices effortlessly.

**Automated navigation generation** — Previous/subsequent links derive from content metadata automatically. Portfolio augmentation eliminates navigational code modification requirements.

**Mobile-first, invariably** — Each component initiates at minimal breakpoint specifications and scales progressively. This constraint produces superior decisions compared to "desktop-first, subsequently remediate mobile."

**Static generation where feasible** — Pre-rendered pages, optimized imagery, minimal extraneous JavaScript. Performance represents not a feature enhancement; it constitutes fundamental expectations.

## Subsequent developmental trajectories

The digital presence maintains operational status. Ongoing initiatives encompass additional case study documentation, personal project exhibitions, and presumably comprehensive demolition when I inevitably attempt implementing labyrinthine gamification mechanisms for content interaction.
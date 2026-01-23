# jsnfx.com redesign

A personal portfolio website constructed with Next.js and MDX, alongside an LLM-powered crawler for transferring content from the previous Webflow site.

## The challenge with portfolio websites

Most portfolio templates prioritize the incorrect objectives. They're either excessively designed with overwhelming animations or insufficiently considered with an emphasis on thumbnail galleries. Neither strategy worked for me (or my tendency to overcomplicate everything I undertake during my leisure time).

## My approach

Sure, we can label it an "approach." I began with a logo crafted by Gemini.

Then I utilized [Coolors](https://coolors.com) to develop a color scheme based on the logo that Gemini produced.

You might be detecting a pattern, and it's not deliberate or methodical planning.

Before turning to Claude, my inadvertent collaborator in everything, I requested Google Stitch to create some mockups. I primarily wanted to establish the sidebar pagetree-style navigation and overall layout feeling "adequate" before constructing anything.

Your turn, Claude.

With my technical specifications and agent.md document ready, I performed a transition from Claude to Claude and constructed a version locally in VS Code.

Following several hours of refinement, my website was complete. I deployed it to Vercel, which is complimentary, somehow. Apologies, Webflow, our relationship has ended.

## The technology stack (and rationale)

**Next.js 14+** featuring App Router. React Server Components function effectively with content-rich websites, and Vercel deployment is essentially zero-configuration.

**Tailwind CSS v4** — Utility-first approach enables me to refine visual elements without switching context between documents. Theming remains uncomplicated.

**MDX for content management** — Markdown incorporating embedded React components. This represents the crucial architectural choice. Content resides in `.mdx` documents with frontmatter metadata, meaning incorporating a new portfolio item simply requires: create directory, add `index.mdx`, finished. The framework manages routing, navigation, and metadata automatically.

**TypeScript in strict mode** — Prevents entire classifications of errors before deployment.

## Content migration: constructing an intelligent crawler

I possessed an existing Webflow website with a dozen pages and approximately 90 images. The manual method to copy, restructure, rename, and organize would have consumed hours I lack and would have generated numerous errors and confusion.

Therefore, I developed a crawler with intelligence.

The framework employs **Playwright** to render JavaScript-heavy pages, then forwards each page to **Claude** for intelligent extraction. Two utilities collaborate:

1. **extract_page_content** — Delivers structured output: clean markdown, title, page category, summary, tags
2. **name_images** — Converts meaningless CDN URLs (`cdn.prod.website-files.com/abc123.png`) into descriptive filenames (`robinhood-trading-dashboard.png`)

### The ornamental image challenge

Not every image on a page belongs within the content. Icons, checkmarks, navigation graphics — these require filtering out. URL patterns alone prove insufficient.

The solution combines multiple indicators: dimension parameters (exclude anything below 100×100px), URL pattern recognition, accessibility attributes, and alt text evaluation. No individual indicator proves reliable; the combination succeeds.

### Outcomes

12 pages processed. 87 images downloaded with descriptive names. ~$0.80 in API expenses. 7 minutes total duration.

Each page generated clean markdown with images positioned accurately, prepared to integrate into the MDX framework without manual revision.

### What genuinely succeeded

- **Prompt for inclusion, not exclusion** — "Include content images, exclude only small icons" outperformed "exclude decorative images"
- **Playwright over requests** — Headless browsers remain essential for contemporary JavaScript-rendered websites
- **Build fallbacks into multi-tool workflows** — LLMs demonstrate inconsistency with parallel tool calls; design for graceful degradation

## The CMS: GitHub as a database (consider this)

I required a method to manage content without establishing a database, subscribing to a headless CMS, or editing raw MDX files like a coffeeshop laptop enthusiast.

The resolution was a custom CMS utilizing GitHub as the backend. Content exists in the repository. Modifications commit directly through the GitHub API. No database, no synchronization problems, no monthly charges. FAREWELL WEBFLOW.

**The stack:** Next.js + TypeScript, JWT authentication via `jose`, GitHub Contents API for CRUD operations. Images undergo client-side compression before committing to the repository.

**The workflow:** Authenticate → edit in a proper interface → select save → changes commit and deploy automatically through Vercel. Draft/publish workflow incorporated.

It's not sophisticated infrastructure. It's *zero* infrastructure. That's the objective.

## Architectural choices that succeeded

**Component-driven interface** — Reusable components enforce consistency without requiring self-discipline. The framework makes the correct choice simple.

**Automatic navigation** — Previous/next links generate from content metadata. Adding a portfolio piece doesn't require modifying navigation code.

**Mobile-first, consistently** — Every component begins at the smallest breakpoint and expands upward. This constraint generates superior decisions than "desktop-first, then address mobile."

**Static when feasible** — Pre-rendered pages, optimized images, minimal unnecessary JavaScript. Performance isn't a feature; it's fundamental requirements.

## Future plans

The website is operational. Continuing work encompasses additional case studies, personal projects, and probably demolishing the entire structure when I inevitably attempt to implement maze-style gamification of the content.
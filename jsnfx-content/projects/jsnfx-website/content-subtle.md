# jsnfx.com redesign

A personal portfolio website built with Next.js and MDX, plus an LLM-powered crawler for moving content from the old Webflow site.

## The problem with portfolio sites

Most portfolio templates focus on the wrong things. They're either over-designed with sickening animations or under-thought with an emphasis on thumbnail grids. Neither style worked for me (or my need to overcomplicate everything I do in my spare time).

## My process

Yeah, we can call it a "process." I started with a logo designed by Gemini.

Then I used [Coolors](https://coolors.com) to create a color palette based on the logo that Gemini made.

You might be seeing a pattern, and it's not slow or careful planning.

Before going to Claude, my unwitting partner in everything, I asked Google Stitch to mock up some examples. I mainly wanted to get the sidebar pagetree style navigation and overall layout feeling "good enough" before building anything.

You're up, Claude.

With my tech spec and agent.md file in hand, I did a handoff from Claude to Claude and built a version locally in VS Code.

After a few hours of tweaking, my site was done. I published it to Vercel, which is free, somehow. Sorry, Webflow, I am broken up with you.

## The stack (and why)

**Next.js 14+** with App Router. React Server Components work well with content-heavy sites, and Vercel deployment is basically zero-config.

**Tailwind CSS v4** — Utility-first means I can iterate on visual details without switching between files. Theming is simple.

**MDX for content** — Markdown with embedded React components. This is the key design decision. Content lives in `.mdx` files with frontmatter metadata, which means adding a new portfolio piece is just: create folder, add `index.mdx`, done. The system handles routing, navigation, and metadata on its own.

**TypeScript in strict mode** — Catches entire groups of bugs before they ship.

## Content migration: building a smarter crawler

I had an existing Webflow site with a dozen pages and nearly 90 images. The manual approach to copy, reformat, rename, organize would have taken hours that I don't have would have created a sea of typos and confusion.

So I built a crawler that thinks.

The system uses **Playwright** to render JavaScript-heavy pages, then passes each page to **Claude** for smart extraction. Two tools work together:

1. **extract_page_content** — Returns structured output: clean markdown, title, page type, summary, tags
2. **name_images** — Changes meaningless CDN URLs (`cdn.prod.website-files.com/abc123.png`) into contextual filenames (`robinhood-trading-dashboard.png`)

### The decorative image problem

Not every image on a page belongs in the content. Icons, checkmarks, navigation sprites — these need to be filtered out. URL patterns alone don't work.

The solution layers multiple signals: dimension limits (skip anything under 100×100px), URL pattern matching, accessibility attributes, and alt text analysis. No single signal is reliable; the combination is.

### Results

12 pages processed. 87 images downloaded with meaningful names. ~$0.80 in API costs. 7 minutes total.

Each page produced clean markdown with images placed correctly, ready to drop into the MDX system without manual cleanup.

### What actually worked

- **Prompt for inclusion, not exclusion** — "Include content images, skip only tiny icons" worked better than "skip decorative images"
- **Playwright over requests** — Headless browsers are essential for modern JavaScript-rendered sites
- **Build fallbacks into multi-tool flows** — LLMs are inconsistent with parallel tool calls; design for graceful failure

## The CMS: GitHub as a database (hear me out)

I needed a way to manage content without spinning up a database, paying for a headless CMS, or editing raw MDX files like a coffeeshop laptop lurker.

The solution was a custom CMS that uses GitHub as the backend. Content lives in the repo. Edits commit directly via the GitHub API. No database, no sync issues, no monthly bill. GOODBYE WEBFLOW.

**The stack:** Next.js + TypeScript, JWT auth via `jose`, GitHub Contents API for CRUD operations. Images get compressed on the client before committing to the repo.

**The workflow:** Log in → edit in a real UI → hit save → changes commit and deploy automatically via Vercel. Draft/publish flow included.

It's not clever infrastructure. It's *no* infrastructure. That's the point.

## Architecture decisions that paid off

**Component-driven UI** — Reusable components enforce consistency without requiring discipline. The system makes the right thing easy.

**Automatic navigation** — Previous/next links generate from content metadata. Adding a portfolio piece doesn't require touching navigation code.

**Mobile-first, always** — Every component starts at the smallest breakpoint and scales up. This constraint produces better decisions than "desktop-first, then fix mobile."

**Static where possible** — Pre-rendered pages, optimized images, no unnecessary JavaScript. Performance isn't a feature; it's table stakes.

## What's next

The site is live. Ongoing work includes more case studies, personal projects, and probably blowing the entire thing to pieces when I inevitably try to implement maze-style gamification of the content.

The migration tool proved its worth beyond just this project. The approach of combining browser automation with LLM-powered content extraction could work for any content-heavy site transition. The key insight was treating each page as a structured document rather than raw HTML, letting the AI understand context and meaning instead of just scraping text.

Building a CMS on top of GitHub felt risky at first, but the benefits compound over time. Every edit creates a commit. Every deploy is traceable. Roll back to any previous version with a single click. Version control for content isn't just nice to have — it's transformative for solo projects where you are both the developer and the content creator.

The technical choices here optimize for one person managing everything. No team coordination overhead. No deployment complexity. No monthly subscriptions piling up. Just write, commit, and ship.
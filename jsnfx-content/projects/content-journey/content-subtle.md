# Content journey

A tool that connects the contextual work of designing content with the analytical process of evaluating LLM inputs and outputs.

**Status:** Active  
**Category:** Web App  
**Technologies:** Next.js, Prompt design, System prompts, Content standards, voice and tone, Evaluation, Scoring rubric

[Try it out](https://content-journey-app.vercel.app/) | [View on GitHub](https://github.com/jg0fox/content-journey-app)

## Content Journey

Content Journey is a side project I created to connect the contextual layer of content design—audience, brand voice, core message—with the analytical evaluation part of working with LLMs. All wrapped into one experience.

## How it works

The tool guides you through setting up your content context: audience profile, brand voice, content standards, and core message. Then it creates content across multiple surfaces using compiled system prompts—each with unique parameters and pattern guidance, but built to work together so output feels unified rather than separate.

The interesting part (interesting to me, at least) is that I linked two models (Claude and GPT-4) so one LLM evaluates the other's output. The evaluation phase scores content against clarity, relevance, tone, actionability, and accessibility using linguistic and literary devices I built into the evaluation prompt. You get a scorecard with detailed feedback, and can hit "improve" to let the secondary model refine content using that evaluation context.

## The output

You end up with before/after comparisons, performance insights, and the ability to export all system prompts as Markdown, JSON, or PDF—the complete set or just the winning prompts.

The dashboard is admittedly a bit messy, but there's plenty of material to work with. It's what I imagined when combining that contextual layer with the analytical one.
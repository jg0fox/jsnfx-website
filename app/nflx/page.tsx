import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  Tag,
  Button,
  Divider,
  CopyEmailButton,
} from "@/components/ui";
import {
  BrainCircuit,
  Scale,
  MessageSquare,
  Layers,
  Sparkles,
  Wrench,
  Globe,
  Briefcase,
  Hammer,
  ArrowRight,
  ExternalLink,
  FileText,
  Download,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Jason Fox — Netflix",
  description:
    "Cover letter and relevant work for the Strategy Lead, Evidence role on Netflix's CUE XD (Context, Understanding & Evidence) team.",
  robots: {
    index: false,
    follow: false,
  },
};

const featuredWork = [
  {
    kind: "project" as const,
    eyebrow: "Featured project",
    title: "Tone Spectrum Explorer",
    description:
      "A framework that turns subjective, hard-to-pin-down ideas about tone into a shared system teams can actually use — translating experience principles into a reusable, machine-readable standard.",
    highlights: [
      "Translates fuzzy experience principles into a concrete, reusable framework",
      "Position tone on 5 spectrums; surfaces the devices that make it land and flags anti-patterns",
      "Systems thinking and creative craft in one artifact — 50+ linguistic devices catalogued",
    ],
    meta: "Interactive tool · Self-directed",
    image: "/projects/tone-spectrum/tone-spectrum-explorer-interface.png",
    href: "/projects/tone-spectrum",
    cta: "Explore the project",
  },
  {
    kind: "project" as const,
    eyebrow: "Featured project",
    title: "Dark Dark Dark",
    description:
      "A single-use scheduler that reimagines date selection as navigating a field of stars — reframing a mundane task with a little persuasion, enticement, and delight.",
    highlights: [
      "Built on the rock-solid mental model of calendars — well-defined enough to leave room to experiment",
      "A lens resolves the familiar calendar out of a wild star field; you schedule by clicking and lassoing stars",
      "The same instinct behind visualizing research insights: compel and entertain, don't just show the data",
    ],
    meta: "Live at drkdrkdrk.com · Self-directed",
    image: "/projects/dark-dark-dark/lens-hud.png",
    imgClassName: "object-cover",
    href: "/projects/dark-dark-dark",
    cta: "View the case study",
  },
  {
    kind: "case study" as const,
    eyebrow: "Case study",
    title: "AI content operations at Atlassian",
    description:
      "Designing evaluation frameworks, building prompt testing tools, and establishing content standards governance for AI-assisted authoring at scale.",
    highlights: [
      "Built double-blind evaluation rubrics for AI-generated release notes across 6 quality dimensions",
      "Developed a prompt evaluation tool for parallel variant testing and output comparison",
      "Audited and designed governance architecture for 260+ content standards across 9 Confluence spaces",
    ],
    meta: "Content Design Lead, AI Tooling",
    image: "/portfolio/atlassian-ai-ops/slides/slide-44.png",
    href: "/portfolio/atlassian-ai-ops-full",
    cta: "View full case study",
  },
];

const additionalWork = [
  {
    title: "Content design for Netflix payments",
    description:
      "Speculative case study crafting content hypotheses, guidelines, and Figma components for Netflix payments experiments using the 18F hypothesis framework. Not commissioned by Netflix.",
    tags: ["Figma components", "Hypothesis-driven", "Speculative"],
    href: "/projects/netflix",
    icon: Globe,
    type: "project" as const,
  },
  {
    title: "Robinhood's 24 Hour Market",
    description:
      "Drove 0-to-1 content strategy in an ambiguous, compliance-bound space — aligning product, legal, and design, and codifying shared patterns for market data, terminology, and tone.",
    tags: ["Cross-functional", "0-to-1", "Systems"],
    href: "/portfolio/robinhood-full",
    icon: Scale,
    type: "portfolio" as const,
  },
  {
    title: "New admin experiences at Atlassian",
    description:
      "Led content design for Jira and Confluence admin onboarding — narrative arcs, content models, and a hypothesis-driven approach that improved retention at the 2-week mark.",
    tags: ["Content strategy", "Onboarding", "Growth"],
    href: "/portfolio/atlassian",
    icon: Layers,
    type: "portfolio" as const,
  },
  {
    title: "Content Journey",
    description:
      "A tool pairing content design context with LLM evaluation. Connected Claude and GPT-4 so one model evaluates the other's output against clarity, tone, and accessibility rubrics.",
    tags: ["LLM evaluation", "Prompt design", "Content standards"],
    href: "/projects/content-journey",
    icon: MessageSquare,
    type: "project" as const,
  },
  {
    title: "Content Standards Checker",
    description:
      "A CLI tool that scans codebases for content issues using AI. Auto-detects industry, evaluates against inclusive language and accessibility standards, and returns actionable suggestions.",
    tags: ["Developer tools", "Content linting", "AI-powered"],
    href: "/projects/check-content",
    icon: Wrench,
    type: "project" as const,
  },
  {
    title: "Peer-to-peer payments at Chime",
    description:
      "Led a content experiment that improved peer-to-peer payments by 16%. Proved that simplifying language outperformed adding specificity — a lesson in trusting users.",
    tags: ["A/B testing", "Comprehension", "User research"],
    href: "/portfolio/chime",
    icon: Scale,
    type: "portfolio" as const,
  },
  {
    title: "Refining Oracle's voice and tone",
    description:
      "Synthesized audits and user research across 5 of Oracle's core products into voice-and-tone frameworks and design resources teams could actually apply.",
    tags: ["Research synthesis", "Frameworks", "Audits"],
    href: "/portfolio/oracle",
    icon: BrainCircuit,
    type: "portfolio" as const,
  },
  {
    title: "jsnfx.com redesign",
    description:
      "Built this portfolio site with Next.js and MDX, including an LLM-powered crawler that migrated 12 pages and 87 images from Webflow with contextual filenames.",
    tags: ["Next.js", "Claude API", "Content migration"],
    href: "/projects/jsnfx-website",
    icon: Hammer,
    type: "project" as const,
  },
];

function FeaturedCard({ study }: { study: (typeof featuredWork)[number] }) {
  const isProject = study.kind === "project";
  return (
    <Link href={study.href} className="block group">
      <div className="flex flex-col md:flex-row gap-6 p-5 rounded-lg border border-soft-linen-dark bg-soft-linen-light hover:border-palm-leaf/50 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
        <div className="md:w-2/5 flex-shrink-0">
          <div className="relative aspect-video rounded-md overflow-hidden bg-soft-linen-dark">
            <Image
              src={study.image}
              alt={study.title}
              fill
              className={
                ("imgClassName" in study && study.imgClassName) ||
                (isProject ? "object-cover object-left-top" : "object-cover")
              }
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        </div>
        <div className="flex-1 min-w-0 space-y-3">
          <div>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-medium mb-1.5 ${
                isProject ? "text-bronze-spice" : "text-palm-leaf-3"
              }`}
            >
              {isProject ? (
                <Hammer className="w-3 h-3" />
              ) : (
                <Briefcase className="w-3 h-3" />
              )}
              {study.eyebrow}
            </span>
            <h3 className="text-lg font-display font-bold text-text-primary group-hover:text-palm-leaf transition-colors">
              {study.title}
            </h3>
            <p className="text-sm text-text-muted mt-0.5">{study.meta}</p>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            {study.description}
          </p>
          <ul className="space-y-1">
            {study.highlights.map((h) => (
              <li key={h} className="text-sm text-text-secondary flex items-start gap-2">
                <span className="text-palm-leaf mt-1 flex-shrink-0">·</span>
                {h}
              </li>
            ))}
          </ul>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-palm-leaf group-hover:gap-2 transition-all">
            {study.cta} <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function NetflixPage() {
  return (
    <article className="space-y-12">
      {/* Header with Netflix logo */}
      <header className="space-y-6">
        <div className="flex items-center gap-3 text-sm text-text-muted">
          <Link href="/" className="hover:text-palm-leaf transition-colors">
            Jason Fox
          </Link>
          <span>/</span>
          <span>Netflix</span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative w-40 h-10 flex-shrink-0">
            <Image
              src="/images/netflix-logo.svg"
              alt="Netflix"
              fill
              className="object-contain object-left"
              priority
              unoptimized
            />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-text-primary">
              Strategy Lead, Evidence
            </h1>
            <p className="text-text-secondary mt-1 flex flex-wrap items-center gap-3">
              <span>Application from Jason Fox</span>
              <span className="flex items-center gap-2">
                <Link
                  href="/nflx-resume"
                  className="inline-flex items-center gap-1 text-xs font-medium text-palm-leaf hover:text-palm-leaf-3 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  View resume
                </Link>
                <span className="text-soft-linen-dark">|</span>
                <a
                  href="/jason-fox-resume.pdf"
                  download
                  className="inline-flex items-center gap-1 text-xs font-medium text-palm-leaf hover:text-palm-leaf-3 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF
                </a>
              </span>
            </p>
          </div>
        </div>
      </header>

      <Divider />

      {/* Cover Letter */}
      <section className="max-w-3xl">
        <div className="space-y-5 text-text-secondary leading-relaxed">
          <p className="text-xl font-display font-bold text-text-primary">
            Hi Netflix,
          </p>

          <p>
            I have been, at the very least, 15 different types of content
            practitioner for at least 100 different types of users. And anyone
            who has helped a team succeed by putting language first will know
            exactly what I'm talking about.
          </p>

          <p>
            Yet whether I'm leading workshops to chart a team's content systems
            and strategies or defining a new information architecture on a
            legacy knowledge base, I never lose sight of my goals to simplify,
            share, and learn.
          </p>

          <p>
            Over the last 2 years, I've found myself focused on AI content
            systems for internal tooling and developer teams. I've written the
            context, built the systems, managed the integrations, and influenced
            the stakeholders.
          </p>

          <p>
            In one of my recent efforts, I wrangled 250+ content design
            standards and built them into an AI content system. This involved:
          </p>

          <ol className="list-decimal space-y-1.5 pl-6 marker:text-text-muted marker:font-medium">
            <li>Auditing and tagging every standard with governance metadata</li>
            <li>Defining a new information architecture for the entire corpus</li>
            <li>Building a Bitbucket repository as our context storage</li>
            <li>
              Building an MCP server and ensuring it had the capability to serve
              the metadata-enriched standards
            </li>
            <li>
              Designing system prompt components, like a metadata decision
              matrix, so tools can retrieve the right standard efficiently
            </li>
            <li>Building the pipeline to our AI tooling</li>
            <li>
              Finally, measuring the impact of that work on our AI performance
            </li>
          </ol>

          <p>
            I don't have this work in my portfolio yet, but I'd love to put
            together a presentation for you.
          </p>

          <p>
            Thanks and best regards,
            <br />
            <span className="font-medium text-text-primary">Jason Fox</span>
          </p>
        </div>
      </section>

      <Divider label="Relevant work" />

      {/* Featured work with workshop banner */}
      <section className="space-y-6">
        {/* Tone Spectrum Explorer — featured first */}
        <FeaturedCard study={featuredWork[0]} />

        {/* Dark Dark Dark — visual/creative work */}
        <FeaturedCard study={featuredWork[1]} />

        {/* UX Content Collective Workshop Banner */}
        <a
          href="https://uxcontent.com/ai-hands-on-building-waitlist/"
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 px-6 py-4 rounded-lg border border-[#f5c6c6] bg-[#fbeaea] hover:bg-[#f7dede] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#e50914]/15 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-[#b00610]" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#b00610]/70 uppercase tracking-wide">
                  UX Content Collective Workshop
                </p>
                <h3 className="font-display font-bold text-[#7a0a10] leading-tight">
                  AI in Content Design: Hands-On Building
                </h3>
              </div>
            </div>
            <p className="text-sm text-[#b00610] flex-1 min-w-0">
              Teaching content designers to stop using AI as an assistant and start using it as a building material. No coding experience required.
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#b00610] group-hover:gap-2 transition-all flex-shrink-0">
              Learn more <ExternalLink className="w-4 h-4" />
            </span>
          </div>
        </a>

        {/* Atlassian AI content operations */}
        <FeaturedCard study={featuredWork[2]} />
      </section>

      {/* Additional work cards */}
      <section>
        <h2 className="text-xl font-display font-bold text-text-primary mb-5">
          More from the portfolio and workshop
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {additionalWork.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.title} href={item.href}>
                <Card interactive className="h-full">
                  <CardContent className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-soft-linen-dark flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-palm-leaf-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-bold text-text-primary leading-tight">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium flex-shrink-0 px-2 py-0.5 rounded-full ${
                          item.type === "portfolio"
                            ? "bg-palm-leaf/15 text-palm-leaf-3"
                            : "bg-bronze-spice/10 text-bronze-spice"
                        }`}
                      >
                        {item.type === "portfolio" ? (
                          <Briefcase className="w-3 h-3" />
                        ) : (
                          <Hammer className="w-3 h-3" />
                        )}
                        {item.type === "portfolio" ? "Portfolio" : "Project"}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.tags.map((tag) => (
                        <Tag key={tag} size="sm">
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <Divider />

      {/* CTA */}
      <section className="bg-soft-linen-light border border-soft-linen-dark rounded-lg p-8 text-center">
        <h2 className="text-2xl font-display font-bold text-text-primary mb-3">
          Let's talk
        </h2>
        <p className="text-text-secondary mb-6 max-w-md mx-auto">
          I'd love to discuss how systems thinking, research-driven frameworks,
          and AI-fluent workflows can help CUE XD move evidence strategy
          upstream — shaping how members make confident choices across a global
          catalog.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <CopyEmailButton variant="primary" size="lg" />
          <Link href="/portfolio">
            <Button variant="ghost" size="lg">
              View full portfolio
            </Button>
          </Link>
        </div>
      </section>
    </article>
  );
}

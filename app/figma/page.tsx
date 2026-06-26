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
  title: "Jason Fox — Figma",
  description:
    "Cover letter and relevant work for the Support Content Engineer role at Figma.",
  robots: {
    index: false,
    follow: false,
  },
};

const featuredCaseStudies = [
  {
    title: "AI content operations at Atlassian",
    description:
      "Designing evaluation frameworks, building prompt testing tools, and establishing content standards governance for AI-assisted authoring across internal tooling and developer teams.",
    highlights: [
      "Built double-blind evaluation rubrics for AI-generated release notes across 6 quality dimensions",
      "Developed a prompt evaluation tool for parallel variant testing and output comparison",
      "Audited and designed governance architecture for 260+ content standards across 9 Confluence spaces",
    ],
    role: "Content Design Lead, AI Tooling",
    timeline: "6+ months",
    image: "/portfolio/atlassian-ai-ops/slides/slide-44.png",
    href: "/portfolio/atlassian-ai-ops-full",
  },
  {
    title: "Robinhood's 24 Hour Market",
    description:
      "Navigating compliance, conceptual density, and content systems to help customers trade on their own terms.",
    highlights: [
      "Discovered a market price tooltip causing 7% more bounces and 12% higher abandonment",
      "Designed SEC Reg BI-compliant conversational patterns that educate without recommending",
      "Served as implementation lead in Robinhood's content governance council",
    ],
    role: "Senior Staff Content Designer",
    timeline: "6 months",
    image: "/portfolio/robinhood/slides/slide-41.png",
    href: "/portfolio/robinhood-full",
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
    title: "Tone Spectrum Explorer",
    description:
      "An interactive tool that systematizes voice and tone into machine-readable standards. Explores 50+ linguistic devices across 5 tone spectrums and generates exportable content standards.",
    tags: ["AI + linguistics", "Voice & tone", "Standards generation"],
    href: "/projects/tone-spectrum",
    icon: Sparkles,
    type: "project" as const,
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
    title: "jsnfx.com redesign",
    description:
      "Built this portfolio site with Next.js and MDX, including an LLM-powered crawler that migrated 12 pages and 87 images from Webflow with contextual filenames.",
    tags: ["Next.js", "Claude API", "Content migration"],
    href: "/projects/jsnfx-website",
    icon: Hammer,
    type: "project" as const,
  },
  {
    title: "Refining Oracle's voice and tone",
    description:
      "Distilled voice and tone from 5 of Oracle's core products into actionable design resources through content auditing, user research, and voice mapping.",
    tags: ["Voice mapping", "Content auditing", "Enterprise"],
    href: "/portfolio/oracle",
    icon: BrainCircuit,
    type: "portfolio" as const,
  },
];

export default function FigmaPage() {
  return (
    <article className="space-y-12">
      {/* Header with Figma logo */}
      <header className="space-y-6">
        <div className="flex items-center gap-3 text-sm text-text-muted">
          <Link href="/" className="hover:text-palm-leaf transition-colors">
            Jason Fox
          </Link>
          <span>/</span>
          <span>Figma</span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative w-12 h-[72px] flex-shrink-0">
            <Image
              src="/images/figma-logo.svg"
              alt="Figma"
              fill
              className="object-contain object-left"
              priority
              unoptimized
            />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-text-primary">
              Support Content Engineer
            </h1>
            <p className="text-text-secondary mt-1 flex flex-wrap items-center gap-3">
              <span>Application from Jason Fox</span>
              <span className="flex items-center gap-2">
                <Link
                  href="/figma-resume"
                  className="inline-flex items-center gap-1 text-xs font-medium text-palm-leaf hover:text-palm-leaf-3 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  View resume
                </Link>
                <span className="text-soft-linen-dark">|</span>
                <a
                  href="/jason-fox-resume-figma.pdf"
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
            Hi Figma,
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

      {/* Featured case studies with workshop banner */}
      <section className="space-y-6">
        {/* Atlassian AI Ops */}
        {(() => {
          const study = featuredCaseStudies[0];
          return (
            <Link href={study.href} className="block group">
              <div className="flex flex-col md:flex-row gap-6 p-5 rounded-lg border border-soft-linen-dark bg-soft-linen-light hover:border-palm-leaf/50 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                <div className="md:w-2/5 flex-shrink-0">
                  <div className="relative aspect-video rounded-md overflow-hidden bg-soft-linen-dark">
                    <Image src={study.image} alt={study.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 40vw" />
                  </div>
                </div>
                <div className="flex-1 min-w-0 space-y-3">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-palm-leaf-3 mb-1.5">
                      <Briefcase className="w-3 h-3" />
                      Case study
                    </span>
                    <h3 className="text-lg font-display font-bold text-text-primary group-hover:text-palm-leaf transition-colors">{study.title}</h3>
                    <p className="text-sm text-text-muted mt-0.5">{study.role}</p>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{study.description}</p>
                  <ul className="space-y-1">
                    {study.highlights.map((h) => (
                      <li key={h} className="text-sm text-text-secondary flex items-start gap-2">
                        <span className="text-palm-leaf mt-1 flex-shrink-0">·</span>{h}
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-palm-leaf group-hover:gap-2 transition-all">
                    View full case study <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })()}

        {/* UX Content Collective Workshop Banner */}
        <a
          href="https://uxcontent.com/ai-hands-on-building-waitlist/"
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 px-6 py-4 rounded-lg border border-[#b8d4e8] bg-[#e8f1f8] hover:bg-[#dce9f3] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#3d7ab5]/15 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-[#2a5f8f]" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#2a5f8f]/70 uppercase tracking-wide">
                  UX Content Collective Workshop
                </p>
                <h3 className="font-display font-bold text-[#1e3a5f] leading-tight">
                  AI in Content Design: Hands-On Building
                </h3>
              </div>
            </div>
            <p className="text-sm text-[#2a5f8f] flex-1 min-w-0">
              Teaching content designers to stop using AI as an assistant and start using it as a building material. No coding experience required.
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2a5f8f] group-hover:gap-2 transition-all flex-shrink-0">
              Learn more <ExternalLink className="w-4 h-4" />
            </span>
          </div>
        </a>

        {/* Robinhood */}
        {(() => {
          const study = featuredCaseStudies[1];
          return (
            <Link href={study.href} className="block group">
              <div className="flex flex-col md:flex-row gap-6 p-5 rounded-lg border border-soft-linen-dark bg-soft-linen-light hover:border-palm-leaf/50 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                <div className="md:w-2/5 flex-shrink-0">
                  <div className="relative aspect-video rounded-md overflow-hidden bg-soft-linen-dark">
                    <Image src={study.image} alt={study.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 40vw" />
                  </div>
                </div>
                <div className="flex-1 min-w-0 space-y-3">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-palm-leaf-3 mb-1.5">
                      <Briefcase className="w-3 h-3" />
                      Case study
                    </span>
                    <h3 className="text-lg font-display font-bold text-text-primary group-hover:text-palm-leaf transition-colors">{study.title}</h3>
                    <p className="text-sm text-text-muted mt-0.5">{study.role}</p>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{study.description}</p>
                  <ul className="space-y-1">
                    {study.highlights.map((h) => (
                      <li key={h} className="text-sm text-text-secondary flex items-start gap-2">
                        <span className="text-palm-leaf mt-1 flex-shrink-0">·</span>{h}
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-palm-leaf group-hover:gap-2 transition-all">
                    View full case study <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })()}
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
          I'd love to discuss how my experience building AI content systems,
          information architecture, and content governance can help Figma's
          support content become a superpower.
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

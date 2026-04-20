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
  title: "Jason Fox — Autodesk",
  description:
    "Cover letter and relevant work for the Content and Conversational Designer role at Autodesk.",
  robots: {
    index: false,
    follow: false,
  },
};

const featuredCaseStudies = [
  {
    title: "AI content operations at Atlassian",
    description:
      "Designing evaluation frameworks, building prompt testing tools, and establishing content standards governance for AI-assisted authoring at scale.",
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
      "Co-led Robinhood's content committee, codifying patterns for market data, terminology, and tone",
    ],
    role: "Senior Staff Content Designer",
    timeline: "6 months",
    image: "/portfolio/robinhood/slides/slide-41.png",
    href: "/portfolio/robinhood-full",
  },
];

const additionalWork = [
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
    title: "Tone Spectrum Explorer",
    description:
      "An interactive tool that systematizes voice and tone into machine-readable standards. Explores 50+ linguistic devices across 5 tone spectrums and generates exportable content standards.",
    tags: ["AI + linguistics", "Voice & tone", "Standards generation"],
    href: "/projects/tone-spectrum",
    icon: Sparkles,
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
    title: "Content Journey",
    description:
      "A tool pairing content design context with LLM evaluation. Connected Claude and GPT-4 so one model evaluates the other's output against clarity, tone, and accessibility rubrics.",
    tags: ["LLM evaluation", "Prompt design", "Content standards"],
    href: "/projects/content-journey",
    icon: MessageSquare,
    type: "project" as const,
  },
  {
    title: "Content design for Netflix payments",
    description:
      "External case study crafting content hypotheses, guidelines, and Figma components for Netflix payments experiments using the 18F hypothesis framework.",
    tags: ["Hypothesis-driven", "Figma components", "UX research"],
    href: "/portfolio/netflix",
    icon: Globe,
    type: "portfolio" as const,
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

export default function AutodeskPage() {
  return (
    <article className="space-y-12">
      {/* Header with Autodesk logo */}
      <header className="space-y-6">
        <div className="flex items-center gap-3 text-sm text-text-muted">
          <Link
            href="/"
            className="hover:text-palm-leaf transition-colors"
          >
            Jason Fox
          </Link>
          <span>/</span>
          <span>Autodesk</span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative w-48 h-12 flex-shrink-0">
            <Image
              src="/images/autodesk-logo.svg"
              alt="Autodesk logo"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-text-primary">
              Content and conversational designer
            </h1>
            <p className="text-text-secondary mt-1 flex flex-wrap items-center gap-3">
              <span>Application from Jason Fox</span>
              <span className="flex items-center gap-2">
                <Link
                  href="/autodesk-resume"
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
            Greetings Autodesk,
          </p>

          <p>
            My career started adjacent to AEC. As an agency content strategist, I
            handled demand generation for Trimble 3D Warehouse, helping architects
            and designers understand the possibilities. Eventually, my path took
            me into fintech and enterprise SaaS, where I went deep on systems
            thinking, content craft, and eventually AI. But I never stopped being
            a maker. I still use KiCad and Autodesk Fusion for home projects and
            fabricating parts for DIY electronics. When I saw this role, it felt
            like everything I've learned was leading back to the space where I
            started, and to a community I'm grateful to be part of.
          </p>

          <p>
            For the past 2 years, I've been focused specifically on generative AI
            at Atlassian, where I'm a Lead Content Designer on our AI Content
            Systems team. I define how conversational guidance, product voice, and
            interaction patterns work together across AI-connected experiences.
            I've built governance models and evaluation frameworks that enable
            consistency without becoming bottlenecks. I've developed standards for
            how AI should respond, when it should hedge, how to handle errors
            gracefully, and how to scaffold user understanding as capabilities
            evolve.
          </p>

          <p>
            You describe this role as creating experiences that "move
            conversations forward, provide trust and transparency, anticipate and
            respond to shifting user needs, and help users complete meaningful
            tasks in ways that ideally spark joy." That's exactly how I think
            about the work. Content design is as much about writing prompts as it
            is about architecting the logic of trust. I've built the skills
            necessary to help AI systems know when to clarify, when to act, when
            to surface limitations, and how to keep users in control while still
            being genuinely helpful.
          </p>

          <p>
            I'm drawn to this role because of its scope and the audience it
            serves. Designers, creatives, and builders are my people. I know what
            it feels like to be mid-project, trying to get a tool to do what's in
            my head, and hitting friction that could have been avoided with
            clearer guidance. I want to help Autodesk build the experiences that
            reduce that friction and make the work feel seamless.
          </p>

          <p>
            Thanks for your time,
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
          I'd love to discuss how my experience with AI content systems and
          conversational design can contribute to what Autodesk is building.
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

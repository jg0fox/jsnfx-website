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
  ArrowUpRight,
  ExternalLink,
  FileText,
  Download,
} from "lucide-react";
import { CalloutsProvider, RailAccordion } from "./CalloutsAccordion";
import {
  VideoLightboxProvider,
  VideoSidebarRow,
  MobileVideoList,
} from "./VideoLightbox";

export const metadata: Metadata = {
  title: "Jason Fox — Figma",
  description:
    "Cover letter and relevant work for a UX writer role at Figma.",
  robots: {
    index: false,
    follow: false,
  },
};

const FIGMA_PURPLE = "#A259FF";

const pairedCaseStudies = [
  {
    title: "AI content systems at Atlassian",
    hint: "Voice, guidance, and governance at scale",
    image: "/portfolio/atlassian-ai-ops/slides/slide-44.png",
    href: "/portfolio/atlassian-ai-ops-full",
  },
  {
    title: "Robinhood's 24 Hour Market",
    hint: "0-to-1 in a compliance-bound space",
    image: "/portfolio/robinhood/slides/slide-41.png",
    href: "/portfolio/robinhood-full",
  },
  {
    title: "Peer-to-peer payments at Chime",
    hint: "A content experiment that lifted P2P 16%",
    image: "/portfolio/chime/slides/slide-78.png",
    href: "/portfolio/chime-full",
  },
];

const featuredVideos = [
  {
    id: 729967797,
    title: "Finding rhythm in your tone of voice",
    duration: "2:52",
    thumbnail:
      "https://i.vimeocdn.com/video/1469113859-99bcaf7752c088586b1a4f163ea37d9b6d95a1c8da75c55fa106e0aec3795464-d_640x360",
  },
  {
    id: 808762357,
    title: "Designing a celebratory tone",
    duration: "2:57",
    thumbnail:
      "https://i.vimeocdn.com/video/1633707496-b1875f0d55b1805302042e8e2e4c3a369c289d5d6127f07ebfb213e558881167-d_640x360",
  },
  {
    id: 700539388,
    title: "Influencing perceived value with content design",
    duration: "1:47",
    thumbnail:
      "https://i.vimeocdn.com/video/1416103259-763d5a385b33c83a9d34e27f9bb57f490575978a923d42a68d94365693d3bce6-d_640x360",
  },
];

const additionalWork = [
  {
    title: "Content design for Netflix payments",
    description:
      "Speculative case study crafting content hypotheses, guidelines, and Figma components for Netflix payments experiments using the 18F hypothesis framework.",
    tags: ["Figma components", "Hypothesis-driven", "Speculative"],
    href: "/projects/netflix",
    icon: Globe,
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
    title: "Refining Oracle's voice and tone",
    description:
      "Distilled voice and tone from 5 of Oracle's core products into actionable design resources through content auditing, user research, and voice mapping.",
    tags: ["Voice mapping", "Content auditing", "Enterprise"],
    href: "/portfolio/oracle",
    icon: BrainCircuit,
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
    title: "Robinhood's content committee",
    description:
      "Co-led Robinhood's cross-functional content committee, codifying patterns for market data, terminology, and tone across equities, crypto, and retirement.",
    tags: ["Governance", "Cross-functional", "Patterns"],
    href: "/portfolio/robinhood",
    icon: Scale,
    type: "portfolio" as const,
  },
  {
    title: "AI in Content Design workshop",
    description:
      "A hands-on workshop for the UX Content Collective, teaching content designers to stop using AI as an assistant and start using it as a building material.",
    tags: ["Teaching", "AI tooling", "Craft"],
    href: "https://uxcontent.com/ai-hands-on-building-waitlist/",
    icon: Sparkles,
    type: "project" as const,
    external: true,
  },
];

/* ---------- Sidebar callout building blocks ---------- */

function SidebarRowGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-soft-linen-dark bg-soft-linen-light overflow-hidden divide-y divide-soft-linen-dark/60">
      {children}
    </div>
  );
}

function SidebarCaseStudyRow({
  title,
  hint,
  image,
  href,
}: {
  title: string;
  hint: string;
  image: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-2.5 group hover:bg-soft-linen-dark/30 transition-colors"
    >
      <div className="relative w-[72px] aspect-video bg-soft-linen-dark rounded-sm overflow-hidden flex-shrink-0">
        <Image
          src={image}
          alt=""
          fill
          className="object-cover"
          sizes="72px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[13px] font-display font-bold text-text-primary leading-snug group-hover:text-palm-leaf transition-colors line-clamp-2">
          {title}
        </h4>
        <p className="text-[11px] text-text-muted leading-snug mt-0.5 line-clamp-1">
          {hint}
        </p>
      </div>
      <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-palm-leaf group-hover:translate-x-0.5 transition-all flex-shrink-0" />
    </Link>
  );
}

function SidebarFeaturedProject() {
  return (
    <Link href="/projects/tone-spectrum" className="block group">
      <div className="rounded-lg border border-soft-linen-dark bg-soft-linen-light overflow-hidden hover:border-palm-leaf/50 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
        <div className="relative aspect-[16/9] bg-soft-linen-dark">
          <Image
            src="/projects/tone-spectrum/tone-spectrum-explorer-interface.png"
            alt=""
            fill
            className="object-cover object-left-top"
            sizes="288px"
          />
        </div>
        <div className="p-3 space-y-1">
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-bronze-spice uppercase tracking-wide">
            <Hammer className="w-2.5 h-2.5" />
            Side project
          </span>
          <h4 className="text-sm font-display font-bold text-text-primary leading-snug group-hover:text-palm-leaf transition-colors">
            Tone Spectrum Explorer
          </h4>
          <p className="text-xs text-text-muted leading-snug">
            50+ linguistic devices, 5 tone spectrums, exportable standards.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-palm-leaf pt-0.5 group-hover:gap-1.5 transition-all">
            Explore <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ---------- Mobile: compact inline pathway list ---------- */

function MobilePathwayList({
  eyebrow,
  items,
}: {
  eyebrow: string;
  items: { title: string; href: string; external?: boolean }[];
}) {
  return (
    <div className="xl:hidden mt-5 rounded-lg border border-soft-linen-dark bg-soft-linen-light/60 p-4">
      <div className="flex items-center gap-2 mb-2.5">
        <span
          className="h-px w-4"
          style={{ backgroundColor: FIGMA_PURPLE, opacity: 0.5 }}
        />
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: FIGMA_PURPLE }}
        >
          {eyebrow}
        </span>
      </div>
      <ul className="divide-y divide-soft-linen-dark/60">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex items-center justify-between gap-3 py-2.5 group"
              {...(item.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              <span className="text-sm text-text-primary group-hover:text-palm-leaf transition-colors">
                {item.title}
              </span>
              <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-palm-leaf group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Hybrid section wrapper ---------- */

function HybridSection({
  children,
  sidebar,
  mobile,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  mobile: React.ReactNode;
}) {
  return (
    <section className="xl:grid xl:grid-cols-[minmax(0,36rem)_18rem] xl:gap-10 xl:items-start">
      <div className="text-lg text-text-secondary leading-relaxed space-y-5">
        {children}
        {mobile}
      </div>
      <aside className="hidden xl:block">{sidebar}</aside>
    </section>
  );
}

export default function FigmaPage() {
  return (
    <article className="space-y-16">
      {/* Header */}
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
              UX Writer, AI
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

      {/* Cover letter block */}
      <div className="space-y-5">
        {/* Opening (no sidebar) */}
        <section className="max-w-xl">
          <div className="space-y-5 text-text-secondary leading-relaxed">
            <p className="text-xl font-display font-bold text-text-primary">
              Hello Figma,
            </p>

            <p className="text-lg leading-relaxed">
              I've spent my career writing content and building systems. For
              the past 2 years, I've been focused specifically on generative
              AI, working to help govern context for model-generated content,
              designing prompts with guardrails, and building evaluation
              frameworks that help teams trust AI outputs.
            </p>
          </div>
        </section>

        <VideoLightboxProvider>
        <CalloutsProvider>
        {/* Hybrid section 1: Atlassian + 3 case studies */}
        <HybridSection
          sidebar={
            <RailAccordion
              id="cases"
              label="Related case studies"
              count={pairedCaseStudies.length}
              attention
            >
              <SidebarRowGroup>
                {pairedCaseStudies.map((study) => (
                  <SidebarCaseStudyRow key={study.href} {...study} />
                ))}
              </SidebarRowGroup>
            </RailAccordion>
          }
          mobile={
            <MobilePathwayList
              eyebrow="Related case studies"
              items={pairedCaseStudies.map((s) => ({
                title: s.title,
                href: s.href,
              }))}
            />
          }
        >
          <p>
            At Atlassian, I lead content design for our AI Content Systems
            team, where I own context governance and content quality for
            AI-connected experiences across Atlassian apps. I've developed
            expertise in AI onboarding patterns, prompt design and evaluation
            (human-led, model-based, and code-based), and creating content
            infrastructure that scales. I've also built taxonomies and
            machine-readable standards designed for both human and agentic
            ingestion.
          </p>
        </HybridSection>

        {/* Hybrid section 2: tone spectrum + featured project */}
        <HybridSection
          sidebar={
            <RailAccordion id="project" label="Featured project" count={1}>
              <SidebarFeaturedProject />
            </RailAccordion>
          }
          mobile={
            <MobilePathwayList
              eyebrow="Featured project"
              items={[
                {
                  title: "Tone Spectrum Explorer",
                  href: "/projects/tone-spectrum",
                },
              ]}
            />
          }
        >
          <p>
            You've described this role as "content engineer as much as a
            writer" and I feel seen. I'm a systems thinker who stays hands-on.
            I built the Tone Spectrum Explorer to help teams think about voice
            and tone at scale — an interactive tool that turns linguistic
            knowledge about tone into something teams can actually use, and
            exports a machine-readable content standard. For a recent
            hackathon, I built Word Wrangler, a multiplayer competitive
            writing game with AI-generated commentary.
          </p>
        </HybridSection>

        {/* Hybrid section 3: workshops + 3 videos */}
        <HybridSection
          sidebar={
            <RailAccordion
              id="videos"
              label="From the workshop"
              count={featuredVideos.length}
            >
              <SidebarRowGroup>
                {featuredVideos.map((video) => (
                  <VideoSidebarRow key={video.id} {...video} />
                ))}
              </SidebarRowGroup>
            </RailAccordion>
          }
          mobile={
            <MobileVideoList
              eyebrow="From the workshop"
              items={featuredVideos.map((v) => ({
                id: v.id,
                title: v.title,
              }))}
            />
          }
        >
          <p>
            Through UX Content Collective, I teach workshops on building with
            gen AI, voice and tone, and Figma. I'm as comfortable in a
            terminal as I am in a text editor.
          </p>
          </HybridSection>
        </CalloutsProvider>
        </VideoLightboxProvider>

        {/* Closing */}
        <section className="max-w-xl">
          <div className="space-y-5 text-lg text-text-secondary leading-relaxed">
            <p>
              The role you've described sends me on a bit of an emotional
              ride because 1.) I've been through the full interview process
              at Figma twice, and 2.) the area where strategy, craft, gen AI,
              Sophie Tahran, and Figma meet is the area I want to spend the
              next large chunk of my career.
            </p>

            <p>
              I know I'm the UX writer you're looking for. I hope I'll get
              the opportunity to try and convince you I'm right.
            </p>

            <p>
              Thanks for your time,
              <br />
              <span className="font-medium text-text-primary">Jason Fox</span>
            </p>
          </div>
        </section>
      </div>

      <Divider />

      {/* More from portfolio and workshop */}
      <section>
        <h2 className="text-xl font-display font-bold text-text-primary mb-5">
          More from Jason's portfolio and workshop
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {additionalWork.map((item) => {
            const Icon = item.icon;
            const isExternal = "external" in item && item.external;
            const cardInner = (
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
                      {isExternal && <ExternalLink className="w-3 h-3" />}
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
            );

            return isExternal ? (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {cardInner}
              </a>
            ) : (
              <Link key={item.title} href={item.href}>
                {cardInner}
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
          I'd love to discuss the intersection of strategy, craft, and gen AI
          at Figma — and how my experience with content systems and
          AI-connected experiences can help shape it.
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

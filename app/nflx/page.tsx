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
  Play,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Jason Fox — Netflix",
  description:
    "Cover letter and relevant work for a content design role at Netflix.",
  robots: {
    index: false,
    follow: false,
  },
};

const NETFLIX_RED = "#E50914";

const pairedCaseStudies = [
  {
    title: "AI content systems at Atlassian",
    blurb:
      "Defining product voice, conversational guidance, and interaction patterns for AI experiences that serve millions.",
    role: "Lead Content Designer, AI Content Systems",
    image: "/portfolio/atlassian-ai-ops/slides/slide-44.png",
    href: "/portfolio/atlassian-ai-ops-full",
  },
  {
    title: "Robinhood's 24 Hour Market",
    blurb:
      "Compliance-bound content design for an ambiguous, 0-to-1 trading experience. Co-led Robinhood's content committee.",
    role: "Senior Staff Content Designer",
    image: "/portfolio/robinhood/slides/slide-41.png",
    href: "/portfolio/robinhood-full",
  },
  {
    title: "Peer-to-peer payments at Chime",
    blurb:
      "A content experiment that lifted P2P payment completion by 16% — proof that trusting users beats adding specificity.",
    role: "Lead Content Designer, Growth",
    image: "/portfolio/chime/slides/slide-78.png",
    href: "/portfolio/chime-full",
  },
];

const featuredVideos = [
  {
    id: 729967797,
    title: "Finding rhythm in your tone of voice",
    description:
      "Modulating rhythm to match different contexts and moments.",
    duration: "2:52",
    thumbnail:
      "https://i.vimeocdn.com/video/1469113859-99bcaf7752c088586b1a4f163ea37d9b6d95a1c8da75c55fa106e0aec3795464-d_640x360",
  },
  {
    id: 808762357,
    title: "Designing a celebratory tone",
    description:
      "Content's role in designing for celebration, delight, and pleasure.",
    duration: "2:57",
    thumbnail:
      "https://i.vimeocdn.com/video/1633707496-b1875f0d55b1805302042e8e2e4c3a369c289d5d6127f07ebfb213e558881167-d_640x360",
  },
  {
    id: 700539388,
    title: "Influencing perceived value with content design",
    description:
      "How the language around content shapes how people receive it.",
    duration: "1:47",
    thumbnail:
      "https://i.vimeocdn.com/video/1416103259-763d5a385b33c83a9d34e27f9bb57f490575978a923d42a68d94365693d3bce6-d_640x360",
  },
];

const additionalWork = [
  {
    title: "Content design for Netflix payments",
    description:
      "Speculative case study crafting content hypotheses, guidelines, and Figma components for Netflix payments experiments using the 18F hypothesis framework. Not commissioned by Netflix.",
    tags: ["Speculative", "Hypothesis-driven", "Figma components"],
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

export default function NetflixPage() {
  return (
    <article className="space-y-16">
      {/* Header */}
      <header className="space-y-6">
        <div className="flex items-center gap-3 text-sm text-text-muted">
          <Link href="/" className="hover:text-palm-leaf transition-colors">
            Jason Fox
          </Link>
          <span>/</span>
          <span>Netflix</span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div
            className="font-black tracking-tight leading-none select-none"
            style={{
              color: NETFLIX_RED,
              fontFamily:
                "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "2.75rem",
              letterSpacing: "-0.05em",
            }}
            aria-label="Netflix"
          >
            NETFLIX
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-text-primary">
              Content design
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

      {/* Cover letter — opening (standalone, editorial) */}
      <section className="max-w-2xl">
        <div className="space-y-5 text-text-secondary leading-relaxed">
          <p className="text-xl font-display font-bold text-text-primary">
            Hi Netflix team,
          </p>

          <p className="text-lg leading-relaxed">
            My mom's name is still on our Netflix home screen. She died 13 years
            ago. I've never logged back into her profile. I think about what's
            there sometimes. A snapshot of shows she was working through,
            stories she didn't get to finish, or the last things she was trying
            to make sense of. It's a little sad, but it's also kind of
            heartening. I think this is something special Netflix does, even
            when it doesn't know it. It gives people the stories they use to
            make sense of being alive.
          </p>

          <p>
            I suppose that's part of why I'm here. The itch that brought me to
            this application is the desire to design for moments when people
            want to feel something. Trust and clarity are tablestakes, and I've
            built my career on them. But I've honestly never designed for people
            who want to feel thrilled, contemplative, wrecked-in-a-good-way, or
            finally-understood. Those are deep emotional territories, and
            they're where I want to work right now.
          </p>
        </div>
      </section>

      {/* Experience paragraph + 3 paired case studies */}
      <section className="space-y-8">
        <div className="max-w-2xl space-y-5 text-text-secondary leading-relaxed">
          <p>
            For the past 2 years, I've been a Lead Content Designer on
            Atlassian's AI Content Systems team, where I define how
            conversational guidance, product voice, and interaction patterns
            work together across experiences that serve millions. Before that,
            I shipped content for fintech at Robinhood and Chime, not to
            mention enterprise SaaS, always at the intersection of systems
            thinking and craft. I've driven 0-1 initiatives in ambiguous
            spaces, partnered with brand and marketing on campaigns, and built
            language frameworks that scale across formats.
          </p>
        </div>

        {/* Editorial eyebrow */}
        <div className="flex items-center gap-3 max-w-2xl">
          <span
            className="h-px flex-1"
            style={{ backgroundColor: NETFLIX_RED, opacity: 0.35 }}
          />
          <span
            className="text-xs font-semibold uppercase tracking-[0.18em]"
            style={{ color: NETFLIX_RED }}
          >
            Three case studies from that work
          </span>
          <span
            className="h-px flex-1"
            style={{ backgroundColor: NETFLIX_RED, opacity: 0.35 }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pairedCaseStudies.map((study) => (
            <Link key={study.href} href={study.href} className="block group">
              <div className="h-full flex flex-col rounded-lg border border-soft-linen-dark bg-soft-linen-light overflow-hidden hover:border-palm-leaf/50 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                <div className="relative aspect-video bg-soft-linen-dark">
                  <Image
                    src={study.image}
                    alt={study.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="flex-1 flex flex-col p-4 space-y-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-palm-leaf-3">
                    <Briefcase className="w-3 h-3" />
                    Case study
                  </span>
                  <h3 className="font-display font-bold text-text-primary leading-tight group-hover:text-palm-leaf transition-colors">
                    {study.title}
                  </h3>
                  <p className="text-xs text-text-muted">{study.role}</p>
                  <p className="text-sm text-text-secondary leading-relaxed flex-1">
                    {study.blurb}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-palm-leaf group-hover:gap-2 transition-all pt-1">
                    Read case study <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Tone Spectrum paragraph + prominent pathway */}
      <section className="space-y-8">
        <div className="max-w-2xl space-y-5 text-text-secondary leading-relaxed">
          <p>
            I also spend my own time building tools for the craft I care about.
            I built the Tone Spectrum Explorer, an interactive tool that turns
            years of literary and linguistic knowledge about tone into
            something teams can actually use. It lets a writer position their
            tone on a spectrum, surfaces the linguistic devices that make that
            tone land, detects anti-patterns, and exports a machine-readable
            content standard. It's craft and systems in the same artifact,
            which is how I like to work.
          </p>
        </div>

        <Link href="/projects/tone-spectrum" className="block group">
          <div className="relative overflow-hidden rounded-xl border border-soft-linen-dark bg-gradient-to-br from-soft-linen-light to-soft-linen hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
              <div className="relative lg:col-span-3 aspect-[16/10] lg:aspect-auto lg:min-h-[320px] bg-soft-linen-dark">
                <Image
                  src="/projects/tone-spectrum/tone-spectrum-explorer-interface.png"
                  alt="Tone Spectrum Explorer interface"
                  fill
                  className="object-cover object-left-top"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>
              <div className="lg:col-span-2 p-6 lg:p-8 flex flex-col justify-center space-y-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-bronze-spice">
                  <Hammer className="w-3 h-3" />
                  Featured project
                </span>
                <h3 className="text-2xl font-display font-bold text-text-primary leading-tight group-hover:text-palm-leaf transition-colors">
                  Tone Spectrum Explorer
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  50+ linguistic devices across 5 tone spectrums. Detects
                  anti-patterns. Exports a machine-readable content standard.
                  A working artifact of how I think about tone.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <Tag size="sm">AI + linguistics</Tag>
                  <Tag size="sm">Voice &amp; tone</Tag>
                  <Tag size="sm">Standards generation</Tag>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-palm-leaf group-hover:gap-2.5 transition-all pt-1">
                  Explore the tool <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Formats paragraph + 3 videos */}
      <section className="space-y-8">
        <div className="max-w-2xl space-y-5 text-text-secondary leading-relaxed">
          <p>
            I can see that Netflix is thinking about new shapes now. Things
            like livestreams, podcasts, and shorter-form entertainment, which
            represent new moments of attention, and they'll need new language
            to match. Listening to a daily podcast is not the same as watching
            a serialized series.
          </p>
        </div>

        <div className="flex items-center gap-3 max-w-2xl">
          <span
            className="h-px flex-1"
            style={{ backgroundColor: NETFLIX_RED, opacity: 0.35 }}
          />
          <span
            className="text-xs font-semibold uppercase tracking-[0.18em]"
            style={{ color: NETFLIX_RED }}
          >
            From my workshop on tone and format
          </span>
          <span
            className="h-px flex-1"
            style={{ backgroundColor: NETFLIX_RED, opacity: 0.35 }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredVideos.map((video) => (
            <Link
              key={video.id}
              href="/resources#videos"
              className="group block rounded-lg overflow-hidden bg-soft-linen-light border border-soft-linen-dark hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
            >
              <div className="relative aspect-video bg-soft-linen-dark overflow-hidden">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg"
                    style={{ backgroundColor: NETFLIX_RED }}
                  >
                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                  {video.duration}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-text-primary line-clamp-2 group-hover:text-palm-leaf transition-colors">
                  {video.title}
                </h3>
                <p className="mt-1 text-sm text-text-muted line-clamp-2">
                  {video.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Questions: pullquote + two-column */}
      <section className="space-y-10">
        <blockquote
          className="relative pl-6 lg:pl-8 max-w-3xl"
          style={{ borderLeft: `3px solid ${NETFLIX_RED}` }}
        >
          <p className="text-2xl lg:text-3xl font-display font-bold text-text-primary leading-[1.25]">
            A six-minute viewing moment is not the same as a Sunday evening.
          </p>
        </blockquote>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          <div className="space-y-3">
            <div
              className="text-5xl font-display font-black leading-none"
              style={{ color: NETFLIX_RED, opacity: 0.85 }}
              aria-hidden="true"
            >
              ?
            </div>
            <p className="text-lg lg:text-xl font-display font-semibold text-text-primary leading-snug">
              How do we respect the content habits people already have while
              inviting them into something different?
            </p>
          </div>
          <div className="space-y-3">
            <div
              className="text-5xl font-display font-black leading-none"
              style={{ color: NETFLIX_RED, opacity: 0.85 }}
              aria-hidden="true"
            >
              ?
            </div>
            <p className="text-lg lg:text-xl font-display font-semibold text-text-primary leading-snug">
              How do we keep discovery feeling generous when the catalog
              stretches across formats that don't map cleanly onto each other?
            </p>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="max-w-2xl">
        <div className="space-y-5 text-text-secondary leading-relaxed">
          <p>
            These are exactly the ambiguous, systems-level questions I've spent
            my career getting better at answering.
          </p>

          <p>I'd love to help answer them at Netflix.</p>

          <p>
            Thanks for your time,
            <br />
            <span className="font-medium text-text-primary">Jason Fox</span>
          </p>
        </div>
      </section>

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
          I'd love to discuss the emotional territory Netflix is designing for
          next, and how my experience with voice, tone, and content systems can
          help shape it.
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

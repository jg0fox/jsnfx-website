import { Metadata } from "next";
import Link from "next/link";
import { Divider, Tag } from "@/components/ui";
import { Download, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Resume — Jason Fox",
  description:
    "Content designer with 10+ years of experience in voice, tone, AI content systems, and content governance.",
  robots: {
    index: false,
    follow: false,
  },
};

const experience = [
  {
    company: "Atlassian",
    role: "Lead Content Designer, AI Content Systems",
    dates: "Mar 2024 – Present",
    bullets: [
      "Defining how conversational guidance, product voice, and interaction patterns work together across AI experiences that serve millions",
      "Building evaluation frameworks, governance architecture, and model-assisted workflows for content quality at scale",
    ],
  },
  {
    company: "The UX Content Collective",
    role: "Instructor",
    dates: "Apr 2022 – Present",
    bullets: [
      "Designing and running workshops on voice and tone, content systems, and Figma skills for working content designers",
    ],
  },
  {
    company: "Robinhood",
    role: "Sr. Staff Content Designer, Equities",
    dates: "Dec 2022 – Sep 2023",
    bullets: [
      "Led content design for 0-to-1 initiatives in ambiguous, compliance-bound space",
      "Co-led Robinhood's content committee, codifying patterns for market data, terminology, and tone",
    ],
  },
  {
    company: "Chime",
    role: "Lead Content Designer, Growth",
    dates: "Apr 2021 – Dec 2022",
    bullets: [
      "Helped found Chime's content design team, establishing systems, standards, and a culture of craft",
      "Ran a content experiment that lifted peer-to-peer payment completion by 16%",
    ],
  },
  {
    company: "Atlassian",
    role: "Senior Growth Content Designer",
    dates: "Jan 2020 – Apr 2021",
    bullets: [
      "Led content-first product onboarding across Confluence and Jira",
      "Established an internal growth content design curriculum",
    ],
  },
  {
    company: "Oracle",
    role: "Principal UX Writer & Conversation Designer",
    dates: "Aug 2018 – Jan 2020",
    bullets: [
      "Distilled voice and tone from 5 core products into design resources through auditing, research, and voice mapping",
      "Led UX writing and conversation design across core products",
    ],
  },
  {
    company: "Baymard Institute",
    role: "UX Research Analyst and Writer",
    dates: "Dec 2017 – Aug 2018",
    bullets: [
      "Translated large-scale e-commerce usability research into articles, reports, and benchmark databases",
    ],
  },
  {
    company: "Havenly",
    role: "UX Writer and Copywriter",
    dates: "Nov 2015 – Dec 2016",
    bullets: [
      "Helped found Havenly's content team, creating standards, systems, and metrics for growth",
    ],
  },
  {
    company: "Self-employed",
    role: "Freelance UX Content Worker",
    dates: "2012 – Dec 2017",
    bullets: [],
  },
];

const skills = [
  "Voice & tone development",
  "AI fluency",
  "Content experimentation",
  "Figma prototyping",
  "Research & data analysis",
  "Content governance",
  "Feature naming",
  "Information architecture",
  "Stakeholder management",
  "Mentorship",
];

export default function FigmaResumePage() {
  return (
    <article className="max-w-3xl resume-print-article">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-3 text-sm text-text-muted mb-8 print:hidden">
        <Link href="/" className="hover:text-palm-leaf transition-colors">
          Jason Fox
        </Link>
        <span>/</span>
        <Link href="/figma" className="hover:text-palm-leaf transition-colors">
          Figma
        </Link>
        <span>/</span>
        <span>Resume</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-text-primary">
              Jason Fox
            </h1>
            <p className="text-lg text-text-secondary mt-1">
              Content designer with 10+ years working on voice, tone, and
              systems
            </p>
          </div>
          <a
            href="/jason-fox-resume-figma.pdf"
            download
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-soft-linen-light border border-soft-linen-dark text-text-secondary hover:border-palm-leaf hover:text-palm-leaf transition-colors flex-shrink-0 print:hidden"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-text-muted">
          <a
            href="https://jsnfx.com/figma"
            className="hover:text-palm-leaf transition-colors"
          >
            jsnfx.com/figma
          </a>
          <span>·</span>
          <span>jasongfox@gmail.com</span>
          <span>·</span>
          <a
            href="https://www.linkedin.com/in/jasongfox/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-palm-leaf transition-colors"
          >
            LinkedIn
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <p className="mt-4 text-text-secondary italic">
          A systems thinker who stays hands-on. I care about craft, build the
          tools I want my teams to use, and am as comfortable in a terminal
          as I am in a text editor.
        </p>
      </header>

      <Divider />

      {/* Experience */}
      <section className="mt-8">
        <h2 className="text-xs font-medium uppercase tracking-widest text-text-muted mb-6">
          Experience
        </h2>

        <div className="space-y-8">
          {experience.map((job, i) => (
            <div key={`${job.company}-${i}`}>
              <h3 className="font-display font-bold text-text-primary">
                {job.company}
              </h3>
              <p className="text-sm text-text-secondary mt-0.5">
                {job.role}{" "}
                <span className="text-text-muted">· {job.dates}</span>
              </p>
              {job.bullets.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {job.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="text-sm text-text-secondary flex items-start gap-2"
                    >
                      <span className="text-text-muted mt-0.5 flex-shrink-0">
                        –
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      <Divider className="my-8" />

      {/* Education */}
      <section>
        <h2 className="text-xs font-medium uppercase tracking-widest text-text-muted mb-6">
          Education
        </h2>

        <div>
          <h3 className="font-display font-bold text-text-primary">
            University of Colorado
          </h3>
          <p className="text-sm text-text-secondary mt-0.5">
            English writing with a focus on rhetorical discourse
          </p>
          <p className="text-sm text-text-muted">Magna Cum Laude · 2006 – 2010</p>
        </div>
      </section>

      <Divider className="my-8" />

      {/* Skills */}
      <section>
        <h2 className="text-xs font-medium uppercase tracking-widest text-text-muted mb-4">
          Skills
        </h2>

        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Tag key={skill} size="sm">
              {skill}
            </Tag>
          ))}
        </div>
      </section>
    </article>
  );
}

import { Metadata } from "next";
import Link from "next/link";
import { Divider, Tag } from "@/components/ui";
import { Download, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Resume — Jason Fox",
  description:
    "Content designer with 10+ years of experience in AI content systems, conversational design, and content governance.",
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
      "Leading context governance and content quality for AI-connected experiences across all of Atlassian's apps, building evaluation frameworks and model-assisted workflows for tools that serve millions",
    ],
  },
  {
    company: "The UX Content Collective",
    role: "Instructor",
    dates: "Apr 2022 – Present",
    bullets: [
      "Designing and running workshops for content systems, voice and tone development, and Figma skills",
    ],
  },
  {
    company: "Robinhood",
    role: "Sr. Staff Content Designer, Equities",
    dates: "Dec 2022 – Sep 2023",
    bullets: [
      "Focused on bringing peace of mind to our customers while making improvements to metrics like funded accounts, MAU, assets under custody, and ARPU",
    ],
  },
  {
    company: "Chime",
    role: "Lead Content Designer, Growth",
    dates: "Apr 2021 – Dec 2022",
    bullets: [
      "Helped the founding content design team establish content systems and standards, build a culture of empowerment and education, and optimize peer-to-peer payment experiences",
    ],
  },
  {
    company: "Atlassian",
    role: "Senior Growth Content Designer",
    dates: "Jan 2020 – Apr 2021",
    bullets: [
      "Created a content-based foundation for the growth of Confluence and Jira",
      "Established an internal growth content design curriculum",
      "Led content-first product onboarding experiences",
    ],
  },
  {
    company: "Oracle",
    role: "Principal UX Writer & Conversation Designer",
    dates: "Aug 2018 – Jan 2020",
    bullets: [
      "Created messaging frameworks for core audiences: IC, management, executives, and beyond",
      "Lead UX writing and content initiatives across core products",
    ],
  },
  {
    company: "Baymard Institute",
    role: "UX Research Analyst and Writer",
    dates: "Dec 2017 – Aug 2018",
    bullets: [
      "Conducted and translated large-scale e-commerce usability research data into UX articles, reports, and benchmark databases",
    ],
  },
  {
    company: "Havenly",
    role: "UX Writer and Copywriter",
    dates: "Nov 2015 – Dec 2016",
    bullets: [
      "Helped to found Havenly's content team, creating standards, systems, and metrics for growth",
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
  "AI fluency",
  "Content experimentation",
  "Figma prototyping",
  "Research & data analysis",
  "Accessibility & inclusivity",
  "Content governance",
  "Mentorship",
  "Feature naming",
  "Information architecture",
  "Stakeholder management",
];

export default function ResumePage() {
  return (
    <article className="max-w-3xl">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-3 text-sm text-text-muted mb-8">
        <Link href="/" className="hover:text-palm-leaf transition-colors">
          Jason Fox
        </Link>
        <span>/</span>
        <Link href="/autodesk" className="hover:text-palm-leaf transition-colors">
          Autodesk
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
              Content designer with 10+ years and ~20 million tokens of
              experience
            </p>
          </div>
          <a
            href="/jason-fox-resume.pdf"
            download
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-soft-linen-light border border-soft-linen-dark text-text-secondary hover:border-palm-leaf hover:text-palm-leaf transition-colors flex-shrink-0"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-text-muted">
          <Link
            href="/"
            className="hover:text-palm-leaf transition-colors"
          >
            jsnfx.com
          </Link>
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
          I get excited by content evaluation systems, am obsessed with tone
          frameworks, and I'm as comfortable in a terminal as I am in a text
          editor.
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

import { Metadata } from "next";
import { PageHeader } from "@/components/layout";
import { Divider } from "@/components/ui";
import { Download, FileText, Presentation, BookOpen, Code, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "AI workshop materials",
  description:
    "Downloadable materials for the AI building workshop.",
  robots: {
    index: false,
    follow: false,
  },
};

const studentMaterials = [
  {
    title: "Workshop slides",
    description: "The full slide deck used during the session.",
    href: "/workshop/workshop-slides.html",
    icon: Presentation,
  },
  {
    title: "Cheat sheet",
    description: "Quick reference for key concepts and commands.",
    href: "/workshop/cheat-sheet.html",
    icon: FileText,
  },
  {
    title: "Glossary",
    description: "Definitions for terms used throughout the workshop.",
    href: "/workshop/glossary.pdf",
    icon: BookOpen,
  },
  {
    title: "Seed prompt",
    description: "A starter prompt to kick off your first build.",
    href: "/workshop/seed-prompt.txt",
    icon: MessageSquare,
  },
];

const artifactFiles = [
  {
    title: "Content testing tool (API version)",
    description: "Interactive tool that connects to the Claude API.",
    href: "/workshop/content-testing-tool-api.html",
    icon: Code,
  },
  {
    title: "Content testing tool (static version)",
    description: "Standalone version that works without an API key.",
    href: "/workshop/content-testing-tool-static.html",
    icon: Code,
  },
  {
    title: "System prompt",
    description: "The system prompt powering the content testing tool.",
    href: "/workshop/system-prompt.txt",
    icon: FileText,
  },
  {
    title: "Tech spec",
    description: "Technical specification for the content testing tool.",
    href: "/workshop/tech-spec.md",
    icon: FileText,
  },
  {
    title: "CLAUDE.md",
    description: "Project instructions file used with Claude Code.",
    href: "/workshop/CLAUDE.md",
    icon: FileText,
  },
];

const facilitatorMaterials = [
  {
    title: "Facilitator notes",
    description: "Detailed talking points and guidance for running the workshop.",
    href: "/workshop/facilitator-notes.md",
    icon: FileText,
  },
  {
    title: "Run of show",
    description: "Timing and agenda breakdown for the session.",
    href: "/workshop/run-of-show.md",
    icon: FileText,
  },
];

function DownloadLink({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}) {
  return (
    <a
      href={href}
      download
      className="flex items-center justify-between p-4 rounded-lg bg-soft-linen-light border border-soft-linen-dark hover:border-palm-leaf hover:bg-palm-leaf/5 transition-all group"
    >
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 mt-0.5 text-text-muted group-hover:text-palm-leaf transition-colors shrink-0" />
        <div>
          <h3 className="font-medium text-text-primary group-hover:text-palm-leaf transition-colors">
            {title}
          </h3>
          <p className="text-sm text-text-muted">{description}</p>
        </div>
      </div>
      <Download className="w-4 h-4 text-text-muted group-hover:text-palm-leaf transition-colors shrink-0 ml-4" />
    </a>
  );
}

export default function AIWorkshopPage() {
  return (
    <>
      <PageHeader
        title="AI workshop materials"
        description="Download the slides, reference materials, and project files from the workshop. Everything you need to keep building on your own."
      />

      {/* Student materials */}
      <section className="mb-12">
        <h2 className="text-2xl font-display font-bold text-text-primary mb-2">
          Student materials
        </h2>
        <p className="text-sm text-text-muted mb-6">
          Core resources handed out during the workshop.
        </p>
        <div className="space-y-3">
          {studentMaterials.map((item) => (
            <DownloadLink key={item.title} {...item} />
          ))}
        </div>
      </section>

      <Divider />

      {/* Artifact files */}
      <section className="my-12">
        <h2 className="text-2xl font-display font-bold text-text-primary mb-2">
          Workshop artifact
        </h2>
        <p className="text-sm text-text-muted mb-6">
          The content testing tool we built together, plus the files that power it.
        </p>
        <div className="space-y-3">
          {artifactFiles.map((item) => (
            <DownloadLink key={item.title} {...item} />
          ))}
        </div>
      </section>

      <Divider />

      {/* Facilitator materials */}
      <section className="mt-12">
        <h2 className="text-2xl font-display font-bold text-text-primary mb-2">
          Facilitator materials
        </h2>
        <p className="text-sm text-text-muted mb-6">
          For anyone running their own version of this workshop.
        </p>
        <div className="space-y-3">
          {facilitatorMaterials.map((item) => (
            <DownloadLink key={item.title} {...item} />
          ))}
        </div>
      </section>
    </>
  );
}

import { Metadata } from "next";
import { PageHeader } from "@/components/layout";
import { Divider } from "@/components/ui";
import { Download, FileText, BookOpen, MessageSquare } from "lucide-react";

export const dynamic = "force-static";

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
        description="Download the reference materials and project files from the workshop. Everything you need to keep building on your own."
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

    </>
  );
}

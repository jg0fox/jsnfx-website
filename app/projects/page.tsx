import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, Tag } from "@/components/ui";
import { FolderOpen } from "lucide-react";
import { getProjectItems } from "@/lib/content";

export const metadata: Metadata = {
  title: "Side projects",
  description: "Personal projects and experiments in content design tooling.",
  alternates: {
    canonical: "/projects",
  },
};

// Hardcoded projects that don't have detail pages yet
const placeholderProjects = [
  {
    title: "Content Standards IDE Tool",
    slug: null,
    description:
      "A tool for checking content against design system standards directly in your IDE.",
    category: "Tool",
    status: "In development" as const,
    technologies: ["TypeScript", "VS Code API"],
  },
  {
    title: "Tone Spectrum Explorer",
    slug: null,
    description:
      "An interactive tool for exploring and defining tone characteristics across a spectrum.",
    category: "Experiment",
    status: "In development" as const,
    technologies: ["React", "D3.js"],
  },
  {
    title: "Zillow Content Tool",
    slug: null,
    description:
      "A specialized content tool built for real estate content workflows.",
    category: "Tool",
    status: "Archived" as const,
    technologies: ["JavaScript", "Node.js"],
  },
];

const statusStyles: Record<string, string> = {
  Active: "bg-palm-leaf/10 text-palm-leaf-3",
  Complete: "bg-bronze-spice/10 text-bronze-spice",
  "In development": "bg-palm-leaf-2/10 text-palm-leaf-3",
  Archived: "bg-soft-linen-dark text-text-muted",
};

export default async function ProjectsPage() {
  // Fetch MDX-based projects
  const mdxProjects = await getProjectItems();

  // Combine MDX projects with placeholder projects
  const allProjects = [
    ...mdxProjects.map((p) => ({
      title: p.title,
      slug: p.slug,
      description: p.description,
      category: p.category,
      status: p.status,
      technologies: [] as string[], // MDX projects store technologies in the full item
    })),
    ...placeholderProjects,
  ];

  return (
    <>
      <PageHeader
        title="Side projects"
        description="Personal experiments and tools exploring the intersection of content design and technology."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allProjects.map((project) => {
          const CardWrapper = project.slug
            ? ({ children }: { children: React.ReactNode }) => (
                <Link
                  href={`/projects/${project.slug}`}
                  className="block transition-transform hover:-translate-y-0.5"
                >
                  {children}
                </Link>
              )
            : ({ children }: { children: React.ReactNode }) => <>{children}</>;

          return (
            <CardWrapper key={project.title}>
              <Card className="flex flex-col h-full">
                <CardContent className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-lg bg-soft-linen">
                      <FolderOpen className="w-5 h-5 text-palm-leaf" />
                    </div>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        statusStyles[project.status] || statusStyles["Active"]
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-text-primary mb-2">
                    {project.title}
                  </h3>

                  <p className="text-sm text-text-secondary mb-4">
                    {project.description}
                  </p>

                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.technologies.map((tech) => (
                        <Tag key={tech} size="sm">
                          {tech}
                        </Tag>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </CardWrapper>
          );
        })}
      </div>

      {/* Coming Soon Note */}
      <div className="mt-12 p-6 bg-soft-linen-light border border-soft-linen-dark rounded-lg text-center">
        <p className="text-text-secondary">
          More projects coming soon. These are works in progress—check back for
          updates!
        </p>
      </div>
    </>
  );
}

import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout";
import { Card, CardContent } from "@/components/ui";
import { FolderOpen } from "lucide-react";
import { getProjectItems } from "@/lib/content";

export const metadata: Metadata = {
  title: "Side projects",
  description: "Personal projects and experiments in content design tooling.",
  alternates: {
    canonical: "/projects",
  },
};

const statusStyles: Record<string, string> = {
  Active: "bg-palm-leaf/10 text-palm-leaf-3",
  Complete: "bg-bronze-spice/10 text-bronze-spice",
  "In development": "bg-palm-leaf-2/10 text-palm-leaf-3",
  Archived: "bg-soft-linen-dark text-text-muted",
};

export default async function ProjectsPage() {
  const projects = await getProjectItems();

  return (
    <>
      <PageHeader
        title="Side projects"
        description="Personal experiments and tools exploring the intersection of content design and technology."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="block transition-transform hover:-translate-y-0.5"
          >
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
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}

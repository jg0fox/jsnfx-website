import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHeader } from "@/components/layout";
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
            className="group block rounded-lg overflow-hidden bg-soft-linen-light border border-soft-linen-dark transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Thumbnail or Placeholder */}
            <div className="relative aspect-video bg-soft-linen overflow-hidden">
              {project.thumbnail ? (
                <Image
                  src={project.thumbnail}
                  alt={`${project.title} thumbnail`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <FolderOpen className="w-12 h-12 text-text-muted/30" />
                </div>
              )}
              {/* Status overlay */}
              <div className="absolute top-3 left-3">
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    statusStyles[project.status] || statusStyles["Active"]
                  }`}
                >
                  {project.status}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-display font-bold text-lg text-text-primary group-hover:text-palm-leaf transition-colors">
                {project.title}
              </h3>
              <p className="mt-2 text-sm text-text-secondary line-clamp-2">
                {project.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

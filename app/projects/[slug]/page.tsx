import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/layout";
import { SideProjectMeta } from "@/components/projects";
import { Tag } from "@/components/ui";
import { JsonLd } from "@/components/seo/JsonLd";
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/content";
import { processMDX } from "@/lib/mdx";
import {
  generateProjectSchema,
  generateBreadcrumbSchema,
} from "@/lib/schema";

function getCtaLabel(url: string): string {
  if (url.includes("npmjs.com")) return "View on NPM";
  if (url.includes("github.com")) return "View on GitHub";
  return "View project";
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Not found",
    };
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
    },
    alternates: {
      canonical: `/projects/${slug}`,
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const content = await processMDX(project.content);

  const projectSchema = generateProjectSchema(project);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Projects", url: "/projects" },
    { name: project.title },
  ]);

  return (
    <>
      <JsonLd schema={[projectSchema, breadcrumbSchema]} />
      <article>
        {/* Header */}
        <PageHeader
          title={project.title}
          description={project.description}
          breadcrumbs={[
            { label: "Side projects", href: "/projects" },
            { label: project.title },
          ]}
        >
          <div className="flex flex-wrap gap-2 mt-2">
            <Tag>{project.category}</Tag>
          </div>
        </PageHeader>

        {/* Hero Image */}
        {project.heroImage && (
          <div className="relative aspect-video mb-8 rounded-lg overflow-hidden bg-soft-linen-light">
            <Image
              src={project.heroImage}
              alt={project.title}
              fill
              className="object-contain p-8"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>
        )}

        {/* CTA Button */}
        {project.liveUrl && (
          <div className="mb-8">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-palm-leaf text-white font-medium rounded-lg hover:bg-palm-leaf-3 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              {getCtaLabel(project.liveUrl)}
            </a>
          </div>
        )}

        {/* Two-column layout on desktop */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="prose prose-lg max-w-none">{content}</div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="lg:sticky lg:top-8">
              <SideProjectMeta
                status={project.status}
                category={project.category}
                technologies={project.technologies}
                github={project.github}
                liveUrl={project.liveUrl}
              />
            </div>
          </div>
        </div>
      </article>
    </>
  );
}

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
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

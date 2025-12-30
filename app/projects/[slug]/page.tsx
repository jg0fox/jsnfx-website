import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout";
import { SideProjectMeta } from "@/components/projects";
import { Tag } from "@/components/ui";
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/content";
import { processMDX } from "@/lib/mdx";

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
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const content = await processMDX(project.content);

  return (
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
  );
}

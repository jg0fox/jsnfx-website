import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  ExternalLink,
  Github,
  Play,
  Download,
  Code,
  Globe,
  Package,
} from "lucide-react";
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
import type { ButtonIcon } from "@/types/content";

// NPM icon (not available in Lucide)
function NpmIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z" />
    </svg>
  );
}

// Get icon component for button
function getButtonIcon(iconName?: ButtonIcon, className?: string) {
  if (!iconName || iconName === "none") return null;

  const iconMap: Record<string, React.ReactNode> = {
    github: <Github className={className} />,
    npm: <NpmIcon className={className} />,
    external: <ExternalLink className={className} />,
    play: <Play className={className} />,
    download: <Download className={className} />,
    code: <Code className={className} />,
    globe: <Globe className={className} />,
    package: <Package className={className} />,
  };

  return iconMap[iconName] || null;
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

        {/* Action Buttons */}
        {(project.button1Label && project.button1Url) ||
        (project.button2Label && project.button2Url) ? (
          <div className="flex flex-wrap gap-3 mb-8">
            {/* Primary Button */}
            {project.button1Label && project.button1Url && (
              <a
                href={project.button1Url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-palm-leaf text-white font-medium rounded-lg hover:bg-palm-leaf-3 transition-colors"
              >
                {getButtonIcon(project.button1Icon, "w-5 h-5")}
                {project.button1Label}
              </a>
            )}
            {/* Secondary Button */}
            {project.button2Label && project.button2Url && (
              <a
                href={project.button2Url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-palm-leaf text-palm-leaf font-medium rounded-lg hover:bg-palm-leaf hover:text-white transition-colors"
              >
                {getButtonIcon(project.button2Icon, "w-5 h-5")}
                {project.button2Label}
              </a>
            )}
          </div>
        ) : null}

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
              />
            </div>
          </div>
        </div>
      </article>
    </>
  );
}

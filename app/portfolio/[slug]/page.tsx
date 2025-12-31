import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PageHeader } from "@/components/layout";
import { ProjectMeta, ProjectNav } from "@/components/portfolio";
import { Tag } from "@/components/ui";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getPortfolioBySlug,
  getAllPortfolioSlugs,
  getAdjacentPortfolioItems,
} from "@/lib/content";
import { processMDX } from "@/lib/mdx";
import {
  generatePortfolioSchema,
  generateBreadcrumbSchema,
} from "@/lib/schema";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllPortfolioSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const portfolio = await getPortfolioBySlug(slug);

  if (!portfolio) {
    return {
      title: "Not Found",
    };
  }

  return {
    title: portfolio.title,
    description: portfolio.description,
    openGraph: {
      title: portfolio.title,
      description: portfolio.description,
      type: "article",
    },
    alternates: {
      canonical: `/portfolio/${slug}`,
    },
  };
}

export default async function PortfolioDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const portfolio = await getPortfolioBySlug(slug);

  if (!portfolio) {
    notFound();
  }

  const { previous, next } = await getAdjacentPortfolioItems(slug);
  const content = await processMDX(portfolio.content);

  const portfolioSchema = generatePortfolioSchema(portfolio);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Portfolio", url: "/portfolio" },
    { name: portfolio.company },
  ]);

  return (
    <>
      <JsonLd schema={[portfolioSchema, breadcrumbSchema]} />
      <article>
        {/* Header */}
        <PageHeader
          title={portfolio.title}
          description={portfolio.description}
          breadcrumbs={[
            { label: "Portfolio", href: "/portfolio" },
            { label: portfolio.company },
          ]}
        >
          <div className="flex flex-wrap gap-2 mt-2">
            <Tag>{portfolio.category}</Tag>
          </div>
        </PageHeader>

        {/* Hero Image */}
        {portfolio.heroImage && (
          <div className="relative aspect-video mb-8 rounded-lg overflow-hidden bg-soft-linen-light">
            <Image
              src={portfolio.heroImage}
              alt={portfolio.title}
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
              <ProjectMeta
                company={portfolio.company}
                role={portfolio.role}
                timeline={portfolio.timeline}
                tools={portfolio.tools}
              />
            </div>
          </div>
        </div>

        {/* Prev/Next Navigation */}
        <ProjectNav previous={previous} next={next} />
      </article>
    </>
  );
}

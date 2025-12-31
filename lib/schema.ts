/**
 * JSON-LD Schema Generators
 * Structured data for SEO and rich search results
 */

import { siteConfig, absoluteUrl } from "./seo";
import type { PortfolioItem, ProjectItem } from "@/types/content";

/**
 * Person schema for homepage
 */
export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    jobTitle: "Senior Content Designer",
    sameAs: [
      siteConfig.social.linkedin,
      siteConfig.social.github,
      siteConfig.social.medium,
    ],
    knowsAbout: [
      "Content Design",
      "UX Writing",
      "Content Strategy",
      "Design Systems",
      "Information Architecture",
    ],
  };
}

/**
 * Breadcrumb schema for navigation
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url?: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url && { item: absoluteUrl(item.url) }),
    })),
  };
}

/**
 * CreativeWork schema for portfolio items
 */
export function generatePortfolioSchema(portfolio: PortfolioItem) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: portfolio.title,
    description: portfolio.description,
    url: absoluteUrl(`/portfolio/${portfolio.slug}`),
    datePublished: portfolio.date,
    author: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    creator: {
      "@type": "Organization",
      name: portfolio.company,
    },
    keywords: [portfolio.category, ...portfolio.tools],
    ...(portfolio.heroImage && {
      image: absoluteUrl(portfolio.heroImage),
    }),
  };
}

/**
 * CreativeWork schema for project items
 */
export function generateProjectSchema(project: ProjectItem) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: absoluteUrl(`/projects/${project.slug}`),
    datePublished: project.date,
    author: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    keywords: [project.category, ...project.technologies],
    ...(project.thumbnail && {
      image: absoluteUrl(project.thumbnail),
    }),
  };
}

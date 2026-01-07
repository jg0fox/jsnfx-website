import { MetadataRoute } from "next";
import { getPortfolioItems, getProjectItems } from "@/lib/content";
import { siteConfig } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const portfolioItems = await getPortfolioItems();
  const projectItems = await getProjectItems();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/portfolio`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/resources`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/writing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Portfolio detail pages
  const portfolioPages: MetadataRoute.Sitemap = portfolioItems.map((item) => ({
    url: `${siteConfig.url}/portfolio/${item.slug}`,
    lastModified: new Date(item.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Project detail pages
  const projectPages: MetadataRoute.Sitemap = projectItems.map((item) => ({
    url: `${siteConfig.url}/projects/${item.slug}`,
    lastModified: new Date(item.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...portfolioPages, ...projectPages];
}

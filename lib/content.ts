import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type {
  PortfolioMeta,
  PortfolioItem,
  ProjectMeta,
  ProjectItem,
  PortfolioFrontmatter,
  ProjectFrontmatter,
} from "@/types/content";

const contentDirectory = path.join(process.cwd(), "content");

/**
 * Get all portfolio items for the index page
 */
export async function getPortfolioItems(): Promise<PortfolioMeta[]> {
  const portfolioDir = path.join(contentDirectory, "portfolio");

  // Check if directory exists
  if (!fs.existsSync(portfolioDir)) {
    return [];
  }

  const slugs = fs.readdirSync(portfolioDir).filter((name) => {
    const itemPath = path.join(portfolioDir, name);
    return fs.statSync(itemPath).isDirectory();
  });

  const items: PortfolioMeta[] = [];

  for (const slug of slugs) {
    const filePath = path.join(portfolioDir, slug, "index.mdx");

    if (!fs.existsSync(filePath)) {
      continue;
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);
    const frontmatter = data as PortfolioFrontmatter;

    items.push({
      slug: frontmatter.slug || slug,
      title: frontmatter.title,
      description: frontmatter.description,
      date: frontmatter.date,
      category: frontmatter.category,
      company: frontmatter.company,
      thumbnail: frontmatter.thumbnail,
      featured: frontmatter.featured,
      order: frontmatter.order,
    });
  }

  // Sort by order first (if defined), then by date
  return items.sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

/**
 * Get a single portfolio item by slug
 */
export async function getPortfolioBySlug(
  slug: string
): Promise<PortfolioItem | null> {
  const filePath = path.join(contentDirectory, "portfolio", slug, "index.mdx");

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const frontmatter = data as PortfolioFrontmatter;

  return {
    slug: frontmatter.slug || slug,
    title: frontmatter.title,
    description: frontmatter.description,
    date: frontmatter.date,
    category: frontmatter.category,
    company: frontmatter.company,
    thumbnail: frontmatter.thumbnail,
    featured: frontmatter.featured,
    order: frontmatter.order,
    heroImage: frontmatter.heroImage,
    role: frontmatter.role,
    timeline: frontmatter.timeline,
    tools: frontmatter.tools,
    content,
  };
}

/**
 * Get all project items for the index page
 */
export async function getProjectItems(): Promise<ProjectMeta[]> {
  const projectsDir = path.join(contentDirectory, "projects");

  if (!fs.existsSync(projectsDir)) {
    return [];
  }

  const slugs = fs.readdirSync(projectsDir).filter((name) => {
    const itemPath = path.join(projectsDir, name);
    return fs.statSync(itemPath).isDirectory();
  });

  const items: ProjectMeta[] = [];

  for (const slug of slugs) {
    const filePath = path.join(projectsDir, slug, "index.mdx");

    if (!fs.existsSync(filePath)) {
      continue;
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);
    const frontmatter = data as ProjectFrontmatter;

    items.push({
      slug: frontmatter.slug || slug,
      title: frontmatter.title,
      description: frontmatter.description,
      date: frontmatter.date,
      category: frontmatter.category,
      status: frontmatter.status,
      thumbnail: frontmatter.thumbnail,
    });
  }

  // Sort by date, newest first
  return items.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Get a single project by slug
 */
export async function getProjectBySlug(
  slug: string
): Promise<ProjectItem | null> {
  const filePath = path.join(contentDirectory, "projects", slug, "index.mdx");

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const frontmatter = data as ProjectFrontmatter;

  return {
    slug: frontmatter.slug || slug,
    title: frontmatter.title,
    description: frontmatter.description,
    date: frontmatter.date,
    category: frontmatter.category,
    status: frontmatter.status,
    thumbnail: frontmatter.thumbnail,
    technologies: frontmatter.technologies,
    github: frontmatter.github,
    liveUrl: frontmatter.liveUrl,
    content,
  };
}

/**
 * Get adjacent portfolio items for prev/next navigation
 */
export async function getAdjacentPortfolioItems(currentSlug: string): Promise<{
  previous: PortfolioMeta | null;
  next: PortfolioMeta | null;
}> {
  const items = await getPortfolioItems();
  const currentIndex = items.findIndex((item) => item.slug === currentSlug);

  return {
    previous: currentIndex > 0 ? items[currentIndex - 1] : null,
    next: currentIndex < items.length - 1 ? items[currentIndex + 1] : null,
  };
}

/**
 * Get all portfolio slugs for static generation
 */
export async function getAllPortfolioSlugs(): Promise<string[]> {
  const items = await getPortfolioItems();
  return items.map((item) => item.slug);
}

/**
 * Get all project slugs for static generation
 */
export async function getAllProjectSlugs(): Promise<string[]> {
  const items = await getProjectItems();
  return items.map((item) => item.slug);
}

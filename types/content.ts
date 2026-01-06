/**
 * Base metadata shared across content types
 */
export interface ContentMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
}

/**
 * Portfolio item metadata (for index pages)
 */
export interface PortfolioMeta extends ContentMeta {
  category: string;
  company: string;
  thumbnail: string;
  featured?: boolean;
  order?: number;
}

/**
 * Full portfolio item (for detail pages)
 */
export interface PortfolioItem extends PortfolioMeta {
  heroImage?: string;
  role: string;
  timeline: string;
  tools: string[];
  content: string;
}

/**
 * Project (side project) metadata
 */
export interface ProjectMeta extends ContentMeta {
  category: string;
  status: "Active" | "Complete" | "In development" | "Archived";
  thumbnail?: string;
}

/**
 * Full project item
 */
export interface ProjectItem extends ProjectMeta {
  technologies: string[];
  github?: string;
  liveUrl?: string;
  heroImage?: string;
  content: string;
}

/**
 * Navigation item for sidebar
 */
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}

/**
 * Social link for footer/sidebar
 */
export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

/**
 * Frontmatter parsed from MDX files
 */
export interface PortfolioFrontmatter {
  title: string;
  slug: string;
  description: string;
  category: string;
  company: string;
  date: string;
  role: string;
  timeline: string;
  tools: string[];
  featured?: boolean;
  thumbnail: string;
  heroImage?: string;
  order?: number;
  published?: boolean;
}

export interface ProjectFrontmatter {
  title: string;
  slug: string;
  description: string;
  category: string;
  status: "Active" | "Complete" | "In development" | "Archived";
  date: string;
  technologies: string[];
  github?: string;
  liveUrl?: string;
  thumbnail?: string;
  heroImage?: string;
  published?: boolean;
}

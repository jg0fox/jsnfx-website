/**
 * SEO Configuration
 * Centralized site metadata and URL helpers
 */

export const siteConfig = {
  name: "Jason Fox",
  title: "Jason Fox, Content Designer",
  description:
    "Content designer by day, Content Designer by night. Portfolio showcasing UX content design work at Atlassian, Robinhood, Netflix, Chime, and Oracle.",
  url: "https://jsnfx.com",
  locale: "en_US",
  social: {
    linkedin: "https://www.linkedin.com/in/jasongfox/",
    github: "https://github.com/jg0fox",
    medium: "https://medium.com/@jjfoxbox",
  },
} as const;

/**
 * Generate an absolute URL from a path
 */
export function absoluteUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${cleanPath}`;
}

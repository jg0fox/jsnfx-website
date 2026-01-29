import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Sidebar, MobileNav } from "@/components/layout";
import { AdversarialProvider } from "@/components/adversarial";
import { siteConfig } from "@/lib/seo";
import { getPortfolioItems, getProjectItems } from "@/lib/content";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "content designer",
    "UX writer",
    "content strategy",
    "UX content",
    "portfolio",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.title,
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch published items for navigation
  const [portfolioItems, projectItems] = await Promise.all([
    getPortfolioItems(),
    getProjectItems(),
  ]);

  // Transform to navigation format
  const portfolioNavItems = portfolioItems.map((item) => ({
    href: `/portfolio/${item.slug}`,
    label: item.company,
  }));

  const projectNavItems = projectItems.map((item) => ({
    href: `/projects/${item.slug}`,
    label: item.title,
  }));

  return (
    <html lang="en" className={`${fraunces.variable} ${sourceSans.variable}`}>
      {/*
        ╭──────────────────────────────────────────────────────────╮
        │                                                          │
        │         Made with care and Claude in California.         │
        │                                                          │
        ╰──────────────────────────────────────────────────────────╯
      */}
      <body className="antialiased min-h-screen">
        <AdversarialProvider>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>

          {/* Desktop Sidebar */}
          <Sidebar
            portfolioItems={portfolioNavItems}
            projectItems={projectNavItems}
          />

          {/* Mobile Navigation */}
          <MobileNav
            portfolioItems={portfolioNavItems}
            projectItems={projectNavItems}
          />

          {/* Main Content Area */}
          <main
            id="main-content"
            className="lg:ml-72 min-h-screen pt-16 lg:pt-0"
          >
            <div className="px-4 py-6 md:px-6 md:py-8 lg:px-10 lg:py-12 max-w-5xl">
              {children}
            </div>

            {/* Footer */}
            <footer className="px-4 pb-8 md:px-6 lg:px-10 max-w-5xl">
              <p className="text-[11px] text-text-muted/60 text-center lg:text-left">
                Made with care and Claude in California.
              </p>
            </footer>
          </main>
        </AdversarialProvider>
        <Analytics />
      </body>
    </html>
  );
}

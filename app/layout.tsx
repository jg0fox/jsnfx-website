import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { Sidebar, MobileNav } from "@/components/layout";
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
  title: {
    default: "Jason Fox - Content Designer",
    template: "%s | Jason Fox",
  },
  description:
    "Senior content designer with 10+ years of experience. Portfolio showcasing UX content design work at Atlassian, Robinhood, Netflix, Chime, and Oracle.",
  keywords: [
    "content designer",
    "UX writer",
    "content strategy",
    "UX content",
    "portfolio",
  ],
  authors: [{ name: "Jason Fox" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Jason Fox - Content Designer",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${sourceSans.variable}`}>
      <body className="antialiased min-h-screen">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Navigation */}
        <MobileNav />

        {/* Main Content Area */}
        <main
          id="main-content"
          className="lg:ml-72 min-h-screen pt-16 lg:pt-0"
        >
          <div className="px-4 py-6 md:px-6 md:py-8 lg:px-10 lg:py-12 max-w-5xl">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}

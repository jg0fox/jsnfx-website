"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Play, Wrench, BookOpen, X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

// Video data
const videos = [
  { id: 808762357, title: "Designing a celebratory tone", description: "Content's role in designing for celebration, delight, and pleasure.", duration: 177, thumbnail: "https://i.vimeocdn.com/video/1633707496-b1875f0d55b1805302042e8e2e4c3a369c289d5d6127f07ebfb213e558881167-d_640x360" },
  { id: 684277786, title: "Jason Fox at UX New Zealand: Behavioral Content Design", description: "Conference talk on behavioral content design principles.", duration: 1724, thumbnail: "https://i.vimeocdn.com/video/1386992952-60875e30fc3cbfafc0090ae268a3cab514432485d7ef129e50ffc56955d6d289-d_640x360" },
  { id: 693653232, title: "The elevator chat workshop", description: "Simplify language, clarify concepts, and win over a few stakeholders in the process.", duration: 88, thumbnail: "https://i.vimeocdn.com/video/1403661825-6ef9c4d4141d6184fee82172e2a4e1e6430fbad60d7d3169ee694607256cd8ee-d_640x360" },
  { id: 698283387, title: "Accessible content design for emojis", description: "Explore the topic of accessible content design for emojis.", duration: 70, thumbnail: "https://i.vimeocdn.com/video/1412095563-e9ddda3a39c0b4d4d6e4d7c485f0fe26873339acf6881607ed806890099af472-d_640x360" },
  { id: 700539388, title: "Influencing perceived value with content design", description: "What's perceived value and how does it relate to content design?", duration: 107, thumbnail: "https://i.vimeocdn.com/video/1416103259-763d5a385b33c83a9d34e27f9bb57f490575978a923d42a68d94365693d3bce6-d_640x360" },
  { id: 703509565, title: "What's growth content design?", description: "Learn about growth content design from someone who has spent years as a growth content designer.", duration: 105, thumbnail: "https://i.vimeocdn.com/video/1421028931-7a870204c1b8b2e66e632ed834b72e191db4da5c12a86c59590e1ff579ce5810-d_640x360" },
  { id: 729967797, title: "Finding rhythm in your tone of voice", description: "Learn to modulate tone of voice through rhythm!", duration: 172, thumbnail: "https://i.vimeocdn.com/video/1469113859-99bcaf7752c088586b1a4f163ea37d9b6d95a1c8da75c55fa106e0aec3795464-d_640x360" },
  { id: 735507600, title: "Bring some swing to your strings with assonance and consonance", description: "Techniques for adding rhythm and musicality to your writing.", duration: 140, thumbnail: "https://i.vimeocdn.com/video/1480051301-2761d10243c4666d10a70196ee8b5e973cf5ff04453ff8db9a05571dc173464f-d_640x360" },
  { id: 748837754, title: "Some content documentation in Figma", description: "A look at content documentation techniques in Figma.", duration: 146, thumbnail: "https://i.vimeocdn.com/video/1505957875-78314231fdd4e0b2e2c7148cb505a6197190c2b06d56b3dd6dd1f5aedbffb335-d_640x360" },
  { id: 681944704, title: "The Glengarry Bob Ross effect of content design", description: "Learn about the Glengarry Bob Ross effect of content design.", duration: 51, thumbnail: "https://i.vimeocdn.com/video/1382193769-a8a3ffd2183326aeff4a123c638263483bb18cd9240243651e42f0e66273181d-d_640x360" },
  { id: 711284172, title: "People don't read", description: "A quick dive into an annoying argument.", duration: 135, thumbnail: "https://i.vimeocdn.com/video/1434360936-7d6a49bd071985bf2bc4a9a72c50dcf2b8173e4670c1a24082ee670f151b092f-d_640x360" },
  { id: 718772342, title: "Alternatives to a style guide", description: "If you've read your company's voice and tone style guide, chances are you wrote it. Here are some alternatives.", duration: 160, thumbnail: "https://i.vimeocdn.com/video/1448029349-4a16d1de4a978d7d9fcacdd37d15aec4c7768dd605dadff13c628148ec4b58f0-d_640x360" },
  { id: 754803902, title: "Unburden the words", description: "Techniques for simplifying and clarifying content.", duration: 132, thumbnail: "https://i.vimeocdn.com/video/1516524179-c4981836852cbbb30117e91cea9a58de9ee06d8a5c267dba7dbcf4f38ef5abf6-d_640x360" },
  { id: 748550436, title: "A content designer's guide to the apocalypse", description: "A longer exploration of content design concepts.", duration: 300, thumbnail: "https://i.vimeocdn.com/video/1505415858-e318275a2416256e72d125fac4ad53fd16caaa478c7010cb9162ea8c4b056d72-d_640x360" },
  { id: 726340175, title: "What if Figma had a content design mode?", description: "Imagining content design features in Figma.", duration: 68, thumbnail: "https://i.vimeocdn.com/video/1462149411-8848cb0b14aeb4acda5bffa5fdb8b949a4c560581115cd0a2a3a9f1c472b9e1b-d_640x360" },
  { id: 705424424, title: "Making a content matrix in Figma", description: "Learn to make a content matrix in Figma.", duration: 83, thumbnail: "https://i.vimeocdn.com/video/1424293332-e835a1e8020bda7cd441f768680f9314f67a24f1a5d81decaf97530c1bb3484a-d_640x360" },
  { id: 681945980, title: "Content variants in Figma", description: "Learn to use content variants in Figma.", duration: 90, thumbnail: "https://i.vimeocdn.com/video/1382187290-609a93f8799bc5303ef1e58b64be78bf420d48377e11bc26957fa6cfb4fdd5cb-d_640x360" },
  { id: 693653289, title: "Figma basics for content designers", description: "Figma and content design is happiness. Learn the basics and get in there!", duration: 72, thumbnail: "https://i.vimeocdn.com/video/1403661891-04f17225dca399c96c1bf5a0dd735e095f9fb965f3e9526049e04d2d113f9548-d_640x360" }
];

// Tool data
const tools = [
  { title: "Content office hours notepad", description: "Keep track of your office hour notes where they matter most.", url: "https://www.figma.com/community/file/1296567366913101561/content-office-hours-notepad", source: "Figma Community", type: "figma" },
  { title: "Content design decision log", description: "Track decisions and rationale, you won't regret it.", url: "https://www.figma.com/community/file/1280996171891229192/Content-decision-log-component", source: "Figma Community", type: "figma" },
  { title: "Tone of voice audit and modulation", description: "Tone of voice exercises for end-to-end digital product experiences.", url: "https://www.figma.com/community/file/1261151532179355495", source: "Figma Community", type: "figma" },
  { title: "Content heuristics scorecard", description: "A content scorecard backed by evidence (And Torrey Podmajersky)", url: "https://jasinfox.notion.site/jasinfox/A-content-heuristics-scorecard-27769d770828404baed4f85474045c98", source: "Notion", type: "notion" },
  { title: "Content variants", description: "Manage various tones of voice, system states, or other dynamic content with this component set framework.", url: "https://www.figma.com/community/file/1084535061779757305", source: "Figma Community", type: "figma" },
  { title: "Comprehension test prototype", description: "Use this Figma file to create a prototype that you can use to administer unmoderated content comprehension tests.", url: "https://www.figma.com/community/file/1113834623558316913", source: "Figma Community", type: "figma" },
  { title: "Content options prototype", description: "Create a prototype that makes it easy to share your content work.", url: "https://www.figma.com/community/file/1084536824233491706", source: "Figma Community", type: "figma" },
  { title: "Text volume plugin", description: "Measure the volume of text in a Figma frame.", url: "https://www.figma.com/community/plugin/1040340750434492789/Text-Volume", source: "Figma Plugin", type: "plugin" },
  { title: "The elevator chat", description: "A content design workshop to simplify, consolidate, and jumpstart content.", url: "https://www.figma.com/community/file/1084537719022592251", source: "Figma Community", type: "figma" },
];

// Article data
const articles = [
  { title: "Accessible content design for emojis", description: "Emojis are fun, but they're not always accessible for all users. Guidelines and considerations for content designers.", url: "https://uxcontent.com/accessible-content-design-for-emojis/", source: "UX Content Collective", tag: "Accessibility", image: null },
  { title: "How we built a text measurement tool at Chime", description: "Open any app on your phone. In one sentence, describe how much text you see.", url: "https://medium.com/life-at-chime/how-we-built-a-text-measurement-tool-at-chime-23189785f285", source: "Medium - Life at Chime", tag: "Tools", image: "https://miro.medium.com/v2/resize:fit:2000/format:webp/1*_hLS5LE5mYVA21WOOqJnJQ.png" },
  { title: "The content design interview-getter", description: "Use this tool when you need to land a dream job interview", url: "https://bootcamp.uxdesign.cc/the-content-design-interview-getter-3ba14b141507", source: "UX Design Bootcamp", tag: "Job search", image: null },
  { title: "Getting started with growth content design", description: "Core principles, frameworks, and considerations to act on growth content opportunities.", url: "https://uxwriterscollective.com/getting-started-with-growth-content-design/", source: "UX Content Collective", tag: "Growth", image: null },
  { title: "Error state stasis: a quick visit to the syntax of an error message", description: "If your users are Tweeting at you about a disappointing error message experience, consider it an opportunity", url: "https://uxdesign.cc/error-state-stasis-a-quick-visit-to-the-syntax-of-an-error-message-53791cd08703", source: "UX Collective", tag: "UX writing", image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*xZlzjnNGRorReOSq3H_-Pg.png" },
  { title: "The microcopyist: cancellation, confirmation, conflagration", description: "Writing microcopy for destructive actions", url: "https://uxdesign.cc/the-microcopyist-cancellation-confirmation-conflagration-8a6047a4cf9", source: "UX Collective", tag: "UX writing", image: "https://miro.medium.com/v2/resize:fit:2000/format:webp/1*dAsBzxNEkq0GWFGYaXbiqA.png" },
  { title: "The 197,000 Year-Old Writing Trick", description: "Learn to create compelling copy without writing at all", url: "https://medium.springboard.com/the-197-000-year-old-trick-to-writing-4fd31cc333f6", source: "Springboard", tag: "Writing", image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*v-e8EchVAlZWkB4AM6QTpw.png" },
  { title: "When copy loves itself too much", description: "I'm not a narcissist, but sometimes my copy is.", url: "https://uxdesign.cc/when-copy-loves-itself-too-much-a2b79238312f", source: "UX Collective", tag: "Writing", image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Snq8n1pG093HV-k_Z5yKfA.png" },
  { title: "The Glengarry Bob Ross UX effect", description: "Microcopy's role in UX upsells", url: "https://uxdesign.cc/the-glengarry-bob-ross-effect-3f1fed2d2084", source: "UX Collective", tag: "Growth", image: "https://miro.medium.com/v2/resize:fit:924/format:webp/1*l7he8s-CJ9Ip9cVZ9YEAeA.gif" },
];

type Tab = "videos" | "tools" | "articles";

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Figma icon
function FigmaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
      <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
      <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" />
      <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
      <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
    </svg>
  );
}

// Notion icon
function NotionIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M4 4a2 2 0 0 1 2-2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

// Plugin icon
function PluginIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
    </svg>
  );
}

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("videos");
  const [videosShown, setVideosShown] = useState(6);
  const [videoModalId, setVideoModalId] = useState<number | null>(null);

  // Handle URL hash to set active tab
  useEffect(() => {
    let lastHash = "";

    const checkHash = () => {
      const hash = window.location.hash.slice(1);
      if (hash !== lastHash && ["videos", "tools", "articles"].includes(hash)) {
        lastHash = hash;
        setActiveTab(hash as Tab);
      }
    };

    // Check on mount
    checkHash();

    // Listen for hash changes (direct hash changes)
    window.addEventListener("hashchange", checkHash);

    // Listen for popstate (browser back/forward)
    window.addEventListener("popstate", checkHash);

    // Poll for hash changes as Next.js client navigation doesn't trigger hashchange
    const interval = setInterval(checkHash, 50);

    return () => {
      window.removeEventListener("hashchange", checkHash);
      window.removeEventListener("popstate", checkHash);
      clearInterval(interval);
    };
  }, []);

  // Close modal on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setVideoModalId(null);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (videoModalId !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [videoModalId]);

  const handleLoadMore = useCallback(() => {
    setVideosShown(videos.length);
  }, []);

  const videosToShow = videos.slice(0, videosShown);

  return (
    <>
      {/* Page Header */}
      <header className="mb-8 md:mb-12">
        <h1 className="text-3xl lg:text-5xl font-display font-bold text-text-primary">
          Resources
        </h1>
        <p className="mt-3 text-lg text-text-secondary max-w-2xl">
          A collection of videos, tools, and articles on content design, UX writing, and the craft of language in digital products.
        </p>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b-2 border-soft-linen-dark">
        <button
          onClick={() => setActiveTab("videos")}
          className={cn(
            "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
            "border-b-2 -mb-[2px]",
            activeTab === "videos"
              ? "text-palm-leaf-3 border-palm-leaf"
              : "text-text-secondary border-transparent hover:text-text-primary"
          )}
        >
          <Play className="w-4 h-4" />
          Videos
          <span
            className={cn(
              "px-2 py-0.5 text-xs rounded-full",
              activeTab === "videos"
                ? "bg-palm-leaf text-white"
                : "bg-soft-linen-dark text-text-muted"
            )}
          >
            {videos.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("tools")}
          className={cn(
            "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
            "border-b-2 -mb-[2px]",
            activeTab === "tools"
              ? "text-palm-leaf-3 border-palm-leaf"
              : "text-text-secondary border-transparent hover:text-text-primary"
          )}
        >
          <Wrench className="w-4 h-4" />
          Tools
          <span
            className={cn(
              "px-2 py-0.5 text-xs rounded-full",
              activeTab === "tools"
                ? "bg-palm-leaf text-white"
                : "bg-soft-linen-dark text-text-muted"
            )}
          >
            {tools.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("articles")}
          className={cn(
            "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
            "border-b-2 -mb-[2px]",
            activeTab === "articles"
              ? "text-palm-leaf-3 border-palm-leaf"
              : "text-text-secondary border-transparent hover:text-text-primary"
          )}
        >
          <BookOpen className="w-4 h-4" />
          Articles
          <span
            className={cn(
              "px-2 py-0.5 text-xs rounded-full",
              activeTab === "articles"
                ? "bg-palm-leaf text-white"
                : "bg-soft-linen-dark text-text-muted"
            )}
          >
            {articles.length}
          </span>
        </button>
      </div>

      {/* Videos Tab */}
      {activeTab === "videos" && (
        <div>
          <p className="text-text-secondary mb-6 max-w-xl">
            Short-form video content exploring content design concepts, tools, and techniques. Most are under 3 minutes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videosToShow.map((video) => (
              <button
                key={video.id}
                onClick={() => setVideoModalId(video.id)}
                className={cn(
                  "group text-left rounded-lg overflow-hidden",
                  "bg-soft-linen-light border border-soft-linen-dark",
                  "transition-all duration-200",
                  "hover:-translate-y-1 hover:shadow-lg"
                )}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-soft-linen-dark overflow-hidden">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized
                  />
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-black/70 rounded-full flex items-center justify-center group-hover:bg-black/80 transition-colors">
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                  {/* Duration */}
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                    {formatDuration(video.duration)}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-text-primary line-clamp-2 group-hover:text-palm-leaf transition-colors">
                    {video.title}
                  </h3>
                  <p className="mt-1 text-sm text-text-muted line-clamp-2">
                    {video.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Load more button */}
          {videosShown < videos.length && (
            <div className="text-center mt-8">
              <button
                onClick={handleLoadMore}
                className={cn(
                  "px-6 py-3 rounded-lg font-medium",
                  "bg-soft-linen-light border-2 border-soft-linen-dark",
                  "text-text-secondary hover:text-palm-leaf-3 hover:border-palm-leaf",
                  "transition-colors"
                )}
              >
                Load more videos ({videos.length - videosShown} remaining)
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tools Tab */}
      {activeTab === "tools" && (
        <div>
          <p className="text-text-secondary mb-6 max-w-xl">
            Figma community files and resources to help content designers work more effectively.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tools.map((tool) => (
              <a
                key={tool.url}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-start gap-4 p-5 rounded-lg",
                  "bg-soft-linen-light border border-soft-linen-dark",
                  "transition-all duration-200",
                  "hover:border-palm-leaf hover:-translate-y-0.5"
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                    tool.type === "plugin" ? "bg-palm-leaf" : "bg-soft-linen"
                  )}
                >
                  {tool.type === "figma" && (
                    <FigmaIcon className={cn("w-5 h-5", "text-palm-leaf")} />
                  )}
                  {tool.type === "notion" && (
                    <NotionIcon className="w-5 h-5 text-palm-leaf" />
                  )}
                  {tool.type === "plugin" && (
                    <PluginIcon className="w-5 h-5 text-white" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text-primary">
                    {tool.title}
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    {tool.description}
                  </p>
                  <p className="mt-2 text-xs text-text-muted">{tool.source}</p>
                </div>

                <ExternalLink className="w-4 h-4 text-text-muted flex-shrink-0 mt-1" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Articles Tab */}
      {activeTab === "articles" && (
        <div>
          <p className="text-text-secondary mb-6 max-w-xl">
            Long-form articles on UX writing, content design methodology, and the craft of language in products.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {articles.map((article) => (
              <a
                key={article.url}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group rounded-lg overflow-hidden",
                  "bg-soft-linen-light border border-soft-linen-dark",
                  "transition-all duration-200",
                  "hover:-translate-y-1 hover:shadow-lg"
                )}
              >
                {/* Image */}
                <div className="aspect-video bg-gradient-to-br from-palm-leaf to-palm-leaf-2 flex items-center justify-center overflow-hidden">
                  {article.image ? (
                    <Image
                      src={article.image}
                      alt={article.title}
                      width={640}
                      height={360}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <BookOpen className="w-12 h-12 text-white opacity-50" />
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <span className="inline-block bg-soft-linen text-text-muted text-xs font-medium px-2 py-1 rounded mb-3">
                    {article.tag}
                  </span>
                  <h3 className="font-display font-bold text-lg text-text-primary group-hover:text-palm-leaf transition-colors">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary line-clamp-2">
                    {article.description}
                  </p>
                  <p className="mt-3 text-xs text-text-muted">{article.source}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Video Modal */}
      {videoModalId !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 md:p-8"
          onClick={() => setVideoModalId(null)}
        >
          <button
            onClick={() => setVideoModalId(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            aria-label="Close video"
          >
            <X className="w-8 h-8" />
          </button>

          <div
            className="w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://player.vimeo.com/video/${videoModalId}?autoplay=1`}
              className="w-full h-full rounded-lg"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}

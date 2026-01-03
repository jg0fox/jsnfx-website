"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  User,
  Briefcase,
  FolderOpen,
  PenTool,
  Linkedin,
  Github,
  Mail,
  ChevronDown,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Medium icon (not available in Lucide)
function MediumIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
    </svg>
  );
}

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [emailCopied, setEmailCopied] = useState(false);
  const pathname = usePathname();

  const handleEmailCopy = async () => {
    try {
      await navigator.clipboard.writeText("jasongfox@gmail.com");
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const navigation = [
    {
      href: "/",
      label: "About me",
      icon: <User className="w-5 h-5" />,
    },
    {
      href: "/portfolio",
      label: "Portfolio",
      icon: <Briefcase className="w-5 h-5" />,
      children: [
        { href: "/portfolio/atlassian", label: "Atlassian" },
        { href: "/portfolio/chime", label: "Chime" },
        { href: "/portfolio/robinhood", label: "Robinhood" },
        { href: "/portfolio/netflix", label: "Netflix" },
        { href: "/portfolio/oracle", label: "Oracle" },
      ],
    },
    {
      href: "/projects",
      label: "Side projects",
      icon: <FolderOpen className="w-5 h-5" />,
      children: [
        { href: "/projects/jsnfx-website", label: "jsnfx.com" },
      ],
    },
    {
      href: "/writing",
      label: "Creative writing",
      icon: <PenTool className="w-5 h-5" />,
    },
  ];

  const socialLinks = [
    {
      href: "https://www.linkedin.com/in/jasongfox/",
      icon: <Linkedin className="w-5 h-5" />,
      label: "LinkedIn",
    },
    {
      href: "https://github.com/jg0fox",
      icon: <Github className="w-5 h-5" />,
      label: "GitHub",
    },
    {
      href: "https://medium.com/@jjfoxbox",
      icon: <MediumIcon className="w-5 h-5" />,
      label: "Medium",
    },
  ];

  return (
    <>
      {/* Mobile Header Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-soft-linen-light border-b border-soft-linen-dark">
        <div className="flex items-center justify-between h-full px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src="/logo.svg"
                alt="JSNFX Logo"
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </div>
            <span className="font-display font-bold text-text-primary">
              Jason Fox
            </span>
          </Link>

          <button
            onClick={() => setIsOpen(true)}
            className="p-3 -mr-2 text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-text-primary/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />

        {/* Menu Panel */}
        <div
          className={cn(
            "absolute top-0 right-0 h-full w-full max-w-sm bg-soft-linen-light shadow-xl",
            "transform transition-transform duration-300 ease-out",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-soft-linen-dark">
            <span className="font-display font-bold text-text-primary">
              Menu
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-3 -mr-2 text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                const isExpanded = expandedItem === item.href;
                const hasChildren = item.children && item.children.length > 0;

                const toggleExpand = (e: React.MouseEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setExpandedItem(isExpanded ? null : item.href);
                };

                return (
                  <div key={item.href}>
                    <div
                      className={cn(
                        "flex items-center rounded-lg transition-colors",
                        "hover:bg-soft-linen-dark/50",
                        isActive && "bg-soft-linen-dark font-medium"
                      )}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 flex-1 px-4 py-3"
                      >
                        <span className="text-text-secondary">{item.icon}</span>
                        <span className="text-text-primary">{item.label}</span>
                      </Link>
                      {hasChildren && (
                        <button
                          onClick={toggleExpand}
                          className="p-3 text-text-muted hover:text-text-secondary transition-colors"
                          aria-label={isExpanded ? "Collapse menu" : "Expand menu"}
                        >
                          <ChevronDown
                            className={cn(
                              "w-5 h-5 transition-transform duration-200",
                              isExpanded && "rotate-180"
                            )}
                          />
                        </button>
                      )}
                    </div>
                    {hasChildren && isExpanded && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.children?.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "block px-4 py-3 rounded-lg transition-colors",
                              "text-text-secondary hover:text-text-primary hover:bg-soft-linen-dark/50",
                              pathname === child.href &&
                                "text-palm-leaf-3 font-medium"
                            )}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Social Links */}
            <div className="mt-8 pt-6 border-t border-soft-linen-dark">
              <p className="px-4 mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">
                Connect
              </p>
              <div className="flex gap-2 px-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-center justify-center w-12 h-12 rounded-lg",
                      "bg-soft-linen text-text-secondary",
                      "hover:bg-palm-leaf hover:text-white transition-colors"
                    )}
                    aria-label={link.label}
                  >
                    {link.icon}
                  </a>
                ))}
                <button
                  onClick={handleEmailCopy}
                  className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-lg",
                    "bg-soft-linen text-text-secondary",
                    "hover:bg-palm-leaf hover:text-white transition-colors"
                  )}
                  aria-label="Copy email address"
                >
                  {emailCopied ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Mail className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

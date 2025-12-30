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
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const pathname = usePathname();

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
      href: "https://www.linkedin.com/in/jasonfox/",
      icon: <Linkedin className="w-5 h-5" />,
      label: "LinkedIn",
    },
    {
      href: "https://github.com/jsnfx",
      icon: <Github className="w-5 h-5" />,
      label: "GitHub",
    },
    {
      href: "mailto:jason@jsnfx.com",
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
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

                const handleItemClick = (e: React.MouseEvent) => {
                  if (hasChildren) {
                    e.preventDefault();
                    setExpandedItem(isExpanded ? null : item.href);
                  }
                };

                return (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      onClick={handleItemClick}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                        "hover:bg-soft-linen-dark/50",
                        isActive && "bg-soft-linen-dark font-medium"
                      )}
                    >
                      <span className="text-text-secondary">{item.icon}</span>
                      <span className="flex-1 text-text-primary">{item.label}</span>
                      {hasChildren && (
                        <ChevronDown
                          className={cn(
                            "w-5 h-5 text-text-muted transition-transform duration-200",
                            isExpanded && "rotate-180"
                          )}
                        />
                      )}
                    </Link>
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
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  User,
  Briefcase,
  FolderOpen,
  PenTool,
  Linkedin,
  Github,
  Mail,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  children?: { href: string; label: string }[];
}

function NavItem({ href, label, icon, isActive, children }: NavItemProps) {
  const [isExpanded, setIsExpanded] = useState(isActive);
  const pathname = usePathname();

  const hasChildren = children && children.length > 0;
  const isChildActive = children?.some((child) =>
    pathname.startsWith(child.href)
  );

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div>
      <Link
        href={href}
        onClick={handleClick}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200",
          "hover:bg-soft-linen-dark/50",
          (isActive || isChildActive) && "bg-soft-linen-dark/70 font-medium",
          (isActive || isChildActive) &&
            "border-l-3 border-palm-leaf -ml-[3px] pl-[calc(1rem+3px)]"
        )}
      >
        <span className="text-text-secondary">{icon}</span>
        <span className="flex-1 text-text-primary">{label}</span>
        {hasChildren && (
          <ChevronDown
            className={cn(
              "w-4 h-4 text-text-muted transition-transform duration-200",
              isExpanded && "rotate-180"
            )}
          />
        )}
      </Link>
      {hasChildren && isExpanded && (
        <div className="ml-8 mt-1 space-y-1">
          {children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={cn(
                "block px-4 py-2 text-sm rounded-lg transition-colors duration-200",
                "text-text-secondary hover:text-text-primary hover:bg-soft-linen-dark/50",
                pathname === child.href && "text-palm-leaf-3 font-medium"
              )}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

function SocialLink({ href, icon, label }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors duration-200",
        "text-text-secondary hover:text-text-primary hover:bg-soft-linen-dark/50"
      )}
      aria-label={label}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}

export function Sidebar() {
  const pathname = usePathname();

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
      icon: <Linkedin className="w-4 h-4" />,
      label: "LinkedIn",
    },
    {
      href: "https://github.com/jsnfx",
      icon: <Github className="w-4 h-4" />,
      label: "GitHub",
    },
    {
      href: "mailto:jason@jsnfx.com",
      icon: <Mail className="w-4 h-4" />,
      label: "Email",
    },
  ];

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 flex-col bg-soft-linen-light border-r border-soft-linen-dark">
      {/* Logo and Name */}
      <div className="p-6 border-b border-soft-linen-dark">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative w-16 h-16 flex-shrink-0">
            <Image
              src="/logo.svg"
              alt="JSNFX Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-text-primary group-hover:text-palm-leaf transition-colors">
              Jason Fox
            </h1>
            <p className="text-sm text-text-muted">Content Designer</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            isActive={
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href)
            }
            children={item.children}
          />
        ))}
      </nav>

      {/* Connect Section */}
      <div className="p-4 border-t border-soft-linen-dark">
        <p className="px-3 mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">
          Connect
        </p>
        <div className="space-y-1">
          {socialLinks.map((link) => (
            <SocialLink
              key={link.href}
              href={link.href}
              icon={link.icon}
              label={link.label}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}

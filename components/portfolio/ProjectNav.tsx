import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectNavItem {
  slug: string;
  title: string;
  company?: string;
}

interface ProjectNavProps {
  previous?: ProjectNavItem | null;
  next?: ProjectNavItem | null;
  className?: string;
}

export function ProjectNav({ previous, next, className }: ProjectNavProps) {
  if (!previous && !next) return null;

  return (
    <nav
      aria-label="Project navigation"
      className={cn(
        "flex flex-col sm:flex-row gap-4 pt-8 mt-8 border-t border-soft-linen-dark",
        className
      )}
    >
      {previous ? (
        <Link
          href={`/portfolio/${previous.slug}`}
          className={cn(
            "flex-1 group flex items-center gap-3 p-4 rounded-lg",
            "bg-soft-linen-light border border-soft-linen-dark",
            "transition-all duration-200",
            "hover:border-palm-leaf hover:bg-palm-leaf/5"
          )}
        >
          <ChevronLeft className="w-5 h-5 text-text-muted group-hover:text-palm-leaf transition-colors" />
          <div className="min-w-0">
            <span className="block text-xs text-text-muted">Previous</span>
            <span className="block font-medium text-text-primary truncate group-hover:text-palm-leaf transition-colors">
              {previous.title}
            </span>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {next ? (
        <Link
          href={`/portfolio/${next.slug}`}
          className={cn(
            "flex-1 group flex items-center justify-end gap-3 p-4 rounded-lg text-right",
            "bg-soft-linen-light border border-soft-linen-dark",
            "transition-all duration-200",
            "hover:border-palm-leaf hover:bg-palm-leaf/5"
          )}
        >
          <div className="min-w-0">
            <span className="block text-xs text-text-muted">Next</span>
            <span className="block font-medium text-text-primary truncate group-hover:text-palm-leaf transition-colors">
              {next.title}
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-palm-leaf transition-colors" />
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}

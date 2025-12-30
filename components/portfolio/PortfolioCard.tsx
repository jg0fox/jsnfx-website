import Image from "next/image";
import Link from "next/link";
import { Tag } from "@/components/ui";
import { cn } from "@/lib/utils";

interface PortfolioCardProps {
  slug: string;
  title: string;
  description: string;
  category: string;
  company: string;
  thumbnail: string;
  className?: string;
}

export function PortfolioCard({
  slug,
  title,
  description,
  category,
  company,
  thumbnail,
  className,
}: PortfolioCardProps) {
  return (
    <Link
      href={`/portfolio/${slug}`}
      className={cn(
        "group block rounded-lg overflow-hidden",
        "bg-soft-linen-light border border-soft-linen-dark",
        "transition-all duration-200",
        "hover:-translate-y-1 hover:shadow-lg",
        className
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-soft-linen overflow-hidden">
        <Image
          src={thumbnail}
          alt={`${title} thumbnail`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Category overlay */}
        <div className="absolute top-3 left-3">
          <Tag size="sm">{category}</Tag>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-text-muted mb-1">{company}</p>
        <h3 className="font-display font-bold text-lg text-text-primary group-hover:text-palm-leaf transition-colors">
          {title}
        </h3>
        <p className="mt-2 text-sm text-text-secondary line-clamp-2">
          {description}
        </p>
      </div>
    </Link>
  );
}

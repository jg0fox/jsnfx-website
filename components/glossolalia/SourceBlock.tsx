"use client";

import { useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Source } from "@/types/glossolalia";

interface SourceBlockProps {
  source: Source;
}

export function SourceBlock({ source }: SourceBlockProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-soft-linen-dark rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 md:p-5 hover:bg-soft-linen-light/50 transition-colors duration-200"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block text-xs font-mono font-medium text-palm-leaf-3 bg-palm-leaf/10 px-2 py-0.5 rounded-full shrink-0">
                {source.id}
              </span>
              <span className="text-xs text-text-muted">{source.year}</span>
            </div>
            <h4 className="font-display font-bold text-sm text-text-primary leading-snug">
              {source.title}
            </h4>
            <p className="text-xs text-text-muted mt-1">
              {source.authors} — <em>{source.journal}</em>
            </p>
          </div>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-text-muted shrink-0 transition-transform duration-200 mt-1",
              expanded && "rotate-180"
            )}
          />
        </div>
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          expanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 pb-4 md:px-5 md:pb-5 space-y-3">
          <p className="text-sm text-text-secondary leading-relaxed">
            {source.summary}
          </p>

          <blockquote className="border-l-4 border-palm-leaf bg-palm-leaf/5 p-3 rounded-r-lg">
            <p className="text-sm text-text-secondary leading-relaxed">
              {source.whyItMatters}
            </p>
          </blockquote>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
            <p className="text-xs text-text-muted italic">
              {source.experimentRelevance}
            </p>
            {source.doiUrl && (
              <a
                href={source.doiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-palm-leaf-3 hover:text-bronze-spice transition-colors shrink-0"
              >
                Source <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

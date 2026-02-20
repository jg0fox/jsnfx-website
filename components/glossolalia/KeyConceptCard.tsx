"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KeyConceptCardProps {
  term: string;
  description: string;
}

export function KeyConceptCard({ term, description }: KeyConceptCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className="w-full text-left bg-soft-linen-light border border-soft-linen-dark rounded-lg p-4 transition-colors duration-200 hover:border-palm-leaf/40"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-display font-bold text-text-primary text-sm">
          {term}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-text-muted shrink-0 transition-transform duration-200 mt-0.5",
            expanded && "rotate-180"
          )}
        />
      </div>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          expanded ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
        )}
      >
        <p className="text-sm text-text-secondary leading-relaxed">
          {description}
        </p>
      </div>
    </button>
  );
}

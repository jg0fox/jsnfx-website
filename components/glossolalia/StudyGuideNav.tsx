"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tier } from "@/types/glossolalia";
import { ProgressBar } from "./ProgressBar";

interface StudyGuideNavProps {
  tiers: Tier[];
  activePhenomenonId: string | null;
  progress: number;
  onNavigate: (id: string) => void;
  onJumpToQuiz: (tierId: string) => void;
}

export function StudyGuideNav({
  tiers,
  activePhenomenonId,
  progress,
  onNavigate,
  onJumpToQuiz,
}: StudyGuideNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const activePhenomenon = tiers
    .flatMap((t) => t.phenomena)
    .find((p) => p.id === activePhenomenonId);

  const handleNavigate = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  const navContent = (
    <nav className="space-y-4">
      {tiers.map((tier) => (
        <div key={tier.id}>
          <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
            {tier.id === "tier1" ? "Tier 1" : "Tier 2"}
          </p>
          <ul className="space-y-0.5">
            {tier.phenomena.map((phenomenon) => (
              <li key={phenomenon.id}>
                <button
                  onClick={() => handleNavigate(phenomenon.id)}
                  className={cn(
                    "w-full text-left text-sm py-1.5 px-2 rounded transition-colors",
                    activePhenomenonId === phenomenon.id
                      ? "text-palm-leaf-3 font-medium bg-palm-leaf/5"
                      : "text-text-secondary hover:text-text-primary hover:bg-soft-linen-dark/30"
                  )}
                >
                  {phenomenon.number}. {phenomenon.title}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => onJumpToQuiz(tier.id)}
                className="w-full text-left text-xs py-1.5 px-2 text-palm-leaf-3 hover:text-bronze-spice transition-colors font-medium"
              >
                Quiz &darr;
              </button>
            </li>
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar — visible at xl+ */}
      <aside className="hidden xl:block w-56 shrink-0">
        <div className="sticky top-6 space-y-4">
          <ProgressBar progress={progress} label="Reading progress" />
          {navContent}
        </div>
      </aside>

      {/* Mobile/tablet dropdown — visible below xl */}
      <div className="xl:hidden sticky top-16 lg:top-0 z-10 bg-soft-linen/95 backdrop-blur-sm border-b border-soft-linen-dark -mx-4 px-4 md:-mx-6 md:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1 mr-3">
            <ProgressBar progress={progress} />
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors shrink-0 py-1 min-h-[44px]"
          >
            <span className="truncate max-w-[200px]">
              {activePhenomenon
                ? `${activePhenomenon.number}. ${activePhenomenon.title}`
                : "Navigate"}
            </span>
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform duration-200",
                mobileOpen && "rotate-180"
              )}
            />
          </button>
        </div>

        <div
          className={cn(
            "overflow-hidden transition-all duration-200",
            mobileOpen ? "max-h-[500px] opacity-100 mt-3" : "max-h-0 opacity-0"
          )}
        >
          {navContent}
        </div>
      </div>
    </>
  );
}

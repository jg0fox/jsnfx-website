import type { Tier } from "@/types/glossolalia";

interface TierHeaderProps {
  tier: Tier;
  onJumpToQuiz: () => void;
}

export function TierHeader({ tier, onJumpToQuiz }: TierHeaderProps) {
  return (
    <div className="mb-6 md:mb-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-3 mb-3 md:mb-4">
        <h2 className="text-xl md:text-3xl font-display font-bold text-text-primary">
          {tier.title}
        </h2>
        <button
          onClick={onJumpToQuiz}
          className="text-xs md:text-sm text-palm-leaf-3 hover:text-bronze-spice transition-colors font-medium shrink-0"
        >
          Jump to quiz &darr;
        </button>
      </div>
      <p className="text-sm md:text-base text-text-secondary leading-relaxed">
        {tier.description}
      </p>
    </div>
  );
}

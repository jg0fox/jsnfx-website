import type { ThoughtExperiment as ThoughtExperimentType } from "@/types/glossolalia";

interface ThoughtExperimentProps {
  experiment: ThoughtExperimentType;
}

export function ThoughtExperiment({ experiment }: ThoughtExperimentProps) {
  return (
    <div className="bg-soft-linen-light border border-soft-linen-dark rounded-lg p-5">
      <p className="text-sm text-text-secondary leading-relaxed italic">
        {experiment.prompt}
      </p>
    </div>
  );
}

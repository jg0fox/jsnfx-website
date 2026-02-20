"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Phenomenon } from "@/types/glossolalia";
import { KeyConceptCard } from "./KeyConceptCard";
import { SourceBlock } from "./SourceBlock";
import { ThoughtExperiment } from "./ThoughtExperiment";
import {
  SemanticSatiationExercise,
  SemanticSatiationAudioExercise,
  FramingEffectExercise,
  BoubaKikiExercise,
  BoubaKikiAudioExercise,
  StroopEffectExercise,
  ProsodicExercise,
  VerbalTransformationExercise,
  PhonemicRestorationExercise,
} from "./exercises";

interface PhenomenonSectionProps {
  phenomenon: Phenomenon;
  sectionRef: (el: HTMLElement | null) => void;
}

const exerciseComponents: Record<string, React.ComponentType> = {
  "semantic-satiation": SemanticSatiationExercise,
  "semantic-satiation-audio": SemanticSatiationAudioExercise,
  "framing-effect": FramingEffectExercise,
  "bouba-kiki": BoubaKikiExercise,
  "bouba-kiki-audio": BoubaKikiAudioExercise,
  "stroop-effect": StroopEffectExercise,
  "prosodic-emotional": ProsodicExercise,
  "verbal-transformation": VerbalTransformationExercise,
  "phonemic-restoration": PhonemicRestorationExercise,
};

export function PhenomenonSection({
  phenomenon,
  sectionRef,
}: PhenomenonSectionProps) {
  const [sourcesExpanded, setSourcesExpanded] = useState(false);

  return (
    <section
      id={phenomenon.id}
      ref={sectionRef}
      className="scroll-mt-32 lg:scroll-mt-16 pb-8 md:pb-16"
    >
      <h3 className="text-xl md:text-2xl font-display font-bold text-text-primary mb-3">
        {phenomenon.number}. {phenomenon.title}
      </h3>

      {/* Overview */}
      <div className="mb-4 md:mb-6">
        <p className="text-sm md:text-base text-text-secondary leading-relaxed">
          {phenomenon.overview}
        </p>
      </div>

      {/* Key concepts */}
      <div className="mb-4 md:mb-6">
        <h4 className="text-xs md:text-sm font-bold text-text-muted uppercase tracking-wide mb-2 md:mb-3">
          Key concepts
        </h4>
        <div className="grid gap-2">
          {phenomenon.keyConcepts.map((concept) => (
            <KeyConceptCard
              key={concept.term}
              term={concept.term}
              description={concept.description}
            />
          ))}
        </div>
      </div>

      {/* Thought experiments */}
      {phenomenon.thoughtExperiments.length > 0 && (
        <div className="mb-4 md:mb-6">
          <h4 className="text-xs md:text-sm font-bold text-text-muted uppercase tracking-wide mb-2 md:mb-3">
            Try it yourself
          </h4>
          <div className="grid gap-3">
            {phenomenon.thoughtExperiments.map((exp) => (
              <ThoughtExperiment key={exp.id} experiment={exp} />
            ))}
          </div>
        </div>
      )}

      {/* Interactive exercises */}
      {phenomenon.exercises?.map((exerciseId) => {
        const ExerciseComponent = exerciseComponents[exerciseId];
        if (!ExerciseComponent) return null;
        return (
          <div key={exerciseId} className="mb-4 md:mb-6">
            <div className="border-2 border-palm-leaf/30 rounded-lg p-4 md:p-6 bg-soft-linen-light/50">
              <h4 className="text-xs md:text-sm font-bold text-palm-leaf-3 uppercase tracking-wide mb-3 md:mb-4">
                Interactive exercise
              </h4>
              <ExerciseComponent />
            </div>
          </div>
        );
      })}

      {/* Sources */}
      <div>
        <button
          onClick={() => setSourcesExpanded(!sourcesExpanded)}
          className="flex items-center gap-2 text-sm font-bold text-text-muted uppercase tracking-wide mb-3 hover:text-text-secondary transition-colors"
        >
          Sources ({phenomenon.sources.length})
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform duration-200",
              sourcesExpanded && "rotate-180"
            )}
          />
        </button>
        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            sourcesExpanded
              ? "max-h-[5000px] opacity-100"
              : "max-h-0 opacity-0"
          )}
        >
          <div className="grid gap-3">
            {phenomenon.sources.map((source) => (
              <SourceBlock key={source.id} source={source} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

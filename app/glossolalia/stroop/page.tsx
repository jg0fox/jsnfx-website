"use client";

import { PageHeader } from "@/components/layout";
import {
  KeyConceptCard,
  SourceBlock,
  ThoughtExperiment,
} from "@/components/glossolalia";
import { StroopEffectExercise } from "@/components/glossolalia/exercises";
import { tiers } from "@/lib/glossolalia-data";

const stroopEffect = tiers
  .flatMap((t) => t.phenomena)
  .find((p) => p.id === "stroop-effect")!;

export default function StroopPage() {
  return (
    <>
      <PageHeader
        title="The Stroop Effect"
        description="You cannot un-read a word. Language has root-level access to cognition."
        breadcrumbs={[
          { label: "Glossolalia", href: "/glossolalia" },
          { label: "Stroop Effect" },
        ]}
      />

      {/* Overview */}
      <div className="mb-8 md:mb-12">
        <p className="text-sm md:text-base text-text-secondary leading-relaxed">
          {stroopEffect.overview}
        </p>
      </div>

      {/* Interactive exercise */}
      <div className="mb-8 md:mb-12">
        <div className="border-2 border-palm-leaf/30 rounded-lg p-4 md:p-6 bg-soft-linen-light/50">
          <h2 className="text-xs md:text-sm font-bold text-palm-leaf-3 uppercase tracking-wide mb-3 md:mb-4">
            Interactive exercise
          </h2>
          <StroopEffectExercise />
        </div>
      </div>

      {/* Key concepts */}
      <div className="mb-8 md:mb-12">
        <h2 className="text-xl md:text-2xl font-display font-bold text-text-primary mb-4">
          Key Concepts
        </h2>
        <div className="grid gap-2">
          {stroopEffect.keyConcepts.map((concept) => (
            <KeyConceptCard
              key={concept.term}
              term={concept.term}
              description={concept.description}
            />
          ))}
        </div>
      </div>

      {/* Thought experiment */}
      {stroopEffect.thoughtExperiments.length > 0 && (
        <div className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-display font-bold text-text-primary mb-4">
            Think About It
          </h2>
          <div className="grid gap-3">
            {stroopEffect.thoughtExperiments.map((exp) => (
              <ThoughtExperiment key={exp.id} experiment={exp} />
            ))}
          </div>
        </div>
      )}

      {/* Sources */}
      <div className="mb-8 md:mb-12">
        <h2 className="text-xl md:text-2xl font-display font-bold text-text-primary mb-4">
          Sources
        </h2>
        <div className="grid gap-3">
          {stroopEffect.sources.map((source) => (
            <SourceBlock key={source.id} source={source} />
          ))}
        </div>
      </div>
    </>
  );
}

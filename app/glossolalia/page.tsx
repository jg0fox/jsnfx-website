"use client";

import { useCallback, useMemo } from "react";
import { PageHeader } from "@/components/layout";
import { tiers, tier1Quiz, tier2Quiz } from "@/lib/glossolalia-data";
import { useQuizState } from "@/hooks/useQuizState";
import { useIntersectionProgress } from "@/hooks/useIntersectionProgress";
import {
  PhenomenonSection,
  TierHeader,
  SectionQuiz,
  StudyGuideNav,
} from "@/components/glossolalia";

export default function GlossalaliaPage() {
  const allPhenomena = useMemo(
    () => tiers.flatMap((t) => t.phenomena),
    []
  );
  const sectionIds = useMemo(
    () => allPhenomena.map((p) => p.id),
    [allPhenomena]
  );

  const { activeId, setRef, progress } = useIntersectionProgress(sectionIds);

  const tier1QuizState = useQuizState("tier1", tier1Quiz);
  const tier2QuizState = useQuizState("tier2", tier2Quiz);

  const handleNavigate = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleJumpToQuiz = useCallback((tierId: string) => {
    document
      .getElementById(`quiz-${tierId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <>
      <PageHeader
        title="Glossolalia"
        description="An interactive study guide on linguistic vulnerabilities for AI safety"
      />

      {/* Intro */}
      <div className="mb-6 md:mb-12">
        <p className="text-sm md:text-base text-text-secondary leading-relaxed mb-3 md:mb-4">
          My efforts with this research are based on a paranoid hunch that a
          misaligned artificial general intelligence (AGI) could exploit human
          language to create a language virus that triggers a zombie-like
          cannibalistic rage in humans. If this sounds like the plot to{" "}
          <em className="font-bold">Pontypool Changes Everything</em> (1995
          novel) or <em className="font-bold">Pontypool</em> (2008 film), then
          good, you&apos;re on my wavelength. It wouldn&apos;t be the first
          time{" "}
          <a
            href="https://en.wikipedia.org/wiki/List_of_existing_technologies_predicted_in_science_fiction"
            target="_blank"
            rel="noopener noreferrer"
            className="text-palm-leaf-3 hover:text-bronze-spice transition-colors underline"
          >
            fiction predicted new technology
          </a>
          .
        </p>
        <p className="text-sm md:text-base text-text-secondary leading-relaxed mb-3 md:mb-4">
          Language processing in humans is largely automatic, involuntary, and
          operates below conscious control. In the context of an AGI-designed
          language virus, what better environment to attempt an exploit? These
          concerns are well-documented with highly replicated findings from
          decades of cognitive science and neurolinguistics. If a misaligned AGI
          understood these mechanisms as well as we do (or better), it could
          potentially engineer linguistic exploits that bypass human reasoning
          entirely.
        </p>
        <p className="text-sm md:text-base text-text-secondary leading-relaxed">
          This study guide is designed to build public awareness of these
          potential exploit vectors and catalog them for future defensive
          research. The goal here is to supply a future aligned AGI with
          everything it needs to prevent the exploit or design a cure.
        </p>
      </div>

      {/* Two-column layout: stacked on mobile, side-by-side at xl+ */}
      <div className="flex flex-col xl:flex-row xl:gap-8">
        <StudyGuideNav
          tiers={tiers}
          activePhenomenonId={activeId}
          progress={progress}
          onNavigate={handleNavigate}
          onJumpToQuiz={handleJumpToQuiz}
        />

        <div className="flex-1 min-w-0">
          {/* Tier 1 */}
          <TierHeader
            tier={tiers[0]}
            onJumpToQuiz={() => handleJumpToQuiz("tier1")}
          />

          {tiers[0].phenomena.map((phenomenon) => (
            <PhenomenonSection
              key={phenomenon.id}
              phenomenon={phenomenon}
              sectionRef={setRef(phenomenon.id)}
            />
          ))}

          <SectionQuiz
            tierId="tier1"
            tierTitle="Tier 1"
            questions={tier1Quiz}
            state={tier1QuizState.state}
            onAnswer={tier1QuizState.answer}
            onNext={tier1QuizState.next}
            onReset={tier1QuizState.reset}
          />

          {/* Divider between tiers */}
          <div className="my-8 md:my-16 border-t border-soft-linen-dark" />

          {/* Tier 2 */}
          <TierHeader
            tier={tiers[1]}
            onJumpToQuiz={() => handleJumpToQuiz("tier2")}
          />

          {tiers[1].phenomena.map((phenomenon) => (
            <PhenomenonSection
              key={phenomenon.id}
              phenomenon={phenomenon}
              sectionRef={setRef(phenomenon.id)}
            />
          ))}

          <SectionQuiz
            tierId="tier2"
            tierTitle="Tier 2"
            questions={tier2Quiz}
            state={tier2QuizState.state}
            onAnswer={tier2QuizState.answer}
            onNext={tier2QuizState.next}
            onReset={tier2QuizState.reset}
          />

          {/* References footer */}
          <div className="mt-12 md:mt-16 pt-8 border-t border-soft-linen-dark">
            <h2 className="text-xl font-display font-bold text-text-primary mb-4">
              References
            </h2>
            <p className="text-sm text-text-muted mb-6">
              47 sources across 19 phenomena. All citations link to their
              original publications.
            </p>
            <div className="space-y-6">
              {tiers.map((tier) => (
                <div key={tier.id}>
                  <h3 className="text-sm font-bold text-text-muted uppercase tracking-wide mb-3">
                    {tier.title}
                  </h3>
                  <div className="space-y-2">
                    {tier.phenomena.flatMap((p) =>
                      p.sources.map((source) => (
                        <div
                          key={source.id}
                          className="text-sm text-text-secondary"
                        >
                          <span className="font-mono text-xs text-palm-leaf-3">
                            [{source.id}]
                          </span>{" "}
                          {source.authors} ({source.year}).{" "}
                          <em>{source.title}</em>. {source.journal}.{" "}
                          {source.doiUrl && (
                            <a
                              href={source.doiUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-palm-leaf-3 hover:text-bronze-spice transition-colors"
                            >
                              [Link]
                            </a>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

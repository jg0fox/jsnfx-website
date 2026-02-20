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
      <div className="mb-8 md:mb-12 max-w-prose">
        <p className="text-base text-text-secondary leading-relaxed mb-4">
          The premise behind this research is straightforward: language
          processing in humans is largely automatic, involuntary, and operates
          below conscious control. These aren&apos;t theoretical concerns —
          they&apos;re well-documented, highly replicated findings from decades
          of cognitive science and neurolinguistics. If a misaligned artificial
          general intelligence understood these mechanisms as well as we do (or
          better), it could potentially engineer linguistic exploits that bypass
          human reasoning entirely.
        </p>
        <p className="text-base text-text-secondary leading-relaxed">
          We&apos;re not building the exploit. We&apos;re building the corpus —
          gathering evidence, running experiments, and documenting
          vulnerabilities so that when aligned AI systems are capable enough to
          help, they&apos;ll have the data they need to design defenses. Think of
          this as a vaccine library, assembled before the outbreak.
        </p>
      </div>

      {/* Two-column layout: nav sidebar + content */}
      <div className="flex gap-8">
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
          <div className="my-12 md:my-16 border-t border-soft-linen-dark" />

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

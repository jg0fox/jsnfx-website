"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

// Portfolio deck link
const PORTFOLIO_DECK_URL = "https://pitch.com/v/hello-anthropic-tfnw9c";

// Table of contents sections
const tocSections = [
  { id: "trust-framework", label: "A trust framework" },
  { id: "healthcare", label: "Healthcare & life sciences" },
  { id: "financial-services", label: "Financial services" },
  { id: "enterprise-buyers", label: "What enterprise buyers worry about" },
  { id: "principles", label: "Principles I'd bring" },
];

export default function AnthropicPage() {
  const [activeSection, setActiveSection] = useState("");

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -70% 0px",
      }
    );

    tocSections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="relative">
      {/* Main content with ToC layout */}
      <div className="lg:flex lg:gap-12">
        {/* Main content column */}
        <div className="flex-1 max-w-3xl space-y-12">
          {/* Hero Section */}
          <section className="text-center pt-4 pb-8 border-b border-soft-linen-dark">
            {/* Anthropic logo */}
            <div className="flex justify-center mb-6">
              <div className="relative w-16 h-16">
                <Image
                  src="/images/anthropic/Anthropic_Symbol_1.png"
                  alt="Anthropic"
                  fill
                  className="object-contain"
                  priority
                  unoptimized
                />
              </div>
            </div>

            <h1 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-4">
              Notes on enterprise AI, trust, and content design
            </h1>
            <p className="text-lg text-text-secondary mb-8 max-w-xl mx-auto">
              My notes as I wonder what life might be like as an Enterprise Growth content designer at Anthropic.
            </p>
            <a href={PORTFOLIO_DECK_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="lg">
                View portfolio presentation
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
          </section>

          {/* Introduction */}
          <section className="prose-section">
            <h2 className="text-2xl font-display font-bold text-text-primary mb-4">
              An open book
            </h2>
            <div className="text-lg text-text-secondary space-y-4 leading-relaxed">
              <p>
                I've spent the past few weeks immersing myself in AI for enterprise, particularly around healthcare, life sciences, and financial services. These are my notes.
              </p>
              <p>
                This page isn't a polished framework or a finished deliverable. I tried that (with Claude) and, well, it wasn't pretty. And it wasn't simple! So, to take a note from Anthropic's values, I'm just sharing my raw notes. You'll find observations, patterns, and questions I've collected from sources like Anthropic's keynotes, model cards, and my own experience in regulated industries. I'm sharing this because I think the way someone studies a domain says as much about them as the conclusions they reach.
              </p>
            </div>
          </section>

          {/* Trust Framework */}
          <section id="trust-framework" className="prose-section scroll-mt-24">
            <h2 className="text-2xl font-display font-bold text-text-primary mb-4">
              A trust framework for AI in regulated industries
            </h2>
            <p className="text-lg text-text-secondary mb-6 leading-relaxed">
              During my discovery, I've been looking for bits about how enterprises evaluate AI partners. Anthropic's approach to regulated industries stuck with me because it inverts the usual pitch.
            </p>
            <p className="text-lg text-text-secondary mb-6 leading-relaxed">
              Many AI companies lead with technical capabilities. Anthropic leads with mission alignment. Enterprise customers, especially in regulated industries, evaluate on three levels:
            </p>
            <ol className="list-decimal list-inside space-y-3 text-lg text-text-secondary mb-6">
              <li><strong className="text-text-primary">Culture & mindset</strong> — Do you respect the criticality of what we do?</li>
              <li><strong className="text-text-primary">Domain understanding</strong> — Do you know our nuances and requirements?</li>
              <li><strong className="text-text-primary">Technical safeguards</strong> — Can you prove it's safe?</li>
            </ol>
            <p className="text-lg text-text-secondary mb-6 leading-relaxed">
              Most competitors have #3. Fewer have #2. Almost none have #1.
            </p>

            {/* Callout */}
            <div className="bg-palm-leaf/5 border-l-4 border-palm-leaf p-5 rounded-r-lg">
              <p className="text-text-primary font-medium mb-2">Why this matters for content design</p>
              <p className="text-text-secondary">
                Every touchpoint either reinforces or undermines this hierarchy. A tooltip that shows audit trails signals domain understanding. An error message that explains <em>why</em> something was blocked signals respect for the user's judgment. Content design is how these values become visible.
              </p>
            </div>
          </section>

          {/* Healthcare & Life Sciences */}
          <section id="healthcare" className="prose-section scroll-mt-24">
            <h2 className="text-2xl font-display font-bold text-text-primary mb-4">
              Healthcare & life sciences notes
            </h2>
            <p className="text-lg text-text-secondary mb-6 leading-relaxed">
              Notes from Anthropic's Healthcare and Life Sciences keynote.
            </p>

            <h3 className="text-lg font-display font-bold text-text-primary mb-3">
              How Anthropic demonstrates trustworthiness
            </h3>
            <ul className="list-disc list-inside space-y-2 text-lg text-text-secondary mb-6">
              <li>Scientific benchmarks (figure interpretation, computational biology, protein understanding)</li>
              <li>MCP connectors to existing tools and databases</li>
              <li>Evals designed for scientific tasks, not just general reasoning</li>
            </ul>

            <h3 className="text-lg font-display font-bold text-text-primary mb-3">
              Privacy principles
            </h3>
            <ul className="list-disc list-inside space-y-2 text-lg text-text-secondary mb-6">
              <li>Data integrations always opt-in</li>
              <li>Never train on health data</li>
              <li>Sharing always at patient discretion</li>
            </ul>

            <h3 className="text-lg font-display font-bold text-text-primary mb-3">
              Bottlenecks to adoption
            </h3>
            <ul className="list-disc list-inside space-y-2 text-lg text-text-secondary mb-6">
              <li>Healthcare is complex (obvious but worth naming)</li>
              <li>Administrative burden is real but hard to reduce safely</li>
              <li>Data ontology challenges</li>
              <li>Agentic architecture is new territory</li>
            </ul>

            <h3 className="text-lg font-display font-bold text-text-primary mb-3">
              Opportunities
            </h3>
            <ul className="list-disc list-inside space-y-2 text-lg text-text-secondary mb-6">
              <li>Idea to reality, faster</li>
              <li>Empower caregivers to heal and serve</li>
              <li>AI as long-term partner (years, not quarters, contributing to "progressive speed")</li>
              <li>Lower costs for all</li>
            </ul>

            {/* Insight callout */}
            <div className="bg-palm-leaf/5 border-l-4 border-palm-leaf p-5 rounded-r-lg">
              <p className="text-text-primary font-medium mb-2">The insight that stuck with me</p>
              <p className="text-text-secondary">
                Anthropic can serve as a broker between payers and providers, enabling intelligence sharing, data integration, and infrastructure connection that neither party could build alone.
              </p>
              <p className="text-text-secondary mt-2">
                This is a content design challenge. It requires language that builds trust <em>across</em> organizational boundaries, not just within them.
              </p>
            </div>
          </section>

          {/* Financial Services */}
          <section id="financial-services" className="prose-section scroll-mt-24">
            <h2 className="text-2xl font-display font-bold text-text-primary mb-4">
              Financial services notes
            </h2>
            <p className="text-lg text-text-secondary mb-6 leading-relaxed">
              I watched the Financial Services keynote, too. Different format, similar takeaways.
            </p>

            {/* The pitch callout */}
            <div className="bg-bronze-spice/10 border-l-4 border-bronze-spice p-5 rounded-r-lg mb-6">
              <p className="text-text-primary font-medium">The pitch</p>
              <p className="text-text-secondary italic">
                "There will be two types of investment firms: those using AI institutionally and those losing their top talent to competitors who are."
              </p>
            </div>

            <h3 className="text-lg font-display font-bold text-text-primary mb-3">
              How Anthropic demonstrates trustworthiness
            </h3>
            <ul className="list-disc list-inside space-y-2 text-lg text-text-secondary mb-6">
              <li>Finance Agent Benchmark, Claude outperforms competitors</li>
              <li>Financial Modeling World Cup, 5/7 levels passed, 83%+ accuracy</li>
              <li>Domain-specific training for financial reasoning, Excel manipulation, data analysis at scale</li>
              <li>SOC 2 Type 2 certified</li>
              <li>No training on customer data by default</li>
            </ul>

            <h3 className="text-lg font-display font-bold text-text-primary mb-3">
              MCP connectors
            </h3>
            <p className="text-lg text-text-secondary mb-3 leading-relaxed">
              In financial services AI, integrations matter as much as the model:
            </p>
            <ul className="list-disc list-inside space-y-2 text-lg text-text-secondary mb-6">
              <li>S&P Global (transcripts, market data)</li>
              <li>FactSet (fundamentals, consensus estimates)</li>
              <li>Morningstar (public investment research)</li>
              <li>Pitchbook (private market intelligence)</li>
              <li>Dupa (AI-verified fundamentals with citations)</li>
              <li>Box, Databricks, Snowflake, Palantir (internal data)</li>
            </ul>

            <h3 className="text-lg font-display font-bold text-text-primary mb-3">
              The regulatory tension
            </h3>
            <p className="text-lg text-text-secondary mb-3 leading-relaxed">
              There's an eternal conflict here around innovation vs. "20 checkers for 1 doer." Content design sits at this intersection:
            </p>
            <ul className="list-disc list-inside space-y-2 text-lg text-text-secondary mb-6">
              <li>Help organizations move fast without breaking compliance</li>
              <li>Give risk teams the evidence they need</li>
              <li>Frame AI adoption as risk <em>reduction</em>, not risk addition</li>
            </ul>
            <p className="text-lg text-text-secondary mb-6 leading-relaxed">
              The CCO and the VP of Sales Ops have different concerns. Content strategy accounts for both.
            </p>

            <h3 className="text-lg font-display font-bold text-text-primary mb-3">
              Adoption patterns that work
            </h3>
            <p className="text-lg text-text-secondary mb-3 leading-relaxed">From the keynote panel:</p>
            <ol className="list-decimal list-inside space-y-3 text-lg text-text-secondary mb-6">
              <li><strong className="text-text-primary">Democratize first</strong> by getting tools into everyone's hands before picking specific use cases</li>
              <li><strong className="text-text-primary">Top-down buy-in is critical</strong> because leadership must be "AI maniacs" for it to work</li>
              <li><strong className="text-text-primary">Bottom-up innovation</strong> because people in the trenches surface the best ideas</li>
              <li><strong className="text-text-primary">Revisit every 3-6 months</strong>, tech changes fast and failed attempts may now work</li>
              <li><strong className="text-text-primary">Personal use → work use pipeline</strong> is valuable because comfort builds outside work first</li>
              <li><strong className="text-text-primary">Lightning rounds</strong> for "What strange AI thing did you try this week?"</li>
              <li><strong className="text-text-primary">Invest in prompt engineering</strong> to find power users, make them AI champions</li>
            </ol>

            <h3 className="text-lg font-display font-bold text-text-primary mb-3">
              The mindset shift
            </h3>
            <p className="text-lg text-text-secondary mb-3 leading-relaxed">
              Not Google (one question, one answer), it's a companion, a co-pilot.
            </p>
            <p className="text-lg text-text-secondary mb-3 leading-relaxed">
              "Giving everyone a treadmill doesn't cure heart disease." Tool rollout ≠ transformation.
            </p>
            <p className="text-lg text-text-secondary mb-6 leading-relaxed">
              Address job displacement fears head-on: "AI won't take your job, but someone using AI will."
            </p>

            <h3 className="text-lg font-display font-bold text-text-primary mb-3">
              Results worth noting
            </h3>
            <ul className="list-disc list-inside space-y-2 text-lg text-text-secondary">
              <li>NBIM (Norwegian Sovereign Wealth Fund): 20% productivity gains = 213,000 hours/year recovered</li>
              <li>AIG: Underwriting timelines 5x faster, accuracy 75% → 90%</li>
              <li>Bridgewater: Using Claude since 2023 for investment analyst assistance</li>
            </ul>
          </section>

          {/* Enterprise Buyers */}
          <section id="enterprise-buyers" className="prose-section scroll-mt-24">
            <h2 className="text-2xl font-display font-bold text-text-primary mb-4">
              What enterprise buyers worry about
            </h2>
            <p className="text-lg text-text-secondary mb-6 leading-relaxed">
              Notes on the regulatory and compliance landscape from my study guide.
            </p>

            <h3 className="text-lg font-display font-bold text-text-primary mb-3">
              Proxy variables & disparate impact
            </h3>
            <p className="text-lg text-text-secondary mb-3 leading-relaxed">
              AI in regulated industries must account for unintentional discrimination.
            </p>
            <ul className="list-disc list-inside space-y-2 text-lg text-text-secondary mb-4">
              <li><strong className="text-text-primary">Proxy variables:</strong> data points that correlate with a protected characteristic even though it doesn't directly measure it. Like how zip code correlates with race due to historical segregation.</li>
              <li><strong className="text-text-primary">Disparate impact:</strong> when a neutral policy disproportionately affects a protected class, even without intent.</li>
            </ul>
            <p className="text-lg text-text-secondary mb-2 font-medium">Cases to know:</p>
            <ul className="list-disc list-inside space-y-2 text-lg text-text-secondary mb-4">
              <li>Apple Card (2019): Credit limits 20x higher for men than women with similar credit</li>
              <li>Earnest Student Loans (2025): AI penalized HBCU graduates via "Cohort Default Rate"</li>
              <li>State Farm (2022): Fraud detection AI allegedly biased against Black homeowners</li>
            </ul>
            <p className="text-lg text-text-secondary mb-6 leading-relaxed">
              <strong className="text-text-primary">The legal test:</strong> Once disparate impact exists, burden shifts to demonstrate legitimate business purpose <em>and</em> no less discriminatory alternative.
            </p>

            <h3 className="text-lg font-display font-bold text-text-primary mb-3">
              Subprocessors & data governance
            </h3>
            <p className="text-lg text-text-secondary mb-3 leading-relaxed">
              Enterprise legal teams care deeply about the data supply chain:
            </p>
            <ul className="list-disc list-inside space-y-2 text-lg text-text-secondary mb-4">
              <li><strong className="text-text-primary">Subprocessor:</strong> A third party your vendor uses to process your data. Every subprocessor is another potential breach point.</li>
              <li><strong className="text-text-primary">Data Processing Addendum (DPA):</strong> Legal agreement governing how a vendor handles customer data</li>
              <li><strong className="text-text-primary">Notice period:</strong> Time given before adding new subprocessors (Anthropic provides 15 days)</li>
            </ul>
            <p className="text-lg text-text-secondary mb-2 font-medium">What customers ask after churn:</p>
            <ul className="list-disc list-inside space-y-2 text-lg text-text-secondary mb-6">
              <li>Can we export data in a usable format?</li>
              <li>Is it fully deleted? What's the timeline?</li>
              <li>Can you prove deletion?</li>
              <li>Do you retain any derivatives?</li>
            </ul>

            <h3 className="text-lg font-display font-bold text-text-primary mb-3">
              FDA & life sciences AI
            </h3>
            <p className="text-lg text-text-secondary mb-3 leading-relaxed">Key distinctions that matter:</p>
            <ul className="list-disc list-inside space-y-2 text-lg text-text-secondary mb-4">
              <li><strong className="text-text-primary">SaMD (Software as Medical Device):</strong> Software that IS the medical device (e.g., AI that reads X-rays)</li>
              <li><strong className="text-text-primary">Locked algorithm:</strong> Does not change after deployment. Easier regulatory path.</li>
              <li><strong className="text-text-primary">Adaptive algorithm:</strong> Continues learning post-deployment. May need re-validation.</li>
              <li><strong className="text-text-primary">PCCP (Predetermined Change Control Plan):</strong> Describes how AI will change over time — if FDA agrees upfront, manufacturer can make those changes without additional reviews</li>
            </ul>
            <p className="text-lg text-text-secondary mb-6 leading-relaxed">
              <strong className="text-text-primary">Why "continuous improvement" is a red flag:</strong> It sounds good to product teams but sounds like "uncontrolled change" to regulators.
            </p>

            <h3 className="text-lg font-display font-bold text-text-primary mb-3">
              The buying committee
            </h3>
            <p className="text-lg text-text-secondary mb-4 leading-relaxed">
              Enterprise deals over $250K involve an average of 19 stakeholders. Content must serve all of them:
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-base border-collapse">
                <thead>
                  <tr className="border-b border-soft-linen-dark">
                    <th className="text-left py-3 pr-4 font-semibold text-text-primary">Stakeholder</th>
                    <th className="text-left py-3 pr-4 font-semibold text-text-primary">What they care about</th>
                    <th className="text-left py-3 font-semibold text-text-primary">Content they need</th>
                  </tr>
                </thead>
                <tbody className="text-text-secondary">
                  <tr className="border-b border-soft-linen-dark/50">
                    <td className="py-3 pr-4">Economic buyer</td>
                    <td className="py-3 pr-4">ROI, cost justification</td>
                    <td className="py-3">ROI calculators, business cases</td>
                  </tr>
                  <tr className="border-b border-soft-linen-dark/50">
                    <td className="py-3 pr-4">Champion</td>
                    <td className="py-3 pr-4">Making the case internally</td>
                    <td className="py-3">One-pagers they can forward</td>
                  </tr>
                  <tr className="border-b border-soft-linen-dark/50">
                    <td className="py-3 pr-4">Compliance/Legal</td>
                    <td className="py-3 pr-4">Risk, audit trails, regulatory defensibility</td>
                    <td className="py-3">Security whitepapers, compliance matrices</td>
                  </tr>
                  <tr className="border-b border-soft-linen-dark/50">
                    <td className="py-3 pr-4">End users</td>
                    <td className="py-3 pr-4">Does it actually work for my tasks?</td>
                    <td className="py-3">Benchmarks, workflow docs, prompt templates</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Executives</td>
                    <td className="py-3 pr-4">Strategic alignment, peer validation</td>
                    <td className="py-3">Peer case studies, board-ready materials</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-display font-bold text-text-primary mb-3">
              The VP Sales Ops vs. CCO tension
            </h3>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-base border-collapse">
                <thead>
                  <tr className="border-b border-soft-linen-dark">
                    <th className="text-left py-3 pr-4 font-semibold text-text-primary">VP Sales Ops cares about</th>
                    <th className="text-left py-3 font-semibold text-text-primary">CCO cares about</th>
                  </tr>
                </thead>
                <tbody className="text-text-secondary">
                  <tr className="border-b border-soft-linen-dark/50">
                    <td className="py-3 pr-4">Time to value</td>
                    <td className="py-3">Audit trails</td>
                  </tr>
                  <tr className="border-b border-soft-linen-dark/50">
                    <td className="py-3 pr-4">Workflow integration</td>
                    <td className="py-3">Regulatory defensibility</td>
                  </tr>
                  <tr className="border-b border-soft-linen-dark/50">
                    <td className="py-3 pr-4">Measurable outcomes</td>
                    <td className="py-3">Evidence of controls</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Speed and minimal friction</td>
                    <td className="py-3">Thoroughness and caution</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-lg text-text-secondary leading-relaxed">
              Content strategy accounts for both. Legal is often looped in late, smart organizations bring compliance in early to avoid last-minute deal killers.
            </p>
          </section>

          {/* Principles */}
          <section id="principles" className="prose-section scroll-mt-24">
            <h2 className="text-2xl font-display font-bold text-text-primary mb-4">
              Principles I'd bring to the work
            </h2>

            <h3 className="text-lg font-display font-bold text-text-primary mb-3">
              Human in the loop
            </h3>
            <p className="text-lg text-text-secondary mb-3 leading-relaxed">
              Enterprise AI requires deliberate offramps for human review. Content designers define:
            </p>
            <ul className="list-disc list-inside space-y-2 text-lg text-text-secondary mb-6">
              <li>When to surface decisions for approval</li>
              <li>How to make AI reasoning visible and auditable</li>
              <li>Where "visible seams" build trust instead of eroding it</li>
            </ul>
            <p className="text-lg text-text-secondary mb-6 leading-relaxed">
              The goal isn't seamless automation. It's confident collaboration.
            </p>

            <h3 className="text-lg font-display font-bold text-text-primary mb-3">
              Constitutional AI as content philosophy
            </h3>
            <p className="text-lg text-text-secondary mb-6 leading-relaxed">
              Anthropic's approach to alignment mirrors good content design. Teach principles with reasons, not rules with lists. Understanding <em>why</em> enables generalization to situations you couldn't anticipate.
            </p>

            <h3 className="text-lg font-display font-bold text-text-primary mb-3">
              Onboarding principles that fascinate me
            </h3>
            <p className="text-lg text-text-secondary mb-3 leading-relaxed">From my research into AI onboarding best practices:</p>
            <ol className="list-decimal list-inside space-y-2 text-lg text-text-secondary">
              <li>Clear opt-in moments</li>
              <li>Transparency about capabilities <em>and</em> limitations</li>
              <li>Progressive disclosure</li>
              <li>Editable outputs</li>
              <li>Visible seams</li>
              <li>Graceful degradation</li>
              <li>Contextual education</li>
              <li>Trust calibration</li>
            </ol>
          </section>

          {/* Closing */}
          <section className="text-center py-12 mt-8 border-t border-soft-linen-dark">
            <h2 className="text-2xl font-display font-bold text-text-primary mb-4">
              Many more notes to come
            </h2>
            <p className="text-lg text-text-secondary mb-8 max-w-lg mx-auto">
              You can email me if you're interested in chatting about any of this.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href={PORTFOLIO_DECK_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" size="lg">
                  View portfolio presentation
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
              <a
                href="mailto:jasongfox@gmail.com"
                className="inline-flex items-center gap-2 text-lg text-text-secondary hover:text-palm-leaf transition-colors"
              >
                <Mail className="w-5 h-5" />
                jasongfox@gmail.com
              </a>
            </div>
          </section>
        </div>

        {/* Sticky Table of Contents */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <nav className="sticky top-8">
            <ul className="space-y-1 border-l border-soft-linen-dark pl-4">
              {tocSections.map(({ id, label }) => (
                <li key={id}>
                  <button
                    onClick={() => scrollToSection(id)}
                    className={cn(
                      "block w-full text-left py-1.5 text-sm transition-colors",
                      activeSection === id
                        ? "text-bronze-spice font-medium border-l-2 border-bronze-spice -ml-[17px] pl-[15px]"
                        : "text-text-muted hover:text-text-primary"
                    )}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </div>
  );
}

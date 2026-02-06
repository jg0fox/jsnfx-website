"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Shield,
  UserCheck,
  Scale,
  Network,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  Building2,
  Stethoscope
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, Card, CardContent } from "@/components/ui";

// Portfolio deck link - update this with actual link
const PORTFOLIO_DECK_URL = "#";

// Audience tabs
const audiences = [
  { id: "practitioners", label: "Technical practitioners & end users", shortLabel: "Practitioners" },
  { id: "managers", label: "Middle managers & team leads", shortLabel: "Managers" },
  { id: "compliance", label: "Compliance & regulatory", shortLabel: "Compliance" },
  { id: "operations", label: "Operations & enablement", shortLabel: "Operations" },
  { id: "executives", label: "C-level & executives", shortLabel: "Executives" },
];

// Journey stages
const journeyStages = [
  { id: "awareness", label: "Awareness", description: "AI could help us" },
  { id: "evaluation", label: "Evaluation", description: "Is Claude the right choice?" },
  { id: "procurement", label: "Procurement", description: "Can we trust/buy this?" },
  { id: "onboarding", label: "Onboarding", description: "How do we get started?" },
  { id: "adoption", label: "Adoption", description: "How do we get value?" },
  { id: "expansion", label: "Expansion", description: "What else can we do?" },
];

// Content matrix data
type MatrixCell = {
  contentType: string;
  whyItMatters: string;
  healthcareExample: string;
  healthcareNote?: string;
  financeExample: string;
  financeNote?: string;
  portfolioParallel?: {
    image: string;
    caption: string;
  };
};

const contentMatrix: Record<string, Record<string, MatrixCell>> = {
  practitioners: {
    awareness: {
      contentType: "Educational content, thought leadership",
      whyItMatters: "Practitioners are often the first to feel the pain AI could solve. They need permission to explore — and language to advocate upward.",
      healthcareExample: "Blog post: \"How computational biologists are using Claude for protein understanding\" — validates the use case with peer credibility.",
      healthcareNote: "Claude's scientific benchmarks (protein understanding, figure interpretation) provide the proof points.",
      financeExample: "Case snippet: \"How hedge fund analysts reduced model-building time from 5 hours to 30 minutes.\"",
      financeNote: "Nick Lynn's Sarah demo — the narrative structure is itself a content design artifact.",
      portfolioParallel: {
        image: "/images/anthropic/portfolio_update/screencapture-blog-havenly-interior-design-tips-for-guys-1476761566418.png",
        caption: "Havenly blog targeting a new audience segment — same principle of meeting practitioners where they are."
      }
    },
    evaluation: {
      contentType: "Technical documentation, comparison guides, benchmark explainers",
      whyItMatters: "Practitioners evaluate tools based on whether they actually work for their tasks. They need specifics, not marketing.",
      healthcareExample: "MCP connector documentation showing how Claude integrates with existing lab information systems, EHR platforms, or ICD-10 databases — with visible audit trails.",
      healthcareNote: "Document the \"show your work\" pattern — how Claude surfaces reasoning for clinical decisions.",
      financeExample: "Benchmark comparison: Finance Agent Benchmark results, Financial Modeling World Cup performance (83% accuracy, 5/7 levels passed).",
      financeNote: "These benchmarks already exist. Content design work = making them discoverable and interpretable.",
      portfolioParallel: {
        image: "/images/anthropic/level3/Screen-Shot-2015-03-21-at-1.40.39-PM_960.png",
        caption: "The Threat Scenario Quiz — interactive content that lets practitioners self-assess through demonstration."
      }
    },
    procurement: {
      contentType: "Security documentation, compliance attestations",
      whyItMatters: "Even if practitioners love the tool, they need artifacts to hand to procurement and security teams.",
      healthcareExample: "One-pager: \"Claude for healthcare: Data privacy commitments\" — opt-in integrations, no training on health data, patient-controlled sharing.",
      healthcareNote: "Translate the privacy principles from the healthcare keynote into scannable procurement-ready formats.",
      financeExample: "SOC 2 Type 2 certification summary, data handling FAQ for regulated environments.",
      financeNote: "These exist but may need practitioner-friendly versions (vs. legal/compliance versions)."
    },
    onboarding: {
      contentType: "Onboarding flows, contextual tooltips, first-run experiences",
      whyItMatters: "The first hour with a tool determines whether practitioners become advocates or skeptics.",
      healthcareExample: "Guided first task: \"Upload a clinical document and ask Claude to summarize key findings\" — progressive disclosure of capabilities.",
      healthcareNote: "Design onboarding that builds trust incrementally. Show limitations alongside capabilities.",
      financeExample: "Template gallery: Pre-built prompts for common analyst tasks (earnings analysis, comps table, DCF assumptions).",
      financeNote: "Ensure templates teach prompting patterns, not just complete tasks.",
      portfolioParallel: {
        image: "/images/anthropic/portfolio_update/desktop_UX_copy_1.png",
        caption: "Havenly's \"While you wait...\" screen — keeps users engaged during async processes, same principle as AI response latency moments."
      }
    },
    adoption: {
      contentType: "Prompt templates, workflow documentation, power-user guides",
      whyItMatters: "Adoption stalls when practitioners don't know how to move beyond basic use cases.",
      healthcareExample: "Prompt engineering guide for clinical contexts: How to structure queries for diagnostic reasoning, how to request citations from medical literature.",
      healthcareNote: "Lloyd from HG Capital mentioned \"investing in prompt engineering / context engineering\" as a key differentiator.",
      financeExample: "\"From lazy prompt to power prompt\" — guide showing before/after examples.",
      financeNote: "The Costa Rica trip planning example from the keynote is perfect — adapt it for financial contexts."
    },
    expansion: {
      contentType: "Advanced use case documentation, integration guides, MCP connector tutorials",
      whyItMatters: "Practitioners who've seen value become internal champions — if they have content to share.",
      healthcareExample: "MCP connector deep-dive: How to connect Claude to your lab's existing bioinformatics pipeline.",
      healthcareNote: "Technical documentation that practitioners can forward to their engineering teams.",
      financeExample: "\"Beyond chat: Building automated workflows with Claude\" — moving from interactive to agentic use cases.",
      financeNote: "The progression from \"broad enablement\" to \"fully transforming processes\" described by Lloyd at HG Capital."
    }
  },
  managers: {
    awareness: {
      contentType: "Efficiency narratives, team transformation stories",
      whyItMatters: "Middle managers care about team productivity and proving value to leadership. They need stories, not specs.",
      healthcareExample: "Case study: \"How a clinical research team reduced protocol review time by 40%\" — specific, measurable, team-level impact.",
      healthcareNote: "The healthcare keynote mentioned bottlenecks like \"barrier to reducing burden of admin\" — content should name these pain points.",
      financeExample: "Stat highlight: NBIM's 213,000 hours recovered annually — framed as \"what your team could do with that time back.\"",
      financeNote: "Nikolai quote: \"Claude has become indispensable.\""
    },
    evaluation: {
      contentType: "Comparison matrices, pilot program frameworks",
      whyItMatters: "Managers need to justify their choice to leadership and defend it to skeptical team members.",
      healthcareExample: "Build vs. buy analysis: Why partnering with Anthropic beats building internal AI tooling — speed of innovation, domain expertise, compliance built-in.",
      healthcareNote: "Don from New York Life: \"Companies like Anthropic are moving at such incredible velocity with respect to innovation.\"",
      financeExample: "Pilot program template: How to structure a 30-day Claude trial with measurable success criteria.",
      financeNote: "The financial services keynote offered a one-month free trial — content should help managers maximize that window."
    },
    procurement: {
      contentType: "Business case templates, ROI calculators",
      whyItMatters: "Managers often need to build the internal case before procurement even gets involved.",
      healthcareExample: "ROI framework: Time saved on documentation × hourly cost × team size = annual value. Pre-built spreadsheet they can adapt.",
      healthcareNote: "Make the math easy. Managers shouldn't have to build the business case from scratch.",
      financeExample: "AIG case study: Underwriting timelines compressed 5x, accuracy improved from 75% to 90% — quantified outcomes managers can reference.",
      financeNote: "This stat from the keynote is exactly what managers need to take to their VP."
    },
    onboarding: {
      contentType: "Team rollout playbooks, training curriculum outlines",
      whyItMatters: "Managers are responsible for adoption. They need a plan, not just a tool.",
      healthcareExample: "30/60/90 day rollout guide: Week 1 = individual exploration, Month 1 = team use cases identified, Month 2 = workflow integration, Month 3 = measurement and iteration.",
      healthcareNote: "The healthcare keynote emphasized progressive disclosure and opt-in moments — rollout guides should embed these principles.",
      financeExample: "\"AI Champions\" program template: How to identify and empower power users who accelerate team adoption.",
      financeNote: "Lloyd mentioned \"finding those people who become power users... put them up as AI champions.\"",
      portfolioParallel: {
        image: "/images/anthropic/kaiser/KPCO172_LifeHacks_V2-page-1_3300.jpg",
        caption: "Kaiser's \"Life Hacks\" brochure — takes complex healthcare benefits and makes them accessible for busy readers."
      }
    },
    adoption: {
      contentType: "Success metrics frameworks, team retrospective templates",
      whyItMatters: "Managers need to prove value to keep the tool and expand usage.",
      healthcareExample: "Measurement template: Track time-to-insight, documentation quality scores, researcher satisfaction — pre/post comparison framework.",
      healthcareNote: "Make measurement easy. If managers can't prove value, renewal is at risk.",
      financeExample: "Usage intensity dashboard guidance: Michael from DE Shaw described tracking usage patterns across the firm.",
      financeNote: "\"What you see is a log-normal curve... the more you use it, the more you use it.\""
    },
    expansion: {
      contentType: "Cross-functional use case libraries, expansion playbooks",
      whyItMatters: "Successful team deployments become expansion opportunities. Managers need content to share with peers.",
      healthcareExample: "\"From R&D to clinical ops: How one team's Claude success spread across the organization\" — template for internal storytelling.",
      healthcareNote: "Arm successful managers with content they can present at internal leadership meetings.",
      financeExample: "Peer sharing template: \"Lightning round\" format from Michael at DE Shaw — \"What strange AI thing did you try this week?\"",
      financeNote: "This practice builds organic expansion. Content design supports it."
    }
  },
  compliance: {
    awareness: {
      contentType: "Risk reduction narratives, regulatory trend briefings",
      whyItMatters: "Compliance teams often see AI as risk. Content must reframe it as risk management — or even risk reduction.",
      healthcareExample: "Brief: \"How AI audit trails reduce compliance burden\" — position Claude's transparency as a compliance asset, not a liability.",
      healthcareNote: "Healthcare keynote emphasized \"reasoning needs to be traceable and visible — show the MCP connection for ICD-10, show audit trails.\"",
      financeExample: "Regulatory landscape summary: How AI is being addressed by SEC, FINRA, OCC — and how Claude's approach aligns.",
      financeNote: "Compliance teams need to know you understand their world. Show regulatory fluency."
    },
    evaluation: {
      contentType: "Constitutional AI explainers, audit trail documentation",
      whyItMatters: "Compliance evaluates AI differently than practitioners. They need to understand the why behind model behavior.",
      healthcareExample: "Constitutional AI one-pager: How Claude's training methodology creates predictable, auditable behavior — \"principles with reasons, not rules with lists.\"",
      healthcareNote: "This is core Anthropic differentiation. Content design makes it accessible to non-ML compliance professionals.",
      financeExample: "Model risk documentation template: Information compliance teams need to satisfy internal model risk management requirements.",
      financeNote: "Anticipate the questions model risk teams will ask. Pre-build the artifacts.",
      portfolioParallel: {
        image: "/images/anthropic/level3/Screen-Shot-2015-03-21-at-11.42.20-AM_700.png",
        caption: "Level 3 Network Security Playbook — structured to help security teams build defensible processes."
      }
    },
    procurement: {
      contentType: "Security attestations, data handling agreements, subprocessor documentation",
      whyItMatters: "Compliance has veto power. They need artifacts that satisfy their specific requirements.",
      healthcareExample: "HIPAA compliance documentation: BAA templates, data handling specifics, \"never train on health data\" commitment in writing.",
      healthcareNote: "Healthcare keynote privacy principles: opt-in integrations, no training on health data, patient-controlled sharing.",
      financeExample: "SOC 2 Type 2 report summary, data residency options, encryption specifications.",
      financeNote: "These exist — content design work = making them findable and digestible."
    },
    onboarding: {
      contentType: "Compliance review checklists, audit preparation guides",
      whyItMatters: "Compliance teams need to establish monitoring and review processes before broad rollout.",
      healthcareExample: "AI governance checklist: What compliance should verify before, during, and after Claude deployment.",
      healthcareNote: "Make compliance a partner in rollout, not a blocker. Give them the tools to say \"yes, and here's how we'll monitor it.\"",
      financeExample: "Audit trail interpretation guide: How to review Claude's decision logs, what to look for, how to document findings.",
      financeNote: "The \"visible seams\" principle — make AI decisions inspectable by design."
    },
    adoption: {
      contentType: "Ongoing monitoring frameworks, exception handling protocols",
      whyItMatters: "Compliance teams need to know what to do when something goes wrong — or when something looks wrong but isn't.",
      healthcareExample: "Escalation protocol template: When Claude produces unexpected output, here's the review and remediation process.",
      healthcareNote: "\"Deliberate offramps for human review\" — content design defines what those offramps look like.",
      financeExample: "False positive handling guide: When compliance flags an AI output that's actually correct — how to investigate, document, and adjust thresholds.",
      financeNote: "Reduce friction between compliance and practitioners by anticipating common conflicts."
    },
    expansion: {
      contentType: "Regulatory roadmap briefings, compliance automation opportunities",
      whyItMatters: "Once compliance trusts the tool, they may become advocates for expanded use — especially if AI reduces their own burden.",
      healthcareExample: "Future state brief: \"How Claude could automate adverse event reporting\" — show compliance teams the long-term vision.",
      healthcareNote: "Turn compliance from gatekeepers to champions.",
      financeExample: "Reg BI compliance support: How Claude can help advisors document best interest obligations — turning compliance from burden to benefit.",
      financeNote: "PWC and Turing \"solving critical regulatory challenges\" from the partnerships mentioned in keynote."
    }
  },
  operations: {
    awareness: {
      contentType: "Efficiency opportunity assessments, workflow analysis frameworks",
      whyItMatters: "Ops teams are always looking for leverage. They need to see where AI fits in existing processes.",
      healthcareExample: "Workflow assessment template: Map current processes, identify high-friction manual tasks, score AI fit.",
      healthcareNote: "Lloyd from HG Capital: \"Looking at those kind of high-friction tasks where people do a lot of mechanical processing that are quite repeatable.\"",
      financeExample: "Time study framework: How to quantify where analysts spend time — the \"3 a.m. model debugging\" story from Kate Jensen resonates here.",
      financeNote: "Give ops teams the analytical framework to build their own case."
    },
    evaluation: {
      contentType: "Implementation complexity assessments, integration architecture guides",
      whyItMatters: "Ops evaluates feasibility. They need to know what it takes to actually deploy.",
      healthcareExample: "Integration checklist: What systems does Claude need to connect to? What's the data flow? What are the dependencies?",
      healthcareNote: "MCP connectors reduce integration complexity — content should highlight this.",
      financeExample: "Architecture diagram: How Claude for Financial Analysis connects to S&P Global, FactSet, internal Box documents.",
      financeNote: "Reduce perceived implementation risk by showing the integration is already built."
    },
    procurement: {
      contentType: "Implementation timelines, resource requirements, success criteria templates",
      whyItMatters: "Ops owns the \"how\" of deployment. They need realistic planning artifacts.",
      healthcareExample: "Implementation project plan template: Phases, milestones, resource requirements, risk mitigation.",
      healthcareNote: "\"White glove finance specific implementation and onboarding\" mentioned in keynote — content should set expectations.",
      financeExample: "Pilot success criteria template: Define what \"good\" looks like before starting, so everyone agrees on evaluation standards.",
      financeNote: "Reduce post-sale friction by aligning expectations during procurement.",
      portfolioParallel: {
        image: "/images/anthropic/kaiser/KPCO164_NCQA_Awards_B2B-page-0_3300.jpg",
        caption: "Kaiser B2B one-pager — structured to help HR/benefits decision-makers evaluate quickly."
      }
    },
    onboarding: {
      contentType: "Rollout playbooks, change management guides, communication templates",
      whyItMatters: "Ops owns the rollout. They need content to communicate with affected teams.",
      healthcareExample: "Internal announcement template: \"We're piloting Claude for [use case]. Here's what to expect, how to get started, and who to contact.\"",
      healthcareNote: "Change management is as important as the technology — Don from New York Life emphasized \"mindset shift.\"",
      financeExample: "Training curriculum outline: Basic prompting, advanced techniques, when to use AI vs. when not to.",
      financeNote: "\"Use Claude to build a training program\" — from Jonathan's advice in the keynote. Meta but effective.",
      portfolioParallel: {
        image: "/images/anthropic/kaiser/KPCO172_LifeHacks_V2-page-3_3300.jpg",
        caption: "Kaiser Life Hacks interior — explains complex features through user-friendly framing."
      }
    },
    adoption: {
      contentType: "Usage dashboards, adoption metric frameworks, intervention playbooks",
      whyItMatters: "Ops monitors adoption and intervenes when it stalls.",
      healthcareExample: "Adoption health dashboard: Usage frequency, task completion rates, user satisfaction scores — with intervention thresholds.",
      healthcareNote: "Michael from DE Shaw tracks \"usage intensity across the firm\" — content should help ops interpret this data.",
      financeExample: "Re-engagement playbook: When usage drops, here's the diagnostic checklist and intervention options.",
      financeNote: "\"Encourage folks to come back every 6 months\" — Michael's advice. Build this into ops processes."
    },
    expansion: {
      contentType: "Scaling playbooks, multi-department rollout guides",
      whyItMatters: "Successful pilots need to scale. Ops owns that process.",
      healthcareExample: "Horizontal expansion guide: \"You've succeeded in R&D. Here's how to expand to clinical ops, then regulatory affairs.\"",
      healthcareNote: "Healthcare keynote value chain (R&D → Clinical/Regulatory → Commercial) is the roadmap.",
      financeExample: "Vertical expansion guide: \"You've succeeded in equity research. Here's how to expand to fixed income, then risk management.\"",
      financeNote: "Make expansion feel like a repeatable playbook, not a new project each time."
    }
  },
  executives: {
    awareness: {
      contentType: "Executive briefings, strategic vision pieces, peer CEO perspectives",
      whyItMatters: "Executives think in strategic impact, not features. They need the big picture.",
      healthcareExample: "Executive brief: \"AI in healthcare: From efficiency gains to care transformation\" — the progression Vikram from Deloitte described.",
      healthcareNote: "\"Expanding from productivity to revenue generation, new products, reimagined distribution.\"",
      financeExample: "Peer perspective: Quotes from Bridgewater CTO, Commonwealth Bank CTO, AIG's Peter — executives trust other executives.",
      financeNote: "Kate Jensen's keynote opened with these testimonials for a reason.",
      portfolioParallel: {
        image: "/images/anthropic/level3/Screen-Shot-2015-03-21-at-1.53.39-PM_699.png",
        caption: "Level 3 \"Redefining the Network\" whitepaper — strategic framing for executive audiences, not tactical how-to."
      }
    },
    evaluation: {
      contentType: "Competitive differentiation briefs, strategic alignment assessments",
      whyItMatters: "Executives choose partners, not just vendors. They need to understand Anthropic's mission and staying power.",
      healthcareExample: "Mission alignment brief: \"Why Anthropic's approach to AI safety aligns with healthcare's 'first, do no harm'\" — Constitutional AI as institutional fit.",
      healthcareNote: "\"Culture and mindset — respecting the mission of healthcare and the criticality of what they do.\"",
      financeExample: "Differentiation summary: Why Claude outperforms on financial reasoning benchmarks, and why that matters strategically.",
      financeNote: "Finance Agent Benchmark results, Financial Modeling World Cup performance — executive-ready summary."
    },
    procurement: {
      contentType: "Partnership term sheets, executive summary documents, board-ready materials",
      whyItMatters: "Executives sign. They need materials they can take to their board.",
      healthcareExample: "Board presentation template: AI strategy, vendor selection rationale, risk mitigation, expected outcomes — ready to present.",
      healthcareNote: "Make the executive look good to their board. That's the real job of this content.",
      financeExample: "Investment thesis summary: Why AI is a strategic imperative, why now, why Anthropic — the narrative executives need to tell.",
      financeNote: "\"There will be two types of investment firms: those using AI institutionally and those losing their top talent to competitors who are.\""
    },
    onboarding: {
      contentType: "Executive dashboards, strategic milestone frameworks",
      whyItMatters: "Executives need visibility without getting into the weeds.",
      healthcareExample: "Executive dashboard spec: What the CEO should see monthly — adoption metrics, value delivered, risk indicators, strategic milestones.",
      healthcareNote: "Define what \"good\" looks like at the executive level.",
      financeExample: "90-day strategic checkpoint framework: What should be true at 30, 60, 90 days — executive-level success criteria.",
      financeNote: "Frodo from NBIM: \"His leadership and enthusiasm about AI is really setting the scene internally.\""
    },
    adoption: {
      contentType: "Strategic progress reports, competitive intelligence briefings",
      whyItMatters: "Executives need to know if the investment is paying off — and how they compare to peers.",
      healthcareExample: "Quarterly strategic review template: Value delivered, lessons learned, next quarter priorities, competitive positioning.",
      healthcareNote: "Make the executive-Anthropic relationship feel like a strategic partnership, not a vendor relationship.",
      financeExample: "Peer benchmarking brief: \"Here's what leading firms are doing with Claude\" — executives are motivated by competitive dynamics.",
      financeNote: "The keynote panels exist partly for this purpose — peer proof."
    },
    expansion: {
      contentType: "Strategic roadmap co-development, multi-year partnership frameworks",
      whyItMatters: "Executives think in years, not quarters. Expansion content should match that timeframe.",
      healthcareExample: "AI transformation roadmap: Year 1 = foundation, Year 2 = integration, Year 3 = transformation — the long arc.",
      healthcareNote: "Healthcare keynote mentioned \"AI as a partner with a long-term vision — over years, how to achieve progressive speed.\"",
      financeExample: "Strategic partnership proposal: Beyond tools — how Anthropic and the firm can co-develop industry-specific capabilities.",
      financeNote: "\"The research-product flywheel is a critical part of Anthropic strategy.\""
    }
  }
};

// Principles data
const principles = [
  {
    icon: Shield,
    title: "The trust framework",
    content: `Most AI companies lead with technical capabilities. Anthropic leads with mission alignment. Enterprise customers — especially in regulated industries — evaluate partners on three levels:

1. **Culture & mindset** — Do you respect the criticality of what we do?
2. **Domain understanding** — Do you know our nuances and requirements?
3. **Technical safeguards** — Can you prove it's safe?

Most competitors have #3. Fewer have #2. Almost none have #1. Anthropic does. Content design reinforces this at every touchpoint.`
  },
  {
    icon: UserCheck,
    title: "Human in the loop",
    content: `Enterprise AI requires deliberate offramps for human review. This isn't a limitation — it's a feature. Content designers define:

- When to surface decisions for approval
- How to make AI reasoning visible and auditable
- Where "visible seams" build trust instead of eroding it

The goal isn't seamless automation. It's confident collaboration.`
  },
  {
    icon: Scale,
    title: "The regulatory tension",
    content: `In financial services and healthcare, there's an eternal tension: innovation vs. "20 checkers for 1 doer." Content design sits at this intersection, helping organizations:

- Move fast without breaking compliance
- Give risk teams the evidence they need
- Frame AI adoption as risk *reduction*, not risk addition

The CCO and the VP of Sales Ops have different concerns. Content strategy accounts for both.`
  },
  {
    icon: Network,
    title: "Anthropic as broker",
    content: `One insight from Anthropic's healthcare keynote resonated deeply: Anthropic can serve as a broker between payers and providers — enabling intelligence sharing, data integration, and infrastructure connection that neither party could build alone.

This is a content design challenge. It requires language that builds trust across organizational boundaries, not just within them.`
  }
];

// Image modal component
function ImageModal({
  image,
  caption,
  onClose
}: {
  image: string;
  caption: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
        aria-label="Close"
      >
        <X className="w-8 h-8" />
      </button>
      <div
        className="max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video bg-white rounded-lg overflow-hidden">
          <Image
            src={image}
            alt={caption}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
        <p className="mt-4 text-white text-center text-sm">
          {caption}
        </p>
      </div>
    </div>
  );
}

export default function AnthropicPage() {
  const [selectedAudience, setSelectedAudience] = useState("practitioners");
  const [selectedStage, setSelectedStage] = useState(0);
  const [expandedImage, setExpandedImage] = useState<{ image: string; caption: string } | null>(null);

  const currentCell = contentMatrix[selectedAudience]?.[journeyStages[selectedStage].id];

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero Section */}
      <section className="text-center pt-8">
        {/* Anthropic logo placeholder */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4A574] to-[#CC785C] flex items-center justify-center">
            <span className="text-white text-2xl font-bold">A</span>
          </div>
        </div>

        <h1 className="text-4xl lg:text-6xl font-display font-bold text-text-primary mb-4">
          Thoughts on content, trust, and AI
        </h1>
        <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
          How I'd approach enterprise content design at Anthropic.
        </p>
        <a href={PORTFOLIO_DECK_URL} target="_blank" rel="noopener noreferrer">
          <Button variant="primary" size="lg">
            View portfolio presentation
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </a>
      </section>

      {/* Introduction */}
      <section className="max-w-3xl">
        <div className="prose prose-lg text-text-secondary space-y-6">
          <p>
            I've been at least 15 different types of content practitioner for at least 100 different types of users. Whether I'm leading workshops to chart a team's content systems, defining experiment thresholds, or writing the tooltip that helps a compliance officer trust an AI recommendation — I never lose sight of my goals to simplify, share, and learn.
          </p>
          <p>
            I work within Beth Dunn's Full-Stack Content Design model because it allows me to pursue intuitive experiences while ensuring my teammates feel comfortable adopting a content mindset. Content systems are a design team's superpower. So instead of sitting in a corner creating content magic, I prefer to act as a source of education and empowerment for those around me.
          </p>
          <p>
            What follows is my understanding of enterprise AI content strategy — specifically, how a content designer can help Anthropic's Enterprise Growth team build trust with the complex, multi-stakeholder audiences that define healthcare and financial services.
          </p>
        </div>
      </section>

      {/* Principles Section */}
      <section>
        <h2 className="text-2xl lg:text-3xl font-display font-bold text-text-primary mb-8">
          What I understand about enterprise AI
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {principles.map((principle) => (
            <Card key={principle.title} className="h-full">
              <CardContent className="h-full">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-palm-leaf/10 flex items-center justify-center flex-shrink-0">
                    <principle.icon className="w-6 h-6 text-palm-leaf" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-text-primary mb-3">
                      {principle.title}
                    </h3>
                    <div className="text-sm text-text-secondary whitespace-pre-line">
                      {principle.content.split('\n').map((line, i) => {
                        if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ')) {
                          const [num, ...rest] = line.split('**');
                          return (
                            <p key={i} className="ml-4">
                              {num}<strong>{rest.join('**').replace(/\*\*/g, '')}</strong>
                            </p>
                          );
                        }
                        if (line.startsWith('- ')) {
                          return <p key={i} className="ml-4">{line}</p>;
                        }
                        if (line.trim() === '') return <br key={i} />;
                        return <p key={i}>{line}</p>;
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Content Matrix Section */}
      <section>
        <h2 className="text-2xl lg:text-3xl font-display font-bold text-text-primary mb-4">
          Content strategy across audiences and journeys
        </h2>
        <p className="text-text-secondary mb-8 max-w-3xl">
          Enterprise deals involve multiple stakeholders with different concerns, different vocabulary, and different moments of influence. The matrix below maps content opportunities across five audience types and six journey stages — with examples from healthcare and financial services contexts.
        </p>

        {/* Audience Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2">
            {audiences.map((audience) => (
              <button
                key={audience.id}
                onClick={() => setSelectedAudience(audience.id)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                  selectedAudience === audience.id
                    ? "bg-palm-leaf text-white"
                    : "bg-soft-linen-light border border-soft-linen-dark text-text-secondary hover:border-palm-leaf hover:text-palm-leaf"
                )}
              >
                <span className="hidden md:inline">{audience.label}</span>
                <span className="md:hidden">{audience.shortLabel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Journey Slider */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setSelectedStage(Math.max(0, selectedStage - 1))}
              disabled={selectedStage === 0}
              className="p-2 rounded-lg bg-soft-linen-light border border-soft-linen-dark disabled:opacity-50 disabled:cursor-not-allowed hover:border-palm-leaf transition-colors"
              aria-label="Previous stage"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex-1 overflow-x-auto">
              <div className="flex gap-1 min-w-max">
                {journeyStages.map((stage, index) => (
                  <button
                    key={stage.id}
                    onClick={() => setSelectedStage(index)}
                    className={cn(
                      "flex-1 min-w-[100px] px-3 py-3 rounded-lg text-center transition-colors",
                      selectedStage === index
                        ? "bg-bronze-spice text-white"
                        : "bg-soft-linen-light border border-soft-linen-dark text-text-secondary hover:border-bronze-spice"
                    )}
                  >
                    <div className="text-sm font-medium">{stage.label}</div>
                    <div className={cn(
                      "text-xs mt-1",
                      selectedStage === index ? "text-white/80" : "text-text-muted"
                    )}>
                      "{stage.description}"
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedStage(Math.min(journeyStages.length - 1, selectedStage + 1))}
              disabled={selectedStage === journeyStages.length - 1}
              className="p-2 rounded-lg bg-soft-linen-light border border-soft-linen-dark disabled:opacity-50 disabled:cursor-not-allowed hover:border-palm-leaf transition-colors"
              aria-label="Next stage"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2">
            {journeyStages.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedStage(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  selectedStage === index ? "bg-bronze-spice" : "bg-soft-linen-dark"
                )}
                aria-label={`Go to stage ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Content Cell */}
        {currentCell && (
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {/* Header */}
              <div className="bg-soft-linen-dark/50 px-6 py-4 border-b border-soft-linen-dark">
                <div className="text-sm text-text-muted mb-1">Content type</div>
                <div className="font-display font-bold text-text-primary">
                  {currentCell.contentType}
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Why it matters */}
                <div>
                  <h4 className="font-semibold text-text-primary mb-2">Why it matters</h4>
                  <p className="text-text-secondary">{currentCell.whyItMatters}</p>
                </div>

                {/* Examples */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Healthcare */}
                  <div className="bg-soft-linen/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Stethoscope className="w-5 h-5 text-palm-leaf" />
                      <span className="font-semibold text-text-primary">Healthcare example</span>
                    </div>
                    <p className="text-sm text-text-secondary mb-2">{currentCell.healthcareExample}</p>
                    {currentCell.healthcareNote && (
                      <p className="text-xs text-text-muted italic">
                        Anthropic opportunity: {currentCell.healthcareNote}
                      </p>
                    )}
                  </div>

                  {/* Financial Services */}
                  <div className="bg-soft-linen/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="w-5 h-5 text-bronze-spice" />
                      <span className="font-semibold text-text-primary">Financial services example</span>
                    </div>
                    <p className="text-sm text-text-secondary mb-2">{currentCell.financeExample}</p>
                    {currentCell.financeNote && (
                      <p className="text-xs text-text-muted italic">
                        Anthropic reference: {currentCell.financeNote}
                      </p>
                    )}
                  </div>
                </div>

                {/* Portfolio Parallel */}
                {currentCell.portfolioParallel && (
                  <div className="border-t border-soft-linen-dark pt-6">
                    <h4 className="font-semibold text-text-primary mb-3">Portfolio parallel</h4>
                    <button
                      onClick={() => setExpandedImage(currentCell.portfolioParallel!)}
                      className="group flex gap-4 items-start text-left w-full"
                    >
                      <div className="relative w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-soft-linen-dark group-hover:border-palm-leaf transition-colors">
                        <Image
                          src={currentCell.portfolioParallel.image}
                          alt={currentCell.portfolioParallel.caption}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <p className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                          {currentCell.portfolioParallel.caption}
                        </p>
                        <span className="text-xs text-palm-leaf mt-2 inline-block">
                          Click to expand
                        </span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {/* CTA / Closing Section */}
      <section className="text-center py-12 px-6 bg-soft-linen-light border border-soft-linen-dark rounded-lg">
        <h2 className="text-2xl lg:text-3xl font-display font-bold text-text-primary mb-6">
          Ready to build
        </h2>

        <div className="max-w-2xl mx-auto space-y-4 text-text-secondary mb-8">
          <p className="text-lg">
            I figure out what matters. I act on it. And I learn from it fast.
          </p>
          <p>
            That's <strong className="text-text-primary">speed</strong>, <strong className="text-text-primary">agency</strong>, and <strong className="text-text-primary">philosophy</strong> — the three principles that guide my work. Speed means shipping and learning from reality. Agency means ownership without waiting for permission. Philosophy means caring about the <em>why</em> so principles can scale.
          </p>
          <p>
            These three check each other. Philosophy prevents reckless speed. Speed prevents theoretical philosophy. Agency reconciles them in the work itself.
          </p>
          <p>
            I'm ready to bring this approach to Anthropic's Enterprise Growth team — building the content systems that earn trust across regulated industries, complex buying committees, and the practitioners who do the work.
          </p>
        </div>

        <a href={PORTFOLIO_DECK_URL} target="_blank" rel="noopener noreferrer">
          <Button variant="primary" size="lg">
            View portfolio presentation
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </a>

        <p className="mt-6 text-text-muted">
          <a href="mailto:jason@jsnfx.com" className="hover:text-palm-leaf transition-colors">
            jason@jsnfx.com
          </a>
        </p>
      </section>

      {/* Image Modal */}
      {expandedImage && (
        <ImageModal
          image={expandedImage.image}
          caption={expandedImage.caption}
          onClose={() => setExpandedImage(null)}
        />
      )}
    </div>
  );
}

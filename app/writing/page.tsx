import { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, Divider } from "@/components/ui";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Creative writing",
  description:
    "Fiction and nonfiction publications in literary magazines and journals.",
};

const fictionWorks = [
  {
    title: "Subfloor",
    publication: "X-R-A-Y",
    date: "February 2020",
    link: "https://xraylitmag.com/subfloor-by-jason-fox/fiction/",
  },
  {
    title: "Exactly like her",
    publication: "Riggwelter Press",
    date: "September 2020",
    link: "https://issuu.com/riggwelter/docs/issue_30/56",
  },
  {
    title: "Taco Bank",
    publication: "The Daily Drunk",
    date: "November 2020",
    link: "https://dailydrunkmag.com/2020/12/11/taco-bank/",
  },
  {
    title: "Had to be egg",
    publication: "Variety Pack",
    date: "February 2021",
    link: "https://issuu.com/varietypackzine/docs/varietypackissuefour/96",
  },
  {
    title: "I was 50 miles south on 101",
    publication: "(mac)ro(mic)",
    date: "February 2021",
    link: "https://macromic.org/2021/02/05/im-fifty-miles-south-on-101-by-jason-fox/",
  },
  {
    title: "Into the fold",
    publication: "Oyez Review",
    date: "April 2021",
    link: "https://medium.com/oyez-review/into-the-fold-by-jason-fox-2a3084ce6c24",
  },
];

const nonfictionWorks = [
  {
    title: "Oakfall",
    publication: "Autofocus",
    date: "2021",
    link: "https://www.autofocuslit.com/mag/oakfall",
  },
];

export default function WritingPage() {
  return (
    <>
      <PageHeader
        title="Creative writing"
        description="Beyond content design, I write fiction and creative nonfiction. Here are some pieces that found homes in literary magazines."
      />

      {/* Featured Quote */}
      <blockquote className="my-8 p-6 bg-soft-linen-light border-l-4 border-palm-leaf rounded-r-lg">
        <p className="text-lg italic text-text-secondary">
          "Your refrigerator is yawning. It spills an egg-yellow rectangle on
          the floor. A ticking clock somewhere beyond. Then the fridge door
          closes and seals itself with a magnetic kiss. Plum dawn darkness
          washes in."
        </p>
        <cite className="block mt-3 text-sm text-text-muted not-italic">
          — from "Subfloor" in X-R-A-Y
        </cite>
      </blockquote>

      {/* Fiction Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-display font-bold text-text-primary mb-6">
          Fiction
        </h2>
        <div className="space-y-3">
          {fictionWorks.map((work) => (
            <a
              key={work.title}
              href={work.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-lg bg-soft-linen-light border border-soft-linen-dark hover:border-palm-leaf hover:bg-palm-leaf/5 transition-all group"
            >
              <div>
                <h3 className="font-medium text-text-primary group-hover:text-palm-leaf transition-colors">
                  {work.title}
                </h3>
                <p className="text-sm text-text-muted">
                  {work.publication} • {work.date}
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-palm-leaf transition-colors" />
            </a>
          ))}
        </div>
      </section>

      <Divider />

      {/* Nonfiction Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-display font-bold text-text-primary mb-6">
          Nonfiction
        </h2>
        <div className="space-y-3">
          {nonfictionWorks.map((work) => (
            <a
              key={work.title}
              href={work.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-lg bg-soft-linen-light border border-soft-linen-dark hover:border-palm-leaf hover:bg-palm-leaf/5 transition-all group"
            >
              <div>
                <h3 className="font-medium text-text-primary group-hover:text-palm-leaf transition-colors">
                  {work.title}
                </h3>
                <p className="text-sm text-text-muted">
                  {work.publication} • {work.date}
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-palm-leaf transition-colors" />
            </a>
          ))}
        </div>
      </section>
    </>
  );
}

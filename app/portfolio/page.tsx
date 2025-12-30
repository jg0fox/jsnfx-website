import { Metadata } from "next";
import { PageHeader } from "@/components/layout";
import { PortfolioCard } from "@/components/portfolio";
import { getPortfolioItems } from "@/lib/content";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Content design case studies from Atlassian, Robinhood, Chime, Netflix, and Oracle.",
};

export default async function PortfolioPage() {
  const portfolioItems = await getPortfolioItems();

  return (
    <>
      <PageHeader
        title="Portfolio"
        description="Case studies showcasing content design work across fintech, enterprise SaaS, and consumer products."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {portfolioItems.map((item) => (
          <PortfolioCard
            key={item.slug}
            slug={item.slug}
            title={item.title}
            description={item.description}
            category={item.category}
            company={item.company}
            thumbnail={item.thumbnail}
          />
        ))}
      </div>
    </>
  );
}

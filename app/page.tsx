import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, Tag, Button } from "@/components/ui";
import { ExternalLink } from "lucide-react";

const principles = [
  {
    title: "Embrace systems",
    description: "Consistency, connectedness, and scale",
    bgColor: "bg-soft-linen-dark",
    image: "/images/principle-systems.png",
  },
  {
    title: "Empower people",
    description: "Thriving individuals fuel business growth",
    bgColor: "bg-palm-leaf/20",
    image: "/images/principle-people.png",
  },
  {
    title: "Use evidence",
    description: "Data enhances intuition",
    bgColor: "bg-palm-leaf-2/20",
    image: "/images/principle-evidence.png",
  },
  {
    title: "Experiment",
    description: "Failure is a learning opportunity",
    bgColor: "bg-palm-leaf-3/15",
    image: "/images/principle-experiment.png",
  },
];

const talks = [
  {
    title: "Hold my 🎉",
    event: "Button Conf 2023",
    description:
      "A talk on how we've gone overboard with celebration in UX content and how to get back on track.",
    link: "https://www.buttonconf.com/speakers/jason-fox",
  },
  {
    title: "Elevating product experience with tone",
    event: "The UX Content Collective",
    description:
      "Exploring how to create deep, nuanced shades of tone that accommodate end-to-end experiences.",
    link: "https://uxcontent.com/workshop-activating-ux-content-with-poetics/",
  },
  {
    title: "Advanced Figma for content designers",
    event: "The UX Content Collective",
    description:
      "Teaching content designers to enhance their work through content-first practices in Figma.",
    link: "https://uxcontent.com/workshop-advanced-figma-for-content-designers/",
  },
  {
    title: "Content operations at scale",
    event: "Button Workshop Days",
    description:
      "A 2-day workshop on how to plan, build, and implement content design at scale.",
    link: "https://www.buttonevents.com/events/content-operations-how-to-plan-build-and-implement-content-design-at-scale",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1">
          <h1 className="text-3xl lg:text-5xl font-display font-bold text-text-primary mb-4">
            One of the many Jason Foxes
          </h1>
          <p className="text-lg text-text-secondary mb-6">
            I'm a content designer at Atlassian and yes the double "at" bothers
            me.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/portfolio">
              <Button variant="primary">View portfolio</Button>
            </Link>
            <a href="mailto:jason@jsnfx.com">
              <Button variant="ghost">Get in touch</Button>
            </a>
          </div>
        </div>
        <div className="w-full md:w-64 lg:w-80 flex-shrink-0">
          <div className="relative aspect-square">
            <Image
              src="/images/jason-illustrated.png"
              alt="Illustration of Jason Fox"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 100vw, 320px"
            />
          </div>
        </div>
      </section>

      {/* Content Design Principles */}
      <section>
        <h2 className="text-2xl lg:text-3xl font-display font-bold text-text-primary mb-6">
          My content design principles
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {principles.map((principle) => (
            <div
              key={principle.title}
              className={`${principle.bgColor} rounded-xl p-4 flex flex-col`}
            >
              {/* Illustration area - fixed height for alignment */}
              <div className="h-28 lg:h-36 flex items-center justify-center mb-3">
                <div className="relative w-24 h-24 lg:w-32 lg:h-32">
                  <Image
                    src={principle.image}
                    alt={principle.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              {/* Text content */}
              <div>
                <h3 className="font-display font-bold text-base lg:text-lg text-text-primary">
                  {principle.title}
                </h3>
                <p className="text-sm text-text-secondary mt-1">
                  {principle.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Talks & Workshops */}
      <section>
        <h2 className="text-2xl lg:text-3xl font-display font-bold text-text-primary mb-4">
          Recent talks and workshops
        </h2>
        <p className="text-text-secondary mb-6">
          I'm passionate about showing and sharing my work with the content
          community. In addition to regularly speaking at conferences, I've also
          designed and run a variety of workshops at shops like The UX Content
          Collective.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {talks.map((talk) => (
            <Card key={talk.title} interactive>
              <a
                href={talk.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <CardContent>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Tag size="sm" className="mb-2">
                        {talk.event}
                      </Tag>
                      <h3 className="font-display font-bold text-lg text-text-primary">
                        {talk.title}
                      </h3>
                      <p className="text-sm text-text-secondary mt-2">
                        {talk.description}
                      </p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-text-muted flex-shrink-0" />
                  </div>
                </CardContent>
              </a>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-soft-linen-light border border-soft-linen-dark rounded-lg p-8 text-center">
        <h2 className="text-2xl font-display font-bold text-text-primary mb-3">
          Let's connect
        </h2>
        <p className="text-text-secondary mb-6 max-w-md mx-auto">
          Looking for a content designer who cares deeply about craft and
          systems? I'd love to chat.
        </p>
        <a href="mailto:jason@jsnfx.com">
          <Button variant="primary" size="lg">
            jason@jsnfx.com
          </Button>
        </a>
      </section>
    </div>
  );
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glossolalia",
  description:
    "An interactive study guide on linguistic vulnerabilities for AI safety. 19 phenomena, 47 sources, and hands-on exercises.",
  alternates: { canonical: "/glossolalia" },
};

export default function GlossalaliaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Videos, tools, and articles on content design, UX writing, and the craft of language in digital products.",
  alternates: {
    canonical: "/resources",
  },
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

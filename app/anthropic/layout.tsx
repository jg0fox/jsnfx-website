import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notes on enterprise AI, trust, and content design",
  description:
    "My notes on enterprise AI content design — observations on trust frameworks, regulated industries, and principles from studying Anthropic's approach.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AnthropicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

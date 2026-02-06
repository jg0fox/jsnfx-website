import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thoughts on content, trust, and AI",
  description:
    "How I'd approach enterprise content design at Anthropic — building trust with complex, multi-stakeholder audiences in healthcare and financial services.",
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

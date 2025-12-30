import { compileMDX } from "next-mdx-remote/rsc";
import { MDXComponents } from "@/components/mdx/MDXComponents";

/**
 * Compile MDX content to React components
 */
export async function processMDX(source: string) {
  const { content } = await compileMDX({
    source,
    components: MDXComponents,
    options: {
      parseFrontmatter: false,
    },
  });

  return content;
}

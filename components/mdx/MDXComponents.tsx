import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { MDXComponents as MDXComponentsType } from "mdx/types";

/**
 * Custom heading component with anchor link
 */
function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const HeadingComponent = ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    const id =
      typeof children === "string"
        ? children.toLowerCase().replace(/\s+/g, "-")
        : undefined;

    const sizeClasses = {
      1: "text-3xl lg:text-4xl mt-8 mb-4",
      2: "text-2xl lg:text-3xl mt-8 mb-4",
      3: "text-xl lg:text-2xl mt-6 mb-3",
      4: "text-lg lg:text-xl mt-4 mb-2",
      5: "text-base lg:text-lg mt-4 mb-2",
      6: "text-base mt-4 mb-2",
    };

    return (
      <Tag
        id={id}
        className={cn(
          "font-display font-bold text-text-primary scroll-mt-20",
          sizeClasses[level]
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  };

  HeadingComponent.displayName = `Heading${level}`;
  return HeadingComponent;
}

/**
 * Custom image component
 */
function MDXImage({
  src,
  alt,
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  if (!src || typeof src !== "string") return null;

  // Handle relative paths
  const imageSrc = src.startsWith("./") ? src.replace("./", "/images/") : src;

  return (
    <figure className="my-8 overflow-hidden rounded-lg border border-soft-linen-dark">
      <div className="relative aspect-[4/3] bg-soft-linen-light">
        <Image
          src={imageSrc}
          alt={alt || ""}
          fill
          className="object-contain p-2"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 800px"
        />
      </div>
      {alt && (
        <figcaption className="py-2 px-3 text-sm text-text-muted text-center bg-soft-linen-light border-t border-soft-linen-dark">
          {alt}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Custom link component
 */
function MDXLink({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isExternal = href?.startsWith("http");

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-palm-leaf-3 underline underline-offset-2 hover:text-bronze-spice transition-colors"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href || "#"}
      className="text-palm-leaf-3 underline underline-offset-2 hover:text-bronze-spice transition-colors"
      {...props}
    >
      {children}
    </Link>
  );
}

/**
 * Callout/highlight box component
 */
function Callout({
  children,
  type = "info",
}: {
  children: React.ReactNode;
  type?: "info" | "warning" | "success";
}) {
  const styles = {
    info: "border-palm-leaf bg-palm-leaf/5",
    warning: "border-bronze-spice bg-bronze-spice/5",
    success: "border-palm-leaf-3 bg-palm-leaf-3/5",
  };

  return (
    <div
      className={cn(
        "my-6 p-4 border-l-4 rounded-r-lg",
        styles[type]
      )}
    >
      {children}
    </div>
  );
}

/**
 * All MDX component mappings
 */
export const MDXComponents: MDXComponentsType = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),

  p: ({ children, ...props }) => {
    // Check if children contains only an image (MDX wraps images in <p> tags)
    // If so, render the image directly without the <p> wrapper to avoid hydration errors
    const childArray = React.Children.toArray(children);
    if (
      childArray.length === 1 &&
      React.isValidElement(childArray[0]) &&
      (childArray[0].type === "img" || childArray[0].type === MDXImage)
    ) {
      return <>{children}</>;
    }

    return (
      <p className="my-4 text-text-secondary leading-relaxed" {...props}>
        {children}
      </p>
    );
  },

  a: MDXLink,
  img: MDXImage,

  ul: ({ children, ...props }) => (
    <ul className="my-4 ml-6 list-disc text-text-secondary space-y-2" {...props}>
      {children}
    </ul>
  ),

  ol: ({ children, ...props }) => (
    <ol className="my-4 ml-6 list-decimal text-text-secondary space-y-2" {...props}>
      {children}
    </ol>
  ),

  li: ({ children, ...props }) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),

  blockquote: ({ children, ...props }) => (
    <blockquote
      className="my-6 pl-4 border-l-4 border-palm-leaf italic text-text-secondary"
      {...props}
    >
      {children}
    </blockquote>
  ),

  code: ({ children, ...props }) => (
    <code
      className="px-1.5 py-0.5 rounded bg-soft-linen-dark text-sm font-mono text-text-primary"
      {...props}
    >
      {children}
    </code>
  ),

  pre: ({ children, ...props }) => (
    <pre
      className="my-6 p-4 rounded-lg bg-text-primary text-soft-linen-light overflow-x-auto"
      {...props}
    >
      {children}
    </pre>
  ),

  hr: () => <hr className="my-8 border-t border-soft-linen-dark" />,

  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-text-primary" {...props}>
      {children}
    </strong>
  ),

  em: ({ children, ...props }) => (
    <em className="italic" {...props}>
      {children}
    </em>
  ),

  // Custom components that can be used in MDX
  Callout,
};

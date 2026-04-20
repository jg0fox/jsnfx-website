"use client";

import { useState } from "react";
import { Lightbox } from "./Lightbox";

interface LightboxImageProps {
  src: string;
  alt: string;
  children: React.ReactNode;
}

export function LightboxImage({ src, alt, children }: LightboxImageProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label={`View expanded: ${alt || "image"}`}
        className="cursor-zoom-in transition-opacity hover:opacity-90"
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        {children}
      </div>
      <Lightbox
        src={src}
        alt={alt}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

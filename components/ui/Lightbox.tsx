"use client";

import { useEffect, useCallback, useRef } from "react";
import { X } from "lucide-react";

interface LightboxProps {
  src: string;
  alt: string;
  open: boolean;
  onClose: () => void;
}

export function Lightbox({ src, alt, open, onClose }: LightboxProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={alt || "Expanded image"}
      style={{ animation: "lightbox-fade-in 200ms ease-out" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/90 p-4 md:p-8 lg:p-12"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <button
        ref={closeButtonRef}
        onClick={onClose}
        aria-label="Close lightbox"
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
      >
        <X className="w-6 h-6" />
      </button>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt || ""}
        className="max-w-full max-h-[85vh] object-contain cursor-zoom-out rounded-lg"
        onClick={onClose}
      />

      {alt && (
        <p className="mt-3 text-sm text-white/70 text-center max-w-2xl">
          {alt}
        </p>
      )}
    </div>
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Play, X } from "lucide-react";
import { cn } from "@/lib/utils";

const FIGMA_PURPLE = "#A259FF";

type VideoLightboxContextValue = {
  openId: number | null;
  openVideo: (id: number) => void;
  closeVideo: () => void;
};

const VideoLightboxContext = createContext<VideoLightboxContextValue>({
  openId: null,
  openVideo: () => {},
  closeVideo: () => {},
});

export function VideoLightboxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openId, setOpenId] = useState<number | null>(null);

  const openVideo = useCallback((id: number) => setOpenId(id), []);
  const closeVideo = useCallback(() => setOpenId(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (openId !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [openId]);

  return (
    <VideoLightboxContext.Provider value={{ openId, openVideo, closeVideo }}>
      {children}
      {openId !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Video player"
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 md:p-8"
          style={{ animation: "lightbox-fade-in 200ms ease-out" }}
          onClick={closeVideo}
        >
          <button
            type="button"
            onClick={closeVideo}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            aria-label="Close video"
          >
            <X className="w-8 h-8" />
          </button>
          <div
            className="w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://player.vimeo.com/video/${openId}?autoplay=1`}
              className="w-full h-full rounded-lg"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Video player"
            />
          </div>
        </div>
      )}
    </VideoLightboxContext.Provider>
  );
}

function useVideoLightbox() {
  return useContext(VideoLightboxContext);
}

interface VideoSidebarRowProps {
  id: number;
  title: string;
  duration: string;
  thumbnail: string;
}

export function VideoSidebarRow({
  id,
  title,
  duration,
  thumbnail,
}: VideoSidebarRowProps) {
  const { openVideo } = useVideoLightbox();

  return (
    <button
      type="button"
      onClick={() => openVideo(id)}
      className="flex items-center gap-3 p-2.5 group hover:bg-soft-linen-dark/30 transition-colors w-full text-left cursor-pointer"
    >
      <div className="relative w-[72px] aspect-video bg-soft-linen-dark rounded-sm overflow-hidden flex-shrink-0">
        <Image
          src={thumbnail}
          alt=""
          fill
          className="object-cover"
          sizes="72px"
          unoptimized
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
            style={{ backgroundColor: FIGMA_PURPLE }}
          >
            <Play className="w-2.5 h-2.5 text-white fill-white ml-0.5" />
          </div>
        </div>
        <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-white text-[9px] leading-none px-1 py-0.5 rounded font-medium">
          {duration}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[13px] font-semibold text-text-primary leading-snug group-hover:text-palm-leaf transition-colors line-clamp-2">
          {title}
        </h4>
      </div>
      <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-palm-leaf group-hover:translate-x-0.5 transition-all flex-shrink-0" />
    </button>
  );
}

interface MobileVideoListProps {
  eyebrow: string;
  items: { id: number; title: string }[];
}

export function MobileVideoList({ eyebrow, items }: MobileVideoListProps) {
  const { openVideo } = useVideoLightbox();

  return (
    <div className="xl:hidden mt-5 rounded-lg border border-soft-linen-dark bg-soft-linen-light/60 p-4">
      <div className="flex items-center gap-2 mb-2.5">
        <span
          className="h-px w-4"
          style={{ backgroundColor: FIGMA_PURPLE, opacity: 0.5 }}
        />
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: FIGMA_PURPLE }}
        >
          {eyebrow}
        </span>
      </div>
      <ul className="divide-y divide-soft-linen-dark/60">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => openVideo(item.id)}
              className={cn(
                "flex items-center justify-between gap-3 py-2.5 group w-full text-left cursor-pointer"
              )}
            >
              <span className="flex items-center gap-2 text-sm text-text-primary group-hover:text-palm-leaf transition-colors">
                <Play
                  className="w-3 h-3 fill-current flex-shrink-0"
                  style={{ color: FIGMA_PURPLE }}
                />
                {item.title}
              </span>
              <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-palm-leaf group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

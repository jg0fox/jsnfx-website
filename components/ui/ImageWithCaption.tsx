import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageWithCaptionProps {
  src: string;
  alt: string;
  caption?: string;
  aspectRatio?: "video" | "square" | "portrait" | "auto";
  priority?: boolean;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
}

export function ImageWithCaption({
  src,
  alt,
  caption,
  aspectRatio = "video",
  priority = false,
  className,
  fill = true,
  width,
  height,
}: ImageWithCaptionProps) {
  const aspectRatioClasses = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    auto: "",
  };

  return (
    <figure className={cn("overflow-hidden rounded-lg", className)}>
      <div
        className={cn(
          "relative overflow-hidden bg-soft-linen",
          aspectRatioClasses[aspectRatio]
        )}
      >
        {fill ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 50vw"
            priority={priority}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="object-cover w-full h-auto"
            priority={priority}
          />
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-text-muted text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

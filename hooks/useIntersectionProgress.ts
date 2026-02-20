"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export function useIntersectionProgress(sectionIds: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const elementsRef = useRef<Map<string, HTMLElement>>(new Map());

  const setRef = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      if (el) {
        elementsRef.current.set(id, el);
      } else {
        elementsRef.current.delete(id);
      }
    },
    []
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let bestEntry: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (
            entry.isIntersecting &&
            (!bestEntry ||
              entry.intersectionRatio > bestEntry.intersectionRatio)
          ) {
            bestEntry = entry;
          }
        }
        if (bestEntry) {
          setActiveId(bestEntry.target.id);
        }
      },
      {
        threshold: [0, 0.1, 0.25, 0.5],
        rootMargin: "-80px 0px -60% 0px",
      }
    );

    const elements = elementsRef.current;
    for (const el of elements.values()) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sectionIds]);

  const progress =
    activeId && sectionIds.length > 0
      ? (sectionIds.indexOf(activeId) + 1) / sectionIds.length
      : 0;

  return { activeId, setRef, progress };
}

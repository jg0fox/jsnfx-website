"use client";

import { createContext, useContext, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const NETFLIX_RED = "#E50914";

type CalloutsContextValue = {
  openId: string | null;
  toggle: (id: string) => void;
};

const CalloutsContext = createContext<CalloutsContextValue>({
  openId: null,
  toggle: () => {},
});

export function CalloutsProvider({ children }: { children: React.ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const toggle = (id: string) =>
    setOpenId((prev) => (prev === id ? null : id));

  return (
    <CalloutsContext.Provider value={{ openId, toggle }}>
      {children}
    </CalloutsContext.Provider>
  );
}

interface RailAccordionProps {
  id: string;
  label: string;
  count?: number;
  attention?: boolean;
  children: React.ReactNode;
}

export function RailAccordion({
  id,
  label,
  count,
  attention = false,
  children,
}: RailAccordionProps) {
  const { openId, toggle } = useContext(CalloutsContext);
  const isOpen = openId === id;
  const [interacted, setInteracted] = useState(false);
  const contentId = `callout-${id}`;
  const showAttention = attention && !interacted && !isOpen;

  const handleToggle = () => {
    if (!interacted) setInteracted(true);
    toggle(id);
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="group flex items-center gap-2 w-full text-left py-1.5 cursor-pointer"
      >
        <span
          className="h-px w-6 transition-opacity duration-200"
          style={{
            backgroundColor: NETFLIX_RED,
            opacity: isOpen ? 0.7 : 0.4,
          }}
        />
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.18em] group-hover:opacity-80 transition-opacity"
          style={{ color: NETFLIX_RED }}
        >
          {label}
        </span>
        {count !== undefined && (
          <span
            className="text-[10px] font-semibold tabular-nums"
            style={{ color: NETFLIX_RED, opacity: 0.55 }}
          >
            {count}
          </span>
        )}
        {showAttention ? (
          <motion.span
            className="inline-flex"
            style={{ transformOrigin: "center" }}
            animate={{
              rotate: [-14, 14, -10, 6, 0, 0, 0, 0, 0],
              scale: [1.05, 1.1, 1.08, 1.04, 1, 1, 1, 1, 1],
              filter: [
                "drop-shadow(0 0 6px rgba(229, 9, 20, 0.7))",
                "drop-shadow(0 0 10px rgba(229, 9, 20, 0.9))",
                "drop-shadow(0 0 8px rgba(229, 9, 20, 0.8))",
                "drop-shadow(0 0 5px rgba(229, 9, 20, 0.6))",
                "drop-shadow(0 0 0px rgba(229, 9, 20, 0))",
                "drop-shadow(0 0 0px rgba(229, 9, 20, 0))",
                "drop-shadow(0 0 0px rgba(229, 9, 20, 0))",
                "drop-shadow(0 0 0px rgba(229, 9, 20, 0))",
                "drop-shadow(0 0 0px rgba(229, 9, 20, 0))",
              ],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.03, 0.06, 0.09, 0.12, 0.3, 0.6, 0.9, 1],
            }}
          >
            <ChevronDown
              className="w-3.5 h-3.5"
              style={{ color: NETFLIX_RED, opacity: 0.85 }}
            />
          </motion.span>
        ) : (
          <span className="inline-flex">
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 transition-transform duration-200",
                isOpen && "rotate-180"
              )}
              style={{ color: NETFLIX_RED, opacity: 0.7 }}
            />
          </span>
        )}
      </button>

      <div
        id={contentId}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="pt-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

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
            className="inline-flex items-center justify-center"
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "9999px",
              transformOrigin: "center",
            }}
            animate={{
              rotate: [0, 0, -22, 22, -16, 8, 0, 0, 0, 0],
              scale: [1, 1.15, 1.4, 1.45, 1.35, 1.2, 1.05, 1, 1, 1],
              boxShadow: [
                "0 0 0px 0px rgba(229, 9, 20, 0)",
                "0 0 10px 2px rgba(229, 9, 20, 0.4)",
                "0 0 18px 4px rgba(229, 9, 20, 0.55)",
                "0 0 22px 5px rgba(229, 9, 20, 0.6)",
                "0 0 18px 4px rgba(229, 9, 20, 0.5)",
                "0 0 14px 3px rgba(229, 9, 20, 0.35)",
                "0 0 8px 1px rgba(229, 9, 20, 0.2)",
                "0 0 0px 0px rgba(229, 9, 20, 0)",
                "0 0 0px 0px rgba(229, 9, 20, 0)",
                "0 0 0px 0px rgba(229, 9, 20, 0)",
              ],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.02, 0.05, 0.08, 0.12, 0.18, 0.26, 0.35, 0.7, 1],
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

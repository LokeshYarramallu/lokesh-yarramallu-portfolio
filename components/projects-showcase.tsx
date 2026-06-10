"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─────────────────────── Data ─────────────────────── */

interface Project {
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  gradient: string;
  accentColor: string;
  link?: string;
}

const PROJECTS: Project[] = [
  {
    name: "AMRAssistant",
    tagline: "AI-Powered Antimicrobial Stewardship",
    description:
      "Multi-agent workflow using GRPO-based distillation for antimicrobial resistance stewardship. Features hybrid Vector–Graph–Web search RAG under MCP architecture with a custom memory pipeline.",
    stack: ["Multi-Agent", "GRPO", "MCP", "RAG", "Vector DB", "Graph DB"],
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    accentColor: "#10b981",
  },
  {
    name: "AutoBrowseMCP",
    tagline: "Natural Language Browser Automation",
    description:
      "Custom MCP server enabling natural language-driven browser automation via Playwright and Gemini. Engineered for stealth sessions, robust retries, and seamless integration with agentic LLM workflows.",
    stack: ["MCP", "Gemini", "Playwright", "AsyncIO", "LLMOps"],
    gradient: "from-violet-500/20 via-purple-500/10 to-transparent",
    accentColor: "#8b5cf6",
    link: "https://github.com/LokeshYarramallu",
  },
  {
    name: "BeyondBorders",
    tagline: "Multiplex Social Network Intelligence",
    description:
      "Social network intelligence using GNN with automated strategic analysis. Processes six edge types to identify multiplex communities and rank influencers across marketing categories for real-time campaign optimization.",
    stack: ["GNN", "NetworkX", "PyTorch", "Graph Analytics"],
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    accentColor: "#06b6d4",
  },
  {
    name: "HybridCode",
    tagline: "Intelligent Codebase Analysis Framework",
    description:
      "Intelligent code analysis system integrating Qdrant and Neo4j with Gemini for developer queries requiring both semantic understanding and structural code analysis. Includes multi-agent article generation with DistilBERT quality scoring.",
    stack: ["Agno", "Neo4j", "Qdrant", "Gemini", "Cohere", "HuggingFace"],
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    accentColor: "#f59e0b",
  },
  {
    name: "HealthAI",
    tagline: "AI-Powered Health Assistant",
    description:
      "AI health assistant with multilingual medical query handling via Llama3, CNN-based fracture detection, and disease prediction using XGBoost. Optimized with Intel oneAPI for high-performance inference.",
    stack: ["PyTorch", "Llama3", "XGBoost", "Intel oneAPI", "CNN"],
    gradient: "from-rose-500/20 via-pink-500/10 to-transparent",
    accentColor: "#f43f5e",
  },
];

/* ────────────────────── Helpers ───────────────────── */

function padIndex(i: number): string {
  return String(i + 1).padStart(2, "0");
}

/* ────────────────── GitHub Icon SVG ──────────────── */

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

/* ────────────────── Arrow Icon SVG ───────────────── */

function ChevronIcon({
  direction,
  className,
}: {
  direction: "left" | "right";
  className?: string;
}) {
  return (
    <svg
      className={cn("h-4 w-4", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {direction === "left" ? (
        <polyline points="15 18 9 12 15 6" />
      ) : (
        <polyline points="9 6 15 12 9 18" />
      )}
    </svg>
  );
}

/* ──────────────── Main Component ─────────────────── */

export function ProjectsShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const project = PROJECTS[activeIndex];

  /* ── Navigation helpers ── */

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % PROJECTS.length);
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length);
  }, []);

  /* ── Auto-advance (pause on hover) ── */

  useEffect(() => {
    if (isHovered) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(goNext, 6000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isHovered, goNext]);

  /* ── Keyboard navigation ── */

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  /* ── Variants ── */

  const cardVariants = {
    enter: { x: 30, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -30, opacity: 0 },
  };

  const pillVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.15 + i * 0.05, duration: 0.3, ease: "easeOut" },
    }),
  };

  return (
    <div
      className="flex w-full flex-col justify-between gap-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Card area ── */}
      <div className="relative w-full">
        {/* Arrow Buttons */}
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous project"
          className={cn(
            "absolute left-2 top-1/2 z-20 -translate-y-1/2",
            "flex h-9 w-9 items-center justify-center rounded-full",
            "border border-white/[0.08] bg-white/5 backdrop-blur-xl",
            "text-white/50 transition-all duration-200",
            "hover:bg-white/10 hover:text-white/80",
            "md:left-4 md:h-10 md:w-10"
          )}
        >
          <ChevronIcon direction="left" />
        </button>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next project"
          className={cn(
            "absolute right-2 top-1/2 z-20 -translate-y-1/2",
            "flex h-9 w-9 items-center justify-center rounded-full",
            "border border-white/[0.08] bg-white/5 backdrop-blur-xl",
            "text-white/50 transition-all duration-200",
            "hover:bg-white/10 hover:text-white/80",
            "md:right-4 md:h-10 md:w-10"
          )}
        >
          <ChevronIcon direction="right" />
        </button>

        {/* Animated card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "relative w-full overflow-hidden rounded-3xl",
              "border border-white/[0.08]",
              "bg-gradient-to-br",
              project.gradient,
              "p-6 md:p-8"
            )}
          >
            {/* Subtle inner glow overlay */}
            <div
              className="pointer-events-none absolute inset-0 rounded-3xl opacity-30"
              style={{
                background: `radial-gradient(ellipse at 20% 0%, ${project.accentColor}15, transparent 60%)`,
              }}
            />

            {/* ── Large faded number ── */}
            <span
              className="pointer-events-none absolute left-6 top-4 select-none text-7xl font-black leading-none text-white/[0.04]"
              aria-hidden
            >
              {padIndex(activeIndex)}
            </span>

            {/* ── GitHub link (if exists) ── */}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "absolute right-6 top-6 z-10",
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  "border border-white/[0.08] bg-white/5 backdrop-blur-md",
                  "text-white/40 transition-all duration-200",
                  "hover:bg-white/10 hover:text-white/80"
                )}
                aria-label={`View ${project.name} on GitHub`}
              >
                <GitHubIcon className="h-4 w-4" />
              </a>
            )}

            {/* ── Header ── */}
            <div className="relative z-10 mt-8 md:mt-6">
              <p className="mb-1 text-sm uppercase tracking-widest text-white/50">
                {project.tagline}
              </p>
              <h3 className="text-2xl font-bold text-white md:text-3xl">
                {project.name}
              </h3>
            </div>

            {/* ── Description ── */}
            <p className="relative z-10 mt-4 line-clamp-3 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
              {project.description}
            </p>

            {/* ── Tech stack pills ── */}
            <motion.div
              className="relative z-10 mt-6 flex flex-wrap gap-2"
              initial="hidden"
              animate="visible"
            >
              {project.stack.map((tech, i) => (
                <motion.span
                  key={tech}
                  custom={i}
                  variants={pillVariants as any}
                  className="rounded-full border px-3 py-1 text-xs text-white/70"
                  style={{
                    backgroundColor: `${project.accentColor}18`,
                    borderColor: `${project.accentColor}33`,
                  }}
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Dot navigation ── */}
      <div className="flex items-center justify-center gap-2">
        {PROJECTS.map((p, i) => (
          <button
            key={p.name}
            type="button"
            onClick={() => setActiveIndex(i)}
            aria-label={`Go to project ${p.name}`}
            className="group relative flex h-5 items-center justify-center"
          >
            <motion.span
              className="block h-2 rounded-full"
              animate={{
                width: i === activeIndex ? 32 : 8,
                backgroundColor:
                  i === activeIndex ? p.accentColor : "rgba(255,255,255,0.15)",
              }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

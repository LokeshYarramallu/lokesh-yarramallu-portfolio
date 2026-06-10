"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface SkillCategory {
  title: string;
  accent: string;
  icon: React.ReactNode;
  tags: string[];
}

const CoreEngineeringIcon = ({ color }: { color: string }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
    <line x1="14" y1="4" x2="10" y2="20" />
  </svg>
);

const AIResearchIcon = ({ color }: { color: string }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.8-3.5 6v2.5H8.5V15c-2.2-1.2-3.5-3.5-3.5-6a7 7 0 0 1 7-7z" />
    <line x1="9" y1="22" x2="15" y2="22" />
    <line x1="10" y1="19" x2="14" y2="19" />
    <circle cx="10" cy="9" r="1" fill={color} stroke="none" />
    <circle cx="14" cy="9" r="1" fill={color} stroke="none" />
  </svg>
);

const GenAIAgentsIcon = ({ color }: { color: string }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2l2.4 4.2L19 7.5l-3.2 3.5.5 5L12 14l-4.3 2 .5-5L5 7.5l4.6-1.3z" />
    <circle cx="12" cy="12" r="2" />
    <line x1="12" y1="16" x2="12" y2="22" />
    <line x1="9" y1="20" x2="15" y2="20" />
  </svg>
);

const DevToolsIcon = ({ color }: { color: string }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a3 3 0 0 1-4.2 4.2L7.5 19.5a2.1 2.1 0 0 1-3-3L14.3 6.7a3 3 0 0 1 4.2-4.2l-3.8 3.8z" />
  </svg>
);

const DatabasesInfraIcon = ({ color }: { color: string }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 5v6c0 1.7-4 3-9 3s-9-1.3-9-3V5" />
    <path d="M21 11v6c0 1.7-4 3-9 3s-9-1.3-9-3v-6" />
  </svg>
);

const FoundationsIcon = ({ color }: { color: string }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <line x1="9" y1="7" x2="16" y2="7" />
    <line x1="9" y1="11" x2="14" y2="11" />
  </svg>
);

const SKILLS: SkillCategory[] = [
  {
    title: "Core Engineering",
    accent: "#06b6d4",
    icon: <CoreEngineeringIcon color="#06b6d4" />,
    tags: ["Python", "OOP", "APIs", "SDK Design", "Microservices", "Testing", "CI/CD"],
  },
  {
    title: "AI & Research",
    accent: "#8b5cf6",
    icon: <AIResearchIcon color="#8b5cf6" />,
    tags: ["Machine Learning", "Deep Learning", "LLM Fine-tuning", "Optimization", "PyTorch"],
  },
  {
    title: "GenAI & Agents",
    accent: "#10b981",
    icon: <GenAIAgentsIcon color="#10b981" />,
    tags: [
      "LLMOps",
      "AgentOps",
      "MCP",
      "A2A",
      "Multi-Agent Workflows",
      "Hybrid RAG",
      "Memory Orchestration",
    ],
  },
  {
    title: "Developer Tools",
    accent: "#f59e0b",
    icon: <DevToolsIcon color="#f59e0b" />,
    tags: ["Git", "Docker", "VSCode", "GCP", "Claude", "FastAPI", "Django"],
  },
  {
    title: "Databases & Infra",
    accent: "#f43f5e",
    icon: <DatabasesInfraIcon color="#f43f5e" />,
    tags: ["Qdrant", "Neo4j", "Pinecone", "PostgreSQL", "DigitalOcean", "WebSockets"],
  },
  {
    title: "Foundations",
    accent: "#0ea5e9",
    icon: <FoundationsIcon color="#0ea5e9" />,
    tags: [
      "DSA",
      "Operating Systems",
      "Computer Networks",
      "DBMS",
      "Software Development",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const tagContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.15,
    },
  },
};

const tagVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function SkillsShowcase() {
  return (
    <section className="w-full px-4 py-4 sm:px-6 md:py-8 max-h-[60vh] overflow-y-auto [&::-webkit-scrollbar]:hidden">
      <motion.div
        className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants as any}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {SKILLS.map((skill) => (
          <SkillCard key={skill.title} skill={skill} />
        ))}
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Card                                                               */
/* ------------------------------------------------------------------ */

function SkillCard({ skill }: { skill: SkillCategory }) {
  const { title, accent, icon, tags } = skill;

  return (
    <motion.div
      variants={cardVariants as any}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.25, ease: "easeOut" },
      }}
      className={cn(
        "group relative overflow-hidden rounded-2xl",
        "border border-white/[0.08] bg-white/[0.03] backdrop-blur-md",
        "p-5 transition-colors duration-300",
        "hover:border-white/20"
      )}
    >
      {/* Radial glow — top-left accent */}
      <div
        className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full opacity-100 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle, ${accent}14 0%, transparent 70%)`,
        }}
      />
      {/* Intensified glow on hover */}
      <div
        className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle, ${accent}30 0%, transparent 70%)`,
        }}
      />

      {/* Icon + Title */}
      <div className="relative mb-4 flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${accent}15` }}
        >
          {icon}
        </div>
        <h3 className="text-[15px] font-semibold tracking-tight text-white">
          {title}
        </h3>
      </div>

      {/* Tags */}
      <motion.div
        className="relative flex flex-wrap gap-2"
        variants={tagContainerVariants as any}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {tags.map((tag) => (
          <motion.span
            key={tag}
            variants={tagVariants as any}
            className="inline-block rounded-full border px-2.5 py-1 text-xs leading-none"
            style={{
              backgroundColor: `${accent}1A`,
              color: `${accent}CC`,
              borderColor: `${accent}33`,
            }}
          >
            {tag}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
}

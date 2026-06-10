"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const publications = [
  {
    title:
      "Deep Learning Enabled Vehicle Identification as a Contribution to Urban Home Security",
    venue: "INCET-24",
    year: 2024,
    description:
      "Deep learning-based vehicle identification system for enhancing residential security through automated surveillance.",
    isIEEE: true,
  },
  {
    title:
      "Industrial Worker Safety Device with Proactive Gas Leak and Fire Protection System",
    venue: "ICTCS-23",
    year: 2023,
    description:
      "IoT-based safety device combining gas leak detection and fire protection for industrial worker safety.",
    isIEEE: false,
  },
  {
    title:
      "BeyondBorders: Unveiling Community and Influence in Multiplex Social Networks",
    venue: "ICACECS-25",
    year: 2025,
    description:
      "GNN-powered social network intelligence for multiplex community detection and influencer analysis across marketing categories.",
    isIEEE: false,
  },
  {
    title:
      "HybridCode: A Dual-Database Framework for Intelligent Codebase Analysis",
    venue: "IEEE ASIACON-25",
    year: 2025,
    description:
      "Intelligent code analysis integrating Qdrant and Neo4j with Gemini for semantic and structural understanding.",
    isIEEE: true,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const dotPulse = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.5, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export function PublicationsCards() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={cn(
          "relative max-h-[60vh] overflow-y-auto px-4",
          "scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        )}
      >
        {/* Timeline line */}
        <div
          className="absolute left-[11px] top-0 bottom-0 w-[2px]"
          style={{
            background:
              "linear-gradient(to bottom, #06b6d4, #8b5cf6)",
          }}
        />

        <motion.div
          className="relative flex flex-col gap-6 py-2"
          variants={containerVariants as any}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {publications.map((pub, index) => (
            <motion.div
              key={index}
              className="relative pl-10"
              variants={cardVariants as any}
            >
              {/* Timeline dot */}
              <div className="absolute left-0 top-8 flex items-center justify-center">
                <motion.div
                  className="relative z-10 h-[10px] w-[10px] rounded-full bg-cyan-400"
                  variants={dotPulse as any}
                  initial="initial"
                  animate="animate"
                  style={{
                    boxShadow:
                      "0 0 8px 2px rgba(6, 182, 212, 0.5)",
                  }}
                />
                {/* Connector line from dot to card */}
                <div className="absolute left-[10px] top-1/2 h-[1px] w-[18px] bg-gradient-to-r from-cyan-400/60 to-transparent" />
              </div>

              {/* Card */}
              <motion.div
                className={cn(
                  "relative overflow-hidden",
                  "bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl p-6",
                  "transition-all duration-300 ease-out cursor-default"
                )}
                whileHover={{
                  y: -4,
                  borderColor: "rgba(255, 255, 255, 0.18)",
                  boxShadow:
                    "0 8px 32px -4px rgba(6, 182, 212, 0.1), 0 4px 16px -2px rgba(139, 92, 246, 0.08)",
                }}
              >
                {/* Year watermark */}
                <span className="absolute top-3 right-4 text-4xl font-bold text-white/[0.06] select-none pointer-events-none leading-none">
                  {pub.year}
                </span>

                {/* Badges row */}
                <div className="flex items-center gap-2 mb-3 relative z-10">
                  <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded-full px-3 py-1 text-xs font-medium">
                    {pub.venue}
                  </span>
                  {pub.isIEEE && (
                    <span className="bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide">
                      IEEE
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3
                  className="text-base font-semibold leading-snug mb-2 relative z-10"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0.8))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {pub.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-white/50 leading-relaxed line-clamp-2 relative z-10">
                  {pub.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

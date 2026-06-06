"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import type { AvatarTone } from "@/lib/portfolio-content";

type CircleStackProps = {
  avatars: AvatarTone[];
  avatarOverlap: string;
  avatarPrimary: string;
  avatarSecondary: string;
  stackShiftX: string;
  stackShiftY: string;
};

function AvatarCircle({
  tone,
  index,
  total,
  hoveredIndex,
  setHoveredIndex,
}: {
  tone: AvatarTone;
  index: number;
  total: number;
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
}) {
  const isFirst = index === 0;
  const isHovered = hoveredIndex === index;
  const shouldBlur = hoveredIndex !== null && !isHovered;
  const hasImage = Boolean(tone.image);

  return (
    <div
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      className={`relative aspect-square overflow-hidden rounded-full border border-[#050507] bg-[#0f1116]/85 backdrop-blur-xl transition-[transform,filter,opacity] duration-500 ease-in-out ${
        shouldBlur ? "opacity-75" : "opacity-100"
      }`}
      style={{
        backgroundColor: tone.background,
        boxShadow: "inset 0 0 0 1px rgba(5,5,7,0.95)",
        marginLeft: index === 0 ? 0 : "calc(var(--avatar-overlap) * -1)",
        width: isFirst ? "var(--avatar-primary)" : "var(--avatar-secondary)",
        filter: shouldBlur ? "blur(2.25px)" : "blur(0px)",
        transform: isHovered ? "scale(1.1)" : "scale(1)",
        zIndex: total - index,
        willChange: "transform, filter, opacity",
      }}
    >
      {hasImage ? (
        <Image
          alt={tone.title ?? `Avatar ${index + 1}`}
          className="object-cover"
          fill
          priority={index === 0}
          src={tone.image as string}
        />
      ) : (
        <>
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 50% 25%, rgba(255,255,255,0.18), rgba(255,255,255,0) 34%), radial-gradient(circle at 50% 100%, rgba(0,0,0,0.16), rgba(0,0,0,0) 56%)",
            }}
          />
          <div
            className="absolute left-1/2 top-[18%] h-[56%] w-[50%] -translate-x-1/2 rounded-[48%_48%_44%_44%/40%_40%_52%_52%]"
            style={{ backgroundColor: tone.skin }}
          />
          <div
            className="absolute left-1/2 top-[11%] h-[34%] w-[46%] -translate-x-1/2 rounded-[52%_52%_42%_42%/58%_58%_44%_44%]"
            style={{ backgroundColor: tone.hair }}
          />
          {tone.cap ? (
            <>
              <div
                className="absolute left-1/2 top-[7%] h-[22%] w-[50%] -translate-x-1/2 rounded-[52%_52%_44%_44%/62%_62%_38%_38%]"
                style={{ backgroundColor: tone.hair }}
              />
              <div
                className="absolute left-[54%] top-[19%] h-[4%] w-[24%] -translate-x-1/2 rounded-full"
                style={{ backgroundColor: tone.hair }}
              />
            </>
          ) : null}
          <div
            className="absolute left-1/2 top-[39%] h-[7%] w-[18%] -translate-x-1/2 rounded-full bg-[#d39b72]"
            style={{ opacity: 0.65 }}
          />
          <div className="absolute left-[39%] top-[46%] h-[2.8%] w-[4%] -translate-x-1/2 rounded-full bg-[#31261f]" />
          <div className="absolute left-[61%] top-[46%] h-[2.8%] w-[4%] -translate-x-1/2 rounded-full bg-[#31261f]" />
          <div className="absolute left-1/2 top-[45%] h-[2.8%] w-[4%] -translate-x-1/2 rounded-full bg-[#31261f]" />
          {tone.glasses ? (
            <>
              <div className="absolute left-[39%] top-[41%] h-[11%] w-[15%] -translate-x-1/2 rounded-full border-[2px] border-[#584538]" />
              <div className="absolute left-[61%] top-[41%] h-[11%] w-[15%] -translate-x-1/2 rounded-full border-[2px] border-[#584538]" />
              <div className="absolute left-1/2 top-[45%] h-[1px] w-[8%] -translate-x-1/2 bg-[#584538]" />
            </>
          ) : null}
          <div
            className="absolute left-1/2 top-[60%] h-[30%] w-[72%] -translate-x-1/2 rounded-[32%_32%_16%_16%/26%_26%_10%_10%]"
            style={{ backgroundColor: tone.clothing }}
          />
          <div
            className="absolute left-1/2 top-[69%] h-[20%] w-[56%] -translate-x-1/2 rounded-[28%_28%_22%_22%/18%_18%_12%_12%]"
            style={{ backgroundColor: tone.shirt }}
          />
          <div
            className="absolute left-1/2 top-[86%] h-[12%] w-[50%] -translate-x-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.18), rgba(255,255,255,0))",
            }}
          />
          <div
            className="absolute inset-x-[14%] bottom-[10%] h-[16%] rounded-full"
            style={{
              backgroundColor: tone.accent,
              filter: "blur(10px)",
              opacity: 0.42,
            }}
          />
        </>
      )}
    </div>
  );
}

export default function CircleStack({
  avatars,
  avatarOverlap,
  avatarPrimary,
  avatarSecondary,
  stackShiftX,
  stackShiftY,
}: CircleStackProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const stackStyle = {
    ["--avatar-primary"]: avatarPrimary,
    ["--avatar-secondary"]: avatarSecondary,
    ["--avatar-overlap"]: avatarOverlap,
  } as CSSProperties;

  return (
    <div className="relative">
      <div
        className="relative flex items-center justify-center"
        style={{
          ...stackStyle,
          transform: `translateX(${stackShiftX}) translateY(${stackShiftY})`,
        }}
      >
        {avatars.map((tone, index) => (
          <AvatarCircle
            key={tone.title ?? index}
            tone={tone}
            index={index}
            total={avatars.length}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
          />
        ))}
      </div>
    </div>
  );
}

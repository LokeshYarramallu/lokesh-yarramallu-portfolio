"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import type { AvatarTone } from "@/lib/portfolio-content";

type CircleStackProps = {
  avatars: AvatarTone[];
  avatarOverlap: string;
  avatarPrimary: string;
  avatarSecondary: string;
  activeIndex?: number;
  isClosingTrigger?: boolean;
  isolateActive?: boolean;
  onCircleClick?: (index: number) => void;
  stackShiftX: string;
  stackShiftY: string;
};

function AvatarCircle({
  tone,
  index,
  onCircleClick,
  total,
  activeIndex,
  isClosingTrigger,
  isIsolated,
  isOpenTrigger,
}: {
  tone: AvatarTone;
  index: number;
  onCircleClick?: (index: number) => void;
  total: number;
  activeIndex: number;
  isClosingTrigger: boolean;
  isIsolated: boolean;
  isOpenTrigger: boolean;
}) {
  const isActive = index === activeIndex;
  const hasGraduationCap = index === 0;
  const shouldFadeForFocus = isIsolated && !isActive;
  const shouldBlur = activeIndex >= 0 && !isActive && !shouldFadeForFocus;
  const hasImage = Boolean(tone.image);

  return (
    <button
      aria-label={tone.title ?? `Avatar ${index + 1}`}
      onClick={() => onCircleClick?.(index)}
      type="button"
      className={`relative aspect-square overflow-hidden rounded-full border border-[#050507] bg-[#0f1116]/85 p-0 backdrop-blur-xl transition-[filter,opacity,width,box-shadow] duration-500 ease-in-out ${
        shouldFadeForFocus ? "pointer-events-none opacity-0" : shouldBlur ? "opacity-75" : "opacity-100"
      }`}
      style={{
        ["--circle-travel-x" as string]: `clamp(${index * 28}px, ${index * 5}vw, ${index * 82}px)`,
        animation: isOpenTrigger
          ? `${
              isClosingTrigger ? "selected-circle-exit" : "selected-circle-enter"
            } 620ms cubic-bezier(0.22,1,0.36,1) both`
          : undefined,
        backgroundColor: tone.background,
        boxShadow: isActive
          ? "inset 0 0 0 1px rgba(5,5,7,0.95), 0 28px 80px rgba(0,0,0,0.42)"
          : "inset 0 0 0 1px rgba(5,5,7,0.95)",
        marginLeft:
          index === 0 ? 0 : "calc(var(--avatar-overlap) * -1)",
        width: isActive ? "var(--avatar-primary)" : "var(--avatar-secondary)",
        filter: shouldBlur ? "blur(2.25px)" : "blur(0px)",
        zIndex: isActive ? total + 1 : total - index,
        willChange: "filter, opacity, width, box-shadow",
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
          {tone.cap && !hasGraduationCap ? (
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
          {hasGraduationCap ? (
            <div className="absolute left-1/2 top-[5%] z-10 h-[34%] w-[68%] -translate-x-1/2">
              <div className="absolute left-1/2 top-[10%] h-[26%] w-[78%] -translate-x-1/2 rotate-[-8deg] rounded-[8%] bg-[#050507] shadow-[0_8px_18px_rgba(0,0,0,0.35)]" />
              <div className="absolute left-1/2 top-[31%] h-[22%] w-[48%] -translate-x-1/2 rounded-[18%_18%_42%_42%/22%_22%_50%_50%] bg-[#10131a]" />
              <div className="absolute left-[69%] top-[27%] h-[38%] w-[2px] origin-top rotate-[9deg] bg-[#d9edf6]" />
              <div className="absolute left-[70%] top-[62%] h-[10%] w-[7%] rounded-full bg-[#d9edf6]" />
              <div className="absolute left-[49%] top-[20%] h-[9%] w-[9%] -translate-x-1/2 rounded-full bg-[#d9edf6]" />
            </div>
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
      <div
        className="absolute inset-0 z-30 flex items-center justify-center rounded-full bg-black/34 backdrop-blur-[1px] transition-[opacity,backdrop-filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          opacity: isOpenTrigger ? 1 : 0,
          pointerEvents: isOpenTrigger ? "auto" : "none",
        }}
      >
        <div
          className="relative h-[22%] w-[22%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            transform: isClosingTrigger
              ? "scale(0.76) rotate(110deg)"
              : isOpenTrigger
                ? "scale(1) rotate(0deg)"
                : "scale(0.68) rotate(-18deg)",
          }}
        >
          <span className="absolute left-1/2 top-1/2 h-[14%] w-full -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-white/88 shadow-[0_0_18px_rgba(255,255,255,0.22)]" />
          <span className="absolute left-1/2 top-1/2 h-[14%] w-full -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-white/88 shadow-[0_0_18px_rgba(255,255,255,0.22)]" />
        </div>
      </div>
    </button>
  );
}

export default function CircleStack({
  avatars,
  avatarOverlap,
  avatarPrimary,
  avatarSecondary,
  activeIndex = 0,
  isClosingTrigger = false,
  isolateActive = false,
  onCircleClick,
  stackShiftX,
  stackShiftY,
}: CircleStackProps) {
  const stackStyle = {
    ["--avatar-primary"]: avatarPrimary,
    ["--avatar-secondary"]: avatarSecondary,
    ["--avatar-overlap"]: avatarOverlap,
  } as CSSProperties;

  return (
    <div className="relative">
      <div
        className="relative flex items-end justify-center"
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
            activeIndex={activeIndex}
            isClosingTrigger={isClosingTrigger && activeIndex === index}
            isIsolated={isolateActive}
            isOpenTrigger={isolateActive && activeIndex === index}
            onCircleClick={onCircleClick}
          />
        ))}
      </div>
    </div>
  );
}

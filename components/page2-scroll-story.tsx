"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import CircleStack from "@/components/circle-stack";
import type { PortfolioContent } from "@/lib/portfolio-content";

type Page2ScrollStoryProps = {
  content: PortfolioContent;
};

const SCROLL_THRESHOLD = 28;
const STEP_COOLDOWN_MS = 220;
const WHEEL_IDLE_MS = 120;
const STATEMENT_STAY_MS = 8500;
const PAGE2_STACK_SIZES = {
  avatarOverlap: "clamp(10px, 2vw, 26px)",
  avatarPrimary: "clamp(92px, 16vw, 230px)",
  avatarSecondary: "clamp(54px, 8vw, 120px)",
  stackShiftX: "0px",
  stackShiftY: "0px",
} as const;
const SECTION_DOCK_ITEMS = [
  {
    cardBackground: "/assets/university-card.jpg",
    credential: "B.Tech Computer Science",
    detail: "Artificial Intelligence Engineering",
    initial: "U",
    icon: "/assets/university-svgrepo-com.svg",
    location: "Amrita Vishwa Vidyapeetham, Amritapuri Campus",
    score: "CGPA 9.3",
    title: "University",
    years: "2022 - 2026",
  },
  {
    cardBackground: "/assets/intermediate-card.jpg",
    credential: "Higher Secondary Education",
    detail: "Class XII",
    initial: "I",
    icon: "/assets/school-svgrepo-com.svg",
    location: "Sri Chaitanya Junior College, Vijayawada",
    score: "95%",
    title: "Intermediate",
    years: "2020 - 2022",
  },
  {
    cardBackground: "/assets/tenth-card.jpg",
    credential: "Secondary Education",
    detail: "Class X",
    initial: "10",
    icon: "/assets/school-clock-svgrepo-com.svg",
    location: "Dr. KKR's Gowtham School, Rajamahendravaram",
    score: "93%",
    title: "10th",
    years: "2020",
  },
] as const;
const ACTIVE_CIRCLE_LABELS = [
  "Education",
  "Experience",
  "Projects",
  "Skills",
  "Contact",
] as const;
type HoverDirection = "top" | "right" | "bottom" | "left";
const EDUCATION_CARD_STYLE = {
  height: "clamp(230px, 48svh, 470px)",
  maxHeight: "calc(100svh - clamp(210px, 34svh, 310px))",
} as const satisfies CSSProperties;
const PROFILE_STATEMENTS = [
  {
    quote:
      "Research gives the work depth; production gives it discipline.",
    title: "Operating Style",
  },
  {
    quote:
      "Unclear problems feel less like blockers and more like starting points.",
    title: "Problem Fit",
  },
  {
    quote:
      "Good AI should reason, recover, remember, and still be usable when the demo is over.",
    title: "Build Mentality",
  },
  {
    quote:
      "Systems matter before spectacle; structure is what lets intelligence keep working.",
    title: "Engineering Taste",
  },
  {
    quote:
      "The work is most interesting where agents, memory, retrieval, and backend reliability meet.",
    title: "North Star",
  },
  {
    quote:
      "Calm engineering, curious research, and a bias toward things that can be tested.",
    title: "Working Rhythm",
  },
] as const;

export default function Page2ScrollStory({ content }: Page2ScrollStoryProps) {
  const avatarCount = content.avatars.length;
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isFirstDockOpen, setIsFirstDockOpen] = useState(false);
  const [isFirstDockClosing, setIsFirstDockClosing] = useState(false);
  const [openCircleIndex, setOpenCircleIndex] = useState<number | null>(null);
  const [closingCircleIndex, setClosingCircleIndex] = useState<number | null>(
    null,
  );
  const closeDockTimeoutRef = useRef<number | null>(null);
  const wheelDeltaRef = useRef(0);
  const wheelBurstLockedRef = useRef(false);
  const wheelIdleTimeoutRef = useRef<number | null>(null);
  const wheelDirectionRef = useRef<1 | -1 | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchBurstLockedRef = useRef(false);
  const cooldownRef = useRef(false);
  const cooldownTimeoutRef = useRef<number | null>(null);

  const resetScrollIntent = useCallback(() => {
    wheelDeltaRef.current = 0;
    wheelDirectionRef.current = null;
    touchStartYRef.current = null;
    touchBurstLockedRef.current = false;
  }, []);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;

      if (cooldownTimeoutRef.current !== null) {
        window.clearTimeout(cooldownTimeoutRef.current);
      }

      if (wheelIdleTimeoutRef.current !== null) {
        window.clearTimeout(wheelIdleTimeoutRef.current);
      }

      if (closeDockTimeoutRef.current !== null) {
        window.clearTimeout(closeDockTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (avatarCount <= 1) {
      return;
    }

    const releaseWheelBurst = () => {
      wheelDeltaRef.current = 0;
      wheelDirectionRef.current = null;
      wheelBurstLockedRef.current = false;

      if (wheelIdleTimeoutRef.current !== null) {
        window.clearTimeout(wheelIdleTimeoutRef.current);
        wheelIdleTimeoutRef.current = null;
      }
    };

    const scheduleWheelBurstRelease = () => {
      if (wheelIdleTimeoutRef.current !== null) {
        window.clearTimeout(wheelIdleTimeoutRef.current);
      }

      wheelIdleTimeoutRef.current = window.setTimeout(() => {
        releaseWheelBurst();
      }, WHEEL_IDLE_MS);
    };

    const stepActiveCircle = (direction: 1 | -1) => {
      if (cooldownRef.current) {
        return;
      }

      setActiveIndex((current) => {
        const nextIndex = Math.max(
          -1,
          Math.min(avatarCount - 1, current + direction),
        );

        if (nextIndex === current) {
          resetScrollIntent();
          return current;
        }

        cooldownRef.current = true;
        resetScrollIntent();
        cooldownTimeoutRef.current = window.setTimeout(() => {
          cooldownRef.current = false;
          cooldownTimeoutRef.current = null;
          wheelDeltaRef.current = 0;
        }, STEP_COOLDOWN_MS);

        return nextIndex;
      });
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      scheduleWheelBurstRelease();

      if (cooldownRef.current) {
        wheelDeltaRef.current = 0;
        wheelDirectionRef.current = null;
        return;
      }

      if (wheelBurstLockedRef.current) {
        return;
      }

      const direction = event.deltaY > 0 ? 1 : -1;

      if (wheelDirectionRef.current !== direction) {
        wheelDeltaRef.current = 0;
        wheelDirectionRef.current = direction;
      }

      wheelDeltaRef.current += event.deltaY;

      if (wheelDeltaRef.current > SCROLL_THRESHOLD) {
        wheelBurstLockedRef.current = true;
        wheelDeltaRef.current = 0;
        stepActiveCircle(1);
      } else if (wheelDeltaRef.current < -SCROLL_THRESHOLD) {
        wheelBurstLockedRef.current = true;
        wheelDeltaRef.current = 0;
        stepActiveCircle(-1);
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
      touchBurstLockedRef.current = false;
    };

    const onTouchMove = (event: TouchEvent) => {
      const startY = touchStartYRef.current;
      const currentY = event.touches[0]?.clientY;

      if (startY == null || currentY == null) {
        return;
      }

      if (cooldownRef.current) {
        touchStartYRef.current = currentY;
        event.preventDefault();
        return;
      }

      if (touchBurstLockedRef.current) {
        event.preventDefault();
        return;
      }

      const deltaY = startY - currentY;

      if (Math.abs(deltaY) < SCROLL_THRESHOLD) {
        return;
      }

      event.preventDefault();
      touchBurstLockedRef.current = true;
      touchStartYRef.current = currentY;
      stepActiveCircle(deltaY > 0 ? 1 : -1);
    };

    const onTouchEnd = () => {
      resetScrollIntent();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault();
        stepActiveCircle(1);
      }

      if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        stepActiveCircle(-1);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [avatarCount, resetScrollIntent]);

  useEffect(() => {
    if (activeIndex !== 0) {
      setIsFirstDockOpen(false);
      setIsFirstDockClosing(false);

      if (closeDockTimeoutRef.current !== null) {
        window.clearTimeout(closeDockTimeoutRef.current);
        closeDockTimeoutRef.current = null;
      }
    }
  }, [activeIndex]);

  const onCircleClick = (index: number) => {
    setActiveIndex(index);

    if (closeDockTimeoutRef.current !== null) {
      window.clearTimeout(closeDockTimeoutRef.current);
      closeDockTimeoutRef.current = null;
    }

    if (openCircleIndex === index && closingCircleIndex === null) {
      setClosingCircleIndex(index);

      if (index === 0) {
        setIsFirstDockClosing(true);
      }

      closeDockTimeoutRef.current = window.setTimeout(() => {
        setOpenCircleIndex(null);
        setClosingCircleIndex(null);
        setIsFirstDockOpen(false);
        setIsFirstDockClosing(false);
        closeDockTimeoutRef.current = null;
      }, 820);
      return;
    }

    setOpenCircleIndex(index);
    setClosingCircleIndex(null);

    if (index === 0) {
      setIsFirstDockOpen(true);
      setIsFirstDockClosing(false);
      return;
    }

    setIsFirstDockOpen(false);
    setIsFirstDockClosing(false);
  };

  const isCircleFocusVisible =
    openCircleIndex !== null || closingCircleIndex !== null;
  const isEducationDockVisible =
    openCircleIndex === 0 || closingCircleIndex === 0;
  const isContactCardVisible =
    openCircleIndex === 4 || closingCircleIndex === 4;

  return (
    <div className="relative h-[100svh] overflow-hidden">
      <div className="absolute inset-0 bg-black/22 backdrop-blur-[22px]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.012)_24%,rgba(0,0,0,0.12)_58%,rgba(255,255,255,0.04))]" />

      {!isCircleFocusVisible ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-[34svh] items-center overflow-hidden">
          <MovingStatementCards items={PROFILE_STATEMENTS} />
        </div>
      ) : null}

      <div className="pointer-events-none absolute bottom-[clamp(20px,5svh,48px)] right-[clamp(18px,4vw,52px)] z-10 flex flex-col items-center gap-2 text-white/58">
        <svg
          aria-hidden="true"
          className="h-[clamp(34px,5vw,58px)] w-[clamp(22px,3vw,34px)]"
          fill="none"
          viewBox="0 0 28 54"
        >
          <rect
            height="34"
            rx="14"
            stroke="currentColor"
            strokeWidth="2"
            width="26"
            x="1"
            y="1"
          />
          <path
            d="M14 10V22"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <path
            d="M8 43L14 49L20 43"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
        <span className="text-[0.58rem] font-semibold uppercase tracking-[0.22em]">
          Scroll
        </span>
      </div>

      {isContactCardVisible ? (
        <ContactPinCard isClosing={closingCircleIndex === 4} />
      ) : null}

      <div className="absolute bottom-[clamp(54px,12svh,150px)] left-[clamp(24px,8vw,104px)] flex items-end justify-start">
        {isEducationDockVisible ? (
          <VerticalSectionDock isClosing={closingCircleIndex === 0} />
        ) : null}
        <CircleStack
          activeIndex={activeIndex}
          avatars={content.avatars}
          avatarOverlap={PAGE2_STACK_SIZES.avatarOverlap}
          avatarPrimary={PAGE2_STACK_SIZES.avatarPrimary}
          avatarSecondary={PAGE2_STACK_SIZES.avatarSecondary}
          isolateActive={isCircleFocusVisible}
          isClosingTrigger={closingCircleIndex !== null}
          onCircleClick={onCircleClick}
          stackShiftX={PAGE2_STACK_SIZES.stackShiftX}
          stackShiftY={PAGE2_STACK_SIZES.stackShiftY}
        />
        <ActiveCircleLabel
          activeIndex={activeIndex}
          isEducationDockVisible={isCircleFocusVisible}
        />
      </div>
    </div>
  );
}

function ContactPinCard({ isClosing }: { isClosing: boolean }) {
  const [isPinHovered, setIsPinHovered] = useState(false);

  return (
    <div className="pointer-events-auto absolute right-[clamp(22px,8vw,120px)] top-1/2 z-20 w-[min(78vw,360px)] -translate-y-1/2 [perspective:1200px]">
      <a
        className="relative block pt-16 [transform-style:preserve-3d]"
        href="mailto:lokesh@example.com"
        onMouseEnter={() => setIsPinHovered(true)}
        onMouseLeave={() => setIsPinHovered(false)}
        onPointerEnter={() => setIsPinHovered(true)}
        onPointerLeave={() => setIsPinHovered(false)}
        style={{
          animation: `${
            isClosing ? "education-card-exit" : "education-card-enter"
          } 620ms cubic-bezier(0.22,1,0.36,1) both`,
        }}
      >
        <div
          className="absolute left-1/2 top-2 z-30 -translate-x-1/2 rounded-full border border-white/12 bg-[#05070d]/92 px-4 py-2 text-xs font-semibold text-cyan-100 shadow-[0_18px_60px_rgba(0,0,0,0.38)] backdrop-blur-md transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            opacity: isPinHovered ? 1 : 0.42,
            transform: isPinHovered
              ? "translateX(-50%) translateY(-8px)"
              : "translateX(-50%) translateY(0)",
          }}
        >
          /contact
        </div>
        <div
          className="absolute left-1/2 top-11 z-20 h-16 w-px -translate-x-1/2 origin-top bg-gradient-to-b from-cyan-200/90 to-transparent transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            opacity: isPinHovered ? 1 : 0.28,
            transform: isPinHovered
              ? "translateX(-50%) scaleY(1)"
              : "translateX(-50%) scaleY(0.72)",
          }}
        />
        <div
          className="absolute left-1/2 top-[6.4rem] z-20 h-4 w-4 -translate-x-1/2 rounded-full bg-cyan-200 shadow-[0_0_32px_rgba(165,243,252,0.95)] transition-opacity duration-500"
          style={{ opacity: isPinHovered ? 1 : 0.52 }}
        />
        <div
          className="absolute left-1/2 top-[6.4rem] z-10 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/20 transition-[opacity,transform] duration-700"
          style={{
            opacity: isPinHovered ? 1 : 0,
            animation: isPinHovered
              ? undefined
              : "contact-pin-pulse 2.8s ease-in-out infinite",
            transform: isPinHovered
              ? "translateX(-50%) translateY(-50%) scale(1.25)"
              : "translateX(-50%) translateY(-50%) scale(1)",
          }}
        />
        <div
          className="absolute left-1/2 top-[6.4rem] z-10 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/10 transition-[opacity,transform] duration-1000"
          style={{
            opacity: isPinHovered ? 1 : 0,
            transform: isPinHovered
              ? "translateX(-50%) translateY(-50%) scale(1.22)"
              : "translateX(-50%) translateY(-50%) scale(1)",
          }}
        />
        <div
          className="relative rounded-[28px] border border-white/18 bg-[#0b0f18]/78 p-5 shadow-[0_35px_90px_rgba(0,0,0,0.38)] backdrop-blur-xl transition-[box-shadow,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            boxShadow: isPinHovered
              ? "0 45px 120px rgba(34,211,238,0.18)"
              : "0 35px 90px rgba(0,0,0,0.38)",
            transform: isPinHovered
              ? "rotateX(10deg) rotateY(-14deg) translateY(-10px) translateZ(48px)"
              : "rotateX(0deg) rotateY(0deg) translateZ(0)",
            animation: isPinHovered
              ? undefined
              : "contact-pin-float 5s ease-in-out infinite",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_50%_0%,rgba(165,243,252,0.22),transparent_42%)] transition-opacity duration-500"
            style={{ opacity: isPinHovered ? 1 : 0 }}
          />
          <p className="mb-4 inline-flex rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-cyan-100/86">
            Contact
          </p>
          <h3 className="text-[clamp(1.35rem,3vw,2rem)] font-semibold leading-tight tracking-[-0.04em] text-white">
            Let&apos;s build something reliable.
          </h3>
          <p className="mt-3 text-sm leading-6 text-white/58">
            Open to AI engineering roles, backend systems, agentic workflows,
            and production-focused collaborations.
          </p>
          <div className="mt-5 h-28 rounded-2xl bg-[radial-gradient(circle_at_20%_20%,rgba(165,243,252,0.72),transparent_32%),linear-gradient(135deg,rgba(20,184,166,0.86),rgba(59,130,246,0.78)_52%,rgba(15,23,42,0.92))]" />
          <span className="mt-5 inline-flex text-sm font-semibold text-cyan-100">
            lokesh@example.com
          </span>
        </div>
      </a>
    </div>
  );
}

function ActiveCircleLabel({
  activeIndex,
  isEducationDockVisible,
}: {
  activeIndex: number;
  isEducationDockVisible: boolean;
}) {
  if (activeIndex < 0) {
    return null;
  }

  if (isEducationDockVisible) {
    return null;
  }

  const label =
    ACTIVE_CIRCLE_LABELS[activeIndex] ?? `Section ${activeIndex + 1}`;

  return (
    <div className="pointer-events-none absolute bottom-[clamp(4px,1svh,12px)] left-[calc(100%+clamp(18px,5vw,72px))] z-10 flex flex-col items-start gap-2 text-left">
      <span
        className="origin-center whitespace-nowrap px-[clamp(10px,2vw,20px)] py-[clamp(6px,1.2vw,10px)] text-[clamp(0.95rem,2.2vw,1.45rem)] font-semibold uppercase tracking-[0.18em] text-white"
        key={label}
        style={{
          animation:
            "active-label-flip 520ms cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function VerticalSectionDock({ isClosing }: { isClosing: boolean }) {
  const dockRef = useRef<HTMLElement | null>(null);
  const [dockPointer, setDockPointer] = useState<{
    iconSize: number;
    x: number;
    width: number;
  } | null>(null);
  const [isCompact, setIsCompact] = useState(false);
  const [selectedEducationIndex, setSelectedEducationIndex] = useState(0);
  const [isCompactCardHovered, setIsCompactCardHovered] = useState(false);
  const [compactHoverDirection, setCompactHoverDirection] =
    useState<HoverDirection>("bottom");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 760px)");
    const syncCompactLayout = () => setIsCompact(mediaQuery.matches);

    syncCompactLayout();
    mediaQuery.addEventListener("change", syncCompactLayout);

    return () => {
      mediaQuery.removeEventListener("change", syncCompactLayout);
    };
  }, []);

  const selectedEducationItem = SECTION_DOCK_ITEMS[selectedEducationIndex];
  const compactOverlayTransform = isCompactCardHovered
    ? "translate3d(0, 0, 0)"
    : getDirectionTransform(compactHoverDirection);

  return (
    <nav
      aria-label="Portfolio sections"
      className={`absolute z-20 flex items-center gap-[clamp(22px,4vw,72px)] ${
        isCompact ? "justify-center" : "justify-between"
      }`}
      onPointerLeave={() => setDockPointer(null)}
      onPointerMove={(event) => {
        const rect = dockRef.current?.getBoundingClientRect();

        if (!rect) {
          return;
        }

        setDockPointer({
          iconSize:
            Number.parseFloat(
              getComputedStyle(event.currentTarget).getPropertyValue("--education-icon-size"),
            ) || 84,
          x: event.clientX - rect.left,
          width: rect.width,
        });
      }}
      ref={dockRef}
      style={
        {
          "--education-icon-size": "clamp(48px, 6.4vw, 84px)",
          bottom:
            "calc(clamp(92px, 16vw, 230px) / 2 - (var(--education-icon-size) + clamp(8px,1.8vw,20px)))",
          left: isCompact
            ? "calc(clamp(92px, 16vw, 230px) + clamp(52px, 12vw, 96px))"
            : "calc(clamp(92px, 16vw, 230px) + clamp(42px, 6vw, 86px))",
          transform: undefined,
          width: isCompact
            ? "calc(100vw - clamp(24px, 8vw, 104px) - clamp(92px, 16vw, 230px) - clamp(52px, 12vw, 96px) - clamp(16px, 4vw, 32px))"
            : "calc(100vw - clamp(24px, 8vw, 104px) - clamp(92px, 16vw, 230px) - clamp(42px, 6vw, 86px) - clamp(24px, 7vw, 96px))",
        } as CSSProperties
      }
    >
      {isCompact ? (
        <div
          className="fixed left-1/2 top-[clamp(28px,10svh,78px)] w-[min(86vw,430px)] -translate-x-1/2"
        >
          <div
          className="group/card relative overflow-hidden rounded-[clamp(20px,3vw,28px)] border-[clamp(2px,0.5vw,4px)] border-white/70 bg-white text-center text-[#050507] shadow-[0_22px_60px_rgba(0,0,0,0.26)]"
          onPointerEnter={(event) => {
            setCompactHoverDirection(
              getPointerDirection(event.currentTarget, event),
            );
            setIsCompactCardHovered(true);
          }}
          onPointerLeave={(event) => {
            setCompactHoverDirection(
              getPointerDirection(event.currentTarget, event),
            );
            setIsCompactCardHovered(false);
          }}
          style={{
            ...EDUCATION_CARD_STYLE,
            animation: `${
              isClosing ? "education-card-exit" : "education-card-enter"
            } 620ms cubic-bezier(0.22,1,0.36,1) both`,
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-105"
            style={{
              backgroundImage: selectedEducationItem.cardBackground
                ? `url(${selectedEducationItem.cardBackground})`
                : undefined,
            }}
          />
          <div className="absolute inset-0 bg-black/48" />
          <div
            className="absolute inset-0 flex items-center justify-center p-[clamp(18px,2.2vw,30px)] text-center transition-opacity duration-300 ease-out"
            style={{
              opacity: isCompactCardHovered ? 0 : 1,
            }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white">
              {selectedEducationItem.title}
            </p>
          </div>
          <div className="absolute inset-0 flex flex-col justify-end overflow-hidden bg-black/28 p-[clamp(14px,2.2vw,30px)] text-left text-white">
            <div
              className="transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                opacity: isCompactCardHovered ? 1 : 0,
                transform: compactOverlayTransform,
              }}
            >
              <h3 className="text-[clamp(0.98rem,1.9vw,1.55rem)] font-semibold leading-tight tracking-[-0.04em]">
                {selectedEducationItem.credential}
              </h3>
              <p className="mt-1 text-[clamp(0.72rem,1vw,0.875rem)] font-medium leading-[1.45] text-white/78">
                {selectedEducationItem.detail}
              </p>
              <p className="mt-[clamp(0.75rem,2svh,1.25rem)] text-[clamp(0.72rem,1vw,0.875rem)] leading-[1.45] text-white/72">
                {selectedEducationItem.location}
              </p>
              <div className="mt-[clamp(0.75rem,2svh,1.25rem)] flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/25 bg-white/12 px-3 py-1 text-[clamp(0.58rem,0.9vw,0.68rem)] font-semibold uppercase tracking-[0.14em] text-white/84">
                  {selectedEducationItem.years}
                </span>
                <span className="rounded-full border border-white/25 bg-white/12 px-3 py-1 text-[clamp(0.58rem,0.9vw,0.68rem)] font-semibold uppercase tracking-[0.14em] text-white/84">
                  {selectedEducationItem.score}
                </span>
              </div>
            </div>
          </div>
          </div>
        </div>
      ) : null}

      {SECTION_DOCK_ITEMS.map((item, index) => (
        <VerticalDockItem
          index={index}
          isCompact={isCompact}
          isSelected={selectedEducationIndex === index}
          item={item}
          itemCount={SECTION_DOCK_ITEMS.length}
          key={item.title}
          iconSize={dockPointer?.iconSize ?? null}
          isClosing={isClosing}
          onSelect={() => {
            setSelectedEducationIndex(index);

            if (isCompact) {
              setCompactHoverDirection("bottom");
              setIsCompactCardHovered(true);
            }
          }}
          pointerX={dockPointer?.x ?? null}
          rowWidth={dockPointer?.width ?? null}
          showCard={!isCompact}
        />
      ))}
    </nav>
  );
}

function VerticalDockItem({
  iconSize,
  index,
  isCompact,
  isClosing,
  isSelected,
  item,
  itemCount,
  onSelect,
  pointerX,
  rowWidth,
  showCard,
}: {
  iconSize: number | null;
  index: number;
  isCompact: boolean;
  isClosing: boolean;
  isSelected: boolean;
  item: (typeof SECTION_DOCK_ITEMS)[number];
  itemCount: number;
  onSelect: () => void;
  pointerX: number | null;
  rowWidth: number | null;
  showCard: boolean;
}) {
  const resolvedIconSize = iconSize ?? 84;
  const itemCenter =
    rowWidth === null
      ? resolvedIconSize / 2
      : itemCount === 1
        ? rowWidth / 2
        : resolvedIconSize / 2 +
          index * ((rowWidth - resolvedIconSize) / (itemCount - 1));
  const distance =
    pointerX === null ? Number.POSITIVE_INFINITY : Math.abs(pointerX - itemCenter);
  const influence = Math.max(0, 1 - distance / (resolvedIconSize * 1.1));
  const scale = 1 + influence * 0.45;
  const iconImageSize = resolvedIconSize * (0.46 + influence * 0.06);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [hoverDirection, setHoverDirection] =
    useState<HoverDirection>("bottom");
  const overlayTransform = isCardHovered
    ? "translate3d(0, 0, 0)"
    : getDirectionTransform(hoverDirection);

  return (
    <div
      className={`relative flex h-[calc(var(--education-icon-size)+48px)] flex-1 justify-center ${
        isCompact ? "min-w-0" : "min-w-[clamp(120px,16vw,230px)]"
      }`}
    >
      {showCard ? (
        <div
          className="absolute bottom-[calc(100%+28px)] left-1/2 w-[min(100%,clamp(190px,21vw,310px))] -translate-x-1/2"
        >
          <div
            className="group/card relative overflow-hidden rounded-[clamp(20px,3vw,28px)] border-[clamp(2px,0.5vw,4px)] border-white/70 bg-white text-center text-[#050507] shadow-[0_22px_60px_rgba(0,0,0,0.26)]"
            onPointerEnter={(event) => {
              setHoverDirection(getPointerDirection(event.currentTarget, event));
              setIsCardHovered(true);
            }}
            onPointerLeave={(event) => {
              setHoverDirection(getPointerDirection(event.currentTarget, event));
              setIsCardHovered(false);
            }}
            style={{
              ...EDUCATION_CARD_STYLE,
            animation:
              `${
                isClosing ? "education-card-exit" : "education-card-enter"
              } 620ms cubic-bezier(0.22,1,0.36,1) both`,
            animationDelay: isClosing
              ? `${index * 55}ms`
              : `${index * 85}ms`,
            }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-105"
              style={{
                backgroundImage: item.cardBackground
                  ? `url(${item.cardBackground})`
                  : undefined,
              }}
            />
            <div className="absolute inset-0 bg-black/48" />
            <div
              className="absolute inset-0 flex items-center justify-center p-[clamp(18px,2.2vw,30px)] text-center transition-opacity duration-300 ease-out"
              style={{
                opacity: isCardHovered ? 0 : 1,
              }}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white">
                {item.title}
              </p>
            </div>
            <div className="absolute inset-0 flex flex-col justify-end overflow-hidden bg-black/28 p-[clamp(14px,2.2vw,30px)] text-left text-white">
              <div
                className="transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  opacity: isCardHovered ? 1 : 0,
                  transform: overlayTransform,
                }}
              >
                <h3 className="text-[clamp(0.98rem,1.9vw,1.55rem)] font-semibold leading-tight tracking-[-0.04em]">
                  {item.credential}
                </h3>
                <p className="mt-1 text-[clamp(0.72rem,1vw,0.875rem)] font-medium leading-[1.45] text-white/78">
                  {item.detail}
                </p>
                <p className="mt-[clamp(0.75rem,2svh,1.25rem)] text-[clamp(0.72rem,1vw,0.875rem)] leading-[1.45] text-white/72">
                  {item.location}
                </p>
                <div className="mt-[clamp(0.75rem,2svh,1.25rem)] flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/25 bg-white/12 px-3 py-1 text-[clamp(0.58rem,0.9vw,0.68rem)] font-semibold uppercase tracking-[0.14em] text-white/84">
                    {item.years}
                  </span>
                  <span className="rounded-full border border-white/25 bg-white/12 px-3 py-1 text-[clamp(0.58rem,0.9vw,0.68rem)] font-semibold uppercase tracking-[0.14em] text-white/84">
                    {item.score}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <div
        className="absolute top-0"
        style={{
          animation:
            `${
              isClosing ? "education-icon-exit" : "education-icon-enter"
            } 520ms cubic-bezier(0.22,1,0.36,1) both`,
          animationDelay: isClosing
            ? `${index * 45}ms`
            : `${120 + index * 70}ms`,
        }}
      >
        <a
          aria-label={`Show ${item.title} education details`}
          aria-pressed={isCompact ? isSelected : undefined}
          className={`group flex h-[var(--education-icon-size)] w-[var(--education-icon-size)] origin-center transform-gpu items-center justify-center rounded-full text-white/74 shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-[background-color,box-shadow,color,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:bg-white hover:text-[#050507] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
            isCompact && isSelected
              ? "bg-white/22 shadow-[0_14px_38px_rgba(255,255,255,0.16)]"
              : "bg-white/[0.07]"
          }`}
          href={`#${item.title.toLowerCase()}`}
          onClick={(event) => {
            if (isCompact) {
              event.preventDefault();
            }

            onSelect();
          }}
          onPointerEnter={() => {
            setHoverDirection("bottom");
            setIsCardHovered(true);
          }}
          onPointerLeave={() => {
            setHoverDirection("bottom");
            setIsCardHovered(false);
          }}
          style={{
            transform: `scale(${scale})`,
          }}
        >
          {item.icon ? (
            <Image
              alt=""
              aria-hidden="true"
              className="invert transition-[filter,height,width] duration-200 ease-out group-hover:invert-0 group-focus-visible:invert-0"
              height={24}
              src={item.icon}
              style={{
                height: `${iconImageSize}px`,
                width: `${iconImageSize}px`,
              }}
              width={24}
            />
          ) : (
            <span
              className="font-semibold transition-[font-size] duration-200 ease-out"
              style={{ fontSize: `${resolvedIconSize * 0.24}px` }}
            >
              {item.initial}
            </span>
          )}
        </a>
      </div>
    </div>
  );
}

function getPointerDirection(
  element: HTMLElement,
  event: PointerEvent<HTMLElement>,
): HoverDirection {
  const rect = element.getBoundingClientRect();
  const normalizedX =
    (event.clientX - rect.left - rect.width / 2) *
    (rect.width > rect.height ? rect.height / rect.width : 1);
  const normalizedY =
    (event.clientY - rect.top - rect.height / 2) *
    (rect.height > rect.width ? rect.width / rect.height : 1);
  const direction = Math.round(
    Math.atan2(normalizedY, normalizedX) / (Math.PI / 2) + 5,
  ) % 4;

  return (["right", "bottom", "left", "top"] as const)[direction];
}

function getDirectionTransform(direction: HoverDirection) {
  if (direction === "top") {
    return "translate3d(0, -100%, 0)";
  }

  if (direction === "right") {
    return "translate3d(100%, 0, 0)";
  }

  if (direction === "left") {
    return "translate3d(-100%, 0, 0)";
  }

  return "translate3d(0, 100%, 0)";
}

function MovingStatementCards({
  items,
}: {
  items: typeof PROFILE_STATEMENTS;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % items.length);
    }, STATEMENT_STAY_MS);

    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [items.length]);

  return (
    <div className="relative flex h-[clamp(76px,12vh,132px)] w-screen items-center justify-center px-[clamp(36px,10vw,160px)] py-[clamp(12px,1.4vw,20px)] text-center text-white">
      {items.map((item, index) => (
        <p
          aria-hidden={index !== currentIndex}
          className={`absolute max-w-[min(70vw,720px)] text-[clamp(0.76rem,1vw,1rem)] font-medium leading-[1.45] tracking-normal text-white/86 transition-[opacity,filter] duration-1000 ease-in-out ${
            index === currentIndex
              ? "opacity-100 blur-0"
              : "opacity-0 blur-sm"
          }`}
          key={item.title}
        >
          {index === currentIndex ? (
            <TextGenerateEffect text={item.quote} activeKey={currentIndex} />
          ) : (
            item.quote
          )}
        </p>
      ))}
    </div>
  );
}

function TextGenerateEffect({
  activeKey,
  text,
}: {
  activeKey: number;
  text: string;
}) {
  return (
    <span key={activeKey} className="inline-block">
      {text.split(" ").map((word, index) => (
        <span
          className="inline-block animate-[text-word-reveal_1500ms_ease-out_both]"
          key={`${word}-${index}`}
          style={{ animationDelay: `${index * 130}ms` }}
        >
          {word}
          {index < text.split(" ").length - 1 ? "\u00a0" : ""}
        </span>
      ))}
    </span>
  );
}

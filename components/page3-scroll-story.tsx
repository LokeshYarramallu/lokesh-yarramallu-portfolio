"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import CircleStack from "@/components/circle-stack";
import type { PortfolioContent } from "@/lib/portfolio-content";
import { PinContainer } from "@/components/ui/3d-pin";
import { SkillsShowcase } from "./skills-showcase";
import { PublicationsCards } from "./publications-cards";
import { ProjectsShowcase } from "./projects-showcase";
import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";

type Page2ScrollStoryProps = {
  content: PortfolioContent;
};

const SCROLL_THRESHOLD = 28;
const STEP_COOLDOWN_MS = 600;
const WHEEL_IDLE_MS = 120;
const STATEMENT_STAY_MS = 8500;
const PAGE2_STACK_SIZES = {
  avatarOverlap: "clamp(8px, 1.5vw, 20px)",
  avatarPrimary: "clamp(69px, 12vw, 172px)",
  avatarSecondary: "clamp(40px, 6vw, 90px)",
  stackShiftX: "0px",
  stackShiftY: "0px",
} as const;
const ABOUT_CATEGORIES = [
  {
    title: "Education",
    icon: "/assets/university-svgrepo-com.svg",
    cards: [
      {
        title: "University",
        credential: "B.Tech in Computer Science",
        detail: "Artificial Intelligence Engineering",
        location: "Amrita Vishwa Vidyapeetham",
        score: "CGPA: 9.3",
        years: "2022 - 2026",
        image: "/assets/university-card.webp"
      },
      {
        title: "Intermediate",
        credential: "Higher Secondary (Class XII)",
        detail: "MPC",
        location: "Sri Chaitanya Junior College",
        score: "95%",
        years: "2020 - 2022",
        image: "/assets/intermediate-card.jpg"
      },
      {
        title: "10th",
        credential: "Secondary Education (Class X)",
        detail: "State Board",
        location: "Dr. KKR's Gowtham School",
        score: "93%",
        years: "2020",
        image: "/assets/tenth-card.jpg"
      }
    ]
  },
  {
    title: "Skills",
    icon: "/assets/skills-emoji.svg",
    cards: []
  },
  {
    title: "Research",
    icon: "/assets/university-svgrepo-com.svg",
    cards: []
  }
] as const;

const ACTIVE_CIRCLE_LABELS = [
  "About",
  "Experience",
  "Projects",
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
      "Building production-grade AI systems from cutting-edge research.",
    title: "Mission",
  },
  {
    quote:
      "Multi-agent workflows · MCP architecture · Hybrid RAG pipelines.",
    title: "Craft",
  },
  {
    quote:
      "From Intel hackathon finalist to shipping AI SaaS at scale.",
    title: "Journey",
  },
  {
    quote:
      "9.3 CGPA · 4 IEEE publications · Open-source contributor.",
    title: "Proof Points",
  },
  {
    quote:
      "LLMOps · AgentOps · Memory orchestration · System design.",
    title: "Stack",
  },
  {
    quote:
      "Calm engineering, curious research, and a bias toward things that ship.",
    title: "Working Rhythm",
  },
] as const;

export default function Page3ScrollStory({
  content,
}: Page2ScrollStoryProps) {
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
      if (openCircleIndex !== null) return;
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
      if (openCircleIndex !== null) return;
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
      if (openCircleIndex !== null) return;
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
  }, [avatarCount, resetScrollIntent, openCircleIndex]);

  useEffect(() => {
    if (activeIndex !== 0) {
      setTimeout(() => {
        setIsFirstDockOpen(false);
        setIsFirstDockClosing(false);
      }, 0);

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
  const isExperienceVisible =
    openCircleIndex === 1 || closingCircleIndex === 1;
  const isProjectsVisible =
    openCircleIndex === 2 || closingCircleIndex === 2;

  return (
    <div className="relative h-[100svh] overflow-hidden">
      <div className="absolute inset-0 bg-black/22 backdrop-blur-[22px]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.012)_24%,rgba(0,0,0,0.12)_58%,rgba(255,255,255,0.04))]" />

      {!isCircleFocusVisible ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-[34svh] items-center overflow-hidden">
          <MovingStatementCards items={PROFILE_STATEMENTS} />
        </div>
      ) : null}

      <AnimatePresence>
        {!isCircleFocusVisible ? (
          <motion.div 
            key="home-hero-image"
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)", x: 20 }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)", x: 0 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)", x: 20 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="pointer-events-auto absolute bottom-0 right-0 top-[15svh] w-[60vw] max-w-[700px] z-0 flex items-end justify-end"
          >
            <PixelatedCanvas
              src="/assets/lokesh.png"
              width={800}
              height={1000}
              cellSize={3}
              dotScale={0.9}
              shape="square"
              backgroundColor=""
              dropoutStrength={0.4}
              interactive
              distortionStrength={3}
              distortionRadius={80}
              distortionMode="swirl"
              followSpeed={0.2}
              jitterStrength={4}
              jitterSpeed={4}
              sampleAverage
              tintColor="#FFFFFF"
              tintStrength={0.2}
              className="w-full h-full object-contain object-right-bottom drop-shadow-[0_0_50px_rgba(34,211,238,0.15)] opacity-90"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {!isCircleFocusVisible ? (
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
      ) : null}

      {isContactCardVisible ? (
        <ContactPinCard isClosing={closingCircleIndex === 4} />
      ) : null}

      {isExperienceVisible ? (
        <ExperienceTimeline isClosing={closingCircleIndex === 1} />
      ) : null}

      {isProjectsVisible ? (
        <ProjectsFullscreenCard isClosing={closingCircleIndex === 2} />
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

const SCROLL_ANIMATIONS = `
@keyframes experience-line-enter {
  0% { transform: translateX(-50%) scaleY(0); opacity: 0; }
  100% { transform: translateX(-50%) scaleY(1); opacity: 1; }
}
@keyframes experience-line-exit {
  0% { transform: translateX(-50%) scaleY(1); opacity: 1; }
  100% { transform: translateX(-50%) scaleY(0); opacity: 0; }
}
@keyframes projects-card-enter {
  0% { transform: scaleX(0); opacity: 0; }
  100% { transform: scaleX(1); opacity: 1; }
}
@keyframes projects-card-exit {
  0% { transform: scaleX(1); opacity: 1; }
  100% { transform: scaleX(0); opacity: 0; }
}
`;

const EXPERIENCE_DATA = [
  {
    company: "Cailyx",
    role: "Co-Founder",
    date: "May 2026 - Present",
    principles: ["Operational", "Entrepreneur"],
    description: [
      "Product Architecture & AI Infrastructure: Designing and scaling core SEO/AEO audit engine.",
      "Engineering Leadership: Orchestrating the end-to-end development of AI-driven marketing workflows.",
      "AI/AEO Strategy: Building specialized workflows to audit, track, and capture real estate within LLM citations.",
    ],
    side: "left" as const,
    links: [
      { url: "http://cailyx.in/" },
      { url: "https://www.linkedin.com/company/116353950/" },
    ],
  },
  {
    company: "Litmus7",
    role: "Backend Engineering Intern",
    date: "Dec 2024 - Present",
    principles: ["Backend Architecture", "Decentralized Systems"],
    description: "Researching memory-aware semantic routing and decentralized graph search for efficient low-latency discovery in dynamic peer networks.",
    side: "left" as const,
    links: [
      { url: "https://www.litmus7.com/" },
    ],
  },
  {
    company: "Heapvue",
    role: "Product Development Engineer",
    date: "May 2024 - Present",
    principles: ["Software Design Architect", "Backend Scalability"],
    description: "Architecting a production-scale multi-tenant AI SaaS using decoupled microservices on DigitalOcean; designed distributed identity, WebSocket communication, and database orchestration layers.",
    side: "left" as const,
    links: [
      { url: "https://chatpress.heapvue.com/" },
      { url: "https://heapvue.com/" },
    ],
  },
  {
    company: "Amrita Hospital, Faridabad",
    role: "ML Engineer Intern",
    date: "Aug 2024 - Dec 2024",
    principles: ["Applied Machine Learning", "Cloud Infrastructure"],
    description: "Managed Django backend deployment on GCP for a dermatology AI platform and built a hybrid multilingual RAG system grounded in clinical knowledge.",
    side: "left" as const,
    links: [
      { url: "https://www.amritahospitals.org/faridabad" }
    ],
  },
  {
    company: "ACM Student Chapter",
    role: "AI Lead",
    date: "May 2024 - May 2025",
    principles: ["Leadership", "Management", "Mentoring"],
    description: "Led the AI division, organized workshops, managed committee operations, and mentored students in machine learning technologies.",
    side: "left" as const,
    links: [
      { url: "https://acm-amritapuri.vercel.app/advisorycommittee" },
    ],
  },
  {
    company: "AmritaWNA",
    role: "Research Intern",
    date: "May 2023 - Jun 2024",
    principles: ["Academic Research", "Computer Vision"],
    description: "Published a research paper in Vehicle Detection and continued research in Smart Home Security under faculty mentorship.",
    side: "left" as const,
    links: [
      { url: "https://www.amrita.edu/center/awna/" },
      { url: "https://www.researchgate.net/publication/382614384_Enhancing_Urban_Home_Security_Deep_Learning_Enabled_Vehicle_Identification" }
    ],
  },
  {
    company: "Intel AI For Youth",
    role: "National Finalist (Top 30)",
    date: "2021",
    principles: ["Achievement", "AI Innovation"],
    description: "Selected as Top 30 National Finalist in Intel's 'AI For Youth' program from thousands of applicants for an innovative smart agriculture solution.",
    side: "left" as const,
  },
  {
    company: "MLH Code in the Dark",
    role: "Winner",
    date: "2024",
    principles: ["Achievement", "Frontend Architecture"],
    description: "Won first place at Major League Hacking's Code in the Dark, demonstrating mastery in blind frontend implementation.",
    side: "left" as const,
  },
  {
    company: "EpochOn AI Hackathon",
    role: "Lead Organizer",
    date: "Dec 2024",
    principles: ["Event Strategy", "Operations", "Mentorship"],
    description: "Conceptualized a 10-hour intensive 'Green AI' hackathon; managed technical logistics and mentorship checkpoints for 19 teams to drive sustainable AI solutions.",
    side: "left" as const,
    links: [
      { url: "https://www.epochon.dev/" },
    ],
    images: [
      "/assets/epochon-1.jpg",
      "/assets/epochon-2.jpg"
    ]
  },
  {
    company: "EvoLUMIN National Hackathon",
    role: "Core Organizer",
    date: "2024",
    principles: ["Scale Operations", "Cross-Functional Coordination"],
    description: "Directed full-scale operations and cross-functional team coordination for Amrita's inaugural national hackathon for 500+ participants and stakeholders.",
    side: "left" as const,
    links: [
      { url: "https://evo-lumin.vercel.app/" },
    ],
    images: [
      "/assets/evolumin-1.jpg",
      "/assets/evolumin-2.jpg",
      "/assets/evolumin-3.jpg"
    ]
  },
  {
    company: "OLabs Hackathon (MeitY)",
    role: "Event Head",
    date: "2025",
    principles: ["Event Direction", "Government Collaboration"],
    description: "Led event management and platform demonstrations for a high-profile government-supported initiative fostering tech-for-good innovation.",
    side: "left" as const,
    links: [
      { url: "https://www.amrita.edu/events/olabs-hackathon/" },
      { url: "https://olabs-hackathon.devfolio.co/" },
    ],
    images: [
      "/assets/olabs-1.jpg",
      "/assets/olabs-2.jpg"
    ]
  },
];

function ExperienceCard({ item }: { item: typeof EXPERIENCE_DATA[0] }) {
  const isLeft = item.side === "left";
  return (
    <>
      {/* Main Content on the ASSIGNED side */}
      <div
        className={`absolute top-1/2 flex w-[max(200px,22vw)] -translate-y-1/2 flex-col p-3 transition-transform duration-300 scale-110 group-hover:scale-95 origin-right ${
          isLeft
            ? "right-full mr-6 items-end text-right"
            : "left-full ml-6 items-start text-left origin-left"
        }`}
      >
        <span className="mb-1 text-[0.55rem] font-bold uppercase tracking-[0.2em] text-cyan-500/80">
          {item.date}
        </span>
        <h3 className="text-xl font-bold tracking-tight text-white">{item.role}</h3>
        <h4 className="text-sm font-medium text-cyan-300/80">{item.company}</h4>
      </div>
    </>
  );
}

function ExperienceTimeline({ isClosing }: { isClosing: boolean }) {
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const [scrollY, setScrollY] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = useCallback((index: number) => {
    if (scrollContainerRef.current) {
      const gapInPixels = window.innerHeight * 0.45;
      scrollContainerRef.current.scrollTo({
        top: index * gapInPixels,
        behavior: "smooth"
      });
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        scrollToIndex(Math.min(EXPERIENCE_DATA.length - 1, hoveredIndex + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        scrollToIndex(Math.max(0, hoveredIndex - 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hoveredIndex, scrollToIndex]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-1, 1], [8, -8]);
  const rotateY = useTransform(smoothX, [-1, 1], [-8, 8]);

  const foregroundX = useTransform(smoothX, [-1, 1], [-30, 30]);
  const foregroundY = useTransform(smoothY, [-1, 1], [-30, 30]);

  const midgroundX = useTransform(smoothX, [-1, 1], [-10, 10]);
  const midgroundY = useTransform(smoothY, [-1, 1], [-10, 10]);

  const backgroundX = useTransform(smoothX, [-1, 1], [15, -15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 2;
    const y = (clientY / window.innerHeight - 0.5) * 2;
    mouseX.set(x);
    mouseY.set(y);
  };
  
  // Flatten all images into a single array, passing along their index within their project
  const ALL_IMAGES = EXPERIENCE_DATA.flatMap((exp: any, i) => 
    exp.images ? exp.images.map((src: string, localIdx: number) => ({ src, expIndex: i, localIdx })) : []
  );

  // 40svh start + 45svh gap per item + 50svh padding at the bottom so the last item reaches center
  const timelineHeight = 40 + (EXPERIENCE_DATA.length - 1) * 45 + 50;

  return (
    <div className="absolute inset-0 w-full h-full" style={{ perspective: "1500px" }} onMouseMove={handleMouseMove}>
      <style>{SCROLL_ANIMATIONS}</style>

      {/* Global Stationary Random Scattered Grid */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ 
            x: backgroundX,
            rotateX,
            rotateY
          }}
        >
          {ALL_IMAGES.map((img, idx) => {
            const isActive = hoveredIndex === img.expIndex;
            
            // Calculate how many images exist for this specific project to perfectly center them
            const totalProjectImages = ALL_IMAGES.filter(i => i.expIndex === img.expIndex).length;
            const offsetIndex = img.localIdx - (totalProjectImages - 1) / 2;
            
            // ACTIVE POSITION: Line them up perfectly in a row!
            // Increased gap slightly as requested to min(26vw, 260px)
            const activeX = `calc(-10vw + ${offsetIndex} * min(26vw, 260px))`;
            const activeY = `-18svh`; // Moved up a bit more to increase vertical gap from the card
            
            // INACTIVE POSITION: Scatter them across the canvas, but keep them tighter together!
            // Reduced spread from 160vw down to 80vw to simulate a reduced "gap" in the background
            const inactiveX = `${((idx * 37) % 80) - 40}vw`; 
            const inactiveY = `${((idx * 23) % 70) - 35}svh`;
            
            return (
              <motion.div
                key={idx}
                className="absolute w-[15vw] h-[10vw] max-w-[160px] max-h-[105px] min-w-[80px] min-h-[50px] rounded-xl overflow-hidden border border-white/5 opacity-50 hidden md:block"
                initial={false}
                animate={{
                  scale: isActive ? 1.5 : 0.75,
                  x: isActive ? activeX : inactiveX,
                  y: isActive ? activeY : inactiveY,
                  opacity: isActive ? 0.9 : 0.15,
                  zIndex: isActive ? 10 : 0,
                }}
                // Silky smooth Apple-style cubic bezier for the sweeping motion
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Canvas Overlay */}
                <div 
                  className="absolute inset-0 z-10 transition-colors duration-500"
                  style={{ backgroundColor: isActive ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.85)' }}
                />
                <img src={img.src} alt="" className="object-cover w-full h-full grayscale-[30%]" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      
      {/* Central Details Card */}
      <div
        className={`pointer-events-none absolute left-[50%] md:left-[45%] z-20 flex w-[max(320px,90vw)] md:w-[max(300px,34vw)] -translate-x-1/2 -translate-y-1/2 flex-col transition-all duration-700 ease-out ${
          ALL_IMAGES.some(img => img.expIndex === hoveredIndex) 
            ? "top-[64svh]" 
            : "top-[50svh]"
        }`}
      >
        <motion.div style={{ x: foregroundX, y: foregroundY, rotateX, rotateY }} className="bg-transparent p-4 md:p-6 w-full h-full flex flex-col">
          <AnimatePresence mode="wait">
          <motion.div 
            key={hoveredIndex} 
            initial={{ opacity: 0, y: scrollDirection === "down" ? 20 : -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: scrollDirection === "down" ? -20 : 20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col"
          >
            <h5 className="mb-3 flex items-center justify-between text-[0.65rem] font-bold uppercase tracking-[0.25em] text-cyan-400/50">
              <span>Impact & Details</span>
            </h5>
            
            {/* Principle Badges */}
            {"principles" in EXPERIENCE_DATA[hoveredIndex] && (
              <div className="mb-4 flex flex-wrap gap-2">
                {(EXPERIENCE_DATA[hoveredIndex] as any).principles.map((principle: string, pIdx: number) => (
                  <span 
                    key={pIdx} 
                    className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-[0.6rem] font-medium tracking-wide text-cyan-300 backdrop-blur-sm"
                  >
                    {principle}
                  </span>
                ))}
              </div>
            )}
            
          <div className="text-[0.85rem] leading-relaxed text-white/80">
            {Array.isArray(EXPERIENCE_DATA[hoveredIndex].description) ? (
              <ul className="flex flex-col gap-4">
                {(EXPERIENCE_DATA[hoveredIndex].description as string[]).map((desc, i) => (
                  <li key={i} className="flex items-start">
                    <span className="mr-3 mt-[0.1rem] text-cyan-400/60">▹</span>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="flex items-start">
                <span className="mr-3 mt-[0.1rem] text-cyan-400/60">▹</span>
                <span>{EXPERIENCE_DATA[hoveredIndex].description}</span>
              </p>
            )}
          </div>

          {/* Links Section */}
            {EXPERIENCE_DATA[hoveredIndex].links && (
              <div className="mt-8 flex flex-wrap justify-center gap-6 pointer-events-auto">
                {EXPERIENCE_DATA[hoveredIndex].links.map((link, i) => {
                  let domain = "";
                  try {
                    domain = new URL(link.url).hostname;
                  } catch (e) {}
                  
                  return (
                    <a 
                      key={i} 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group/link relative flex h-10 w-10 items-center justify-center transition-all duration-300 hover:scale-125"
                    >
                      <span className="absolute -top-8 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-[0.6rem] font-medium text-cyan-100 opacity-0 transition-opacity duration-300 group-hover/link:opacity-100 border border-white/10 backdrop-blur-md">
                        Visit {domain}
                      </span>
                      <img 
                        src={`https://www.google.com/s2/favicons?sz=64&domain_url=${domain}`} 
                        alt={domain}
                        className="h-6 w-6 opacity-70 transition-opacity duration-300 group-hover/link:opacity-100"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </a>
                  );
                })}
              </div>
            )}

            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Scroll Down Prompt */}
      <motion.div 
        className="absolute bottom-6 left-[50%] md:left-[45%] -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center text-cyan-400/50"
        initial={{ opacity: 1 }}
        animate={{ opacity: scrollY < 50 ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-[0.6rem] uppercase tracking-widest mb-2 font-semibold">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>

      <div
        ref={scrollContainerRef}
        className="pointer-events-auto absolute top-[10svh] z-10 flex h-[80svh] w-[100vw] flex-col items-center overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] left-[95%] md:left-[85%]"
        onScroll={(e) => {
          // 45svh is the gap between items
          const gapInPixels = window.innerHeight * 0.45;
          const scrollPos = e.currentTarget.scrollTop;
          
          setScrollY(scrollPos);
          
          const index = Math.round(scrollPos / gapInPixels);
          const clampedIndex = Math.max(0, Math.min(EXPERIENCE_DATA.length - 1, index));
          
          if (clampedIndex !== hoveredIndex) {
            setScrollDirection(clampedIndex > hoveredIndex ? "down" : "up");
            setHoveredIndex(clampedIndex);
          }
        }}
        style={{
          animation: `${
            isClosing ? "experience-line-exit" : "experience-line-enter"
          } 620ms cubic-bezier(0.22,1,0.36,1) both`,
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
        }}
      >
        {/* Timeline line */}
        <motion.div
          className="pointer-events-none absolute h-full w-px flex-col items-center bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent"
          style={{
            height: `${timelineHeight}svh`,
            x: midgroundX,
            y: midgroundY,
            rotateX: rotateX,
            rotateY: rotateY,
          }}
        />

        {/* Timeline items container */}
        <div className="relative h-full w-full">
          {EXPERIENCE_DATA.map((item, index) => {
            const spacing = 40 + index * 45; // Starts at 40svh, 45svh gap

            return (
              <motion.div
                key={item.company}
                onClick={() => scrollToIndex(index)}
                className="group absolute left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border border-cyan-200 bg-[#0b0f18] shadow-[0_0_12px_rgba(34,211,238,0.9)] transition-colors duration-300 hover:bg-cyan-400 cursor-pointer origin-center"
                style={{ 
                  top: `${spacing}svh`,
                  backgroundColor: hoveredIndex === index ? "rgb(34, 211, 238)" : "#0b0f18", // Highlight active dot automatically
                  x: midgroundX,
                  y: midgroundY,
                  rotateX: rotateX,
                  rotateY: rotateY
                }}
                onMouseEnter={() => setHoveredIndex(index)}
              >
                <ExperienceCard item={item} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ContactPinCard({ isClosing }: { isClosing: boolean }) {
  return (
    <div
      className="pointer-events-auto absolute right-[clamp(22px,8vw,120px)] top-1/2 z-20 w-[min(78vw,360px)] -translate-y-1/2 flex items-center justify-center"
      style={{
        animation: `${
          isClosing ? "education-card-exit" : "education-card-enter"
        } 620ms cubic-bezier(0.22,1,0.36,1) both`,
      }}
    >
      <PinContainer title="Get In Touch" href="mailto:vsn.lokesh.yarramallu@gmail.com">
        <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 w-[min(78vw,300px)] h-auto rounded-[28px] border border-white/18 bg-[#0b0f18]/90 backdrop-blur-xl shadow-[0_35px_90px_rgba(0,0,0,0.38)]">
          <p className="mb-4 inline-flex self-start rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-cyan-100/86">
            Contact
          </p>
          <h3 className="text-[clamp(1.2rem,3vw,1.6rem)] font-semibold leading-tight tracking-[-0.04em] text-white">
            Let&apos;s build something reliable.
          </h3>
          <p className="mt-3 text-sm leading-6 text-white/58">
            Open to AI engineering roles, backend systems, agentic workflows,
            and production-focused collaborations.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-white/40">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Rajamahendravaram, Andhra Pradesh
          </div>
          <div className="mt-5 flex flex-col justify-center gap-2 rounded-2xl bg-[radial-gradient(circle_at_20%_20%,rgba(165,243,252,0.12),transparent_32%),linear-gradient(135deg,rgba(20,184,166,0.16),rgba(59,130,246,0.18)_52%,rgba(15,23,42,0.92))] p-3 border border-white/10">
            <a href="https://github.com/LokeshYarramallu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl bg-black/40 px-4 py-2.5 font-medium text-white transition-colors hover:bg-black/60 border border-white/5 hover:border-white/20">
              <svg className="h-5 w-5 text-cyan-100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.022A9.606 9.606 0 0112 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/></svg>
              GitHub
            </a>
            <a href="https://linkedin.com/in/lokeshyarramallu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl bg-black/40 px-4 py-2.5 font-medium text-white transition-colors hover:bg-black/60 border border-white/5 hover:border-white/20">
              <svg className="h-5 w-5 text-cyan-100" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </a>
            <a href="tel:+917095419591" className="flex items-center gap-3 rounded-xl bg-black/40 px-4 py-2.5 font-medium text-white transition-colors hover:bg-black/60 border border-white/5 hover:border-white/20">
              <svg className="h-5 w-5 text-cyan-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              +91 7095419591
            </a>
          </div>
          <a href="mailto:vsn.lokesh.yarramallu@gmail.com" className="mt-5 inline-flex text-sm font-semibold text-cyan-100 transition-colors hover:text-white">
            vsn.lokesh.yarramallu@gmail.com
          </a>
        </div>
      </PinContainer>
    </div>
  );
}

function ProjectsFullscreenCard({ isClosing }: { isClosing: boolean }) {
  return (
    <div
      className="pointer-events-auto absolute bottom-[clamp(24px,8vw,104px)] left-[clamp(200px,28vw,350px)] right-[clamp(24px,8vw,104px)] top-[clamp(24px,8vw,104px)] z-20 flex origin-left items-center justify-center rounded-[32px] border border-white/10 bg-black/40 shadow-[0_35px_90px_rgba(0,0,0,0.38)] backdrop-blur-2xl"
      style={{
        animation: `${
          isClosing ? "projects-card-exit" : "projects-card-enter"
        } 620ms cubic-bezier(0.22,1,0.36,1) both`,
      }}
    >
      <div className="w-full h-full p-6 md:p-10 flex items-center justify-center">
        <ProjectsShowcase />
      </div>
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
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
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

  const selectedCategory = ABOUT_CATEGORIES[selectedCategoryIndex];
  const activeCards = selectedCategory?.cards || [];

  return (
    <nav
      aria-label="Portfolio sections"
      className={`absolute z-20 flex items-center gap-[clamp(4px,1vw,16px)] ${
        isCompact ? "justify-center" : "justify-center"
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
            ? "clamp(160px, 35vw, 260px)"
            : "clamp(180px, 25vw, 300px)",
        } as CSSProperties
      }
    >
      {/* Display Cards for Selected Category */}
      <AnimatePresence mode="wait">
        {selectedCategory?.title === "Skills" ? (
          <motion.div 
            key="skills-showcase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-auto overflow-visible w-[90vw] max-w-5xl"
          >
            <SkillsShowcase />
          </motion.div>
        ) : selectedCategory?.title === "Research" ? (
          <motion.div 
            key="publications-cards"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-auto overflow-visible w-[90vw] max-w-2xl"
          >
            <PublicationsCards />
          </motion.div>
        ) : activeCards.length > 0 ? (
          <motion.div 
            key="education-cards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex w-[95vw] md:w-[85vw] justify-center items-center gap-4 md:gap-8 overflow-visible z-[100] pointer-events-auto"
          >
            {activeCards.map((cardItem, idx) => (
              <AboutCard 
                key={cardItem.credential} 
                item={cardItem} 
                index={idx} 
                isClosing={isClosing} 
                isCompact={isCompact}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="empty-placeholder"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center h-[200px] text-cyan-400/50 font-medium tracking-widest uppercase text-sm border border-cyan-400/20 rounded-xl px-12 bg-black/40 backdrop-blur-md z-[100] pointer-events-auto"
          >
            Content Coming Soon
          </motion.div>
        )}
      </AnimatePresence>

      {ABOUT_CATEGORIES.map((item, index) => (
        <VerticalDockItem
          index={index}
          isCompact={isCompact}
          isSelected={selectedCategoryIndex === index}
          item={item}
          itemCount={ABOUT_CATEGORIES.length}
          key={item.title}
          iconSize={dockPointer?.iconSize ?? null}
          isClosing={isClosing}
          onSelect={() => {
            setSelectedCategoryIndex(index);

            if (isCompact) {
              setCompactHoverDirection("bottom");
              setIsCompactCardHovered(true);
            }
          }}
          pointerX={dockPointer?.x ?? null}
          rowWidth={dockPointer?.width ?? null}
        />
      ))}
    </nav>
  );
}

// --- Helper Component: AboutCard ---
function AboutCard({ 
  item, 
  index, 
  isClosing,
  isCompact
}: { 
  item: any; 
  index: number; 
  isClosing: boolean;
  isCompact: boolean;
}) {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [hoverDirection, setHoverDirection] = useState<HoverDirection>("bottom");
  const overlayTransform = isCardHovered
    ? "translate3d(0, 0, 0)"
    : getDirectionTransform(hoverDirection);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.1
      }}
      className={`relative overflow-hidden shrink-0 rounded-[clamp(20px,3vw,28px)] border-[clamp(2px,0.5vw,4px)] border-white/70 bg-white text-center text-[#050507] shadow-[0_22px_60px_rgba(0,0,0,0.26)] ${isCompact ? "w-[80vw]" : "w-[min(100%,clamp(190px,21vw,310px))]"}`}
      onPointerEnter={(event) => {
        setHoverDirection(getPointerDirection(event.currentTarget, event));
        setIsCardHovered(true);
      }}
      onPointerLeave={(event) => {
        setHoverDirection(getPointerDirection(event.currentTarget, event));
        setIsCardHovered(false);
      }}
      style={EDUCATION_CARD_STYLE}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-105"
        style={{
          backgroundImage: item.image ? `url(${item.image})` : undefined,
        }}
      />
      <div className="absolute inset-0 bg-black/48" />
      <div
        className="absolute inset-0 flex items-center justify-center p-[clamp(18px,2.2vw,30px)] text-center transition-opacity duration-300 ease-out"
        style={{ opacity: isCardHovered ? 0 : 1 }}
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
    </motion.div>
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
}: {
  iconSize: number | null;
  index: number;
  isCompact: boolean;
  isClosing: boolean;
  isSelected: boolean;
  item: (typeof ABOUT_CATEGORIES)[number];
  itemCount: number;
  onSelect: () => void;
  pointerX: number | null;
  rowWidth: number | null;
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
        isCompact ? "min-w-0" : "min-w-[clamp(80px,10vw,140px)]"
      }`}
    >
      {/* The cards are now completely decoupled from the dock icons */}
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
              {/* @ts-expect-error item is narrowed to never */}
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

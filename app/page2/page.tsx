import AuroraBackground from "@/components/aurora-background";
import CircleStack from "@/components/circle-stack";
import { loadPortfolioContent } from "@/lib/portfolio-content";
import type { CSSProperties } from "react";

export default async function Page2() {
  const content = await loadPortfolioContent();

  return (
    <AuroraBackground>
      <main
        className="relative min-h-screen overflow-hidden"
        style={
          {
            backgroundColor: "transparent",
            ["--background"]: "#050507",
          } as CSSProperties
        }
      >
        <div className="pointer-events-none absolute inset-0 bg-black/22 backdrop-blur-[22px]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.012)_24%,rgba(0,0,0,0.12)_58%,rgba(255,255,255,0.04))]" />
        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-6 py-10 sm:px-8 lg:px-12">
          <header className="absolute inset-x-0 top-[8vh]">
            <h1
              className="text-center text-[clamp(1.35rem,3.1vw,2.7rem)] font-medium tracking-[-0.05em] text-[#f5efe3]"
              style={{
                fontFamily:
                  "var(--font-montserrat), var(--font-poppins), sans-serif",
                textShadow: "0 0 24px rgba(255,255,255,0.08)",
              }}
            >
              {content.page.name}
            </h1>
          </header>
          <div className="absolute bottom-[12vh] left-[8vw] flex items-end justify-start sm:left-[9vw] lg:bottom-[14vh] lg:left-[7vw]">
            <CircleStack
              avatars={content.avatars}
              avatarOverlap="clamp(2px, 1vw, 12px)"
              avatarPrimary="clamp(84px, 16vw, 220px)"
              avatarSecondary="clamp(52px, 8vw, 118px)"
              stackShiftX="0px"
              stackShiftY="0px"
            />
          </div>
        </div>
      </main>
    </AuroraBackground>
  );
}

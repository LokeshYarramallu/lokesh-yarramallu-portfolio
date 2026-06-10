import AuroraBackground from "@/components/aurora-background";
import Page3ScrollStory from "@/components/page3-scroll-story";
import { loadPortfolioContent } from "@/lib/portfolio-content";
import type { CSSProperties } from "react";

export default async function Home() {
  const content = await loadPortfolioContent();

  return (
    <AuroraBackground>
      <main
        className="relative min-h-screen overflow-hidden"
        style={
          {
            backgroundColor: "transparent",
            ["--background"]: content.page.background,
          } as CSSProperties
        }
      >
        <Page3ScrollStory content={content} />
      </main>
    </AuroraBackground>
  );
}

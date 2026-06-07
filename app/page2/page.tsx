import AuroraBackground from "@/components/aurora-background";
import Page2ScrollStory from "@/components/page2-scroll-story";
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
            ["--background"]: content.page.background,
          } as CSSProperties
        }
      >
        <Page2ScrollStory content={content} />
      </main>
    </AuroraBackground>
  );
}

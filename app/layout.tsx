import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import { loadPortfolioContent } from "@/lib/portfolio-content";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await loadPortfolioContent();
  const title = "Lokesh Yarramallu | AI Systems Engineer";
  const description = content.page.description || "Portfolio of Lokesh Yarramallu, specializing in Agentic Systems, MCP, and Hybrid RAG.";

  return {
    title: {
      default: title,
      template: "%s | Lokesh Yarramallu",
    },
    description,
    openGraph: {
      title,
      description,
      url: "https://lokeshyarramallu.com", // update to actual domain if needed
      siteName: "Lokesh Yarramallu Portfolio",
      images: [
        {
          url: "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: "Lokesh Yarramallu Portfolio",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="relative isolate min-h-full flex flex-col overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute inset-0 bg-[#050507]" />
        </div>
        <div className="relative z-10 flex min-h-full flex-col">{children}</div>
      </body>
    </html>
  );
}

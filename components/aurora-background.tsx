import type { HTMLAttributes, ReactNode } from "react";

type AuroraBackgroundProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  showRadialGradient?: boolean;
};

export default function AuroraBackground({
  children,
  className = "",
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) {
  return (
    <main className={`relative min-h-screen overflow-hidden ${className}`.trim()} {...props}>
      <div className="relative flex min-h-screen flex-col bg-[#050507] text-slate-50">
        <div
          className={[
            "pointer-events-none absolute -inset-[10px] overflow-hidden blur-[10px] invert filter will-change-transform",
            "[background-image:var(--white-gradient),var(--aurora)]",
            "[background-size:300%_200%,_200%_100%]",
            "[background-position:50%_50%,50%_50%]",
            "animate-[aurora_60s_linear_infinite]",
            "[--aurora:repeating-linear-gradient(100deg,var(--color-sky-500)_10%,var(--color-indigo-300)_15%,var(--color-blue-300)_20%,var(--color-violet-200)_25%,var(--color-sky-400)_30%)]",
            "[--dark-gradient:repeating-linear-gradient(100deg,#050507_0%,#050507_7%,transparent_10%,transparent_12%,#050507_16%)]",
            "[--white-gradient:repeating-linear-gradient(100deg,#ffffff_0%,#ffffff_7%,transparent_10%,transparent_12%,#ffffff_16%)]",
            "after:absolute after:inset-0",
            "after:[background-image:var(--white-gradient),var(--aurora)]",
            "after:[background-size:200%_100%,_100%_100%]",
            "after:[background-position:50%_50%,50%_50%]",
            "after:animate-[aurora_60s_linear_infinite]",
            "after:mix-blend-difference after:content-['']",
            "dark:invert-0 dark:[background-image:var(--dark-gradient),var(--aurora)]",
            "after:dark:[background-image:var(--dark-gradient),var(--aurora)]",
            showRadialGradient
              ? "[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]"
              : "",
          ].join(" ")}
        />
        <div className="relative z-10 flex min-h-screen flex-col">{children}</div>
      </div>
    </main>
  );
}

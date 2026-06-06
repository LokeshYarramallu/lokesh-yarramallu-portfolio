import Image from "next/image";

const experience = [
  {
    chapter: "01",
    role: "R&D Fresher Intern",
    org: "Litmus7",
    period: "Dec 2025 - Present",
    detail:
      "Researching memory-aware semantic routing and decentralized graph search for efficient low-latency discovery in dynamic peer networks.",
  },
  {
    chapter: "02",
    role: "Product Development Engineer",
    org: "Chatpress / HeapVue",
    period: "Oct 2024 - Present",
    detail:
      "Architecting a production-scale multi-tenant AI SaaS with decoupled services, distributed identity, WebSocket communication, and evaluation-driven AgentOps pipelines.",
  },
  {
    chapter: "03",
    role: "Elite Backend Assistant",
    org: "School of AI, Amrita Vishwa Vidyapeetham",
    period: "Jul 2025 - Dec 2025",
    detail:
      "Managed Django deployment on GCP and built a multilingual hybrid RAG system grounded in clinical knowledge for a dermatology AI platform.",
  },
  {
    chapter: "04",
    role: "SIG AI Lead",
    org: "ACM Student Chapter",
    period: "Dec 2022 - May 2025",
    detail:
      "Led workshops, national hackathons, and mentoring programs across ML, research, LLMs, and agentic AI.",
  },
];

const projects = [
  {
    name: "AutoBrowseMCP",
    stack: "MCP, Playwright, Gemini, AsyncIO",
    detail:
      "Custom MCP server enabling natural-language browser automation with stealth sessions, robust retries, and agent workflow integration.",
  },
  {
    name: "HybridCode",
    stack: "Agno, Neo4j, Qdrant, Gemini, Cohere",
    detail:
      "Dual-database code analysis that combines semantic retrieval and structural reasoning for developer questions.",
  },
  {
    name: "AMRAssistant",
    stack: "MCP, GRPO Distillation, Hybrid RAG",
    detail:
      "AMR stewardship multi-agent workflow with explanatory reasoning and a custom memory pipeline.",
  },
  {
    name: "HealthAI",
    stack: "Llama3, PyTorch, XGBoost, oneAPI",
    detail:
      "Multilingual health assistant with fracture detection and disease prediction optimized for practical deployment.",
  },
];

const skills = [
  "Python (OOP), APIs, SDKs, microservices",
  "Machine Learning, Deep Learning, LLM fine-tuning",
  "LLMOps, AgentOps, MCP, A2A, Hybrid RAG",
  "Docker, Git, FastAPI, Django, WebSockets, GCP",
  "Testing, CI/CD pipelines for GenAI systems",
  "Leadership, communication, problem solving",
];

const publications = [
  "BeyondBorders: Unveiling Community and Influence in Multiplex Social Networks",
  "HybridCode: A Dual-Database Framework for Intelligent Codebase Analysis",
  "Deep Learning Enabled Vehicle Identification as a Contribution to Urban Home Security",
  "Industrial Worker Safety Device with Proactive Gas Leak and Fire Protection System",
];

const recognition = [
  "Finalist, Intel GenAI Hackathon 2024",
  "Winner, MLH Hackathon 2023",
  "Core Organizer, EvoLUMIN National Hackathon",
  "Lead Organizer, EpochOn AI Hackathon",
];

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#050507] text-[#f6f1e8]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-70"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(127,179,255,0.18),transparent_24%),radial-gradient(circle_at_84%_22%,rgba(255,194,173,0.12),transparent_20%),radial-gradient(circle_at_76%_74%,rgba(123,228,213,0.1),transparent_24%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:70px_70px] [mask-image:radial-gradient(circle_at_center,black,transparent_88%)]" />
      </div>

      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 sm:px-8 lg:px-12">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 text-[0.7rem] uppercase tracking-[0.3em] text-white/42">
          <span>Lokesh Yarramallu</span>
          <span>AI Systems Engineer</span>
        </div>

        <div className="grid flex-1 gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div className="relative">
            <div className="absolute -left-2 top-0 text-[clamp(5rem,14vw,13rem)] font-medium tracking-[-0.08em] text-white/[0.05]">
              01
            </div>
            <div className="relative z-10 max-w-4xl space-y-6">
              <p className="text-[0.75rem] uppercase tracking-[0.34em] text-[#b7b0a3]">
                Research. Build. Ship.
              </p>
              <h1
                className="text-[clamp(3.2rem,8vw,8rem)] font-medium leading-[0.9] tracking-[-0.075em] text-[#f5efe3]"
                style={{
                  fontFamily:
                    "var(--font-montserrat), var(--font-poppins), sans-serif",
                }}
              >
                Building dependable AI systems from first-principles research to
                production delivery.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-white/64 sm:text-lg">
                I work across agentic systems, hybrid retrieval, backend
                architecture, and production-grade AI workflows with the goal of
                making advanced systems usable under real constraints.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-transform duration-500 hover:-translate-y-1">
              <div className="text-[0.7rem] uppercase tracking-[0.28em] text-white/38">
                Current Focus
              </div>
              <p className="mt-4 text-xl leading-8 tracking-[-0.03em] text-white/88">
                Multi-agent workflows, MCP-native systems, hybrid RAG, and
                backend architecture that survives scale and ambiguity.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.6rem] border border-white/10 bg-black/30 p-5 backdrop-blur-xl transition-transform duration-500 hover:-translate-y-1">
                <div className="text-[0.68rem] uppercase tracking-[0.24em] text-white/34">
                  Education
                </div>
                <p className="mt-3 text-sm leading-6 text-white/72">
                  B.Tech in Computer Science (AI Engineering), Amrita Vishwa
                  Vidyapeetham
                </p>
                <p className="mt-4 text-2xl font-medium text-white/92">9.3</p>
                <p className="text-xs uppercase tracking-[0.2em] text-white/36">
                  CGPA
                </p>
              </div>

              <div className="rounded-[1.6rem] border border-white/10 bg-black/30 p-5 backdrop-blur-xl transition-transform duration-500 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="text-[0.68rem] uppercase tracking-[0.24em] text-white/34">
                    Contact
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/6 p-2">
                    <Image
                      alt="Object group icon"
                      className="h-4 w-4 invert"
                      height={16}
                      src="/assets/object-group-svgrepo-com.svg"
                      width={16}
                    />
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-white/72">
                  Rajamahendravaram, Andhra Pradesh
                </p>
                <a
                  className="mt-4 inline-block text-sm text-[#d8d1c5] transition-colors hover:text-white"
                  href="mailto:vsn.lokesh.yarramallu@gmail.com"
                >
                  vsn.lokesh.yarramallu@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-3 text-sm text-white/60 sm:grid-cols-2 lg:grid-cols-4">
          <a
            className="rounded-full border border-white/12 bg-white/[0.03] px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.06]"
            href="mailto:vsn.lokesh.yarramallu@gmail.com"
          >
            Email
          </a>
          <a
            className="rounded-full border border-white/12 bg-white/[0.03] px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.06]"
            href="https://www.linkedin.com/in/lokeshyarramallu"
            rel="noreferrer"
            target="_blank"
          >
            LinkedIn
          </a>
          <a
            className="rounded-full border border-white/12 bg-white/[0.03] px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.06]"
            href="https://github.com/LokeshYarramallu"
            rel="noreferrer"
            target="_blank"
          >
            GitHub
          </a>
          <a
            className="rounded-full border border-white/12 bg-white/[0.03] px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.06]"
            href="https://www.linkedin.com/in/lokeshyarramallu"
            rel="noreferrer"
            target="_blank"
          >
            Connect
          </a>
        </div>
      </section>

      <section className="relative mx-auto grid w-full max-w-7xl gap-6 px-6 pb-10 sm:px-8 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl">
            <p className="text-[0.7rem] uppercase tracking-[0.28em] text-white/38">
              Skill Surface
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className="rounded-full border border-white/10 bg-black/28 px-4 py-3 text-sm leading-6 text-white/72 transition-transform duration-300 hover:-translate-y-0.5"
                >
                  {skill}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[0.7rem] uppercase tracking-[0.28em] text-white/38">
                Operating Pattern
              </p>
              <svg
                aria-hidden="true"
                className="h-10 w-10 text-white/28"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M8 12h32M8 24h32M8 36h22"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
                <circle
                  cx="34"
                  cy="36"
                  fill="currentColor"
                  r="4"
                />
              </svg>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.4rem] border border-white/8 bg-black/24 p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-white/36">
                  Research
                </div>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Learn the shape of the problem before forcing a system around
                  it.
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-white/8 bg-black/24 p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-white/36">
                  Systems
                </div>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Translate theory into backend, retrieval, orchestration, and
                  deployable workflows.
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-white/8 bg-black/24 p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-white/36">
                  Delivery
                </div>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Prioritize resilience, observability, and outcomes over
                  one-off demos.
                </p>
              </div>
            </div>
          </section>
        </div>

        <section className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="lg:sticky lg:top-10 lg:h-fit">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl">
              <p className="text-[0.7rem] uppercase tracking-[0.28em] text-white/38">
                Experience
              </p>
              <h2
                className="mt-5 text-[clamp(2rem,3vw,3rem)] font-medium leading-[0.98] tracking-[-0.05em] text-white/92"
                style={{
                  fontFamily:
                    "var(--font-montserrat), var(--font-poppins), sans-serif",
                }}
              >
                Systems experience across research, product, and community
                leadership.
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/62">
                The work spans research labs, backend deployment, SaaS systems,
                and AI education, but the through-line is the same: making
                complex technical ideas operational.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {experience.map((item) => (
              <article
                key={item.role}
                className="group rounded-[1.8rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/16"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full border border-white/10 bg-black/30 px-3 py-2 text-[0.72rem] uppercase tracking-[0.24em] text-white/42">
                      {item.chapter}
                    </div>
                    <div>
                      <h3 className="text-xl font-medium tracking-[-0.03em] text-white/92">
                        {item.role}
                      </h3>
                      <p className="mt-1 text-sm text-[#d8d1c5]">{item.org}</p>
                    </div>
                  </div>
                  <span className="text-xs uppercase tracking-[0.22em] text-white/38">
                    {item.period}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-white/64">
                  {item.detail}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.28em] text-white/38">
                Featured Work
              </p>
              <h2
                className="mt-3 text-[clamp(2rem,3.6vw,3.6rem)] font-medium leading-[0.96] tracking-[-0.05em] text-white/92"
                style={{
                  fontFamily:
                    "var(--font-montserrat), var(--font-poppins), sans-serif",
                }}
              >
                Proof-of-work shaped like deployable systems.
              </h2>
            </div>
            <div className="text-sm text-white/52">
              Four projects that best describe the way I build.
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-black/26 p-6 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute right-5 top-5 rounded-full border border-white/10 bg-white/6 p-3">
                <Image
                  alt="Project icon"
                  className="h-5 w-5 invert"
                  height={20}
                  src="/assets/object-group-svgrepo-com.svg"
                  width={20}
                />
              </div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/36">
                {projects[0].stack}
              </p>
              <h3 className="mt-4 text-3xl font-medium tracking-[-0.04em] text-white/92">
                {projects[0].name}
              </h3>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/64">
                {projects[0].detail}
              </p>
            </article>

            <div className="grid gap-4">
              {projects.slice(1).map((project) => (
                <article
                  key={project.name}
                  className="rounded-[1.6rem] border border-white/10 bg-black/26 p-5 transition-all duration-300 hover:-translate-y-1"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-white/36">
                    {project.stack}
                  </p>
                  <h3 className="mt-3 text-xl font-medium tracking-[-0.03em] text-white/92">
                    {project.name}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/62">
                    {project.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl">
            <p className="text-[0.7rem] uppercase tracking-[0.28em] text-white/38">
              Publications
            </p>
            <div className="mt-5 space-y-3">
              {publications.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.15rem] border border-white/8 bg-black/24 px-4 py-3 text-sm leading-6 text-white/70 transition-transform duration-300 hover:-translate-y-0.5"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl">
            <p className="text-[0.7rem] uppercase tracking-[0.28em] text-white/38">
              Leadership & Recognition
            </p>
            <div className="mt-5 grid gap-3">
              {recognition.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.15rem] border border-white/8 bg-black/24 px-4 py-3 text-sm leading-6 text-white/70 transition-transform duration-300 hover:-translate-y-0.5"
                >
                  {item}
                </div>
              ))}
              <div className="rounded-[1.15rem] border border-dashed border-white/10 bg-black/18 px-4 py-4 text-sm leading-6 text-white/58">
                Workshop series on Agentic AI, local LLM deployment, and RAG
                pipelines designed to bridge theory and production practice.
              </div>
            </div>
          </section>
        </div>

        <section className="mb-10 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl">
          <p className="text-[0.7rem] uppercase tracking-[0.28em] text-white/38">
            Closing Note
          </p>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <h2
                className="text-[clamp(2rem,3.2vw,3.4rem)] font-medium leading-[0.97] tracking-[-0.05em] text-white/92"
                style={{
                  fontFamily:
                    "var(--font-montserrat), var(--font-poppins), sans-serif",
                }}
              >
                Open to hard engineering problems where research quality and
                shipping discipline both matter.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62">
                If the work needs agentic systems, backend reliability, hybrid
                retrieval, or a stronger technical spine, I care about building
                the version that survives outside the demo.
              </p>
            </div>
            <div className="flex flex-col gap-3 text-sm">
              <a
                className="rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-white/78 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.08]"
                href="mailto:vsn.lokesh.yarramallu@gmail.com"
              >
                vsn.lokesh.yarramallu@gmail.com
              </a>
              <a
                className="rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-white/78 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.08]"
                href="https://github.com/LokeshYarramallu"
                rel="noreferrer"
                target="_blank"
              >
                github.com/LokeshYarramallu
              </a>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

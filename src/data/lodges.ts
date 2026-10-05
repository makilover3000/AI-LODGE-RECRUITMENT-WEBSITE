/**
 * Lodge data, split into two cohorts:
 *   - "current" — the lodges recruiting now. Until their details drop (LODGE_REVEAL) they are
 *     forest-named placeholders built by `placeholderLodge()`; swap real data into the same
 *     objects (and drop `placeholder: true`) without touching layout.
 *   - "past"    — lodges from earlier cohorts, shown on /lodges/past at their original URLs.
 * Programme/application copy lives in the components and data/programme.ts.
 */

import { LODGE_REVEAL } from "./programme";

export type Captain = {
  name: string;
  detail: string; // faculty / year
  telegram: string; // handle without @
  image: string;
};

export type Week = {
  label: string; // "Week 1", "Recess", "Weeks 5–8"
  topic: string;
  /** per-week attendance tag — undefined for untagged placeholder lodges */
  tag?: "mandatory" | "optional";
  /** optional clarifying note, e.g. "highly recommended if you need guidance" */
  note?: string;
};

/** each lodge gets its own drifting silhouette (leaves — or bats for Vampire) */
export type AmbientKind =
  | "pointed"
  | "teardrop"
  | "lance"
  | "heart"
  | "round"
  | "maple"
  | "oval"
  | "bat";

export type Lodge = {
  slug: string;
  /** which intake this lodge belongs to — see the file header */
  cohort: "current" | "past";
  /** the lodge's real logo art (masked + tinted by LodgeMark); absent → placeholder emblem */
  logo?: string;
  /** placeholder emblem used when there is no logo yet (see public/logos/placeholders/) */
  emblem?: PlaceholderEmblem;
  /** details not released yet — cards and pages show the "details drop" treatment */
  placeholder?: boolean;
  name: string;
  tagline: string;
  /** "TBA" = placeholder lodge whose level is not announced yet */
  level: "Beginner" | "Beginner–Intermediate" | "Intermediate" | "TBA";
  forWho: string;
  /** short "who it's for" shown on the lodge card; falls back to forWho */
  forWhoCard?: string;
  why: string;
  topics: string[];
  /** short concept tags for the lodge card; falls back to topics.slice(0, 3) */
  cardTags?: string[];
  captains: Captain[];
  weeks: Week[];
  ambient: AmbientKind;
  /** palette accent (hex) used for per-lodge tinting */
  accent: string;
  /** logo mark uses the REAL art at /logos/<slug>.png; this overrides the glow
   *  colour (defaults to accent) — see components/lodge/LodgeMark.tsx */
  neonColor?: string;
  /** per-lodge: pulsing crimson halo on the ambient particles (Vampire only) */
  ambientGlow?: boolean;
  /** application status — absent is treated as "open" (see isClosed) */
  status?: "open" | "closed";
  /** programme goals, shown on the lodge overview when present */
  goals?: string[];
  /** approximate length of one session, e.g. "~3 hours per session" */
  sessionLength?: string;
};

export type PlaceholderEmblem = "pine" | "campfire" | "compass" | "lantern" | "axe";

/** A lodge not accepting applications this cycle (still shown for transparency). */
export const isClosed = (l: Lodge) => l.status === "closed";

/** A lodge from an earlier cohort (shown on /lodges/past). */
export const isPast = (l: Lodge) => l.cohort === "past";

/** The art LodgeMark / LodgeTicker paint: the real logo, else the placeholder emblem. */
export const logoSrc = (l: Lodge) =>
  l.logo ?? `/logos/placeholders/${l.emblem ?? "campfire"}.svg`;

/** builds the standard 8-week trail + Recess hack day + Week 10 finals */
const weeks = (topics: string[]): Week[] => [
  ...topics.map((t, i) => ({ label: `Week ${i + 1}`, topic: t })),
  { label: "Recess", topic: "Lodge hack day" },
  { label: "Week 10", topic: "Hackathon finals & project exhibition" },
];

/**
 * A default lodge for the new cohort, shown until its real details drop. `accent` is the dark
 * tone (legible as text on cream); `glow` is its light partner (legible on the pine hero/cards).
 */
const placeholderLodge = ({
  slug,
  name,
  accent,
  glow,
  ambient,
  emblem,
}: {
  slug: string;
  name: string;
  accent: string;
  glow: string;
  ambient: AmbientKind;
  emblem: PlaceholderEmblem;
}): Lodge => ({
  slug,
  name,
  cohort: "current",
  placeholder: true,
  emblem,
  tagline: `Details drop ${LODGE_REVEAL}.`,
  level: "TBA",
  forWho: `${name}'s focus, captains and weekly trail are being finalised. Full details drop ${LODGE_REVEAL} — check back then to see if it's the lodge for you.`,
  forWhoCard: `Focus, captains and weekly trail drop ${LODGE_REVEAL}.`,
  why: "Every lodge runs on the same backbone: weekly hands-on sessions in a small group of 8–10 lodgers with 3 lodge captains, a lodge hack day, and the Week 10 hackathon finals.",
  topics: [
    "Weekly hands-on sessions",
    "Lodge hack day",
    "Hackathon finals & project exhibition",
  ],
  captains: Array.from({ length: 3 }, () => ({
    name: "Captain TBA",
    detail: `Revealed ${LODGE_REVEAL}`,
    telegram: "tbc",
    image: "",
  })),
  weeks: [
    ...Array.from({ length: 7 }, (_, i) => ({ label: `Week ${i + 1}`, topic: "To be announced" })),
    { label: "Recess", topic: "Lodge hack day" },
    { label: "Week 10", topic: "Hackathon finals & project exhibition" },
  ],
  ambient,
  accent,
  neonColor: glow,
});

/** The new cohort's lodges — placeholders until LODGE_REVEAL. */
const CURRENT_LODGES: Lodge[] = [
  placeholderLodge({ slug: "hemlock", name: "Hemlock Lodge", accent: "#3E6B48", glow: "#8FD19E", ambient: "pointed", emblem: "pine" }),
  placeholderLodge({ slug: "cedar", name: "Cedar Lodge", accent: "#A35A42", glow: "#F0A07E", ambient: "maple", emblem: "campfire" }),
  placeholderLodge({ slug: "birch", name: "Birch Lodge", accent: "#6E7A3C", glow: "#D2DC8A", ambient: "oval", emblem: "lantern" }),
  placeholderLodge({ slug: "juniper", name: "Juniper Lodge", accent: "#3A6E8F", glow: "#8CC8EC", ambient: "teardrop", emblem: "compass" }),
  placeholderLodge({ slug: "spruce", name: "Spruce Lodge", accent: "#0D6F62", glow: "#5EBAAB", ambient: "lance", emblem: "pine" }),
  placeholderLodge({ slug: "willow", name: "Willow Lodge", accent: "#8A5C36", glow: "#E2B07E", ambient: "round", emblem: "axe" }),
  placeholderLodge({ slug: "aspen", name: "Aspen Lodge", accent: "#9A6B1F", glow: "#FFCF87", ambient: "heart", emblem: "lantern" }),
  placeholderLodge({ slug: "larch", name: "Larch Lodge", accent: "#B5653A", glow: "#FFB24D", ambient: "maple", emblem: "campfire" }),
  placeholderLodge({ slug: "rowan", name: "Rowan Lodge", accent: "#A33B3B", glow: "#FF8A7A", ambient: "round", emblem: "compass" }),
  placeholderLodge({ slug: "alder", name: "Alder Lodge", accent: "#4F6B7A", glow: "#A9C6D6", ambient: "oval", emblem: "axe" }),
];

/** The lodges from earlier cohorts — kept intact, served at their original URLs. */
const PAST_LODGES: Lodge[] = [
  {
    slug: "cjb",
    cohort: "past",
    logo: "/logos/cjb.png",
    name: "CJB Lodge",
    tagline: "Where friends figure out AI together — before AI starts making decisions for them.",
    level: "Beginner",
    forWho:
      "Anyone with no coding background who's curious about AI and wants to make sense of it through real, relevant events and controversies.",
    forWhoCard:
      "For the curious with no coding background who want to actually understand AI.",
    why: "Learn about AI through relevant, real-world events and controversies — coding and maths stay light, with basic intuition-based content. You'll walk away understanding what AI can and can't do, and how to use it for real practical benefit without letting it do your thinking for you.",
    topics: [
      "Prompt engineering",
      "Hallucinations & bias",
      "Labour displacement",
      "Productivity workflows",
      "MCPs",
      "RAG",
    ],
    cardTags: ["Prompt Engineering", "Hallucinations & Bias", "Real-world AI"],
    captains: [
      {
        name: "Chris",
        detail: "SOSS / Year 3",
        telegram: "chrisakash",
        image: "/captains/chris.jpg",
      },
      {
        name: "June",
        detail: "SCIS (SE) / Year 2",
        telegram: "e1jun6",
        image: "/captains/june.jpg",
      },
      {
        name: "Brod",
        detail: "SCIS (IS) / Year 2",
        telegram: "Adamsandler256",
        image: "/captains/brod.jpg",
      },
    ],
    weeks: [
      { label: "Week 1", topic: "What is AI? LLMs and how language models work" },
      { label: "Week 2", topic: "Prompting and how AI “understands” instructions" },
      { label: "Week 3", topic: "How AI learns: training, data, and the machine learning pipeline" },
      { label: "Week 4", topic: "Hallucinations, retrieval, and grounding AI in facts" },
      { label: "Week 5", topic: "Vision models: how AI sees and interprets images" },
      { label: "Week 6", topic: "AI and creative work: generative models" },
      { label: "Week 7", topic: "AI at work: agents, automation, and agentic AI" },
      { label: "Week 8", topic: "Bias, fairness, and how AI models are trained" },
      { label: "Week 9", topic: "AI safety, deepfakes, and the road ahead" },
    ],
    ambient: "teardrop",
    accent: "#FFB24D",
  },
  {
    slug: "vampire",
    cohort: "past",
    logo: "/logos/vampire.png",
    name: "Vampire Lodge",
    tagline: "Drain the docs. Vibe the code. Deploy the beast.",
    level: "Beginner",
    forWho:
      "Students who want to go from zero to building real AI products — no CS degree needed, just the hunger to ship something. While everyone else is learning to use AI, you'll learn to build the infrastructure that makes AI actually work.",
    forWhoCard:
      "For anyone tired of just prompting — ready to wire the tools, memory, and logic that make AI actually do things.",
    why: "You'll walk away with a live AI agent you built and deployed yourself, something real you can show recruiters and talk about in interviews. We teach you the whole stack, not just calling a model but wiring the tools, memory and orchestration that make it useful.",
    topics: [
      "The AI harness — tools, memory, and orchestration around the model",
      "LLM APIs and function calling",
      "Building multi-tool AI agents with CrewAI",
      "RAG and vector memory",
      "Deploying real AI products to production",
    ],
    cardTags: [
      "APIs & Function Calling",
      "Building AI Agents",
      "RAG & Deployment",
    ],
    captains: [
      {
        name: "Vamsi",
        detail: "SOB / Year 3",
        telegram: "Vamsidhari22",
        image: "/captains/vamsi.jpg",
      },
      {
        name: "Akshaya",
        detail: "SCIS (CS) / Year 2",
        telegram: "melspapaya",
        image: "/captains/akshaya.jpg",
      },
      {
        name: "Makendra",
        detail: "SCIS (IS) / Year 2",
        telegram: "chaneldebleu",
        image: "/captains/makendra-3.jpg",
      },
    ],
    weeks: [
      { label: "Week 1", topic: "AI Landscape & LLM Fundamentals" },
      { label: "Week 2", topic: "Vibe Coding & AI-Assisted Development" },
      { label: "Week 3", topic: "Prompt Engineering & Structured Outputs" },
      { label: "Week 4", topic: "LLM APIs & Function Calling" },
      { label: "Week 5", topic: "Building Your First AI Agent" },
      { label: "Week 6", topic: "Multi-Tool Agents & Orchestration" },
      { label: "Week 7", topic: "RAG & Vector Memory" },
      { label: "Week 8", topic: "Deployment & Project Polish" },
      { label: "Week 9", topic: "Lodge Hack Day" },
      {
        label: "Week 10",
        topic: "Hackathon Finals & Project Exhibition",
      },
    ],
    ambient: "bat",
    accent: "#8B1A1A", // blood red — Vampire Lodge (level badge / ambient stay deep)
    neonColor: "#FF1810", // bright vampire red — neon bat + hero tagline glow
    ambientGlow: true, // pulsing crimson halo on the particles
  },
  {
    slug: "curiositymaxxer",
    cohort: "past",
    logo: "/logos/curiositymaxxer.png",
    name: "CuriosityMaxxer Lodge",
    tagline: "Build with the end in mind — deployment-focused from day one.",
    level: "Intermediate",
    forWho:
      "Product-focused, curiosity-maxxing folks who ideally can already read and write basic Python scripts.",
    forWhoCard:
      "For product-minded builders who want to ship, not just study.",
    why: "An end-in-focus approach: we cater each session around your Hackday ideas and always aim for deployment-focused learning, so you're building toward something real from day one.",
    topics: [
      "Agentic memory systems",
      "Model Context Protocol (MCP)",
      "Agent-to-agent systems",
      "AI safety & guardrails",
      "AI UI/UX",
    ],
    cardTags: ["Agentic Systems", "MCP", "Deployment-focused"],
    captains: [
      {
        name: "Yash",
        detail: "SCIS (CS) / Year 2",
        telegram: "Yash_annem",
        image: "/captains/yash.jpg",
      },
      {
        name: "Kiara",
        detail: "SCIS (CS) / Year 3",
        telegram: "Accordian0live",
        image: "/captains/kiara.jpg",
      },
      {
        name: "Gabriel",
        detail: "MITB / Year 2",
        telegram: "GMSidik",
        image: "/captains/gabriel.jpg",
      },
    ],
    weeks: [
      { label: "Week 1", topic: "The fundamentals of AI (+ optional lab: secure API usage via Colab & deployment)" },
      { label: "Week 2", topic: "Vibecoding / rapid prototyping" },
      { label: "Week 3", topic: "Tool use & agentic loops — structured outputs, ReAct loop" },
      { label: "Week 4", topic: "Agentic memory systems — vector DBs, knowledge-graph retrieval & LLM wiki (+ optional lab)" },
      { label: "Week 5", topic: "Model Context Protocol" },
      { label: "Week 6", topic: "Agent-to-agent systems + human-in-the-loop workflows" },
      { label: "Week 7", topic: "AI safety & guardrails (+ possibly AI UI/UX — streaming components)" },
      { label: "Week 8", topic: "Deployment + prep day for AI Lodge Hack Day" },
    ],
    ambient: "lance",
    accent: "#679D86",
  },
  {
    slug: "paiseh",
    cohort: "past",
    logo: "/logos/paiseh.png",
    name: "Paiseh Lodge",
    tagline: "Equipping you with tools to build anything you can imagine.",
    level: "Beginner–Intermediate",
    forWho:
      "For those who are interested in exploring different areas of AI, and build interesting projects.",
    why: "Learn how to use AI tools and build projects with them, while also understanding the underlying concepts and mechanics.",
    topics: ["Agentic Workflows", "Multimodal AI", "LLM Applications"],
    captains: [
      {
        name: "Sonya",
        detail: "SCIS (IS) / Year 2",
        telegram: "sooony_a",
        image: "/captains/sonya.jpg",
      },
      {
        name: "Pujita",
        detail: "SOB / Year 3",
        telegram: "puji_taa",
        image: "/captains/pujita.jpg",
      },
      {
        name: "Samuel",
        detail: "SCIS (IS) / Year 2",
        telegram: "samtancy",
        image: "/captains/samuel.jpg",
      },
    ],
    weeks: weeks([
      "ML/AI fundamentals",
      "Prompt engineering & LLM Security",
      "Vibecoding",
      "Automated Workflows",
      "Building Agents",
      "RAG & Vector DBs",
      "Multimodal AI",
      "Tensorflow",
    ]),
    ambient: "maple",
    accent: "#C06B4D",
  },
  {
    slug: "wss",
    cohort: "past",
    logo: "/logos/wss.png",
    name: "WSS Lodge",
    tagline: "Real-world AI for real-world problems.",
    level: "Beginner",
    forWho:
      "Anyone — with or without experience — who's curious and driven to explore real-life applications of AI and leverage it to solve business problems.",
    forWhoCard:
      "For problem-solvers who want to put AI to real, business use.",
    why: "Because We Solve Stuff! Whatever your experience level, if you're curious and driven, we'll help you explore real-life applications of AI and use it to actually solve problems.",
    topics: [
      "Vibe coding",
      "Agentic AI",
      "RAG",
      "Deployment",
      "n8n automation",
    ],
    cardTags: ["Vibe Coding", "Agentic AI", "Deployment"],
    captains: [
      {
        name: "Wanyu",
        detail: "SOE / Year 2",
        telegram: "fish_in_a_bowl",
        image: "/captains/wanyu.jpg",
      },
      {
        name: "Sean",
        detail: "SCIS (IS) / Year 3",
        telegram: "sean_koh",
        image: "/captains/sean.jpg",
      },
      {
        name: "Shahad",
        detail: "SOB / Year 5",
        telegram: "SMKxx1",
        image: "/captains/shahad.jpg",
      },
    ],
    weeks: [
      { label: "Week 1", topic: "Vibe coding" },
      { label: "Week 2", topic: "Deployment 1" },
      { label: "Week 3", topic: "Deployment 2 & API Integration" },
      { label: "Week 4", topic: "N8N" },
      { label: "Week 5", topic: "AI Safety" },
      { label: "Week 6", topic: "MCP & Agents" },
      { label: "Week 7", topic: "RAG" },
      { label: "Week 8", topic: "Project discussion" },
      { label: "Week 9", topic: "Project discussion" },
    ],
    ambient: "heart",
    accent: "#FFCF87",
  },
  {
    slug: "hackstreet-boys",
    cohort: "past",
    logo: "/logos/hackstreet-boys.png",
    name: "HackStreet Boys",
    tagline: "Learn AI by building — you'll be the fire. 🔥",
    level: "Beginner–Intermediate",
    forWho:
      "Too technical? Too overwhelming? Not anymore. HackStreet Boys is for students from any faculty — tech background or not — who want to learn AI by actually building things.",
    forWhoCard:
      "For students from any faculty who are curious about AI and want to learn by building and having fun.",
    why: "You'll build your own AI project from scratch and walk away with practical tools you can use for your studies, career, and side projects. No lectures. Just building.",
    topics: [
      "API tooling — call LLMs from code: keys, chat history, structured outputs, function calling",
      "AI app patterns — RAG, vector databases, multimodal input, automated workflows",
      "Prompt engineering & LLM security — reliable outputs and defense against prompt injection",
      "Builder's judgment — picking the right model or pattern for the job",
    ],
    cardTags: ["API Tooling", "Prompt Engineering", "AI App Patterns"],
    captains: [
      {
        name: "Sanjana",
        detail: "SCIS (IS) / Year 2",
        telegram: "ssanjanaa",
        image: "/captains/sanjana.jpg",
      },
      {
        name: "Harshitha",
        detail: "SCIS (IS) / Year 2",
        telegram: "waveb4ckatme",
        image: "/captains/harshitha.jpg",
      },
      {
        name: "Kyle",
        detail: "SOB / Year 2",
        telegram: "KyleJuu",
        image: "/captains/kyle.jpg",
      },
    ],
    weeks: [
      { label: "Week 1", topic: "ML Crash Course — AI Players Overview, ML Models, Deep Dive into LLMs" },
      { label: "Week 2", topic: "Prompt Engineering & LLM Security" },
      { label: "Week 3", topic: "LLM APIs & Function Calling" },
      { label: "Week 4", topic: "Multimodal AI — Vision, Image Generation & Speech" },
      { label: "Week 5", topic: "RAG — Embeddings, Vector Databases & Retrieval" },
      { label: "Week 6", topic: "Automated Workflows" },
      { label: "Week 7", topic: "Frontend + Deployment" },
      { label: "Week 8", topic: "Project" },
      { label: "Week 9", topic: "Project" },
      { label: "Week 10", topic: "Hackathon Finals & Project Exhibition" },
    ],
    ambient: "round",
    accent: "#3BB9AF",
  },
  {
    slug: "llm",
    cohort: "past",
    logo: "/logos/llm.png",
    name: "LLM Lodge",
    status: "closed",
    tagline: "Build real projects while you learn how LLMs actually work.",
    level: "Beginner–Intermediate",
    forWho:
      "Anyone who wants to build personal projects while picking up the ML/LLM fundamentals underneath them.",
    why: "Starts from Python basics and builds up to neural nets, transformers, and working with LLM APIs — then you build.",
    goals: [
      "Build personal projects while integrating AI/ML concepts",
      "Understand the intuition behind Machine Learning",
      "Gain insight into the fundamentals of LLMs",
    ],
    topics: [
      "Python foundations",
      "Neural networks",
      "Transformers",
      "LLM APIs",
    ],
    captains: [
      {
        name: "Greg",
        detail: "SCIS (CS) / Year 3",
        telegram: "gregleejy",
        image: "/captains/greg.jpg",
      },
      {
        name: "Ihsan",
        detail: "SCIS (CS) / Year 3",
        telegram: "ihsanaeong",
        image: "/captains/ihsan.jpg",
      },
    ],
    weeks: [
      {
        label: "Week 1",
        topic: "Basics of programming in Python",
        tag: "mandatory",
      },
      { label: "Week 2", topic: "Neural Networks", tag: "mandatory" },
      { label: "Week 3", topic: "Transformers", tag: "mandatory" },
      {
        label: "Week 4",
        topic: "Guided walkthrough of LLM APIs",
        tag: "mandatory",
      },
      {
        label: "Weeks 5–8",
        topic: "Project building & open office hours",
        tag: "optional",
        note: "Optional as long as you're working on your project — highly recommended if you need guidance.",
      },
      {
        label: "Week 9",
        topic: "Hackday — project showcase",
        tag: "mandatory",
      },
    ],
    sessionLength: "~3 hours per session",
    ambient: "oval",
    accent: "#8A93A6",
  },
];

/** Every topic tag the previous lodges ran, de-duplicated — the pool placeholder cards draw from. */
const TAG_POOL = [...new Set(PAST_LODGES.flatMap((l) => l.cardTags ?? l.topics.slice(0, 3)))];

/** Until their details drop, placeholder lodges show 3 tags sampled from what past lodges
 *  covered. Deterministic (stride 7 through the pool) so server and client render alike;
 *  a lodge's own `cardTags` always wins once its real data lands. */
export const currentLodges: Lodge[] = CURRENT_LODGES.map((l, i) =>
  l.placeholder && !l.cardTags
    ? { ...l, cardTags: [0, 1, 2].map((k) => TAG_POOL[((i * 3 + k) * 7) % TAG_POOL.length]) }
    : l
);
export const pastLodges = PAST_LODGES;
export const lodges: Lodge[] = [...currentLodges, ...PAST_LODGES];

export const getLodge = (slug: string) => lodges.find((l) => l.slug === slug);

/** Old slugs that now redirect to a renamed lodge (kept so shared links don't 404). */
export const LODGE_SLUG_ALIASES: Record<string, string> = {
  kag: "curiositymaxxer", // KAG Lodge → CuriosityMaxxer Lodge
};

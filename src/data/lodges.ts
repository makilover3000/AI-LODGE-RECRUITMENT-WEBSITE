/**
 * Lodge data. Copy here is PLACEHOLDER (names, captains, weekly topics) — structured so real
 * data swaps in without touching layout. Programme/application copy lives in the components.
 */

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
  name: string;
  tagline: string;
  level: "Beginner" | "Beginner–Intermediate" | "Intermediate";
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
  /** per-lodge: pulsing crimson halo on the ambient particles (Vampire only) */
  ambientGlow?: boolean;
  /** application status — absent is treated as "open" (see isClosed) */
  status?: "open" | "closed";
  /** programme goals, shown on the lodge overview when present */
  goals?: string[];
  /** approximate length of one session, e.g. "~3 hours per session" */
  sessionLength?: string;
};

/** A lodge not accepting applications this cycle (still shown for transparency). */
export const isClosed = (l: Lodge) => l.status === "closed";

/** builds the standard 8-week trail + Recess hack day + Week 10 finals */
const weeks = (topics: string[]): Week[] => [
  ...topics.map((t, i) => ({ label: `Week ${i + 1}`, topic: t })),
  { label: "Recess", topic: "Lodge hack day" },
  { label: "Week 10", topic: "Hackathon finals & project exhibition" },
];

export const lodges: Lodge[] = [
  {
    slug: "cjb",
    name: "CJB Lodge",
    tagline: "AI for the curious — no tech background needed.",
    level: "Beginner",
    forWho:
      "Non-technical folks who want to implement AI in their work and stay on top of what's new.",
    why: "Walk away knowing exactly what AI can and can't do so you can actually use and benefit from it critically.",
    topics: [
      "Understand capabilities of AI",
      "The latest AI tools",
      "Tech news & trends",
    ],
    captains: [
      {
        name: "Chris",
        detail: "SOSS / Year 3",
        telegram: "chrisakash",
        image: "/captains/chris.jpg",
      },
      {
        name: "June",
        detail: "SCIS (CS) / Year 2",
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
    weeks: weeks([
      "ML Fundamentals",
      "Prompt Engineering",
      "Hallucinations & Biases",
      "RAG",
      "MCPs and productivity workflows",
      "Labour Displacement",
      "Vibecoding",
      "Hackathon prep",
    ]),
    ambient: "teardrop",
    accent: "#FFB24D",
  },
  {
    slug: "vampire",
    name: "Vampire Lodge",
    tagline: "From zero to deployed AI agent.",
    level: "Beginner–Intermediate",
    forWho:
      "Students who want to go from zero to building real AI products — no CS degree needed, just the hunger to ship something. While everyone else is learning to use AI, you'll learn to build the infrastructure that makes AI actually work.",
    forWhoCard:
      "For anyone who wants to stop using AI and start building with it.",
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
      { label: "Week 1", topic: "The Awakening — AI Landscape & LLM Fundamentals" },
      { label: "Week 2", topic: "The Hunt — Vibe Coding & AI-Assisted Development" },
      { label: "Week 3", topic: "Hypnosis — Prompt Engineering & Structured Outputs" },
      { label: "Week 4", topic: "The Feed — LLM APIs & Function Calling" },
      { label: "Week 5", topic: "The Lair — Building Your First AI Agent" },
      { label: "Week 6", topic: "The Swarm — Multi-Tool Agents & Orchestration" },
      { label: "Week 7", topic: "Cast No Shadow — RAG & Vector Memory" },
      { label: "Week 8", topic: "The Bite — Deployment & Project Polish" },
      { label: "Week 9", topic: "The Blood Hunt — Lodge Hack Day" },
      {
        label: "Week 10",
        topic: "The Coven Rises — Hackathon Finals & Project Exhibition",
      },
    ],
    ambient: "bat",
    accent: "#8B1A1A", // blood red — Vampire Lodge
    ambientGlow: true, // pulsing crimson halo on the particles
  },
  {
    slug: "kag",
    name: "KAG Lodge",
    tagline: "Diving deep into ML/AI theory and building with it.",
    level: "Intermediate",
    forWho:
      "Lodgers who want to dive deep into ML/AI theory and fundamentals, not just use the tools.",
    why: "The most technical lodge: deeper dives into the maths and mechanics under the hood. Comfort with Python + some linear algebra / calculus expected.",
    topics: [
      "ML/AI theory & fundamentals",
      "Neural nets from scratch",
      "Training dynamics",
      "Transformers",
    ],
    captains: [
      {
        name: "Att",
        detail: "SCIS (CS) / Year 2",
        telegram: "mdcccxxi",
        image: "/captains/att.jpg",
      },
      {
        name: "Kiara",
        detail: "SCIS (IS) / Year 2",
        telegram: "Accordian0live",
        image: "/captains/kiara.jpg",
      },
      {
        name: "Gabriel",
        detail: "MITB / PG",
        telegram: "GMSidik",
        image: "/captains/gabriel.jpg",
      },
    ],
    weeks: weeks([
      "Math refresher",
      "Neural nets from scratch",
      "Backprop & training",
      "Transformers",
      "Fine-tuning",
      "Research project I",
      "Research project II",
      "Write-up & demo",
    ]),
    ambient: "lance",
    accent: "#679D86",
  },
  {
    slug: "paiseh",
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
    name: "WSS Lodge",
    tagline: "Make sense of data with AI.",
    level: "Beginner–Intermediate",
    forWho: "Analytics-curious lodgers who love charts, data, and insight.",
    why: "Basic spreadsheets fine; we add Python + ML for analysis. Light math.",
    topics: [
      "Data wrangling",
      "Visualisation",
      "Predictive models",
      "Dashboards",
    ],
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
        detail: "SOB / Year 4",
        telegram: "SMKxx1",
        image: "/captains/shahad.jpg",
      },
    ],
    weeks: weeks([
      "Data foundations",
      "Cleaning & wrangling",
      "Visual storytelling",
      "Predictive models",
      "Model evaluation",
      "Analysis project I",
      "Analysis project II",
      "Dashboard & demo",
    ]),
    ambient: "heart",
    accent: "#FFCF87",
  },
  {
    slug: "hackstreet-boys",
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

export const getLodge = (slug: string) => lodges.find((l) => l.slug === slug);

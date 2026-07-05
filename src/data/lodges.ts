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

export type AmbientKind = "stars" | "fireflies" | "dots" | "embers";

export type Lodge = {
  slug: string;
  name: string;
  tagline: string;
  level: "Beginner" | "Beginner–Intermediate" | "Intermediate";
  forWho: string;
  why: string;
  topics: string[];
  captains: Captain[];
  weeks: Week[];
  ambient: AmbientKind;
  /** palette accent (hex) used for per-lodge tinting */
  accent: string;
  /** application status — absent is treated as "open" (see isClosed) */
  status?: "open" | "closed";
  /** programme goals, shown on the lodge overview when present */
  goals?: string[];
  /** approximate length of one session, e.g. "~3 hours per session" */
  sessionLength?: string;
};

/** A lodge not accepting applications this cycle (still shown for transparency). */
export const isClosed = (l: Lodge) => l.status === "closed";

const placeholderCaptains = (...captains: Captain[]): Captain[] => captains;

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
    captains: placeholderCaptains(
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
    ),
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
    ambient: "fireflies",
    accent: "#FFB24D",
  },
  {
    slug: "vampire",
    name: "Vampire Lodge",
    tagline: "From notebooks to working apps.",
    level: "Beginner–Intermediate",
    forWho: "Open to all levels of experience, regardless of faculty",
    why: "Some Python helps; light math (no heavy proofs). We focus on building and deploying.",
    topics: [
      "APIs & tooling",
      "Building with LLMs",
      "Retrieval & RAG",
      "Shipping a demo",
    ],
    captains: placeholderCaptains(
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
        image: "/captains/makendra.jpg",
      },
    ),
    weeks: weeks([
      "Tooling & environments",
      "Calling model APIs",
      "Prompt engineering",
      "Retrieval & RAG",
      "Building an interface",
      "Project sprint I",
      "Project sprint II",
      "Polish & demo",
    ]),
    ambient: "stars",
    accent: "#5EBAAB",
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
    captains: placeholderCaptains(
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
    ),
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
    ambient: "dots",
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
    captains: placeholderCaptains(
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
    ),
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
    ambient: "embers",
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
    captains: placeholderCaptains(
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
    ),
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
    ambient: "fireflies",
    accent: "#FFCF87",
  },
  {
    slug: "hemlock",
    name: "Hemlock Lodge",
    tagline: "Agents, automation & the frontier.",
    level: "Intermediate",
    forWho: "Builders who want to push into agents, tools, and automation.",
    why: "Comfortable Python expected. We build multi-step agents and wire up real tools.",
    topics: ["Agent design", "Tool use", "Orchestration", "Reliability"],
    captains: placeholderCaptains(
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
    ),
    weeks: weeks([
      "Agent foundations",
      "Tool use & function calling",
      "Memory & state",
      "Orchestration",
      "Evaluation & guardrails",
      "Agent project I",
      "Agent project II",
      "Demo day prep",
    ]),
    ambient: "stars",
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
    captains: placeholderCaptains(
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
    ),
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
    ambient: "dots",
    accent: "#8A93A6",
  },
];

export const getLodge = (slug: string) => lodges.find((l) => l.slug === slug);

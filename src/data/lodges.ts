/**
 * Lodge data. Copy here is PLACEHOLDER (names, captains, weekly topics) — structured so real
 * data swaps in without touching layout. Programme/application copy lives in the components.
 */

export type Captain = {
  name: string;
  detail: string; // faculty / year
  telegram: string; // handle without @
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

const placeholderCaptains = (a: string, b: string, c: string): Captain[] => [
  { name: a, detail: "Faculty / Year — TBC", telegram: "tbc" },
  { name: b, detail: "Faculty / Year — TBC", telegram: "tbc" },
  { name: c, detail: "Faculty / Year — TBC", telegram: "tbc" },
];

const weeks = (topics: string[]): Week[] => [
  ...topics.map((t, i) => ({ label: `Week ${i + 1}`, topic: t })),
  { label: "Recess", topic: "Lodge hack day" },
  { label: "Week 10", topic: "Hackathon finals & project exhibition" },
];

export const lodges: Lodge[] = [
  {
    slug: "cedar",
    name: "Cedar Lodge",
    tagline: "AI for the curious — no tech background needed.",
    level: "Beginner",
    forWho: "Complete beginners and non-technical folks who want to actually use AI in everyday life and stay on top of what's new.",
    why: "The most approachable lodge: practical applications of AI, hands-on with the latest tools, and regular tech news & trends — no coding or math assumed.",
    topics: ["Practical applications of AI", "The latest AI tools", "Tech news & trends", "Prompting & LLMs"],
    captains: placeholderCaptains("Captain One", "Captain Two", "Captain Three"),
    weeks: weeks([
      "Orientation & AI landscape",
      "Python warm-up",
      "Data & notebooks",
      "First ML model",
      "Prompting & LLMs",
      "Mini-project I",
      "Mini-project II",
      "Showcase prep",
    ]),
    ambient: "fireflies",
    accent: "#FFB24D",
  },
  {
    slug: "birch",
    name: "Birch Lodge",
    tagline: "From notebooks to working apps.",
    level: "Beginner–Intermediate",
    forWho: "Those comfortable with basic Python who want to ship small AI apps.",
    why: "Some Python helps; light math (no heavy proofs). We focus on building and deploying.",
    topics: ["APIs & tooling", "Building with LLMs", "Retrieval & RAG", "Shipping a demo"],
    captains: placeholderCaptains("Captain One", "Captain Two", "Captain Three"),
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
    slug: "aspen",
    name: "Aspen Lodge",
    tagline: "Go beyond using tools — understand the theory.",
    level: "Intermediate",
    forWho: "Lodgers who want to dive deep into ML/AI theory and fundamentals, not just use the tools.",
    why: "The most technical lodge: deeper dives into the maths and mechanics under the hood. Comfort with Python + some linear algebra / calculus expected.",
    topics: ["ML/AI theory & fundamentals", "Neural nets from scratch", "Training dynamics", "Transformers"],
    captains: placeholderCaptains("Captain One", "Captain Two", "Captain Three"),
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
    slug: "maple",
    name: "Maple Lodge",
    tagline: "AI for products people actually use.",
    level: "Beginner–Intermediate",
    forWho: "Design- and product-minded folks who want to build delightful AI features.",
    why: "Light coding; we lean on no-code/low-code + APIs. Strong on UX and storytelling.",
    topics: ["AI UX patterns", "Rapid prototyping", "Evals & quality", "Pitching"],
    captains: placeholderCaptains("Captain One", "Captain Two", "Captain Three"),
    weeks: weeks([
      "AI product thinking",
      "Prototyping tools",
      "Designing AI UX",
      "Quality & evals",
      "User testing",
      "Build sprint I",
      "Build sprint II",
      "Pitch prep",
    ]),
    ambient: "embers",
    accent: "#C06B4D",
  },
  {
    slug: "willow",
    name: "Willow Lodge",
    tagline: "Make sense of data with AI.",
    level: "Beginner–Intermediate",
    forWho: "Analytics-curious lodgers who love charts, data, and insight.",
    why: "Basic spreadsheets fine; we add Python + ML for analysis. Light math.",
    topics: ["Data wrangling", "Visualisation", "Predictive models", "Dashboards"],
    captains: placeholderCaptains("Captain One", "Captain Two", "Captain Three"),
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
    captains: placeholderCaptains("Captain One", "Captain Two", "Captain Three"),
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
    topics: ["Python foundations", "Neural networks", "Transformers", "LLM APIs"],
    captains: placeholderCaptains("Captain One", "Captain Two", "Captain Three"),
    weeks: [
      { label: "Week 1", topic: "Basics of programming in Python", tag: "mandatory" },
      { label: "Week 2", topic: "Neural Networks", tag: "mandatory" },
      { label: "Week 3", topic: "Transformers", tag: "mandatory" },
      { label: "Week 4", topic: "Guided walkthrough of LLM APIs", tag: "mandatory" },
      {
        label: "Weeks 5–8",
        topic: "Project building & open office hours",
        tag: "optional",
        note: "Optional as long as you're working on your project — highly recommended if you need guidance.",
      },
      { label: "Week 9", topic: "Hackday — project showcase", tag: "mandatory" },
    ],
    sessionLength: "~3 hours per session",
    ambient: "dots",
    accent: "#8A93A6",
  },
];

export const getLodge = (slug: string) => lodges.find((l) => l.slug === slug);

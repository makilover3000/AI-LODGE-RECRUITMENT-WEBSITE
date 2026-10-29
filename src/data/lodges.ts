/**
 * Lodge data, split into two cohorts:
 *   - "current" — the lodges recruiting now (Spring 2027). A lodge whose details haven't
 *     dropped yet is built by `placeholderLodge()` (currently just Spice); swap real data into
 *     the same object (and drop `placeholder: true`) without touching layout.
 *   - "past"    — lodges from earlier cohorts, shown on /lodges/past at their original URLs.
 * Programme/application copy lives in the components and data/programme.ts.
 */

import { LODGE_REVEAL } from "./programme";

export type Captain = {
  name: string;
  /** faculty / year — omit when not known yet (CaptainCard hides the line) */
  detail?: string;
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
  /** what the lodge's name stands for, e.g. "Mostly Intelligent Together" (MIT) */
  subtitle?: string;
  /** tentative day & time, e.g. "Tue evenings · 7–10pm" */
  schedule?: string;
  /** weekly topics are a draft built from the lodge's topic list (WeekList flags it) */
  trailTentative?: boolean;
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
 * A draft trail from a lodge's own topic list (in the order the captains wrote it), then the
 * programme's fixed Recess hack day + Week 10 finals. Pair with `trailTentative: true`.
 * Fewer than 8 topics? The remaining session weeks show as one honest "To be confirmed"
 * row rather than a silent gap or invented topics.
 */
const SESSION_WEEKS = 8;
const tentativeWeeks = (topics: string[]): Week[] => {
  const n = topics.length;
  const rest =
    n >= SESSION_WEEKS
      ? []
      : [{ label: n + 1 === SESSION_WEEKS ? `Week ${SESSION_WEEKS}` : `Weeks ${n + 1}–${SESSION_WEEKS}`, topic: "To be confirmed" }];
  return [
    ...topics.map((t, i) => ({ label: `Week ${i + 1}`, topic: t })),
    ...rest,
    { label: "Recess", topic: "Lodge hack day" },
    { label: "Week 10", topic: "Hackathon finals & project exhibition" },
  ];
};

/** A captain: name + photo, plus faculty/year and Telegram once known ("tbc" until then). */
const cap = (name: string, image: string, detail?: string, telegram = "tbc"): Captain => ({
  name,
  detail,
  telegram,
  image: `/captains/${image}.jpg`,
});

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
  logo,
  captains,
}: {
  slug: string;
  name: string;
  accent: string;
  glow: string;
  ambient: AmbientKind;
  emblem?: PlaceholderEmblem;
  logo?: string;
  /** known captains so far; the rest of the 3 seats show as TBA */
  captains?: Captain[];
}): Lodge => ({
  slug,
  name,
  cohort: "current",
  placeholder: true,
  emblem,
  logo,
  tagline: `Details drop ${LODGE_REVEAL}.`,
  level: "TBA",
  forWho: `${name}'s focus, captains and weekly trail are being finalised. Full details drop ${LODGE_REVEAL} — check back to see if it's the lodge for you.`,
  forWhoCard: `Focus, captains and weekly trail drop ${LODGE_REVEAL}.`,
  why: "Every lodge runs on the same backbone: weekly hands-on sessions in a small group of 8–10 lodgers with 3 lodge captains, a lodge hack day, and the Week 10 hackathon finals.",
  topics: [
    "Weekly hands-on sessions",
    "Lodge hack day",
    "Hackathon finals & project exhibition",
  ],
  captains: [
    ...(captains ?? []),
    ...Array.from({ length: Math.max(0, 3 - (captains?.length ?? 0)) }, () => ({
      name: "Captain TBA",
      detail: `Revealed ${LODGE_REVEAL}`,
      telegram: "tbc",
      image: "",
    })),
  ],
  weeks: [
    ...Array.from({ length: 7 }, (_, i) => ({ label: `Week ${i + 1}`, topic: "To be announced" })),
    { label: "Recess", topic: "Lodge hack day" },
    { label: "Week 10", topic: "Hackathon finals & project exhibition" },
  ],
  ambient,
  accent,
  neonColor: glow,
});

/** The new cohort's lodges (Spring 2027). Copy comes from each lodge's own brief; topics and
 *  schedules are tentative until the captains finalise them. */
const MIT_TOPICS = [
  "LLM integration",
  "AI orchestration",
  "Tool calling",
  "Memory",
  "Retrieval-Augmented Generation (RAG)",
  "Multi-step agent workflows",
  "Agentic RAG",
  "Basic multi-agent systems",
];
const PANDAI_TOPICS = ["LLM fundamentals", "RAG", "AI agents", "LLM safety", "Vibe coding"];
const HAWKINS_TOPICS = [
  "How multimodal models interpret input",
  "Image recognition & describing photos",
  "Transcribing & summarising audio",
  "AI-generated images, music & video",
  "Prompting across formats",
  "Combining modalities into one workflow",
  "Limits & risks: hallucinations, bias, deepfakes",
];
const BRYAN_TOPICS = [
  "LLMs & prompt engineering",
  "Computer vision",
  "Recommender systems",
  "Vibe coding",
  "Self-improving agents",
  "Testing & improving what you build",
];
const IDW_TOPICS = [
  "How LLMs actually work",
  "Prompt engineering",
  "Image generation with diffusion models",
  "Giving AI memory with RAG",
  "Vibe coding",
  "Autonomous AI agents",
];
const SUPERPOWER_TOPICS = [
  "BM25 / keyword vs. semantic search",
  "Retrieval-Augmented Generation (RAG)",
  "Multimodal search",
  "AI agents that browse the web",
  "Measuring search quality",
];
const DESPACITO_TOPICS = [
  "Machine learning",
  "Computer vision",
  "Interactive games",
  "Creative coding",
  "Vibe coding",
  "Finding limits & improving your experiments",
];
const BOLIAO_TOPICS = [
  "Core LLM & agent concepts",
  "Scoping agents",
  "Designing guardrails",
  "Multi-agent systems",
  "Connecting agents to real databases",
  "Advanced RAG (GraphRAG)",
  "Latest AI tools, frameworks & trends",
];

const CURRENT_LODGES: Lodge[] = [
  {
    slug: "mit",
    cohort: "current",
    logo: "/logos/mit.png",
    name: "MIT Lodge",
    subtitle: "Mostly Intelligent Together",
    tagline: "Building AI agents that plan, remember and act.",
    level: "TBA",
    forWho:
      "Anyone who wants to go beyond chatbots and build intelligent AI agents that call tools, remember and retrieve.",
    forWhoCard: "For builders who want AI agents that plan, use tools and remember.",
    why: "Our lodge focuses on building intelligent AI agents through LLM integration, AI orchestration, tool calling, memory and Retrieval-Augmented Generation (RAG). Building on these foundations, you'll explore multi-step agent workflows, Agentic RAG and basic multi-agent systems through a balance of theory and hands-on projects.",
    topics: MIT_TOPICS,
    cardTags: ["Agentic AI", "Tool Calling", "Agentic RAG"],
    captains: [
      cap("Sanjana", "sanjana-2", "SCIS (IS) / Year 2", "Sanjana270306"),
      cap("Chitanya", "chitanya", "SCIS (IS) / Year 2", "Chitanya_Bharathi"),
      cap("Janani", "janani", "SCIS (IS) / Year 2", "JJanani88"),
    ],
    weeks: tentativeWeeks(MIT_TOPICS),
    trailTentative: true,
    schedule: "Tue or Wed evenings · 7–10pm",
    ambient: "lance",
    accent: "#1E3A6E", // MIT navy
    neonColor: "#8FB4FF",
  },
  {
    slug: "pandai",
    cohort: "current",
    logo: "/logos/pandai.png",
    name: "PandAI Lodge",
    tagline: "Build a real intuition for how AI works — then put it to work in your field.",
    level: "Beginner",
    forWho:
      "Beginners. We want you to develop an intuition for how AI works — and how to ultimately apply it in your own specialised field.",
    forWhoCard: "For beginners who want to understand AI and apply it to their own field.",
    why: "Starting from LLM fundamentals, we build up through RAG, agents and LLM safety to vibe coding — so you leave with a genuine intuition for how AI works, and how to apply it in whatever field you're in.",
    topics: PANDAI_TOPICS,
    cardTags: ["LLM Fundamentals", "RAG & Agents", "Vibe Coding"],
    captains: [
      cap("Emily", "emily", "CIS / Year 1", "homesickpencil"),
      cap("Jun Han", "jun-han", "SCIS (IS) / Year 2", "junnhann"),
      cap("Xing You", "xing-you", "SCIS (IS) / Year 1", "xingthexing"),
    ],
    weeks: tentativeWeeks(PANDAI_TOPICS),
    trailTentative: true,
    schedule: "Tue evenings · 7–10pm",
    ambient: "round",
    accent: "#2B3A33", // panda ink (kept black-and-white — the green panda read as scary)
    neonColor: "#F4EEE0", // paper white: the mark looks like a real panda on dark grounds
  },
  {
    slug: "hawkins",
    cohort: "current",
    logo: "/logos/hawkins.png",
    name: "HawKins Lab",
    tagline: "AI that can see, hear, read and create.",
    level: "Beginner",
    forWho: "Beginner-friendly. No coding background needed — only curiosity!",
    forWhoCard: "Beginner-friendly: no coding background needed, only curiosity.",
    why: "Our lodge focuses on understanding and using AI that can see, hear, read and create across text, images, audio and video. You'll explore how multimodal models interpret different types of input — from image recognition and describing photos to transcribing and summarising audio — then move into AI-generated images, music and video, prompting across formats, and combining modalities into one workflow. We'll also cover the limits and risks, including hallucinations, bias in image generation and deepfakes, so you learn to use these tools responsibly.",
    topics: HAWKINS_TOPICS,
    cardTags: ["Multimodal AI", "Image & Audio", "Generative Media"],
    captains: [
      cap("Kaavya", "kaavya", "SCIS (IS) / Year 2", "kkaavya"),
      cap("Hari", "hari", "SCIS (IS) / Year 2", "harianagrandekutty"),
      cap("Marilyn", "marilyn", "MIM", "llama_louie"),
    ],
    weeks: tentativeWeeks(HAWKINS_TOPICS),
    trailTentative: true,
    schedule: "Tue evenings · 7–10pm",
    ambient: "oval",
    accent: "#9B1C1C", // Upside-Down crimson
    neonColor: "#FF4D4D",
  },
  {
    slug: "bryan",
    cohort: "current",
    logo: "/logos/bryan.png",
    name: "BRYan Lodge",
    tagline: "Everyday applied AI — leave with a working tool every week.",
    level: "Beginner",
    forWho:
      "Beginner-friendly, across all schools — anyone interested in creating tools and workflows that help with their daily or school life.",
    forWhoCard: "For anyone who wants to build AI tools for daily and school life.",
    why: "Our lodge teaches beginners to understand and build the AI they use in daily and school life. We prioritise practical lab sessions so you leave with a working tool every week — covering LLMs and prompt engineering, computer vision, recommender systems, vibe coding and self-improving agents. Throughout the 10 weeks, you'll also learn to test and improve what you build.",
    topics: BRYAN_TOPICS,
    cardTags: ["Applied AI", "Computer Vision", "Vibe Coding"],
    captains: [
      cap("Yu Hui", "yu-hui-3", "SCIS (IS) / Year 1", "why_u_hui"),
      cap("Ryan", "ryan-3", "SCIS (IS) / Year 1", "rnonsense"),
      { name: "Brod", detail: "SCIS (IS) / Year 2", telegram: "Adamsandler256", image: "/captains/brod-2.jpg" },
    ],
    weeks: tentativeWeeks(BRYAN_TOPICS),
    trailTentative: true,
    schedule: "Thu evenings · 7–10pm",
    ambient: "teardrop",
    accent: "#5B4A8B", // night-sky violet (the cat's starry badge)
    neonColor: "#DCD3FF",
  },
  {
    slug: "idw",
    cohort: "current",
    logo: "/logos/idw.png",
    name: "IDW Lodge",
    subtitle: "I Do Want",
    tagline: "The AI everyone talks about — finally explained, without the heavy maths.",
    level: "Beginner",
    forWho: "Absolute beginners who are genuinely clueless about AI.",
    forWhoCard: "For absolute beginners — clear AI, no heavy maths.",
    why: "Our lodge breaks down the AI concepts everyone talks about but few actually understand: how LLMs actually work, prompt engineering, image generation with diffusion models, giving AI memory with RAG, vibe coding and autonomous AI agents. Every week includes plenty of hands-on time, where you put what you've just learned into practice on your project.",
    topics: IDW_TOPICS,
    cardTags: ["LLMs Explained", "Diffusion Models", "AI Agents"],
    captains: [
      cap("Isaac", "isaac", "SCIS (IS) / Year 1", "isaactham"),
      cap("Dheekshitha", "dheekshitha", "SCIS (IS) / Year 1", "dheefvl"),
      cap("Wei Yang", "wei-yang-3", "SCIS (IS) / Year 1", "weiyang17"),
    ],
    weeks: tentativeWeeks(IDW_TOPICS),
    trailTentative: true,
    schedule: "Thu evenings · 7–10pm",
    ambient: "maple",
    accent: "#9A4A12", // sun orange (darkened for text contrast)
    neonColor: "#FFC46B",
  },
  {
    slug: "superpower",
    cohort: "current",
    logo: "/logos/superpower.png",
    name: "Superpower Lodge",
    tagline: "Build AI-powered search engines that retrieve, understand and act.",
    level: "Beginner–Intermediate",
    forWho:
      "Lodgers with basic to intermediate experience who want to build AI-powered search engines.",
    forWhoCard: "For basic-to-intermediate builders who want to make AI search tools.",
    why: "Explore BM25 / keyword vs. semantic search, RAG, multimodal search and AI agents that browse the web. By the end of term, you'll know how to implement AI search tools you can integrate into your own projects — and how to measure search quality.",
    topics: SUPERPOWER_TOPICS,
    cardTags: ["AI Search", "Semantic Search", "RAG"],
    captains: [
      cap("Raeann", "raeann", "SCIS (IS) / Year 1", "raeelim"),
      cap("Wei Kai", "wei-kai", "SCIS (IS) / Year 1", "wa_kii"),
      cap("Philbert", "philbert", "SCIS (IS) / Year 2", "wantonwarlord"),
      { name: "Shahad", detail: "SOB / Year 5", telegram: "SMKxx1", image: "/captains/shahad-2.jpg" },
    ],
    weeks: tentativeWeeks(SUPERPOWER_TOPICS),
    trailTentative: true,
    schedule: "Tue evenings · 7–9.30pm",
    ambient: "pointed",
    accent: "#1F4FA0", // Superman blue
    neonColor: "#FFD23F", // shield yellow
  },
  {
    slug: "despacito",
    cohort: "current",
    logo: "/logos/despacito.png",
    name: "Despacito Lodge",
    tagline: "Experimental AI & creative computing — learn by building, testing and challenging it.",
    level: "Beginner",
    forWho: "Beginners from all schools — no prior coding or AI experience required.",
    forWhoCard: "For beginners from any school — no coding or AI experience needed.",
    why: "Our lodge takes a playful, experiment-driven approach: you'll discover how intelligent systems work by building, testing and challenging them. Through hands-on projects in machine learning, computer vision, interactive games and creative coding, you'll explore how AI learns, makes decisions and responds to different inputs — then use beginner-friendly tools and vibe coding to create your own AI-powered experiments, find their limits and keep improving them. Over 10 weeks, we aim to make AI accessible, engaging and fun through curiosity, creativity and experimentation!",
    topics: DESPACITO_TOPICS,
    cardTags: ["Creative Coding", "Computer Vision", "Interactive Games"],
    captains: [
      cap("Clayton", "clayton", "SCIS (IS) / Year 1", "haid1lau"),
      cap("Elton", "elton", "SCIS (IS) / Year 1", "elt_nn"),
      cap("Dikshaa", "dikshaa", "SCIS (IS) / Year 2", "shaa_rukhan"),
      { name: "Makendra", detail: "SCIS (IS) / Year 2", telegram: "chaneldebleu", image: "/captains/makendra-4.jpg" },
    ],
    weeks: tentativeWeeks(DESPACITO_TOPICS),
    trailTentative: true,
    schedule: "Tue or Thu evenings · 7–10pm",
    ambient: "heart",
    accent: "#B0246E", // deep neon pink (legible on cream)
    neonColor: "#FF4FA3", // the sugar skull's pink tube (cyan 2nd tube lives in SkullNeon)
  },
  {
    slug: "boliao",
    cohort: "current",
    logo: "/logos/boliao.png",
    name: "Boliao Lodge",
    tagline: "A build-focused lodge for AI agents and AI engineering.",
    level: "Intermediate",
    forWho:
      "Intermediate students. No programming background required, but you should have some prior experience building projects.",
    forWhoCard: "For builders with some project experience — no programming background needed.",
    why: "From core LLM and agent concepts to hands-on development: learn to scope agents, design guardrails, build multi-agent systems, connect agents to real databases and implement advanced RAG techniques such as GraphRAG — while staying current with the latest AI tools, frameworks and industry trends.",
    topics: BOLIAO_TOPICS,
    cardTags: ["AI Agents", "Multi-Agent Systems", "GraphRAG"],
    captains: [
      { name: "Yash", detail: "SCIS (CS) / Year 2", telegram: "Yash_annem", image: "/captains/yash-2.jpg" },
      cap("Shaun", "shaun", "SCIS (IS) / Year 2", "shaunpan"),
      { name: "Sonya", detail: "SCIS (IS) / Year 2", telegram: "sooony_a", image: "/captains/sonya-2.jpg" },
    ],
    weeks: tentativeWeeks(BOLIAO_TOPICS),
    trailTentative: true,
    schedule: "Tue evenings · 7–10pm",
    ambient: "round",
    accent: "#8A6410", // duckling ochre
    neonColor: "#FFD966",
  },
  placeholderLodge({
    slug: "spice",
    name: "Spice Lodge",
    logo: "/logos/spice.png",
    accent: "#B23A2A", // chilli red
    glow: "#FF6B4A",
    ambient: "teardrop",
    captains: [
      { name: "Gabriel", detail: "MITB / Year 2", telegram: "GMSidik", image: "/captains/gabriel-2.jpg" },
    ],
  }),
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

export const currentLodges = CURRENT_LODGES;
export const pastLodges = PAST_LODGES;
export const lodges: Lodge[] = [...currentLodges, ...PAST_LODGES];

export const getLodge = (slug: string) => lodges.find((l) => l.slug === slug);

/** Old slugs that now redirect to a renamed lodge (kept so shared links don't 404). */
export const LODGE_SLUG_ALIASES: Record<string, string> = {
  kag: "curiositymaxxer", // KAG Lodge → CuriosityMaxxer Lodge
};

/**
 * Lodge data.
 *
 * Lodge names, captain details (photo/name/faculty/year/telegram) and the
 * week-by-week topic lists are NOT final — they are placeholders. The shapes
 * below are the contract: real data (e.g. exported from a Google Sheet) can be
 * dropped straight in later without touching any layout/animation code.
 *
 * `ambient` selects the per-lodge particle layer rendered over the shared
 * cabin world — a small personality differentiator, not a different scene.
 */

export type AmbientType =
  | "stars"
  | "dots"
  | "fireflies"
  | "embers"
  | "leaves"
  | "snow"
  | "pollen";

export type SkillLevel = "Beginner" | "Beginner–Intermediate" | "Intermediate";

export interface Captain {
  name: string;
  faculty: string;
  year: string;
  telegram: string; // handle without the leading @
  photo?: string; // /public path or remote URL; falls back to a monogram
}

export interface WeekTopic {
  week: number;
  topic: string;
}

export interface Lodge {
  slug: string;
  name: string;
  tagline: string;
  level: SkillLevel;
  ambient: AmbientType;
  topics: string[];
  whoFor: string;
  whyJoin: string;
  captains: Captain[];
  weeks: WeekTopic[];
}

const placeholderCaptains = (a: string, b: string, c: string): Captain[] => [
  { name: a, faculty: "SCIS", year: "Y2", telegram: "tbc_handle" },
  { name: b, faculty: "Business", year: "Y3", telegram: "tbc_handle" },
  { name: c, faculty: "Economics", year: "Y2", telegram: "tbc_handle" },
];

const placeholderWeeks = (theme: string): WeekTopic[] => [
  { week: 1, topic: `Orientation & ${theme} foundations` },
  { week: 2, topic: "Core concepts & tooling setup" },
  { week: 3, topic: "Hands-on: your first build" },
  { week: 4, topic: "Working with real data" },
  { week: 5, topic: "Models & evaluation" },
  { week: 6, topic: "Project scoping with your captains" },
  { week: 7, topic: "Build week — guided project sprint" },
  { week: 8, topic: "Polish, present & demo day prep" },
];

export const lodges: Lodge[] = [
  {
    slug: "aurora",
    name: "Lodge Aurora",
    tagline: "Where curiosity lights the sky.",
    level: "Beginner",
    ambient: "stars",
    topics: ["Intro to AI", "Prompt craft", "No-code tools"],
    whoFor: "Total beginners who are curious about AI and want a gentle, supportive start.",
    whyJoin:
      "No coding or maths assumed. You'll leave able to build and reason about simple AI tools.",
    captains: placeholderCaptains("Capt. A. Tan", "Capt. B. Lim", "Capt. C. Ng"),
    weeks: placeholderWeeks("AI"),
  },
  {
    slug: "ember",
    name: "Lodge Ember",
    tagline: "Small sparks, real projects.",
    level: "Beginner–Intermediate",
    ambient: "embers",
    topics: ["Python basics", "Data wrangling", "First ML model"],
    whoFor: "Curious learners comfortable trying a little code with guidance.",
    whyJoin:
      "Light coding (Python) introduced from scratch; basic maths helps but isn't required.",
    captains: placeholderCaptains("Capt. D. Wong", "Capt. E. Goh", "Capt. F. Lee"),
    weeks: placeholderWeeks("data"),
  },
  {
    slug: "fern",
    name: "Lodge Fern",
    tagline: "Grow your understanding, layer by layer.",
    level: "Beginner",
    ambient: "leaves",
    topics: ["AI in everyday tools", "Ethics & bias", "Build-a-bot"],
    whoFor: "Non-technical students who want to understand AI's impact and use it well.",
    whyJoin: "Concept-first, minimal code. Great for business, comms and design folks.",
    captains: placeholderCaptains("Capt. G. Sim", "Capt. H. Chua", "Capt. I. Teo"),
    weeks: placeholderWeeks("applied AI"),
  },
  {
    slug: "glimmer",
    name: "Lodge Glimmer",
    tagline: "Make ideas shine.",
    level: "Beginner–Intermediate",
    ambient: "dots",
    topics: ["Generative AI", "APIs & apps", "Rapid prototyping"],
    whoFor: "Builders who want to ship a working AI-powered app by the end.",
    whyJoin: "Some coding involved; we ramp you up. Bring an idea, leave with a prototype.",
    captains: placeholderCaptains("Capt. J. Ho", "Capt. K. Yeo", "Capt. L. Koh"),
    weeks: placeholderWeeks("generative AI"),
  },
  {
    slug: "lumen",
    name: "Lodge Lumen",
    tagline: "Bring clarity to data.",
    level: "Intermediate",
    ambient: "fireflies",
    topics: ["Machine learning", "Model evaluation", "Visualisation"],
    whoFor: "Students with some Python/stats who want to go deeper on ML.",
    whyJoin: "Comfortable-with-code track; intermediate maths (basic stats) expected.",
    captains: placeholderCaptains("Capt. M. Ang", "Capt. N. Seah", "Capt. O. Foo"),
    weeks: placeholderWeeks("machine learning"),
  },
  {
    slug: "willow",
    name: "Lodge Willow",
    tagline: "Bend toward what you build.",
    level: "Beginner",
    ambient: "pollen",
    topics: ["AI for good", "Community projects", "Storytelling with data"],
    whoFor: "Mission-driven students who want AI projects with social impact.",
    whyJoin: "Low technical bar; we pair you with captains to scope a meaningful build.",
    captains: placeholderCaptains("Capt. P. Tan", "Capt. Q. Low", "Capt. R. Heng"),
    weeks: placeholderWeeks("AI-for-good"),
  },
  {
    slug: "frost",
    name: "Lodge Frost",
    tagline: "Sharp, clean, technical.",
    level: "Intermediate",
    ambient: "snow",
    topics: ["Deep learning", "LLMs under the hood", "Deployment"],
    whoFor: "Technically confident students ready for a faster, deeper pace.",
    whyJoin: "Strong coding track; comfort with Python and some linear algebra expected.",
    captains: placeholderCaptains("Capt. S. Ong", "Capt. T. Boon", "Capt. U. Quek"),
    weeks: placeholderWeeks("deep learning"),
  },
];

export const lodgeSlugs = lodges.map((l) => l.slug);

export function getLodge(slug: string): Lodge | undefined {
  return lodges.find((l) => l.slug === slug);
}

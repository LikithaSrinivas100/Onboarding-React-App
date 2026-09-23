export const KEY = "onboardingDraft";

export const EMPTY = {
  name: "",
  email: "",
  portfolio: "",
  track: "",
  experience: "",
  techStack: [],
};

export const TRACKS = ["Frontend", "Backend", "Fullstack", "UI/UX Design"];
export const LEVELS = ["Junior", "Mid", "Senior"];
export const LABELS = ["Personal", "Preferences", "Stack", "Review"];

export const TRACK_INFO = {
  Frontend: "Interfaces, interaction, and everything that ships to the browser.",
  Backend: "Services, data, and the systems that keep them running.",
  Fullstack: "End to end — comfortable on both sides of the API.",
  "UI/UX Design": "Research, flows, and the systems that hold a product together.",
};

export const LEVEL_INFO = {
  Junior: "Building core skills, shipping with guidance.",
  Mid: "Owns features end to end with light oversight.",
  Senior: "Sets technical direction, mentors the team.",
};

export const STACK = {
  Frontend: ["React", "Vue", "TypeScript", "CSS Modules"],
  Backend: ["Node.js", "Python/Django", "PostgreSQL", "Redis"],
  Fullstack: [
    "React", "Vue", "TypeScript", "CSS Modules",
    "Node.js", "Python/Django", "PostgreSQL", "Redis",
  ],
  "UI/UX Design": ["Figma", "Storybook", "Design Systems"],
};
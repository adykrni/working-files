export type ResumeProjectLink = {
  label: string;
  href: string;
};

export type ResumeProject = {
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  link?: ResumeProjectLink;
};

export type ResumeRole = {
  period: string;
  company: string;
  summary: string;
  projects: ResumeProject[];
};

export type ResumeSkillGroup = {
  title: string;
  items: string;
};

export type ResumeEducation = {
  degree: string;
  school: string;
};

export const resumeIntro = {
  title: "Resume",
  summary:
    "5+ years shaping UI-led, systems-driven products across AI, automotive, and finance. Turning ambiguous problems into high-craft, scalable interface design with design systems — and I've been shipping to code for the past year.",
};

export const resumeExperience: ResumeRole[] = [
  {
    period: "2022 - Now",
    company: "Accenture Song Design - Senior Product Designer",
    summary:
      "Crafted multiple products for B2B and B2C in the automobile, finance, and enterprise sectors.",
    projects: [
      {
        title: "Loryn AI - Enterprise AI Assistant",
        description:
          "Designed a 0→1 agentic system for an enterprise product. I was responsible for the IT management vertical covering device management, inventory management, and compliance.\n\nBuilt an AI-first design system and patterns for AI-assisted workflows. Shipped features that cut support tickets ~20% and contributed to ~$1.2M in client-measured operational savings. Drove AI-native workflows (Cursor, Claude Code) across ideation, prototyping, and documentation to compress iteration cycles.",
        imageSrc: "/images/loryn-preview.png",
        imageAlt: "Loryn AI chat with SAP system access request form",
        imageWidth: 2600,
        imageHeight: 1704,
      },
      {
        title: "Deutsche Bank — Wealth Management Platform",
        description:
          "Designed MVP dashboard and net wealth experiences for a regulated B2C product, focused on financial widgets and high-stakes decision surfaces. Improved interaction, information clarity and usability across data-heavy screens, balancing business, technical, and compliance constraints.",
        imageSrc: "/images/deutsche-wealth/db-preview.png",
        imageAlt: "Deutsche Bank Wealth Management net wealth dashboard",
        imageWidth: 3900,
        imageHeight: 2412,
      },
      {
        title: "myAudi — Connected-Car Platform & Global Design System",
        description:
          "Designed connected-car experiences across the myAudi app covering dashboards, vehicle-health monitoring, and service journeys for mobile at global scale.",
        imageSrc: "/images/audi-preview.png",
        imageAlt: "myAudi app range and charging overview",
        imageWidth: 2600,
        imageHeight: 1704,
      },
    ],
  },
  {
    period: "Aug 2021 - June 2022",
    company: "Hypersolid (prev. Code d'azur) - Digital Product Designer",
    summary: "Shipping UI design for e-commerce, mainly KLM Holidays and Philips.",
    projects: [
      {
        title: "KLM Holidays",
        description:
          "Built a modular design system from scratch for a consumer platform with millions of DAUs — 17+ reusable, A/B-test-ready components that cut development cycles ~40% and let teams iterate independently while holding brand consistency.",
        link: { label: "Live website", href: "https://holidays.klm.nl/en" },
      },
      {
        title: "Philips",
        description:
          "Redesigned product-page experiences through component work, motion, and experimentation; shipped interactive patterns that reduced bounce ~15%.",
        link: { label: "Live website", href: "https://www.philips.com" },
      },
    ],
  },
];

export const resumeSkills: ResumeSkillGroup[] = [
  {
    title: "Design",
    items:
      "Product design · Prototyping · Interaction design · Systems design · Design systems · User research · Figma · Framer · Midjourney",
  },
  {
    title: "Development",
    items: "HTML · CSS · JavaScript · React · Tailwind · ShadCN · Git · GitHub · Claude Code",
  },
];

export const resumeEducation: ResumeEducation[] = [
  {
    degree: "M.Sc in Strategic Design Management",
    school: "Politecnico di Milano (2019 - 2021)",
  },
  {
    degree: "B.Arch in Architecture",
    school: "University of Pune (2012 - 2017)",
  },
];

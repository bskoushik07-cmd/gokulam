import type { Experience } from "./types";

/**
 * Gokulam Experiences (brief §07) — a permanent, campaign-ready section.
 * Seasonal entries can be added/removed here without touching components.
 */
export const experiences: Experience[] = [
  {
    id: "everyday-classics",
    slug: "everyday-classics",
    title: "Everyday Classics",
    description:
      "The dishes you know and love — dosas off the tawa, thalis on banana leaf, and filter coffee that never misses. The Gokulam everyday, done right.",
    type: "everyday",
    dates: null,
    image: "/images/breakfast-spread.webp",
  },
  {
    id: "seasonal-menus",
    slug: "seasonal-menus",
    title: "Seasonal Menus",
    description:
      "Special menus inspired by seasons and occasions — Pongal specials in January, mango rasam in summer, and festive spreads through the year.",
    type: "seasonal",
    dates: "Rotates with the season",
    image: "/images/sig-uttapam.jpg",
  },
  {
    id: "special-menus",
    slug: "special-menus",
    title: "Special Menus",
    description:
      "Thoughtfully curated Jain and dietary-friendly selections, so everyone at the table eats well. Just ask — our kitchen is happy to adapt.",
    type: "special",
    dates: null,
    image: "/images/sig-idli.jpg",
  },
  {
    id: "celebrations",
    slug: "celebrations",
    title: "Celebrations",
    description:
      "A table made for family, friends and memorable occasions — birthdays, anniversaries and office feasts with banana-leaf meals for the whole party.",
    type: "celebrations",
    dates: null,
    image: "/images/family-meal.webp",
  },
];

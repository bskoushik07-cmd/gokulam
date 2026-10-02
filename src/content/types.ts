/**
 * Content model for the Gokulam website.
 *
 * All outlet / menu / experience content lives here (typed TypeScript),
 * never hardcoded in page components. To add a city, add an outlet entry;
 * to update the menu, edit `menu.ts`. This layer can later be swapped for a
 * headless CMS (e.g. Sanity) without touching any component.
 */

export type OutletStatus = "open" | "coming-soon";

export interface Outlet {
  id: string;
  /** URL slug used by /outlets/[slug] */
  slug: string;
  name: string;
  city: string;
  area: string;
  address: string;
  /** e.g. "11:00 AM – 11:00 PM, all days" — null when not announced yet */
  hours: string | null;
  /** E.164-ish display string — null when not announced yet */
  phone: string | null;
  /** Google Maps search/directions link */
  mapsUrl: string | null;
  /** Order-online deep link where applicable — null hides the CTA */
  orderOnlineUrl: string | null;
  status: OutletStatus;
  /** Path under /public — null renders a decorative placeholder tile */
  image: string | null;
}

export type MenuTag = "spicy" | "jain" | "signature" | "seasonal" | "chef-special";

export interface MenuItem {
  name: string;
  description: string;
  /** Price in INR */
  price: number;
  tags: MenuTag[];
}

export interface MenuCategory {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  items: MenuItem[];
}

export type ExperienceType = "everyday" | "seasonal" | "special" | "celebrations";

export interface Experience {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: ExperienceType;
  /** Optional date/season note, e.g. "Pongal · Jan 14–17" */
  dates: string | null;
  image: string;
}

export interface SignatureDish {
  name: string;
  description: string;
  image: string;
  price: number;
}

import type { Outlet } from "./types";

/**
 * Outlet network. Add a new city by appending an entry —
 * /outlets, /outlets/[slug] and the homepage preview all read from here.
 *
 * NOTE: contact details below are placeholders until the client confirms.
 */
export const outlets: Outlet[] = [
  {
    id: "delhi-janpath",
    slug: "delhi-janpath",
    name: "Gokulam Janpath",
    city: "Delhi",
    area: "Janpath",
    address: "G-7, Janpath Market, Connaught Place, New Delhi 110001",
    hours: "11:00 AM – 11:00 PM, all days",
    phone: "+91 11 4155 2233",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Gokulam+Janpath+Connaught+Place+New+Delhi",
    orderOnlineUrl: null, // wired when the delivery partner link is confirmed
    status: "open",
    image: "/images/outlet-delhi.webp",
  },
  {
    id: "noida-sector-62",
    slug: "noida-sector-62",
    name: "Gokulam Sector 62",
    city: "Noida",
    area: "Sector 62",
    address: "Sector 62, Noida Electronic City",
    hours: null,
    phone: null,
    mapsUrl: "https://maps.app.goo.gl/aD32b2w53EhvrV2g8",
    orderOnlineUrl: null,
    status: "open",
    image: null, // renders a decorative placeholder tile until photography arrives
  },
];

export const getOutlet = (slug: string): Outlet | undefined =>
  outlets.find((o) => o.slug === slug);

export const outletCities: string[] = Array.from(
  new Set(outlets.map((o) => o.city))
);

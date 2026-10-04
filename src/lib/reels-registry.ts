export interface ReelItem {
  id: string;
  title: string;
  caption: string;
  thumbnail: string;
  videoUrl?: string;
  instagramUrl: string;
  handle: string;
  likes: string;
  order: number;
}

export const DEFAULT_REELS: ReelItem[] = [
  {
    id: "reel-1",
    title: "Crisp Ghee Roast Dosa",
    caption: "Golden, crisp and drenched in pure ghee. Made fresh on sizzling cast iron tawas every morning.",
    thumbnail: "/images/hero-dosa.webp",
    instagramUrl: "https://instagram.com",
    handle: "@gokulam.official",
    likes: "2.8k",
    order: 1,
  },
  {
    id: "reel-2",
    title: "The 3-Foot Filter Coffee Pour",
    caption: "The froth, the aroma, and the traditional brass tumbler & davara ritual. The only way to start the day.",
    thumbnail: "/images/sig-filter-coffee.webp",
    instagramUrl: "https://instagram.com",
    handle: "@gokulam.official",
    likes: "4.5k",
    order: 2,
  },
  {
    id: "reel-3",
    title: "Grand South Indian Feast",
    caption: "Over 20 authentic heritage delicacies served on fresh banana leaf. Come hungry, leave happy.",
    thumbnail: "/images/sig-thali.webp",
    instagramUrl: "https://instagram.com",
    handle: "@gokulam.official",
    likes: "3.2k",
    order: 3,
  },
  {
    id: "reel-4",
    title: "Steaming Hot Ghee Podi Idli",
    caption: "Steaming hot mallipoo idlis generously tossed in roasted homemade gun powder podi and pure ghee.",
    thumbnail: "/images/sig-idli.jpg",
    instagramUrl: "https://instagram.com",
    handle: "@gokulam.official",
    likes: "1.9k",
    order: 4,
  },
  {
    id: "reel-5",
    title: "Crispy Golden Medu Vada",
    caption: "Crunchy on the outside, cloud-soft inside. Paired with fresh coconut chutney and hot sambar.",
    thumbnail: "/images/sig-vada.jpg",
    instagramUrl: "https://instagram.com",
    handle: "@gokulam.official",
    likes: "2.4k",
    order: 5,
  },
  {
    id: "reel-6",
    title: "Dawn Coffee Decoction Ritual",
    caption: "Slow-brewed plantation coffee beans creating the iconic aromatic dark decoction since dawn.",
    thumbnail: "/images/coffee-pour.webp",
    instagramUrl: "https://instagram.com",
    handle: "@gokulam.official",
    likes: "3.6k",
    order: 6,
  },
];

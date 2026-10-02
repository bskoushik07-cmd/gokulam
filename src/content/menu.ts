import type { MenuCategory } from "./types";

/**
 * Master menu. Categories follow the brief §04; items are placeholder
 * content the client can edit freely. Prices in INR.
 */
export const menuCategories: MenuCategory[] = [
  {
    id: "breakfast",
    slug: "breakfast",
    title: "Breakfast",
    description: "Start the day the South Indian way.",
    image: "/images/breakfast-spread.webp",
    items: [
      {
        name: "Idli Sambar (2 pc)",
        description: "Pillow-soft idlis served with hot sambar and coconut chutney.",
        price: 99,
        tags: ["jain"],
      },
      {
        name: "Medu Vada (2 pc)",
        description: "Crisp golden vadas, fluffy inside, with sambar and chutney.",
        price: 109,
        tags: [],
      },
      {
        name: "Ven Pongal",
        description: "Comforting rice-and-lentil porridge tempered with pepper, cumin and ghee.",
        price: 129,
        tags: ["signature"],
      },
      {
        name: "Rava Kesari",
        description: "Saffron-kissed semolina halwa with ghee-roasted cashews.",
        price: 89,
        tags: [],
      },
      {
        name: "Gokulam Breakfast Plate",
        description: "Mini idli, vada, pongal and kesari — the full morning ritual.",
        price: 199,
        tags: ["signature"],
      },
    ],
  },
  {
    id: "dosas",
    slug: "dosas",
    title: "Dosas",
    description: "Crisp, golden and made to order.",
    image: "/images/DSC05117.jpg",
    items: [
      {
        name: "Masala Dosa",
        description: "Our signature crisp dosa wrapped around spiced potato palya.",
        price: 149,
        tags: ["signature"],
      },
      {
        name: "Plain Dosa",
        description: "The classic — golden, crisp, served with sambar and chutneys.",
        price: 119,
        tags: ["jain"],
      },
      {
        name: "Onion Rava Dosa",
        description: "Lacy semolina crepe with onions, green chilli and pepper.",
        price: 169,
        tags: ["spicy"],
      },
      {
        name: "Mysore Masala Dosa",
        description: "Fiery red garlic chutney smeared inside, a Mysore legend.",
        price: 179,
        tags: ["spicy", "signature"],
      },
      {
        name: "Ghee Roast",
        description: "Paper-crisp cone finished with a generous spoon of ghee.",
        price: 189,
        tags: ["chef-special"],
      },
      {
        name: "Onion Uttapam",
        description: "Thick, fluffy griddle cake topped with onion, chilli and coriander.",
        price: 159,
        tags: [],
      },
    ],
  },
  {
    id: "idlis-vadas",
    slug: "idlis-vadas",
    title: "Idlis & Vadas",
    description: "Simple, comforting classics.",
    image: "/images/sig-idli.jpg",
    items: [
      {
        name: "Thatte Idli",
        description: "Plate-sized, extra-soft idli with benne (butter) melting on top.",
        price: 79,
        tags: ["signature"],
      },
      {
        name: "Sambar Vada",
        description: "Crisp vadas drowned in piping-hot sambar, finished with ghee.",
        price: 119,
        tags: [],
      },
      {
        name: "Curd Vada",
        description: "Cool curd, tempering and pomegranate over soft vadas.",
        price: 129,
        tags: [],
      },
      {
        name: "Idli Podi",
        description: "Mini idlis tossed in gunpowder and sesame oil.",
        price: 109,
        tags: ["spicy", "jain"],
      },
    ],
  },
  {
    id: "thalis",
    slug: "thalis",
    title: "Thalis",
    description: "A complete celebration of South Indian flavours.",
    image: "/images/sig-thali.webp",
    items: [
      {
        name: "Gokulam Thali",
        description:
          "Rice, sambar, rasam, two poriyals, kootu, appalam, curd and a sweet — served on banana leaf.",
        price: 299,
        tags: ["signature"],
      },
      {
        name: "Mini Meals",
        description: "A lighter thali: rice, sambar, poriyal, appalam and curd.",
        price: 199,
        tags: ["jain"],
      },
      {
        name: "Festive Banana-Leaf Meals",
        description: "Our grandest spread, served the traditional way on weekends and festivals.",
        price: 349,
        tags: ["seasonal", "chef-special"],
      },
      {
        name: "Curd Rice Comfort Bowl",
        description: "Hand-pounded curd rice with pomegranate, tempering and pickle.",
        price: 149,
        tags: [],
      },
    ],
  },
  {
    id: "beverages",
    slug: "beverages",
    title: "Beverages",
    description: "From traditional filter coffee to refreshing favourites.",
    image: "/images/coffee-pour.webp",
    items: [
      {
        name: "Filter Coffee",
        description: "Slow-brewed decoction, frothed the davara way. The Gokulam ritual.",
        price: 60,
        tags: ["signature"],
      },
      {
        name: "Jaggery Filter Coffee",
        description: "Our classic, sweetened with jaggery instead of sugar.",
        price: 70,
        tags: [],
      },
      {
        name: "Masala Buttermilk",
        description: "Churned curd with curry leaf, ginger and roasted jeera.",
        price: 59,
        tags: ["jain"],
      },
      {
        name: "Panakam",
        description: "Jaggery, dry ginger and pepper — the traditional cooler.",
        price: 69,
        tags: ["seasonal"],
      },
      {
        name: "Tender Coconut Payasam Shake",
        description: "A Gokulam twist — payasam meets tender coconut.",
        price: 129,
        tags: ["chef-special"],
      },
    ],
  },
  {
    id: "desserts",
    slug: "desserts",
    title: "Desserts",
    description: "A sweet ending to every meal.",
    image: "/images/dessert.webp",
    items: [
      {
        name: "Elaneer Payasam",
        description: "Tender-coconut kheer, delicate and not too sweet.",
        price: 119,
        tags: ["signature"],
      },
      {
        name: "Kesari Bath",
        description: "Warm saffron semolina halwa with ghee and cashew.",
        price: 89,
        tags: [],
      },
      {
        name: "Holige with Ghee",
        description: "Soft dal-stuffed flatbread served warm with ghee.",
        price: 109,
        tags: ["seasonal"],
      },
      {
        name: "Curd Rice & Pickle Finale",
        description: "Just kidding — ask for the payasam of the day.",
        price: 99,
        tags: ["chef-special"],
      },
    ],
  },
];

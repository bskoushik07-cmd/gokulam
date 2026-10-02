import type { Metadata } from "next";
import HomeJourney from "@/components/HomeJourney";

export const metadata: Metadata = {
  title: "Gokulam — The Soul of South India, On Your Plate",
  description:
    "Authentic South Indian flavours, timeless recipes and the warmth of a meal made with heart. Explore the menu, our story and outlets — now in Delhi and Noida.",
};

export default function HomePage() {
  return <HomeJourney />;
}

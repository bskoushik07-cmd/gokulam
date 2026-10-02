import type { Metadata } from "next";
import { Section, PageHero } from "@/components/ui";
import OutletFinder from "@/components/OutletFinder";

export const metadata: Metadata = {
  title: "Outlets",
  description:
    "Find a Gokulam near you — now open in Delhi (Janpath) and Noida (Sector 62). Addresses, hours, directions and more.",
};

export default function OutletsPage() {
  return (
    <>
      <PageHero
        eyebrow="Outlets"
        title="Gokulam, nearer to you."
        copy="We're growing across India. Find your nearest outlet — or watch this space for the next one."
      />
      <Section>
        <OutletFinder />
      </Section>
    </>
  );
}

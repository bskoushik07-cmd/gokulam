import type { Metadata } from "next";
import { Section, PageHero, Reveal, CTAButton } from "@/components/ui";
import { ExperienceCard } from "@/components/cards";
import { experiences } from "@/content";

export const metadata: Metadata = {
  title: "Experiences",
  description:
    "Gokulam Experiences — everyday classics, seasonal menus, special Jain and dietary-friendly selections, and celebrations made for memorable occasions.",
};

export default function ExperiencesPage() {
  return (
    <>
      <PageHero
        eyebrow="Gokulam Experiences"
        title="More than a meal."
        copy="Seasonal menus, special selections and celebrations — experiences designed to be updated with every occasion, all year round."
      />

      <Section>
        <div className="grid gap-6 sm:grid-cols-2">
          {experiences.map((exp) => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
        </div>

        <Reveal className="mt-16 text-center">
          <h2 className="font-display text-3xl font-semibold text-ink">
            Planning something special?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-ink-soft">
            Family functions, office feasts and festive gatherings — talk to us
            and we&apos;ll set the banana-leaf table.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <CTAButton href="/contact">Enquire Now</CTAButton>
            <CTAButton href="/outlets" variant="secondary">
              Find an Outlet
            </CTAButton>
          </div>
        </Reveal>
      </Section>
    </>
  );
}

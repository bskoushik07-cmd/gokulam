import type { Metadata } from "next";
import { Section, PageHero, Eyebrow, Reveal, CTAButton } from "@/components/ui";
import StorySlideshow from "@/components/StorySlideshow";
import DynamicFoodImage from "@/components/DynamicFoodImage";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Gokulam was born from a simple idea — to bring the warmth, authenticity and richness of South Indian food to more tables. Read our story and philosophy.",
};

const PILLARS = [
  {
    title: "Tradition",
    copy: "Our recipes are inspired by the rich culinary heritage of South India — the fermented batters, the slow-simmered sambars, the temperings passed down through generations of home kitchens.",
  },
  {
    title: "Freshness",
    copy: "Batter ground daily, vegetables bought every morning, coffee decoction brewed through the day. Fresh ingredients and freshly prepared food, every single day.",
  },
  {
    title: "Craft",
    copy: "There is care in every tempering, every batter and every plate. The dosa gets exactly the right crisp; the coffee gets exactly the right froth.",
  },
  {
    title: "Hospitality",
    copy: "The warmth of South Indian hospitality, served with every meal. Come as a guest, leave as family — that is the Gokulam way.",
  },
];

export default function OurStoryPage() {
  return (
    <>
      <PageHero
        eyebrow="The Gokulam Story"
        title="From the South, with love."
        copy="Gokulam was born from a simple idea — to bring the warmth, authenticity and richness of South Indian food to more tables."
      />

      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <StorySlideshow className="aspect-[4/3]" />
          </Reveal>
          <Reveal delay={0.1}>
            <Eyebrow>How it began</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-4xl">
              A little taste of South India, wherever you are.
            </h2>
            <div className="mt-6 space-y-4 leading-relaxed text-ink-soft">
              <p>
                Every South Indian home has its rituals — the aroma of freshly
                brewed filter coffee at dawn, the sound of batter hitting a hot
                tawa, the first spoonful of sambar that tastes like childhood.
                Gokulam exists to keep those rituals alive, far beyond any one
                kitchen.
              </p>
              <p>
                We started with the classics done properly: dosas crisped to
                order, idlis steamed soft, thalis served generously on banana
                leaf. No shortcuts, no compromises — just time-honoured recipes,
                fresh ingredients and thoughtful preparation.
              </p>
              <p>
                Today Gokulam is growing — from Delhi&apos;s Janpath to
                Noida&apos;s Sector 62, and more cities after that. But the idea stays
                the same: food that feels familiar yet memorable, served with
                heart.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="order-2 lg:order-1">
            <Eyebrow>The everyday rituals</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-4xl">
              Made the slow way, on purpose.
            </h2>
            <div className="mt-6 space-y-4 leading-relaxed text-ink-soft">
              <p>
                Good South Indian food cannot be rushed. Batter ferments
                overnight. Sambar simmers until the dal gives up its creaminess.
                Coffee decoction drips slowly through the filter, exactly as it
                should.
              </p>
              <p>
                Our kitchens run on patience — and on people who care deeply
                about the difference between a good dosa and a great one. That
                difference is Gokulam.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="order-1 lg:order-2">
            <DynamicFoodImage
              imageKey="story.rituals"
              defaultSrc="/images/DSC04906.jpg"
              alt="Gokulam dining experience"
              className="aspect-[4/3]"
            />
          </Reveal>
        </div>
      </Section>

      <Section>
        <Reveal>
          <Eyebrow>Our Philosophy</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold text-ink sm:text-4xl">
            Rooted in tradition. Made for today.
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {PILLARS.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 0.07}>
              <div className="h-full rounded-2xl bg-parchment p-7">
                <p className="font-display text-sm font-semibold tracking-[0.2em] text-copper-deep">
                  0{i + 1}
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-ink">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {pillar.copy}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-14 text-center">
          <p className="font-display text-2xl italic text-copper-deep">
            Authentic. Comforting. Unmistakably Gokulam.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <CTAButton href="/menu">Explore Our Menu</CTAButton>
            <CTAButton href="/outlets" variant="secondary">
              Find an Outlet
            </CTAButton>
          </div>
        </Reveal>
      </Section>
    </>
  );
}

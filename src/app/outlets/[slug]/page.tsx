import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section, Eyebrow, Reveal, CTAButton } from "@/components/ui";
import { OutletCard } from "@/components/cards";
import { outlets, getOutlet } from "@/content";
import DynamicFoodImage from "@/components/DynamicFoodImage";

/** Next.js 16: route params are async — always await them. */
type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return outlets.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const outlet = getOutlet(slug);
  if (!outlet) return { title: "Outlet not found" };
  return {
    title: `${outlet.name} — ${outlet.city}`,
    description: `Visit ${outlet.name} in ${outlet.area}, ${outlet.city}. ${outlet.address}${
      outlet.hours ? ` Open ${outlet.hours}.` : ""
    }`,
  };
}

export default async function OutletDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const outlet = getOutlet(slug);
  if (!outlet) notFound();

  const others = outlets.filter((o) => o.slug !== outlet.slug);
  const comingSoon = outlet.status === "coming-soon";

  return (
    <>
      <Section>
        <Reveal>
          <Link
            href="/outlets"
            className="text-sm font-medium text-copper-deep hover:underline"
          >
            ← All outlets
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Eyebrow>
              {outlet.city} · {outlet.area}
            </Eyebrow>
            {comingSoon && (
              <span className="rounded-full bg-copper/15 px-3 py-1 text-xs font-semibold text-copper-deep">
                Coming Soon
              </span>
            )}
          </div>
          <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-6xl">
            {outlet.name}
          </h1>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <DynamicFoodImage
              imageKey={`outlet.${outlet.slug}`}
              defaultSrc={outlet.image || "/images/DSC04900.jpg"}
              alt={`${outlet.name} restaurant dining room`}
              className="aspect-[16/11]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="space-y-6">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.22em] text-copper-deep">
                  Address
                </dt>
                <dd className="mt-1.5 text-lg text-ink">{outlet.address}</dd>
              </div>
              {outlet.hours && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.22em] text-copper-deep">
                    Opening hours
                  </dt>
                  <dd className="mt-1.5 text-lg text-ink">{outlet.hours}</dd>
                </div>
              )}
              {outlet.phone && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.22em] text-copper-deep">
                    Phone
                  </dt>
                  <dd className="mt-1.5 text-lg">
                    <a
                      href={`tel:${outlet.phone.replace(/\s/g, "")}`}
                      className="text-ink hover:text-copper-deep hover:underline"
                    >
                      {outlet.phone}
                    </a>
                  </dd>
                </div>
              )}
              {comingSoon && (
                <p className="rounded-2xl bg-parchment p-5 text-sm leading-relaxed text-ink-soft">
                  We&apos;re putting the finishing touches on our{" "}
                  {outlet.city} outlet. Follow us on Instagram for the opening
                  date — the first filter coffee is on us.
                </p>
              )}
            </dl>

            {!comingSoon && (
              <div className="mt-8 flex flex-wrap gap-4">
                {outlet.mapsUrl && (
                  <a
                    href={outlet.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-forest px-8 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-forest-deep"
                  >
                    Get Directions
                  </a>
                )}
                {outlet.orderOnlineUrl ? (
                  <a
                    href={outlet.orderOnlineUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border-2 border-forest px-8 py-3.5 text-sm font-semibold text-forest transition-colors hover:bg-forest hover:text-cream"
                  >
                    Order Online
                  </a>
                ) : null}
              </div>
            )}
          </Reveal>
        </div>
      </Section>

      {others.length > 0 && (
        <Section>
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-ink">
              Other outlets
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {others.map((o) => (
              <OutletCard key={o.id} outlet={o} />
            ))}
          </div>
          <Reveal className="mt-10 text-center">
            <CTAButton href="/outlets" variant="secondary">
              View All Outlets
            </CTAButton>
          </Reveal>
        </Section>
      )}
    </>
  );
}

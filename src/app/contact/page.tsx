import type { Metadata } from "next";
import Link from "next/link";
import { Section, PageHero, Eyebrow, Reveal } from "@/components/ui";
import EnquiryForm from "@/components/EnquiryForm";
import { outlets } from "@/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Gokulam — general enquiries, celebrations, feedback, franchise and careers. We'd love to hear from you.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Say hello."
        copy="Questions, celebrations, feedback or franchise dreams — write to us and we'll get back to you."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <Reveal>
            <Eyebrow>Reach us</Eyebrow>
            <dl className="mt-6 space-y-6">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.22em] text-copper-deep">
                  Email
                </dt>
                <dd className="mt-1.5 text-lg">
                  <a
                    href="mailto:hello@gokulam.in"
                    className="text-ink hover:text-copper-deep hover:underline"
                  >
                    hello@gokulam.in
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.22em] text-copper-deep">
                  Phone
                </dt>
                <dd className="mt-1.5 text-lg">
                  <a
                    href="tel:+911141552233"
                    className="text-ink hover:text-copper-deep hover:underline"
                  >
                    +91 11 4155 2233
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.22em] text-copper-deep">
                  Follow
                </dt>
                <dd className="mt-1.5 flex gap-4 text-lg">
                  {[
                    ["Instagram", "https://instagram.com"],
                    ["Facebook", "https://facebook.com"],
                    ["X", "https://x.com"],
                  ].map(([label, href]) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink hover:text-copper-deep hover:underline"
                    >
                      {label}
                    </a>
                  ))}
                </dd>
              </div>
            </dl>

            <h2 className="mt-10 font-display text-2xl font-semibold text-ink">
              Our outlets
            </h2>
            <ul className="mt-4 space-y-3">
              {outlets.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/outlets/${o.slug}`}
                    className="text-ink-soft hover:text-copper-deep hover:underline"
                  >
                    {o.name} — {o.city} · {o.area}
                    {o.status === "coming-soon" && " (Coming Soon)"}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-2xl bg-parchment p-6 sm:p-8">
              <h2 className="font-display text-2xl font-semibold text-ink">
                Send an enquiry
              </h2>
              <p className="mt-2 text-sm text-ink-soft">
                Fill this in and we&apos;ll take it from there.
              </p>
              <div className="mt-6">
                <EnquiryForm />
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}

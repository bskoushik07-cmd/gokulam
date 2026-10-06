"use client";

import Link from "next/link";
import { outlets } from "@/content";
import { LogoPlate } from "./Navbar";
import { ArrowUp, MapPin, Phone, Mail, Clock, Sparkles } from "lucide-react";

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative z-20 w-full border-t-2 border-copper/40 bg-bark text-cream shadow-2xl">
      {/* Subtle top ambient glow */}
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-copper to-transparent opacity-60" />

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.8fr_1fr_1fr_1.3fr] lg:gap-14">
          
          {/* Column 1: Brand & Philosophy */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <LogoPlate tone="cream" className="h-14 sm:h-16 w-auto object-contain" />
            </Link>
            
            <p className="max-w-sm text-sm leading-relaxed text-cream/70 font-body">
              Rooted in tradition. Made for today. Authentic South Indian flavours, slow-brewed filter coffee, and the warmth of a meal made with heart.
            </p>

            {/* Pure Veg badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-copper/30 bg-copper/10 px-3.5 py-1.5 text-xs font-semibold text-copper">
              <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/30" />
              <span>100% Pure Vegetarian</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/70 transition-all hover:border-copper hover:bg-copper/10 hover:text-copper active:scale-95"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h3 className="font-display text-xs font-semibold uppercase tracking-[0.24em] text-copper">
              Explore
            </h3>
            <ul className="mt-5 space-y-3.5 text-sm font-body">
              {[
                ["/our-story", "Our Story"],
                ["/menu", "All Menus"],
                ["/menu/janpath", "Menu – Janpath (Delhi)"],
                ["/menu/sector-62", "Menu – Sector 62 (Noida)"],
                ["/experiences", "Experiences"],
                ["/outlets", "Find an Outlet"],
                ["/contact", "Contact Us"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-cream/75 transition-colors hover:text-copper hover:underline underline-offset-4"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Menus & Categories */}
          <div>
            <h3 className="font-display text-xs font-semibold uppercase tracking-[0.24em] text-copper">
              Menu Highlights
            </h3>
            <ul className="mt-5 space-y-3.5 text-sm font-body">
              {[
                ["/menu/janpath#breakfast", "Breakfast Rituals"],
                ["/menu/janpath#dosas", "Crispy Dosas"],
                ["/menu/janpath#idlis-vadas", "Idlis & Vadas"],
                ["/menu/janpath#thalis", "Gokulam Thali"],
                ["/menu/janpath#beverages", "Filter Coffee"],
                ["/menu/janpath#desserts", "Payasam & Sweets"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-cream/75 transition-colors hover:text-copper hover:underline underline-offset-4"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Outlets & Direct Contact */}
          <div>
            <h3 className="font-display text-xs font-semibold uppercase tracking-[0.24em] text-copper">
              Our Outlets
            </h3>
            <div className="mt-5 space-y-5 text-sm font-body">
              {outlets.map((o) => (
                <div key={o.id} className="rounded-2xl border border-cream/10 bg-cream/[0.03] p-4 transition-colors hover:border-copper/40">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/outlets/${o.slug}`}
                      className="font-display text-base font-semibold text-cream hover:text-copper"
                    >
                      {o.name}
                    </Link>
                    {o.status === "coming-soon" ? (
                      <span className="rounded-full bg-copper/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-copper">
                        Soon
                      </span>
                    ) : (
                      <span className="text-[11px] text-copper">Open</span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-cream/60 leading-relaxed">
                    {o.address}
                  </p>
                  {o.hours && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-cream/50">
                      <Clock className="h-3 w-3 text-copper" />
                      <span>{o.hours}</span>
                    </p>
                  )}
                </div>
              ))}

              <div className="pt-2">
                <p className="text-xs text-cream/50">Direct Contact</p>
                <div className="mt-2 flex flex-col gap-1.5 text-xs text-cream/80">
                  <a
                    href="mailto:filtercoffee@gokulamofficial.com"
                    className="flex items-center gap-2 hover:text-copper transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5 text-copper" />
                    <span>filtercoffee@gokulamofficial.com</span>
                  </a>
                  <a
                    href="tel:+919731999040"
                    className="flex items-center gap-2 hover:text-copper transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 text-copper" />
                    <span>+91 97319 99040</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & Back to top */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-cream/15 pt-8 text-xs text-cream/50 sm:flex-row sm:flex-wrap">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p>© {new Date().getFullYear()} Gokulam. All rights reserved.</p>
            <span className="hidden sm:inline text-cream/30">•</span>
            <a
              href="https://liitmedia.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/70 transition-colors hover:text-copper hover:underline underline-offset-4"
            >
              Designed and Managed by liitmedia.in
            </a>
          </div>
          
          <p className="font-display tracking-widest text-cream/70 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-copper" />
            <span>Crafted with ♥ from South India</span>
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 rounded-full border border-cream/20 bg-cream/5 px-3.5 py-1.5 text-xs text-cream/70 transition-all hover:border-copper hover:bg-copper/10 hover:text-copper"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

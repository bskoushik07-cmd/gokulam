"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSiteImage } from "@/context/ImageContext";

const NAV_LINKS = [
  { href: "/our-story", label: "OUR STORY" },
  { href: "/menu", label: "MENU" },
  { href: "/experiences", label: "EXPERIENCES" },
  { href: "/outlets", label: "OUTLETS" },
];

/** Real Gokulam wordmark from the client's brand kit. */
export function LogoPlate({
  compact = false,
  tone = "dark",
  className,
}: {
  compact?: boolean;
  tone?: "dark" | "cream";
  className?: string;
}) {
  const lightLogo = useSiteImage("brand.logo_light", "/images/logo-r3.png");
  const creamLogo = useSiteImage("brand.logo_cream", "/images/logo-cream-original.png");
  const logoSrc = tone === "cream" ? creamLogo : lightLogo;

  return (
    <img
      src={logoSrc}
      alt="Gokulam"
      draggable={false}
      className={className ?? (compact ? "h-8 w-auto" : "h-10 w-auto")}
    />
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-copper/20 bg-parchment/95 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-[96rem] items-center justify-between px-6 py-4 sm:px-8"
      >
        {/* Brand logo on the left */}
        <Link href="/" aria-label="Gokulam home" className="shrink-0" onClick={() => setOpen(false)}>
          <LogoPlate className="h-12 sm:h-14 md:h-16 w-auto object-contain" />
        </Link>

        {/* Desktop links + View Menu button on the right */}
        <div className="hidden items-center gap-7 lg:gap-9 md:flex">
          <ul className="flex items-center gap-7 lg:gap-9">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className={`font-body text-[13px] font-medium uppercase tracking-[0.16em] transition-colors hover:text-copper-deep ${
                    pathname === link.href ? "text-copper-deep" : "text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/menu"
            className="font-body rounded-full bg-forest px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-cream transition-colors hover:bg-forest-deep"
          >
            VIEW MENU
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md text-ink md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile panel */}
      {open && (
        <div className="border-t border-sand/70 bg-cream px-6 pb-6 pt-3 md:hidden">
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`font-body block border-b border-sand/50 py-3.5 text-sm font-medium uppercase tracking-[0.14em] ${
                    pathname === link.href ? "text-copper-deep" : "text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-col gap-3">
            <Link
              href="/menu"
              onClick={() => setOpen(false)}
              className="rounded-full bg-forest px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-cream"
            >
              VIEW MENU
            </Link>
            <Link
              href="/outlets"
              onClick={() => setOpen(false)}
              className="rounded-full border-2 border-forest px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-forest"
            >
              FIND AN OUTLET
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSiteImage } from "@/context/ImageContext";
import { ChevronDown, MapPin, ArrowRight } from "lucide-react";

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
  const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);
  const [mobileMenuExpanded, setMobileMenuExpanded] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setMenuDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setMenuDropdownOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    };
  }, []);

  const isMenuActive = pathname.startsWith("/menu");

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
            <li>
              <Link
                href="/our-story"
                aria-current={pathname === "/our-story" ? "page" : undefined}
                className={`font-body text-[13px] font-medium uppercase tracking-[0.16em] transition-colors hover:text-copper-deep ${
                  pathname === "/our-story" ? "text-copper-deep" : "text-ink"
                }`}
              >
                OUR STORY
              </Link>
            </li>

            {/* Menu with Dropdown */}
            <li
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/menu"
                aria-current={isMenuActive ? "page" : undefined}
                className={`inline-flex items-center gap-1 font-body text-[13px] font-medium uppercase tracking-[0.16em] transition-colors hover:text-copper-deep ${
                  isMenuActive ? "text-copper-deep font-semibold" : "text-ink"
                }`}
              >
                <span>MENU</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${menuDropdownOpen ? "rotate-180 text-copper-deep" : "text-ink/60"}`} />
              </Link>

              {/* Dropdown Menu */}
              {menuDropdownOpen && (
                <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2 z-50 w-72">
                  <div className="overflow-hidden rounded-2xl border border-copper/20 bg-white/95 p-2 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-copper-deep border-b border-sand/60">
                      Select Outlet Menu
                    </div>

                    <Link
                      href="/menu/janpath"
                      onClick={() => setMenuDropdownOpen(false)}
                      className="group flex flex-col rounded-xl px-3 py-2.5 transition-colors hover:bg-parchment"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-display text-sm font-semibold text-ink group-hover:text-copper-deep">
                          Gokulam Janpath
                        </span>
                        <span className="text-[10px] font-bold uppercase text-forest bg-forest/10 px-2 py-0.5 rounded-full">
                          Delhi
                        </span>
                      </div>
                      <span className="mt-0.5 text-xs text-ink-soft">
                        Janpath, Connaught Place
                      </span>
                    </Link>

                    <Link
                      href="/menu/sector-62"
                      onClick={() => setMenuDropdownOpen(false)}
                      className="group flex flex-col rounded-xl px-3 py-2.5 transition-colors hover:bg-parchment"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-display text-sm font-semibold text-ink group-hover:text-copper-deep">
                          Gokulam Sector 62
                        </span>
                        <span className="text-[10px] font-bold uppercase text-forest bg-forest/10 px-2 py-0.5 rounded-full">
                          Noida
                        </span>
                      </div>
                      <span className="mt-0.5 text-xs text-ink-soft">
                        Electronic City, Sector 62
                      </span>
                    </Link>

                    <div className="mt-1 border-t border-sand/60 pt-1">
                      <Link
                        href="/menu"
                        onClick={() => setMenuDropdownOpen(false)}
                        className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-copper-deep hover:bg-sand/30"
                      >
                        <span>View All Menus & PDFs</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </li>

            <li>
              <Link
                href="/experiences"
                aria-current={pathname === "/experiences" ? "page" : undefined}
                className={`font-body text-[13px] font-medium uppercase tracking-[0.16em] transition-colors hover:text-copper-deep ${
                  pathname === "/experiences" ? "text-copper-deep" : "text-ink"
                }`}
              >
                EXPERIENCES
              </Link>
            </li>

            <li>
              <Link
                href="/outlets"
                aria-current={pathname === "/outlets" ? "page" : undefined}
                className={`font-body text-[13px] font-medium uppercase tracking-[0.16em] transition-colors hover:text-copper-deep ${
                  pathname === "/outlets" ? "text-copper-deep" : "text-ink"
                }`}
              >
                OUTLETS
              </Link>
            </li>
          </ul>

          <Link
            href="/menu"
            className="font-body rounded-full bg-forest px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-cream transition-colors hover:bg-forest-deep shadow-sm"
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
            <li>
              <Link
                href="/our-story"
                onClick={() => setOpen(false)}
                className={`font-body block border-b border-sand/50 py-3.5 text-sm font-medium uppercase tracking-[0.14em] ${
                  pathname === "/our-story" ? "text-copper-deep" : "text-ink"
                }`}
              >
                OUR STORY
              </Link>
            </li>

            {/* Mobile Menu Accordion */}
            <li className="border-b border-sand/50 py-3">
              <div
                onClick={() => setMobileMenuExpanded((v) => !v)}
                className="flex cursor-pointer items-center justify-between font-body text-sm font-medium uppercase tracking-[0.14em] text-ink"
              >
                <span>MENU</span>
                <ChevronDown className={`h-4 w-4 text-copper-deep transition-transform duration-200 ${mobileMenuExpanded ? "rotate-180" : ""}`} />
              </div>

              {mobileMenuExpanded && (
                <div className="mt-2 space-y-2 rounded-xl bg-parchment/80 p-3">
                  <Link
                    href="/menu/janpath"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-lg p-2 text-xs font-semibold text-ink hover:bg-sand/40"
                  >
                    <span>Gokulam Janpath (Delhi)</span>
                    <ArrowRight className="h-3 w-3 text-copper-deep" />
                  </Link>
                  <Link
                    href="/menu/sector-62"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-lg p-2 text-xs font-semibold text-ink hover:bg-sand/40"
                  >
                    <span>Gokulam Sector 62 (Noida)</span>
                    <ArrowRight className="h-3 w-3 text-copper-deep" />
                  </Link>
                  <Link
                    href="/menu"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-lg p-2 text-xs font-bold text-copper-deep hover:bg-sand/40"
                  >
                    <span>Overview & All Menus</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </li>

            <li>
              <Link
                href="/experiences"
                onClick={() => setOpen(false)}
                className={`font-body block border-b border-sand/50 py-3.5 text-sm font-medium uppercase tracking-[0.14em] ${
                  pathname === "/experiences" ? "text-copper-deep" : "text-ink"
                }`}
              >
                EXPERIENCES
              </Link>
            </li>

            <li>
              <Link
                href="/outlets"
                onClick={() => setOpen(false)}
                className={`font-body block border-b border-sand/50 py-3.5 text-sm font-medium uppercase tracking-[0.14em] ${
                  pathname === "/outlets" ? "text-copper-deep" : "text-ink"
                }`}
              >
                OUTLETS
              </Link>
            </li>
          </ul>

          <div className="mt-5 flex flex-col gap-3">
            <Link
              href="/menu/janpath"
              onClick={() => setOpen(false)}
              className="rounded-full bg-forest px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-cream"
            >
              JANPATH MENU
            </Link>
            <Link
              href="/menu/sector-62"
              onClick={() => setOpen(false)}
              className="rounded-full border-2 border-forest px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-forest"
            >
              SECTOR 62 MENU
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

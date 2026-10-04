"use client";

import React, { useRef, useState } from "react";
import { Heart, Play, ArrowUpRight, ArrowRight } from "lucide-react";
import { useReels } from "@/context/ReelsContext";
import { ReelItem } from "@/lib/reels-registry";

function InstagramIcon({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function InstagramReelsMarquee() {
  const { reels } = useReels();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  if (!reels || reels.length === 0) return null;

  // Duplicate reels array for infinite continuous seamless loop
  const duplicatedReels = [...reels, ...reels];

  return (
    <div className="relative w-full overflow-hidden py-4">
      {/* Edge gradient masks for luxury depth */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 sm:w-24 bg-gradient-to-r from-cream to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 sm:w-24 bg-gradient-to-l from-cream to-transparent" />

      {/* Marquee Track Container */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex w-full overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing"
      >
        <div
          className={`flex gap-5 sm:gap-6 py-4 px-4 ${
            !isHovered ? "animate-reels-marquee" : "flex"
          }`}
          style={{
            animationPlayState: isHovered ? "paused" : "running",
          }}
        >
          {duplicatedReels.map((reel, index) => (
            <ReelCard key={`${reel.id}-${index}`} reel={reel} />
          ))}
        </div>
      </div>

      {/* Bottom Center Link: Follow our journey */}
      <div className="mt-8 flex justify-center text-center">
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 font-display text-base font-semibold text-ink transition-colors hover:text-copper-deep"
        >
          <span>Follow our journey</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 text-copper" />
        </a>
      </div>
    </div>
  );
}

function ReelCard({ reel }: { reel: ReelItem }) {
  return (
    <a
      href={reel.instagramUrl || "https://instagram.com"}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex-shrink-0 w-[240px] sm:w-[270px] md:w-[290px] aspect-[9/16] overflow-hidden rounded-[26px] bg-bark/95 border border-sand/40 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-copper/70"
    >
      {/* Background Poster Image / Video */}
      <div className="absolute inset-0 h-full w-full overflow-hidden bg-bark">
        <img
          src={reel.thumbnail}
          alt={reel.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      {/* Dark Ambient Gradient Film */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/40" />

      {/* TOP BAR: Handle Capsule + Heart Likes Capsule */}
      <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] font-medium text-white/95 backdrop-blur-md shadow-sm">
          <InstagramIcon className="h-3 w-3 text-amber-300" />
          <span className="truncate max-w-[110px]">{reel.handle || "@gokulam.official"}</span>
        </div>

        <div className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white/95 backdrop-blur-md shadow-sm">
          <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
          <span>{reel.likes || "2.4k"}</span>
        </div>
      </div>

      {/* CENTER: Glowing Frosted Play Icon */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-md shadow-2xl transition-all duration-300 group-hover:scale-115 group-hover:bg-white/35 group-hover:border-white/50">
          <Play className="h-6 w-6 fill-white text-white ml-0.5" />
        </div>
      </div>

      {/* BOTTOM: Caption + Watch Reel */}
      <div className="absolute inset-x-0 bottom-0 p-5 z-10 flex flex-col justify-end">
        <p className="line-clamp-2 text-xs leading-relaxed text-cream/90 font-normal antialiased drop-shadow-sm">
          {reel.caption}
        </p>

        <div className="mt-3 flex items-center gap-1 font-display text-[11px] font-bold uppercase tracking-wider text-amber-300 transition-colors group-hover:text-amber-200">
          <span>Watch Reel</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </a>
  );
}

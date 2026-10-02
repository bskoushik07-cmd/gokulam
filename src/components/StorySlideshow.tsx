"use client";

import { useState, useEffect, useCallback } from "react";
import { FoodImage } from "@/components/ui";
import { useSiteImage } from "@/context/ImageContext";

const INTERVAL = 4000; // ms between slides

/**
 * Auto-advancing image slideshow with a smooth crossfade.
 * Used in the "Our Story" sections across the site.
 */
export default function StorySlideshow({
  className = "aspect-[4/3]",
}: {
  className?: string;
}) {
  const slide1 = useSiteImage("story.slide_1", "/images/story-interior.webp");
  const slide2 = useSiteImage("story.slide_2", "/images/DSC04900.jpg");
  const slide3 = useSiteImage("story.slide_3", "/images/DSC04906.jpg");

  const slides = [
    { src: slide1, alt: "Warm dining hall at Gokulam" },
    { src: slide2, alt: "Gokulam restaurant ambience" },
    { src: slide3, alt: "Gokulam dining experience" },
  ];

  const [active, setActive] = useState(0);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [next]);

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      {slides.map((slide, i) => (
        <div
          key={slide.src + i}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === active ? 1 : 0 }}
        >
          <FoodImage
            src={slide.src}
            alt={slide.alt}
            className="h-full w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      ))}

      {/* Slide indicators */}
      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setActive(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === active
                ? "w-6 bg-copper-deep"
                : "w-2 bg-white/60 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { FoodImage } from "./ui";
import { useSiteImage } from "@/context/ImageContext";

interface DynamicFoodImageProps {
  imageKey: string;
  defaultSrc: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export default function DynamicFoodImage({
  imageKey,
  defaultSrc,
  alt,
  className = "",
  priority = false,
  sizes,
}: DynamicFoodImageProps) {
  const src = useSiteImage(imageKey, defaultSrc);

  return (
    <FoodImage
      src={src}
      alt={alt}
      className={className}
      priority={priority}
      sizes={sizes}
    />
  );
}

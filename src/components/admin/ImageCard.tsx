"use client";

import React, { useState } from "react";
import {
  Edit3,
  RotateCcw,
  ExternalLink,
  Eye,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { ImageItem } from "@/lib/image-registry";

interface ImageCardProps {
  item: ImageItem;
  currentUrl: string;
  onEdit: (item: ImageItem) => void;
  onReset: (key: string) => void;
}

export default function ImageCard({
  item,
  currentUrl,
  onEdit,
  onReset,
}: ImageCardProps) {
  const [showFullPreview, setShowFullPreview] = useState(false);
  const isOverridden = currentUrl !== item.defaultUrl;

  return (
    <>
      <div className="group flex flex-col overflow-hidden rounded-2xl border border-sand/80 bg-parchment transition-all duration-300 hover:border-copper/60 hover:shadow-lg hover:-translate-y-0.5">
        {/* Image Thumbnail Container */}
        <div className="relative aspect-video w-full overflow-hidden bg-cream">
          <img
            src={currentUrl}
            alt={item.label}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Status Badge */}
          <div className="absolute left-3 top-3 flex items-center gap-1.5">
            {isOverridden ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cream shadow-sm backdrop-blur-sm">
                <Sparkles className="h-3 w-3" /> Custom
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cream/90 shadow-sm backdrop-blur-sm">
                Default
              </span>
            )}
          </div>

          {/* Section Pill */}
          <div className="absolute right-3 top-3">
            <span className="rounded-full bg-cream/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-copper-deep shadow-sm backdrop-blur-sm">
              {item.section}
            </span>
          </div>

          {/* Quick Hover Action overlay */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => setShowFullPreview(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-ink shadow transition-transform hover:scale-110"
              title="Zoom preview"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onEdit(item)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-forest text-cream shadow transition-transform hover:scale-110"
              title="Edit image"
            >
              <Edit3 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Card Details */}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display text-lg font-bold text-ink group-hover:text-copper-deep transition-colors">
                {item.label}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-soft">
                {item.description}
              </p>
            </div>
          </div>

          {/* Metadata chips */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-ink-soft/80">
            <span className="rounded-md bg-sand/40 px-2 py-0.5 font-medium">
              Ratio: {item.aspectRatio}
            </span>
            <span className="rounded-md bg-sand/40 px-2 py-0.5 font-mono">
              Key: {item.key}
            </span>
          </div>

          {/* URL preview */}
          <div className="mt-3 truncate rounded-lg bg-cream/80 p-2 font-mono text-[10px] text-ink-soft border border-sand/50">
            <span className="text-copper-deep font-semibold">URL: </span>
            <span title={currentUrl}>{currentUrl}</span>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex items-center justify-between gap-2 border-t border-sand/60 pt-3">
            {isOverridden ? (
              <button
                type="button"
                onClick={() => onReset(item.key)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 transition-colors hover:text-rose-900"
                title="Revert back to default image"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Revert</span>
              </button>
            ) : (
              <span className="text-[11px] text-ink-soft/70 italic">Default</span>
            )}

            <button
              type="button"
              onClick={() => onEdit(item)}
              className="inline-flex items-center gap-1.5 rounded-full bg-forest px-4 py-1.5 text-xs font-semibold text-cream transition-all hover:bg-forest-deep shadow-sm"
            >
              <Edit3 className="h-3 w-3" />
              <span>Change</span>
            </button>
          </div>
        </div>
      </div>

      {/* Full Preview Modal */}
      {showFullPreview && (
        <div
          onClick={() => setShowFullPreview(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in"
        >
          <div className="relative max-h-[85vh] max-w-4xl overflow-hidden rounded-2xl bg-cream shadow-2xl">
            <div className="flex items-center justify-between border-b border-sand/60 p-4">
              <div>
                <h4 className="font-display font-bold text-ink">{item.label}</h4>
                <p className="text-xs text-ink-soft font-mono truncate max-w-lg">{currentUrl}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowFullPreview(false)}
                className="rounded-full bg-sand/30 p-1.5 text-ink hover:bg-sand/60"
              >
                ✕
              </button>
            </div>
            <div className="p-4 flex items-center justify-center bg-parchment/40">
              <img
                src={currentUrl}
                alt={item.label}
                className="max-h-[70vh] w-auto max-w-full rounded-xl object-contain shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

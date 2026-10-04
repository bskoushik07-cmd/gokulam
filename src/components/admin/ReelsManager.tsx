"use client";

import React, { useState } from "react";
import {
  Plus,
  Edit2,
  ExternalLink,
  Heart,
  RotateCcw,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useReels } from "@/context/ReelsContext";
import { ReelItem } from "@/lib/reels-registry";
import ReelEditModal from "./ReelEditModal";

function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
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

export default function ReelsManager() {
  const { reels, addReel, updateReel, deleteReel, reorderReels, resetReels } =
    useReels();

  const [selectedReel, setSelectedReel] = useState<ReelItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenAdd = () => {
    setSelectedReel(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (reel: ReelItem) => {
    setSelectedReel(reel);
    setIsModalOpen(true);
  };

  const handleSaveModal = async (reelData: Omit<ReelItem, "id" | "order">) => {
    if (selectedReel) {
      await updateReel(selectedReel.id, reelData);
    } else {
      await addReel(reelData);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= reels.length) return;

    const copy = [...reels];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    await reorderReels(copy);
  };

  const handleReset = async () => {
    if (confirm("Reset all reels back to default Gokulam signature collection?")) {
      await resetReels();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-sand bg-parchment/60 p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-forest text-sand">
              <InstagramIcon className="h-4 w-4" />
            </span>
            <h3 className="font-display text-xl font-bold text-ink">
              Homepage Instagram Reels ({reels.length})
            </h3>
          </div>
          <p className="mt-1 text-xs text-ink-soft">
            Manage the vertical video reels that appear in the continuous homepage scroll animation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-full border border-sand bg-cream px-4 py-2 text-xs font-semibold text-ink transition-colors hover:bg-sand/30"
          >
            <RotateCcw className="h-3.5 w-3.5 text-copper" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2 text-xs font-semibold uppercase tracking-wider text-cream shadow transition-all hover:bg-forest-deep"
          >
            <Plus className="h-4 w-4 text-sand" />
            <span>Add New Reel</span>
          </button>
        </div>
      </div>

      {/* Reels Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {reels.map((reel, idx) => (
          <div
            key={reel.id}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-sand/80 bg-cream shadow-sm transition-all duration-300 hover:border-copper hover:shadow-xl"
          >
            {/* 9:16 Vertical Thumbnail Poster Preview */}
            <div className="relative aspect-[9/14] w-full overflow-hidden bg-bark">
              <img
                src={reel.thumbnail}
                alt={reel.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40" />

              {/* Top Tags */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/40 px-2.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-md">
                  <InstagramIcon className="h-3 w-3 text-amber-300" />
                  {reel.handle || "@gokulam"}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/40 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
                  <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
                  {reel.likes || "2.4k"}
                </span>
              </div>

              {/* Order Badge */}
              <div className="absolute bottom-3 left-3 z-10">
                <span className="rounded-full bg-forest/80 px-2.5 py-0.5 text-[10px] font-bold text-cream backdrop-blur-sm">
                  #{idx + 1}
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="flex flex-1 flex-col justify-between p-4">
              <div>
                <h4 className="font-display text-base font-bold text-ink">
                  {reel.title}
                </h4>
                <p className="mt-1 line-clamp-2 text-xs text-ink-soft">
                  {reel.caption}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-4 flex items-center justify-between border-t border-sand/50 pt-3">
                {/* Reorder Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMove(idx, "up")}
                    disabled={idx === 0}
                    title="Move Left/Earlier"
                    className="rounded-lg p-1.5 text-ink-soft transition-colors hover:bg-sand/40 hover:text-ink disabled:opacity-30"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(idx, "down")}
                    disabled={idx === reels.length - 1}
                    title="Move Right/Later"
                    className="rounded-lg p-1.5 text-ink-soft transition-colors hover:bg-sand/40 hover:text-ink disabled:opacity-30"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Edit / View Buttons */}
                <div className="flex items-center gap-2">
                  <a
                    href={reel.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open on Instagram"
                    className="rounded-lg p-1.5 text-ink-soft transition-colors hover:bg-sand/40 hover:text-copper"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(reel)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-forest px-3.5 py-1.5 text-xs font-semibold text-cream transition-colors hover:bg-forest-deep"
                  >
                    <Edit2 className="h-3 w-3" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reel Modal */}
      <ReelEditModal
        reel={selectedReel}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
        onDelete={deleteReel}
      />
    </div>
  );
}

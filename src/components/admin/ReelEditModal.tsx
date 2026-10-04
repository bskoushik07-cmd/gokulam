"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Upload,
  Link as LinkIcon,
  Trash2,
  Check,
  Sparkles,
  AlertCircle,
  Play,
  Heart,
} from "lucide-react";
import { ReelItem } from "@/lib/reels-registry";
import { uploadImageToSupabase } from "@/lib/supabase";
import { compressImageFile } from "@/lib/image-compressor";

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

interface ReelEditModalProps {
  reel: ReelItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (reelData: Omit<ReelItem, "id" | "order">) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export default function ReelEditModal({
  reel,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: ReelEditModalProps) {
  const isEditing = !!reel;

  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("https://instagram.com");
  const [handle, setHandle] = useState("@gokulam.official");
  const [likes, setLikes] = useState("2.4k");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (reel) {
        setTitle(reel.title || "");
        setCaption(reel.caption || "");
        setThumbnail(reel.thumbnail || "/images/hero-dosa.webp");
        setInstagramUrl(reel.instagramUrl || "https://instagram.com");
        setHandle(reel.handle || "@gokulam.official");
        setLikes(reel.likes || "2.4k");
      } else {
        setTitle("Fresh Kitchen Moments");
        setCaption("Behind the scenes in our Gokulam kitchen. Savoring the warmth of South India.");
        setThumbnail("/images/hero-dosa.webp");
        setInstagramUrl("https://instagram.com");
        setHandle("@gokulam.official");
        setLikes("1.8k");
      }
      setSelectedFile(null);
      setErrorMsg("");
      setSuccessMsg("");
    }
  }, [isOpen, reel]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const optimized = await compressImageFile(file, {
          maxWidth: 1920,
          maxHeight: 1920,
          quality: 0.88,
        });
        setSelectedFile(optimized);
        const objUrl = URL.createObjectURL(optimized);
        setThumbnail(objUrl);
        setErrorMsg("");
      } catch {
        setSelectedFile(file);
        const objUrl = URL.createObjectURL(file);
        setThumbnail(objUrl);
      }
    }
  };

  const handleSave = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setIsSaving(true);

    try {
      let finalThumbnail = thumbnail;

      if (selectedFile) {
        setIsUploading(true);
        const uploadRes = await uploadImageToSupabase(selectedFile);
        setIsUploading(false);

        if (uploadRes.success && uploadRes.url) {
          finalThumbnail = uploadRes.url;
        } else {
          setErrorMsg(uploadRes.error || "Failed to upload thumbnail image.");
          setIsSaving(false);
          return;
        }
      }

      if (!title.trim()) {
        setErrorMsg("Please enter a title for the reel.");
        setIsSaving(false);
        return;
      }

      if (!finalThumbnail.trim()) {
        setErrorMsg("Please provide a thumbnail image or upload a photo.");
        setIsSaving(false);
        return;
      }

      await onSave({
        title,
        caption,
        thumbnail: finalThumbnail,
        instagramUrl: instagramUrl || "https://instagram.com",
        handle: handle || "@gokulam.official",
        likes: likes || "1.5k",
      });

      setSuccessMsg("Reel saved successfully!");
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save reel.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (reel && onDelete) {
      if (confirm(`Are you sure you want to remove "${reel.title}"?`)) {
        setIsSaving(true);
        await onDelete(reel.id);
        setIsSaving(false);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-y-auto rounded-3xl border border-sand bg-cream p-6 shadow-2xl sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sand/70 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest text-sand shadow">
              <InstagramIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                {isEditing ? "Edit Instagram Reel" : "Add New Instagram Reel"}
              </h2>
              <p className="mt-0.5 text-xs text-ink-soft">
                Showcase vertical video reels in the homepage scroll animation.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-ink-soft transition-colors hover:bg-sand/30 hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="mt-6 grid gap-8 lg:grid-cols-12">
          {/* Left Form */}
          <div className="space-y-4 lg:col-span-7">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-copper-deep">
                Reel Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Filter Coffee Pour Ritual"
                className="mt-1.5 w-full rounded-xl border border-sand bg-parchment px-4 py-2.5 text-xs font-semibold text-ink placeholder-ink-soft/40 outline-none focus:border-copper focus:ring-2 focus:ring-copper/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-copper-deep">
                Reel Caption / Story
              </label>
              <textarea
                rows={3}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Short 2-3 line caption celebrating South Indian flavors..."
                className="mt-1.5 w-full rounded-xl border border-sand bg-parchment px-4 py-2.5 text-xs text-ink placeholder-ink-soft/40 outline-none focus:border-copper focus:ring-2 focus:ring-copper/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-copper-deep">
                Reel Poster / Thumbnail Image
              </label>
              <div className="mt-1.5 flex gap-2">
                <input
                  type="text"
                  value={thumbnail}
                  onChange={(e) => {
                    setThumbnail(e.target.value);
                    setSelectedFile(null);
                  }}
                  placeholder="/images/... or https://..."
                  className="flex-1 rounded-xl border border-sand bg-parchment px-4 py-2 text-xs font-mono text-ink placeholder-ink-soft/40 outline-none focus:border-copper"
                />
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-sand bg-forest px-3.5 py-2 text-xs font-semibold text-cream transition-colors hover:bg-forest-deep">
                  <Upload className="h-3.5 w-3.5" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              {selectedFile && (
                <p className="mt-1 text-[11px] text-emerald-800 font-semibold">
                  ✓ Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-copper-deep">
                  Instagram Reel URL
                </label>
                <input
                  type="text"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/reel/..."
                  className="mt-1.5 w-full rounded-xl border border-sand bg-parchment px-3.5 py-2 text-xs font-mono text-ink placeholder-ink-soft/40 outline-none focus:border-copper"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-copper-deep">
                  Handle Tag
                </label>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="@gokulam.official"
                  className="mt-1.5 w-full rounded-xl border border-sand bg-parchment px-3.5 py-2 text-xs font-semibold text-ink placeholder-ink-soft/40 outline-none focus:border-copper"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-copper-deep">
                Like Count Display
              </label>
              <input
                type="text"
                value={likes}
                onChange={(e) => setLikes(e.target.value)}
                placeholder="e.g. 3.5k or 890"
                className="mt-1.5 w-full rounded-xl border border-sand bg-parchment px-3.5 py-2 text-xs font-semibold text-ink placeholder-ink-soft/40 outline-none focus:border-copper"
              />
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-800 border border-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200">
                <Check className="h-4 w-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}
          </div>

          {/* Right Live Preview */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-sand bg-parchment/60 p-6 lg:col-span-5">
            <span className="mb-3 text-xs font-semibold uppercase tracking-wider text-copper-deep">
              Live Card Preview
            </span>

            <div className="relative w-[210px] aspect-[9/16] overflow-hidden rounded-[22px] bg-bark border border-sand/60 shadow-xl">
              <img
                src={thumbnail || "/images/hero-dosa.webp"}
                alt="Reel preview"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/40" />

              <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                <div className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white/95 backdrop-blur-md">
                  <InstagramIcon className="h-2.5 w-2.5 text-amber-300" />
                  <span className="truncate max-w-[85px]">{handle || "@gokulam"}</span>
                </div>
                <div className="inline-flex items-center gap-0.5 rounded-full border border-white/20 bg-black/40 px-2 py-0.5 text-[10px] font-semibold text-white/95 backdrop-blur-md">
                  <Heart className="h-2.5 w-2.5 fill-rose-500 text-rose-500" />
                  <span>{likes || "2.4k"}</span>
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-md shadow-lg">
                  <Play className="h-5 w-5 fill-white text-white ml-0.5" />
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-3.5 z-10 flex flex-col justify-end">
                <p className="line-clamp-2 text-[10px] leading-snug text-cream/90 font-normal">
                  {caption || "Gokulam reel story..."}
                </p>
                <div className="mt-2 text-[9px] font-bold uppercase tracking-wider text-amber-300">
                  WATCH REEL ↗
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-sand/70 pt-5">
          {isEditing && onDelete ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-50 disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete Reel</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-full border border-sand px-5 py-2.5 text-xs font-semibold text-ink transition-colors hover:bg-sand/30"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-full bg-forest px-7 py-2.5 text-xs font-semibold uppercase tracking-wider text-cream shadow transition-all hover:bg-forest-deep disabled:opacity-50"
            >
              {isSaving ? (
                <span>{isUploading ? "Uploading..." : "Saving..."}</span>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-sand" />
                  <span>{isEditing ? "Update Reel" : "Create Reel"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

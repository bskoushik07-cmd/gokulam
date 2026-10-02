"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  UploadCloud,
  Check,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  listSupabaseMedia,
  uploadImageToSupabase,
  getSupabaseCredentials,
} from "@/lib/supabase";
import { IMAGE_REGISTRY } from "@/lib/image-registry";

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string) => void;
}

export default function MediaLibraryModal({
  isOpen,
  onClose,
  onSelectImage,
}: MediaLibraryModalProps) {
  const [supabaseFiles, setSupabaseFiles] = useState<
    { name: string; url: string; created_at?: string | null }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [activeTab, setActiveTab] = useState<"supabase" | "builtIn">("supabase");

  const loadMedia = async () => {
    setIsLoading(true);
    setUploadError("");
    try {
      const files = await listSupabaseMedia();
      setSupabaseFiles(files);
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError("");

    const res = await uploadImageToSupabase(file);
    setIsUploading(false);

    if (res.success && res.url) {
      onSelectImage(res.url);
      onClose();
    } else {
      setUploadError(res.error || "Failed to upload file to Supabase storage.");
    }
  };

  const hasCreds = !!getSupabaseCredentials();

  // Unique list of built-in assets
  const builtInAssets = Array.from(
    new Set(IMAGE_REGISTRY.map((item) => item.defaultUrl))
  ).map((url) => {
    const item = IMAGE_REGISTRY.find((i) => i.defaultUrl === url);
    return {
      name: item?.label || url.split("/").pop() || "",
      url,
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-3xl border border-sand bg-cream shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sand/70 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest text-sand shadow">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">
                Media Library
              </h2>
              <p className="text-xs text-ink-soft">
                Browse stored images or upload fresh photography.
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

        {/* Tabs & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sand/50 bg-parchment/60 px-6 py-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("supabase")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "supabase"
                  ? "bg-forest text-cream shadow"
                  : "bg-cream text-ink hover:bg-sand/30"
              }`}
            >
              Supabase Storage ({supabaseFiles.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("builtIn")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "builtIn"
                  ? "bg-forest text-cream shadow"
                  : "bg-cream text-ink hover:bg-sand/30"
              }`}
            >
              Built-in Photography ({builtInAssets.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadMedia}
              className="inline-flex items-center gap-1.5 rounded-full border border-sand bg-cream px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-copper"
            >
              <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>

            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-forest px-4 py-1.5 text-xs font-semibold text-cream shadow transition-all hover:bg-forest-deep">
              <UploadCloud className="h-3.5 w-3.5" />
              <span>{isUploading ? "Uploading..." : "Upload New File"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading || !hasCreds}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {uploadError && (
          <div className="mx-6 mt-4 rounded-xl bg-rose-50 p-3 text-xs text-rose-800 border border-rose-200">
            {uploadError}
          </div>
        )}

        {/* Gallery Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 text-ink-soft">
              <Loader2 className="h-8 w-8 animate-spin text-copper" />
              <p className="text-sm font-medium">Loading media assets...</p>
            </div>
          ) : activeTab === "supabase" ? (
            supabaseFiles.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {supabaseFiles.map((file) => (
                  <div
                    key={file.url}
                    onClick={() => {
                      onSelectImage(file.url);
                      onClose();
                    }}
                    className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-sand/80 bg-parchment transition-all hover:border-copper hover:shadow-lg hover:ring-2 hover:ring-copper/30"
                  >
                    <div className="relative aspect-square w-full overflow-hidden bg-black/5">
                      <img
                        src={file.url}
                        alt={file.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-2 text-center">
                      <p className="truncate font-mono text-[11px] text-ink">
                        {file.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sand/80 bg-parchment/40 text-center p-6">
                <UploadCloud className="h-10 w-10 text-copper-deep/50" />
                <h3 className="mt-3 font-display text-lg font-semibold text-ink">
                  No files uploaded to Supabase Storage yet
                </h3>
                <p className="mt-1 max-w-sm text-xs text-ink-soft">
                  {hasCreds
                    ? "Upload your first file using the button above or directly in any image card editor."
                    : "Connect your Supabase project in Settings to start uploading and storing media."}
                </p>
              </div>
            )
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {builtInAssets.map((asset) => (
                <div
                  key={asset.url}
                  onClick={() => {
                    onSelectImage(asset.url);
                    onClose();
                  }}
                  className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-sand/80 bg-parchment transition-all hover:border-copper hover:shadow-lg hover:ring-2 hover:ring-copper/30"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-black/5">
                    <img
                      src={asset.url}
                      alt={asset.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-2 text-center">
                    <p className="truncate text-[11px] font-semibold text-ink">
                      {asset.name}
                    </p>
                    <p className="truncate font-mono text-[10px] text-ink-soft">
                      {asset.url}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Upload,
  Link as LinkIcon,
  RotateCcw,
  Check,
  Sparkles,
  AlertCircle,
  Image as ImageIcon,
  FolderOpen,
} from "lucide-react";
import { ImageItem } from "@/lib/image-registry";
import { uploadImageToSupabase, getSupabaseCredentials } from "@/lib/supabase";
import { compressImageFile } from "@/lib/image-compressor";

interface ImageEditModalProps {
  item: ImageItem | null;
  currentUrl: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string, newUrl: string) => Promise<void>;
  onReset: (key: string) => Promise<void>;
  onOpenMediaLibrary: () => void;
}

export default function ImageEditModal({
  item,
  currentUrl,
  isOpen,
  onClose,
  onSave,
  onReset,
  onOpenMediaLibrary,
}: ImageEditModalProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [inputUrl, setInputUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalSizeKB, setOriginalSizeKB] = useState<number | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (isOpen && item) {
      setInputUrl(currentUrl);
      setPreviewUrl(currentUrl);
      setSelectedFile(null);
      setOriginalSizeKB(null);
      setFilePreview(null);
      setErrorMsg("");
      setSuccessMsg("");
    }
  }, [isOpen, item, currentUrl]);

  if (!isOpen || !item) return null;

  const hasCreds = !!getSupabaseCredentials();

  const processSelectedFile = async (rawFile: File) => {
    try {
      const origKB = rawFile.size / 1024;
      setOriginalSizeKB(origKB);

      // Auto-compress heavy images to web standards
      const optimized = await compressImageFile(rawFile, {
        maxWidth: 2048,
        maxHeight: 2048,
        quality: 0.88,
      });

      setSelectedFile(optimized);
      const objUrl = URL.createObjectURL(optimized);
      setFilePreview(objUrl);
      setPreviewUrl(objUrl);
      setErrorMsg("");
    } catch {
      setSelectedFile(rawFile);
      const objUrl = URL.createObjectURL(rawFile);
      setFilePreview(objUrl);
      setPreviewUrl(objUrl);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processSelectedFile(file);
    }
  };

  const handleUrlChange = (val: string) => {
    setInputUrl(val);
    setPreviewUrl(val);
    setSelectedFile(null);
    setOriginalSizeKB(null);
    setFilePreview(null);
    setErrorMsg("");
  };

  const handleSave = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setIsSaving(true);

    try {
      let finalUrl = previewUrl;

      // If file was chosen and Supabase is configured, upload to storage first
      if (selectedFile) {
        if (!hasCreds) {
          setErrorMsg(
            "Supabase credentials are required to upload files to Cloud Storage. Please enter credentials in Supabase Settings, or provide a direct Image URL."
          );
          setIsSaving(false);
          return;
        }

        setIsUploading(true);
        // Ensure compressed before upload
        const fileToUpload = await compressImageFile(selectedFile);
        const uploadRes = await uploadImageToSupabase(fileToUpload);
        setIsUploading(false);

        if (!uploadRes.success || !uploadRes.url) {
          setErrorMsg(uploadRes.error || "Failed to upload image to Supabase Storage.");
          setIsSaving(false);
          return;
        }

        finalUrl = uploadRes.url;
      }

      if (!finalUrl || finalUrl.trim() === "") {
        setErrorMsg("Please select an image file or enter a valid URL.");
        setIsSaving(false);
        return;
      }

      await onSave(item.key, finalUrl);
      setSuccessMsg("Image updated successfully!");
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save image.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (confirm(`Reset "${item.label}" back to its original default photo?`)) {
      setIsSaving(true);
      await onReset(item.key);
      setIsSaving(false);
      onClose();
    }
  };

  const isOverridden = currentUrl !== item.defaultUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-y-auto rounded-3xl border border-sand bg-cream p-6 shadow-2xl sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sand/70 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-copper/15 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-copper-deep">
                {item.section}
              </span>
              {isOverridden && (
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                  Custom Image Active
                </span>
              )}
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
              {item.label}
            </h2>
            <p className="mt-1 text-xs text-ink-soft">{item.description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-ink-soft transition-colors hover:bg-sand/30 hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-6 space-y-6">
          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex rounded-xl bg-parchment p-1 border border-sand/70">
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                  activeTab === "upload"
                    ? "bg-forest text-cream shadow"
                    : "text-ink hover:text-copper-deep"
                }`}
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload New File</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("url")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                  activeTab === "url"
                    ? "bg-forest text-cream shadow"
                    : "text-ink hover:text-copper-deep"
                }`}
              >
                <LinkIcon className="h-3.5 w-3.5" />
                <span>Direct Image URL</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onOpenMediaLibrary}
              className="inline-flex items-center gap-1.5 rounded-full border border-sand bg-parchment px-4 py-2 text-xs font-semibold text-copper-deep transition-colors hover:border-copper"
            >
              <FolderOpen className="h-3.5 w-3.5" />
              <span>Browse Media Library</span>
            </button>
          </div>

          {/* Upload Tab */}
          {activeTab === "upload" && (
            <div>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sand bg-parchment/50 p-8 text-center transition-colors hover:border-copper hover:bg-parchment/80"
              >
                <input
                  type="file"
                  id="image-upload-input"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest text-sand shadow">
                  <Upload className="h-6 w-6" />
                </div>
                <h4 className="mt-3 font-display text-base font-semibold text-ink">
                  {selectedFile ? selectedFile.name : "Drag & drop an image here, or click to browse"}
                </h4>
                <p className="mt-1 text-xs text-ink-soft">
                  Supports WebP, JPG, PNG, SVG (Recommended: {item.recommendedSize})
                </p>
                {selectedFile && (
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                      <Check className="h-3.5 w-3.5" /> File Selected: {(selectedFile.size / 1024).toFixed(1)} KB
                    </span>
                    {originalSizeKB && originalSizeKB > 1024 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-sand/60 px-3 py-1 text-[11px] font-medium text-ink-soft">
                        ✨ Auto-optimized from {(originalSizeKB / 1024).toFixed(1)} MB
                      </span>
                    )}
                  </div>
                )}
              </div>
              {!hasCreds && (
                <p className="mt-2 text-xs text-amber-800 bg-amber-50 rounded-xl p-3 border border-amber-200">
                  Note: To permanently store uploaded files in Supabase Storage, please configure your Supabase Project in Settings.
                </p>
              )}
            </div>
          )}

          {/* URL Tab */}
          {activeTab === "url" && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-copper-deep">
                Paste Image URL
              </label>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://example.com/photo.jpg or /images/..."
                className="w-full rounded-xl border border-sand bg-parchment px-4 py-3 font-mono text-xs text-ink placeholder-ink-soft/40 outline-none focus:border-copper focus:ring-2 focus:ring-copper/20"
              />
              <p className="text-[11px] text-ink-soft">
                Enter any direct HTTPS image link or local path from <code className="font-mono">/public/images/</code>.
              </p>
            </div>
          )}

          {/* Live Before & After Preview */}
          <div className="rounded-2xl border border-sand bg-parchment p-4">
            <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-copper-deep">
              Preview Comparison
            </h4>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-semibold text-ink-soft">Original / Default</p>
                <div className="relative mt-1.5 aspect-video w-full overflow-hidden rounded-xl border border-sand bg-black/5">
                  <img
                    src={item.defaultUrl}
                    alt="Original"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-copper-deep">New Live Preview</p>
                <div className="relative mt-1.5 aspect-video w-full overflow-hidden rounded-xl border-2 border-copper bg-black/5">
                  <img
                    src={previewUrl || item.defaultUrl}
                    alt="New Preview"
                    onError={() => setErrorMsg("Failed to load image from given preview URL.")}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Error / Success Feedback */}
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

        {/* Footer Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-sand/70 pt-5">
          {isOverridden ? (
            <button
              type="button"
              onClick={handleReset}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-50 disabled:opacity-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset to Original</span>
            </button>
          ) : (
            <span className="text-xs text-ink-soft">Currently using default image</span>
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
                  <span>Save Image</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

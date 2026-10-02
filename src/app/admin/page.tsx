"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Sparkles,
  RotateCcw,
  Download,
  UploadCloud,
  Layers,
  Filter,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Info,
  RefreshCw,
} from "lucide-react";
import { IMAGE_REGISTRY, ImageItem } from "@/lib/image-registry";
import { useSiteImages } from "@/context/ImageContext";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ImageCard from "@/components/admin/ImageCard";
import ImageEditModal from "@/components/admin/ImageEditModal";
import SupabaseSettingsModal from "@/components/admin/SupabaseSettingsModal";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";
import AdminAuth from "@/components/admin/AdminAuth";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeItemForEdit, setActiveItemForEdit] = useState<ImageItem | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [filterOverriddenOnly, setFilterOverriddenOnly] = useState(false);

  const {
    images,
    updateImage,
    resetImage,
    bulkUpdateImages,
    isSupabaseConnected,
    refreshImages,
    isLoading,
  } = useSiteImages();

  // Page counts
  const pageCounts = useMemo(() => {
    const counts: Record<string, number> = { all: IMAGE_REGISTRY.length };
    for (const item of IMAGE_REGISTRY) {
      counts[item.page] = (counts[item.page] || 0) + 1;
    }
    return counts;
  }, []);

  // Overridden images count
  const overriddenCount = useMemo(() => {
    return IMAGE_REGISTRY.filter(
      (item) => (images[item.key] || item.defaultUrl) !== item.defaultUrl
    ).length;
  }, [images]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return IMAGE_REGISTRY.filter((item) => {
      // Page filter
      if (selectedPage !== "all" && item.page !== selectedPage) {
        return false;
      }
      // Overridden only filter
      const isOverridden =
        (images[item.key] || item.defaultUrl) !== item.defaultUrl;
      if (filterOverriddenOnly && !isOverridden) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesLabel = item.label.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesSection = item.section.toLowerCase().includes(q);
        const matchesKey = item.key.toLowerCase().includes(q);
        if (!matchesLabel && !matchesDesc && !matchesSection && !matchesKey) {
          return false;
        }
      }
      return true;
    });
  }, [selectedPage, searchQuery, filterOverriddenOnly, images]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("gokulam_admin_auth_token");
    }
    setIsAuthenticated(false);
  };

  const handleExportConfig = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(images, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `gokulam-images-backup-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (typeof parsed === "object") {
          await bulkUpdateImages(parsed);
          alert("Backup configuration restored successfully!");
        }
      } catch {
        alert("Invalid JSON file provided.");
      }
    };
    reader.readAsText(file);
  };

  if (!isAuthenticated) {
    return <AdminAuth onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-cream text-ink">
      {/* Header */}
      <AdminHeader
        isSupabaseConnected={isSupabaseConnected}
        overriddenCount={overriddenCount}
        totalCount={IMAGE_REGISTRY.length}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenMediaLibrary={() => setIsMediaLibraryOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Body */}
      <main className="mx-auto max-w-[96rem] px-4 py-8 sm:px-8">
        {/* Top Metric Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-sand/70 bg-parchment p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-copper-deep">
              Total Managed Assets
            </p>
            <p className="mt-2 font-display text-3xl font-bold text-ink">
              {IMAGE_REGISTRY.length}
            </p>
            <p className="mt-1 text-xs text-ink-soft">
              Mapped across all pages & sections
            </p>
          </div>

          <div className="rounded-2xl border border-sand/70 bg-parchment p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-copper-deep">
              Custom Overrides Active
            </p>
            <p className="mt-2 font-display text-3xl font-bold text-emerald-700">
              {overriddenCount}
            </p>
            <p className="mt-1 text-xs text-ink-soft">
              {IMAGE_REGISTRY.length - overriddenCount} using default photography
            </p>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-sand/70 bg-parchment p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-copper-deep">
              Backup & Restore
            </p>
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportConfig}
                className="inline-flex items-center gap-1.5 rounded-xl border border-sand bg-cream px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-copper shadow-sm"
                title="Download JSON backup"
              >
                <Download className="h-3.5 w-3.5 text-copper-deep" />
                <span>Export</span>
              </button>

              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-sand bg-cream px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-copper shadow-sm">
                <UploadCloud className="h-3.5 w-3.5 text-copper-deep" />
                <span>Import</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportConfig}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => refreshImages()}
                className="rounded-xl border border-sand bg-cream p-1.5 text-ink transition-colors hover:border-copper shadow-sm"
                title="Reload from Cloud Database"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Content Layout with Sidebar */}
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Sidebar Category Filter */}
          <AdminSidebar
            selectedPage={selectedPage}
            onSelectPage={setSelectedPage}
            counts={pageCounts}
          />

          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            {/* Search and Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-sand/70 bg-parchment/60 p-4">
              {/* Search Bar */}
              <div className="relative min-w-[240px] flex-1 max-w-md">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by dish name, section, page, or key..."
                  className="w-full rounded-xl border border-sand bg-cream px-4 py-2.5 pl-10 text-xs text-ink placeholder-ink-soft/40 outline-none focus:border-copper focus:ring-2 focus:ring-copper/20"
                />
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-copper" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-2.5 text-xs text-ink-soft hover:text-ink"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Quick Filter toggle: Overridden only */}
              <div className="flex items-center gap-3">
                <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-ink-soft">
                  <input
                    type="checkbox"
                    checked={filterOverriddenOnly}
                    onChange={(e) => setFilterOverriddenOnly(e.target.checked)}
                    className="rounded border-sand text-forest focus:ring-copper"
                  />
                  <span>Show Custom Overrides Only ({overriddenCount})</span>
                </label>
              </div>
            </div>

            {/* Results Grid */}
            {filteredItems.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                  <ImageCard
                    key={item.key}
                    item={item}
                    currentUrl={images[item.key] || item.defaultUrl}
                    onEdit={(selected) => setActiveItemForEdit(selected)}
                    onReset={async (key) => {
                      if (confirm(`Reset "${item.label}" back to default?`)) {
                        await resetImage(key);
                      }
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-sand/80 bg-parchment/40 text-center p-8">
                <Search className="h-10 w-10 text-copper-deep/40" />
                <h3 className="mt-3 font-display text-lg font-bold text-ink">
                  No images found
                </h3>
                <p className="mt-1 text-xs text-ink-soft">
                  Try clearing your search query or selecting a different page filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedPage("all");
                    setFilterOverriddenOnly(false);
                  }}
                  className="mt-4 rounded-full bg-forest px-4 py-2 text-xs font-semibold text-cream hover:bg-forest-deep"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      <ImageEditModal
        item={activeItemForEdit}
        currentUrl={
          activeItemForEdit
            ? images[activeItemForEdit.key] || activeItemForEdit.defaultUrl
            : ""
        }
        isOpen={!!activeItemForEdit}
        onClose={() => setActiveItemForEdit(null)}
        onSave={async (key, newUrl) => {
          await updateImage(key, newUrl);
        }}
        onReset={async (key) => {
          await resetImage(key);
        }}
        onOpenMediaLibrary={() => {
          setIsMediaLibraryOpen(true);
        }}
      />

      {/* Supabase Settings Modal */}
      <SupabaseSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onCredentialsUpdated={() => {
          refreshImages();
        }}
      />

      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={isMediaLibraryOpen}
        onClose={() => setIsMediaLibraryOpen(false)}
        onSelectImage={(url) => {
          if (activeItemForEdit) {
            updateImage(activeItemForEdit.key, url);
          }
        }}
      />
    </div>
  );
}

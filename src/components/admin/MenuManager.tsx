"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  RefreshCw,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  Check,
  Filter,
  X,
  Layers,
  UtensilsCrossed,
} from "lucide-react";
import { useMenu } from "@/context/MenuContext";
import { MenuItemRecord } from "@/lib/supabase";
import { janpathMenuCategories, noidaMenuCategories } from "@/content/menu";
import MenuItemEditModal from "./MenuItemEditModal";

export default function MenuManager() {
  const {
    items,
    isLoading,
    isSyncing,
    isSupabaseConnected,
    lastSyncTime,
    updateItem,
    addItem,
    deleteItem,
    toggleAvailability,
    seedAllToSupabase,
    refreshItems,
    resetToDefaults,
  } = useMenu();

  const [selectedOutlet, setSelectedOutlet] = useState<string>("sector-62");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeItemForEdit, setActiveItemForEdit] = useState<MenuItemRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const availableCategories = useMemo(() => {
    if (selectedOutlet === "sector-62") return noidaMenuCategories;
    if (selectedOutlet === "janpath") return janpathMenuCategories;
    // all: combine unique
    const seen = new Set<string>();
    const combined = [];
    for (const c of [...janpathMenuCategories, ...noidaMenuCategories]) {
      if (!seen.has(c.slug)) {
        seen.add(c.slug);
        combined.push(c);
      }
    }
    return combined;
  }, [selectedOutlet]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Outlet filter
      if (selectedOutlet !== "all") {
        const itemOutlet = item.outlet || "janpath";
        if (selectedOutlet === "janpath" && itemOutlet !== "janpath" && itemOutlet !== "delhi-janpath") {
          return false;
        }
        if (selectedOutlet === "sector-62" && itemOutlet !== "sector-62" && itemOutlet !== "noida-sector-62") {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== "all" && item.category_id !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = item.name.toLowerCase().includes(q);
        const descMatch = item.description?.toLowerCase().includes(q);
        const catMatch = item.category_title?.toLowerCase().includes(q);
        const servingMatch = item.serving_details?.toLowerCase().includes(q);
        if (!nameMatch && !descMatch && !catMatch && !servingMatch) {
          return false;
        }
      }

      return true;
    });
  }, [items, selectedOutlet, selectedCategory, searchQuery]);

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setSeedMessage({ text, type });
    setTimeout(() => setSeedMessage(null), 5000);
  };

  const handleSeedToSupabase = async () => {
    if (
      confirm(
        `Sync all ${items.length} dishes across Janpath and Noida to your Supabase database table "menu_items"?`
      )
    ) {
      setIsSeeding(true);
      setSeedMessage(null);
      try {
        const res = await seedAllToSupabase();
        if (res.success) {
          showNotification(`Successfully synced all ${res.count} items to Supabase cloud!`, "success");
        } else {
          showNotification(`Sync notice: ${res.error || "Please ensure Supabase SQL table is created"}`, "error");
        }
      } catch (err: any) {
        showNotification(`Error syncing: ${err.message}`, "error");
      } finally {
        setIsSeeding(false);
      }
    }
  };

  const handleReset = () => {
    if (confirm("Reset menu to the original PDF extracted catalogs (Janpath & Noida)? Any custom added items will be reset.")) {
      resetToDefaults();
      showNotification("Menu reset to authentic PDF catalogs.", "success");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Sync Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-copper/30 bg-gradient-to-r from-cream via-white to-parchment p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-forest/10 p-1.5 text-forest">
              <UtensilsCrossed className="h-4 w-4" />
            </span>
            <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">
              Restaurant Menu CMS
            </h2>
          </div>
          <p className="mt-1 text-xs text-ink-soft sm:text-sm">
            Manage dishes, prices, portion details, availability, and categories for Gokulam Janpath (Delhi) & Gokulam Sector 62 (Noida).
          </p>
          
          {/* Realtime sync badge */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-semibold ${
              isSupabaseConnected ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-amber-100 text-amber-800 border border-amber-300"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isSupabaseConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
              <span>{isSupabaseConnected ? "Supabase Connected • Auto-Sync with each update active" : "Offline / Local Storage Mode"}</span>
            </span>
            {isSyncing && (
              <span className="inline-flex items-center gap-1 text-copper-deep font-semibold animate-pulse">
                <RefreshCw className="h-3 w-3 animate-spin" />
                <span>Syncing to Supabase...</span>
              </span>
            )}
            {lastSyncTime && !isSyncing && (
              <span className="text-[11px] text-ink-soft">
                Last synced: {lastSyncTime.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleSeedToSupabase}
            disabled={isSeeding || isSyncing}
            className="inline-flex items-center gap-1.5 rounded-full border border-forest/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-forest shadow-sm transition-all hover:bg-forest hover:text-cream active:scale-95 disabled:opacity-50"
            title="Upload/Sync all dishes to Supabase cloud database"
          >
            <UploadCloud className={`h-4 w-4 ${isSeeding || isSyncing ? "animate-bounce" : ""}`} />
            <span>{isSeeding ? "Syncing..." : "Sync All to Supabase"}</span>
          </button>

          <button
            type="button"
            onClick={async () => {
              await refreshItems();
              showNotification("Menu reloaded from database.", "success");
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-sand bg-white px-3.5 py-2 text-xs font-semibold text-ink shadow-sm hover:border-copper active:scale-95"
            title="Reload live from database"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-copper-deep ${isLoading ? "animate-spin" : ""}`} />
            <span>Reload</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 rounded-full border border-sand bg-white px-3.5 py-2 text-xs font-semibold text-ink-soft shadow-sm hover:text-ink hover:border-sand/90 active:scale-95"
            title="Restore original brand PDF menus"
          >
            <RotateCcw className="h-3.5 w-3.5 text-copper-deep" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveItemForEdit(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-full bg-forest px-5 py-2 text-xs font-bold uppercase tracking-wider text-cream shadow-md transition-all hover:bg-forest-deep active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Add Dish</span>
          </button>
        </div>
      </div>

      {seedMessage && (
        <div className={`flex items-center gap-2 rounded-2xl p-4 text-xs font-semibold border animate-in fade-in ${
          seedMessage.type === "success"
            ? "bg-emerald-50 text-emerald-900 border-emerald-200"
            : "bg-rose-50 text-rose-900 border-rose-200"
        }`}>
          {seedMessage.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
          )}
          <span>{seedMessage.text}</span>
        </div>
      )}

      {/* Metrics Bar */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-sand/70 bg-parchment p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-copper-deep">
            Total Menu Items
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-ink">{items.length}</p>
          <p className="text-[11px] text-ink-soft">Across Janpath & Noida</p>
        </div>

        <div className="rounded-2xl border border-sand/70 bg-parchment p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-copper-deep">
            Janpath (Delhi) Dishes
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-forest">
            {items.filter((i) => !i.outlet || i.outlet === "janpath" || i.outlet === "all").length}
          </p>
          <p className="text-[11px] text-ink-soft">16 Categories</p>
        </div>

        <div className="rounded-2xl border border-sand/70 bg-parchment p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-copper-deep">
            Noida (Sector 62) Dishes
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-forest">
            {items.filter((i) => i.outlet === "sector-62" || i.outlet === "all").length}
          </p>
          <p className="text-[11px] text-ink-soft">11 Categories</p>
        </div>

        <div className="rounded-2xl border border-sand/70 bg-parchment p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-copper-deep">
            In Stock / Available
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-emerald-700">
            {items.filter((i) => i.is_available !== false).length}
          </p>
          <p className="text-[11px] text-ink-soft">Live on website</p>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-sand/80 bg-parchment/60 p-4">
        {/* Outlet Switcher Pills */}
        <div className="flex items-center gap-1.5 rounded-full border border-sand bg-white p-1">
          <button
            type="button"
            onClick={() => {
              setSelectedOutlet("sector-62");
              setSelectedCategory("all");
            }}
            className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
              selectedOutlet === "sector-62"
                ? "bg-forest text-cream shadow-sm"
                : "text-ink hover:text-copper-deep"
            }`}
          >
            Sector 62 (Noida)
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedOutlet("janpath");
              setSelectedCategory("all");
            }}
            className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
              selectedOutlet === "janpath"
                ? "bg-forest text-cream shadow-sm"
                : "text-ink hover:text-copper-deep"
            }`}
          >
            Janpath (Delhi)
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedOutlet("all");
              setSelectedCategory("all");
            }}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
              selectedOutlet === "all"
                ? "bg-forest text-cream shadow-sm"
                : "text-ink hover:text-copper-deep"
            }`}
          >
            All
          </button>
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-copper-deep hidden sm:inline">
            Category:
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-sand bg-white px-3 py-2 text-xs text-ink outline-none focus:border-copper shadow-sm"
          >
            <option value="all">All Categories ({availableCategories.length})</option>
            {availableCategories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[220px] flex-1 max-w-xs">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by dish name, price..."
            className="w-full rounded-xl border border-sand bg-white px-3 py-2 pl-9 text-xs text-ink placeholder-ink-soft/40 outline-none focus:border-copper shadow-sm"
          />
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-copper-deep" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2 text-xs text-ink-soft hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Items Table */}
      {filteredItems.length > 0 ? (
        <div className="overflow-hidden rounded-3xl border border-sand/80 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-ink">
              <thead className="border-b border-sand bg-parchment/70 text-[11px] font-bold uppercase tracking-wider text-copper-deep">
                <tr>
                  <th className="px-5 py-3.5">Dish Name & Portion</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Price (₹)</th>
                  <th className="px-4 py-3.5">Tags & Badges</th>
                  <th className="px-4 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/40">
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-parchment/40"
                  >
                    {/* Dish Name */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="font-display text-sm font-bold text-ink">
                          {item.name}
                        </span>
                        {item.serving_details && (
                          <span className="mt-0.5 inline-block text-[10px] font-semibold text-forest">
                            Portion: {item.serving_details}
                          </span>
                        )}
                        {item.description && (
                          <span className="mt-0.5 max-w-sm line-clamp-1 text-[11px] text-ink-soft">
                            {item.description}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4">
                      <span className="rounded-lg bg-parchment px-2.5 py-1 text-[11px] font-medium text-ink">
                        {item.category_title || item.category_id}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-4 font-display text-sm font-bold text-copper-deep">
                      ₹{item.price}
                    </td>

                    {/* Tags */}
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {item.tags && item.tags.length > 0 ? (
                          item.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded-full bg-copper/10 px-2 py-0.5 text-[10px] font-semibold text-copper-deep border border-copper/20"
                            >
                              {t}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-ink-soft/40">—</span>
                        )}
                      </div>
                    </td>

                    {/* Availability Toggle */}
                    <td className="px-4 py-4 text-center">
                      <button
                        type="button"
                        onClick={async () => {
                          const res = await toggleAvailability(item.id);
                          if (res) {
                            showNotification(`"${item.name}" availability updated & synced with Supabase!`, "success");
                          }
                        }}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${
                          item.is_available !== false
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-rose-100 text-rose-800 hover:bg-rose-200"
                        }`}
                      >
                        {item.is_available !== false ? (
                          <>
                            <Check className="h-3 w-3" />
                            <span>In Stock</span>
                          </>
                        ) : (
                          <>
                            <X className="h-3 w-3" />
                            <span>Sold Out</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveItemForEdit(item);
                            setIsModalOpen(true);
                          }}
                          className="rounded-full border border-sand bg-cream p-1.5 text-copper-deep transition-colors hover:border-copper hover:bg-white shadow-sm"
                          title="Edit Dish"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (confirm(`Delete "${item.name}" from the menu?`)) {
                              await deleteItem(item.id);
                              showNotification(`"${item.name}" deleted & synced with Supabase.`, "success");
                            }
                          }}
                          className="rounded-full border border-sand bg-cream p-1.5 text-rose-700 transition-colors hover:border-rose-300 hover:bg-rose-50 shadow-sm"
                          title="Delete Dish"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-sand bg-white p-8 text-center">
          <Search className="h-10 w-10 text-copper-deep/40" />
          <h3 className="mt-3 font-display text-lg font-bold text-ink">
            No dishes found
          </h3>
          <p className="mt-1 text-xs text-ink-soft">
            Try adjusting your search query, outlet, or category filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="mt-4 rounded-full bg-forest px-4 py-2 text-xs font-semibold text-cream hover:bg-forest-deep"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Edit / Add Modal */}
      <MenuItemEditModal
        item={activeItemForEdit}
        isOpen={isModalOpen}
        defaultOutlet={selectedOutlet === "all" ? "janpath" : selectedOutlet}
        onClose={() => {
          setIsModalOpen(false);
          setActiveItemForEdit(null);
        }}
        onSave={async (savedData) => {
          if (activeItemForEdit) {
            const res = await updateItem(savedData);
            if (res.success) {
              showNotification(`"${savedData.name}" updated & synced with Supabase!`, "success");
            } else {
              showNotification(`Updated locally (${res.error || "Supabase sync notice"})`, "success");
            }
          } else {
            const res = await addItem(savedData);
            if (res.success) {
              showNotification(`"${savedData.name}" added & synced with Supabase!`, "success");
            } else {
              showNotification(`Added locally (${res.error || "Supabase sync notice"})`, "success");
            }
          }
        }}
        onDelete={async (id) => {
          await deleteItem(id);
          showNotification("Dish deleted & synced with Supabase.", "success");
        }}
      />
    </div>
  );
}

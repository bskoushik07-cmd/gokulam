"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Sparkles, Check, AlertCircle, Trash2 } from "lucide-react";
import { MenuItemRecord } from "@/lib/supabase";
import { janpathMenuCategories, noidaMenuCategories } from "@/content/menu";

interface MenuItemEditModalProps {
  item: MenuItemRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<MenuItemRecord> & { id: string; name: string; price: number; category_id: string; category_title: string }) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  defaultOutlet?: string;
}

const AVAILABLE_TAGS = [
  { id: "signature", label: "★ Signature" },
  { id: "must-try", label: "🔥 Must Try" },
  { id: "jain", label: "🌱 Jain Option" },
  { id: "spicy", label: "🌶 Spicy" },
  { id: "chef-special", label: "👨‍🍳 Chef's Special" },
  { id: "combo", label: "🍱 Value Combo" },
  { id: "seasonal", label: "🍂 Seasonal" },
];

export default function MenuItemEditModal({
  item,
  isOpen,
  onClose,
  onSave,
  onDelete,
  defaultOutlet = "janpath",
}: MenuItemEditModalProps) {
  const isNew = !item || !item.id;

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [categoryId, setCategoryId] = useState("idly-vada");
  const [description, setDescription] = useState("");
  const [servingDetails, setServingDetails] = useState("");
  const [outlet, setOutlet] = useState(defaultOutlet);
  const [tags, setTags] = useState<string[]>([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const activeCategories = outlet === "sector-62" ? noidaMenuCategories : janpathMenuCategories;

  useEffect(() => {
    if (item) {
      setName(item.name || "");
      setPrice(item.price || "");
      setCategoryId(item.category_id || "idly-vada");
      setDescription(item.description || "");
      setServingDetails(item.serving_details || "");
      setOutlet(item.outlet || defaultOutlet);
      setTags(item.tags || []);
      setIsAvailable(item.is_available !== false);
    } else {
      setName("");
      setPrice("");
      setCategoryId(defaultOutlet === "sector-62" ? "idly-vada" : "heritage-karnataka-best-sellers");
      setDescription("");
      setServingDetails("");
      setOutlet(defaultOutlet);
      setTags([]);
      setIsAvailable(true);
    }
    setErrorMsg("");
  }, [item, defaultOutlet, isOpen]);

  if (!isOpen) return null;

  const handleTagToggle = (tagId: string) => {
    setTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Please enter a dish name.");
      return;
    }
    if (!price || isNaN(Number(price))) {
      setErrorMsg("Please enter a valid price in ₹.");
      return;
    }

    const selectedCat = [...janpathMenuCategories, ...noidaMenuCategories].find((c) => c.slug === categoryId || c.id === categoryId);
    const categoryTitle = selectedCat?.title || categoryId;

    const id =
      item?.id ||
      `${outlet}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;

    setIsSaving(true);
    setErrorMsg("");

    try {
      await onSave({
        id,
        name: name.trim(),
        price: Number(price),
        category_id: categoryId,
        category_title: categoryTitle,
        description: description.trim(),
        serving_details: servingDetails.trim(),
        outlet,
        tags,
        is_available: isAvailable,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save dish item.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl border border-sand bg-cream p-6 shadow-2xl sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sand/70 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-forest/10 p-2 text-forest">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-ink">
                {isNew ? "Add New Dish" : "Edit Menu Item"}
              </h2>
              <p className="text-xs text-ink-soft">
                {isNew ? "Create a new dish for the menu" : `Editing "${item?.name}"`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-ink-soft hover:bg-sand/40 hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-800 border border-rose-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSave} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Dish Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-copper-deep">
                Dish Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Benne Masala Dosa"
                required
                className="mt-1.5 w-full rounded-xl border border-sand bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-copper focus:ring-2 focus:ring-copper/20"
              />
            </div>

            {/* Price (INR) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-copper-deep">
                Price (₹) *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="159"
                required
                className="mt-1.5 w-full rounded-xl border border-sand bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-copper focus:ring-2 focus:ring-copper/20"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Target Outlet */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-copper-deep">
                Target Outlet
              </label>
              <select
                value={outlet}
                onChange={(e) => {
                  const newOutlet = e.target.value;
                  setOutlet(newOutlet);
                  if (newOutlet === "sector-62") {
                    setCategoryId("idly-vada");
                  } else {
                    setCategoryId("heritage-karnataka-best-sellers");
                  }
                }}
                className="mt-1.5 w-full rounded-xl border border-sand bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-copper focus:ring-2 focus:ring-copper/20"
              >
                <option value="janpath">Gokulam Janpath (Delhi)</option>
                <option value="sector-62">Gokulam Sector 62 (Noida)</option>
                <option value="all">All Outlets</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-copper-deep">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-sand bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-copper focus:ring-2 focus:ring-copper/20"
              >
                {activeCategories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Serving / Quantity Details */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-copper-deep">
              Serving / Portion Details (Optional)
            </label>
            <input
              type="text"
              value={servingDetails}
              onChange={(e) => setServingDetails(e.target.value)}
              placeholder="e.g. 3 pieces, 10 pieces, 7am to 12 noon, Upma + Rava Kesari"
              className="mt-1.5 w-full rounded-xl border border-sand bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-copper focus:ring-2 focus:ring-copper/20"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-copper-deep">
              Dish Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the dish, preparation, ingredients, or history..."
              className="mt-1.5 w-full rounded-xl border border-sand bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-copper focus:ring-2 focus:ring-copper/20"
            />
          </div>

          {/* Dietary & Badges */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-copper-deep mb-2">
              Dietary Tags & Badges
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map((t) => {
                const active = tags.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleTagToggle(t.id)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                      active
                        ? "bg-forest text-cream shadow-sm"
                        : "bg-parchment text-ink hover:bg-sand/60"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* In Stock / Out of Stock Toggle */}
          <div className="flex items-center justify-between rounded-xl bg-parchment p-3.5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-ink">
                Item Availability
              </span>
              <p className="text-[11px] text-ink-soft">
                {isAvailable ? "Available to order in restaurant" : "Marked as Sold Out / Unavailable"}
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-sand/80 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-forest peer-checked:after:translate-x-full peer-focus:outline-none" />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-between pt-4 border-t border-sand/70">
            {!isNew && onDelete && item?.id ? (
              <button
                type="button"
                onClick={async () => {
                  if (confirm(`Delete "${item.name}" from the menu?`)) {
                    await onDelete(item.id);
                    onClose();
                  }
                }}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Dish</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full px-5 py-2.5 text-xs font-semibold text-ink-soft hover:bg-sand/40"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-cream shadow-md transition-all hover:bg-forest-deep disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{isSaving ? "Saving..." : "Save Dish"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

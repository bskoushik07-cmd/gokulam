"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import {
  MenuItemRecord,
  fetchMenuItems,
  saveMenuItem,
  bulkSaveMenuItems,
  deleteMenuItem as supabaseDeleteMenuItem,
  getSupabase,
} from "@/lib/supabase";
import { janpathMenuCategories, noidaMenuCategories, defaultMenuCategories } from "@/content/menu";
import type { MenuCategory, MenuItem } from "@/content/types";

const LOCAL_STORAGE_MENU_KEY = "gokulam_menu_items_override_v2";

/**
 * Convert default hardcoded categories into MenuItemRecord list for BOTH Janpath and Noida
 */
function getDefaultInitialRecords(): MenuItemRecord[] {
  const records: MenuItemRecord[] = [];
  let order = 1;

  // 1. Janpath items
  for (const cat of janpathMenuCategories) {
    for (const item of cat.items) {
      records.push({
        id: item.id || `janpath-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        outlet: "janpath",
        category_id: item.categoryId || cat.slug,
        category_title: item.categoryTitle || cat.title,
        name: item.name,
        description: item.description || "",
        serving_details: item.servingDetails || "",
        price: item.price,
        tags: (item.tags || []) as string[],
        is_available: item.isAvailable !== false,
        order: order++,
        image_url: "",
      });
    }
  }

  // 2. Noida items
  for (const cat of noidaMenuCategories) {
    for (const item of cat.items) {
      records.push({
        id: item.id || `noida-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        outlet: "sector-62",
        category_id: item.categoryId || cat.slug,
        category_title: item.categoryTitle || cat.title,
        name: item.name,
        description: item.description || "",
        serving_details: item.servingDetails || "",
        price: item.price,
        tags: (item.tags || []) as string[],
        is_available: item.isAvailable !== false,
        order: order++,
        image_url: "",
      });
    }
  }

  return records;
}

interface MenuContextType {
  items: MenuItemRecord[];
  isLoading: boolean;
  isSyncing: boolean;
  isSupabaseConnected: boolean;
  lastSyncTime: Date | null;
  getCategoriesForOutlet: (outletSlug?: string) => MenuCategory[];
  updateItem: (item: Partial<MenuItemRecord> & { id: string; name: string; price: number; category_id: string; category_title: string }) => Promise<{ success: boolean; error?: string }>;
  addItem: (item: Partial<MenuItemRecord> & { name: string; price: number; category_id: string; category_title: string }) => Promise<{ success: boolean; error?: string }>;
  deleteItem: (id: string) => Promise<{ success: boolean; error?: string }>;
  toggleAvailability: (id: string) => Promise<boolean>;
  seedAllToSupabase: () => Promise<{ success: boolean; count: number; error?: string }>;
  refreshItems: () => Promise<void>;
  resetToDefaults: () => void;
}

const MenuContext = createContext<MenuContextType | null>(null);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const defaultRecords = useMemo(() => getDefaultInitialRecords(), []);
  const [items, setItems] = useState<MenuItemRecord[]>(defaultRecords);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Load from Supabase on mount & auto-sync defaults if remote table is empty
  const refreshItems = useCallback(async () => {
    setIsLoading(true);
    const client = getSupabase();
    if (!client) {
      setIsSupabaseConnected(false);
      // Try load from local storage
      if (typeof window !== "undefined") {
        try {
          const saved = localStorage.getItem(LOCAL_STORAGE_MENU_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setItems(parsed);
            }
          }
        } catch {
          // ignore
        }
      }
      setIsLoading(false);
      return;
    }

    try {
      setIsSupabaseConnected(true);
      const dbItems = await fetchMenuItems();
      if (dbItems && dbItems.length > 0) {
        setItems(dbItems);
        setLastSyncTime(new Date());
        if (typeof window !== "undefined") {
          localStorage.setItem(LOCAL_STORAGE_MENU_KEY, JSON.stringify(dbItems));
        }
      } else {
        // Table in Supabase is empty: auto-seed all default Janpath and Noida items!
        console.log("Auto-seeding initial dishes to Supabase menu_items table...");
        const seedRes = await bulkSaveMenuItems(defaultRecords);
        if (seedRes.success) {
          setItems(defaultRecords);
          setLastSyncTime(new Date());
          if (typeof window !== "undefined") {
            localStorage.setItem(LOCAL_STORAGE_MENU_KEY, JSON.stringify(defaultRecords));
          }
        } else {
          // Fallback to local storage if available
          if (typeof window !== "undefined") {
            const saved = localStorage.getItem(LOCAL_STORAGE_MENU_KEY);
            if (saved) {
              const parsed = JSON.parse(saved);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setItems(parsed);
              }
            }
          }
        }
      }
    } catch (err) {
      console.warn("Failed to load menu items from Supabase:", err);
    } finally {
      setIsLoading(false);
    }
  }, [defaultRecords]);

  useEffect(() => {
    refreshItems();
  }, [refreshItems]);

  // Helper to get structured MenuCategories with live items
  const getCategoriesForOutlet = useCallback(
    (outletSlug = "janpath"): MenuCategory[] => {
      const normalized = (outletSlug || "janpath").toLowerCase();
      const isJanpath =
        normalized === "janpath" ||
        normalized === "delhi-janpath" ||
        normalized === "janpadh" ||
        normalized === "gokulam-janpath";

      // Filter items matching outlet
      const outletItems = items.filter((it) => {
        if (!it.outlet || it.outlet === "all") return true;
        if (isJanpath) return it.outlet === "janpath" || it.outlet === "delhi-janpath";
        return it.outlet === "sector-62" || it.outlet === "noida-sector-62";
      });

      // Group by category
      const baseCategories = isJanpath ? janpathMenuCategories : noidaMenuCategories;
      const categoryMap = new Map<string, MenuCategory>();

      // Initialize base categories in order
      for (const cat of baseCategories) {
        categoryMap.set(cat.slug, {
          ...cat,
          items: [],
        });
      }

      // Populate items
      for (const item of outletItems) {
        let cat = categoryMap.get(item.category_id);
        if (!cat) {
          // Custom category created by user
          cat = {
            id: item.category_id,
            slug: item.category_id,
            title: item.category_title || item.category_id,
            description: "",
            image: "/images/DSC05117.jpg",
            items: [],
          };
          categoryMap.set(item.category_id, cat);
        }

        cat.items.push({
          id: item.id,
          name: item.name,
          description: item.description,
          servingDetails: item.serving_details,
          price: item.price,
          tags: (item.tags || []) as any,
          isAvailable: item.is_available,
          order: item.order,
          categoryId: item.category_id,
          categoryTitle: item.category_title,
          outlet: item.outlet,
        });
      }

      // Filter out empty categories
      return Array.from(categoryMap.values()).filter((c) => c.items.length > 0);
    },
    [items]
  );

  // Update a dish item (with full payload merge and Supabase sync)
  const updateItem = useCallback(
    async (item: Partial<MenuItemRecord> & { id: string; name: string; price: number; category_id: string; category_title: string }) => {
      setIsSyncing(true);
      const existing = items.find((it) => it.id === item.id);
      const mergedRecord: MenuItemRecord = {
        id: item.id,
        outlet: item.outlet || existing?.outlet || "janpath",
        category_id: item.category_id || existing?.category_id || "general",
        category_title: item.category_title || existing?.category_title || "General",
        name: item.name || existing?.name || "",
        description: typeof item.description === "string" ? item.description : (existing?.description || ""),
        serving_details: typeof item.serving_details === "string" ? item.serving_details : (existing?.serving_details || ""),
        price: typeof item.price === "number" ? item.price : (existing?.price || 0),
        tags: item.tags || existing?.tags || [],
        is_available: item.is_available !== undefined ? item.is_available : (existing?.is_available !== false),
        order: typeof item.order === "number" ? item.order : (existing?.order || 1),
        image_url: item.image_url || existing?.image_url || "",
        updated_at: new Date().toISOString(),
      };

      const updatedList = items.map((it) => (it.id === item.id ? mergedRecord : it));
      setItems(updatedList);
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_MENU_KEY, JSON.stringify(updatedList));
      }

      // Sync to Supabase cloud
      const res = await saveMenuItem(mergedRecord);
      if (res.success) {
        setLastSyncTime(new Date());
      }
      setIsSyncing(false);
      return res;
    },
    [items]
  );

  // Add a new dish item (and sync to Supabase)
  const addItem = useCallback(
    async (item: Partial<MenuItemRecord> & { name: string; price: number; category_id: string; category_title: string }) => {
      setIsSyncing(true);
      const outlet = item.outlet || "janpath";
      const id =
        item.id ||
        `${outlet}-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
      const newRecord: MenuItemRecord = {
        id,
        outlet,
        category_id: item.category_id,
        category_title: item.category_title,
        name: item.name,
        price: item.price,
        description: item.description || "",
        serving_details: item.serving_details || "",
        tags: item.tags || [],
        is_available: item.is_available !== false,
        order: item.order || items.length + 1,
        image_url: item.image_url || "",
        updated_at: new Date().toISOString(),
      };

      const updatedList = [...items, newRecord];
      setItems(updatedList);
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_MENU_KEY, JSON.stringify(updatedList));
      }

      const res = await saveMenuItem(newRecord);
      if (res.success) {
        setLastSyncTime(new Date());
      }
      setIsSyncing(false);
      return res;
    },
    [items]
  );

  // Delete a dish item (and sync to Supabase)
  const deleteItem = useCallback(
    async (id: string) => {
      setIsSyncing(true);
      const updatedList = items.filter((it) => it.id !== id);
      setItems(updatedList);
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_MENU_KEY, JSON.stringify(updatedList));
      }

      const res = await supabaseDeleteMenuItem(id);
      if (res.success) {
        setLastSyncTime(new Date());
      }
      setIsSyncing(false);
      return res;
    },
    [items]
  );

  // Toggle availability (In stock / Sold out) & sync to Supabase
  const toggleAvailability = useCallback(
    async (id: string) => {
      const item = items.find((it) => it.id === id);
      if (!item) return false;

      const newStatus = !item.is_available;
      const updatedRecord: MenuItemRecord = {
        ...item,
        is_available: newStatus,
        updated_at: new Date().toISOString(),
      };

      const updatedList = items.map((it) => (it.id === id ? updatedRecord : it));
      setItems(updatedList);
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_MENU_KEY, JSON.stringify(updatedList));
      }

      setIsSyncing(true);
      const res = await saveMenuItem(updatedRecord);
      if (res.success) {
        setLastSyncTime(new Date());
      }
      setIsSyncing(false);
      return res.success;
    },
    [items]
  );

  // Seed / Sync all items into Supabase
  const seedAllToSupabase = useCallback(async () => {
    setIsSyncing(true);
    const listToSeed = items.length > 0 ? items : defaultRecords;
    const res = await bulkSaveMenuItems(listToSeed);
    if (res.success) {
      setLastSyncTime(new Date());
      await refreshItems();
    }
    setIsSyncing(false);
    return res;
  }, [items, defaultRecords, refreshItems]);

  // Reset to original hardcoded catalog
  const resetToDefaults = useCallback(() => {
    setItems(defaultRecords);
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_MENU_KEY);
    }
  }, [defaultRecords]);

  return (
    <MenuContext.Provider
      value={{
        items,
        isLoading,
        isSyncing,
        isSupabaseConnected,
        lastSyncTime,
        getCategoriesForOutlet,
        updateItem,
        addItem,
        deleteItem,
        toggleAvailability,
        seedAllToSupabase,
        refreshItems,
        resetToDefaults,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
}

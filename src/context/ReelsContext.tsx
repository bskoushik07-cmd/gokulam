"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { ReelItem, DEFAULT_REELS } from "@/lib/reels-registry";
import {
  fetchSiteReels,
  saveSiteReels,
  deleteSiteReel as deleteSupabaseReel,
} from "@/lib/supabase";

const LOCAL_STORAGE_REELS_KEY = "gokulam_reels_data";

interface ReelsContextType {
  reels: ReelItem[];
  isLoading: boolean;
  addReel: (reelData: Omit<ReelItem, "id" | "order">) => Promise<void>;
  updateReel: (id: string, updated: Partial<ReelItem>) => Promise<void>;
  deleteReel: (id: string) => Promise<void>;
  reorderReels: (newOrder: ReelItem[]) => Promise<void>;
  resetReels: () => Promise<void>;
  refreshReels: () => Promise<void>;
}

const ReelsContext = createContext<ReelsContextType | null>(null);

export function ReelsProvider({ children }: { children: ReactNode }) {
  const [reels, setReels] = useState<ReelItem[]>(DEFAULT_REELS);
  const [isLoading, setIsLoading] = useState(true);

  // Load from Supabase first, fallback to LocalStorage, fallback to DEFAULT_REELS
  const loadReels = useCallback(async () => {
    setIsLoading(true);

    // Check LocalStorage cache for immediate instant render
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_REELS_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setReels(parsed);
          }
        }
      } catch {
        // ignore
      }
    }

    try {
      const dbReels = await fetchSiteReels();
      if (dbReels && Array.isArray(dbReels) && dbReels.length > 0) {
        const formatted: ReelItem[] = dbReels.map((r) => ({
          id: r.id,
          title: r.title,
          caption: r.caption,
          thumbnail: r.thumbnail,
          videoUrl: r.video_url || undefined,
          instagramUrl: r.instagram_url,
          handle: r.handle || "@gokulam.official",
          likes: r.likes || "1.2k",
          order: r.order || 0,
        }));
        formatted.sort((a, b) => a.order - b.order);
        setReels(formatted);

        if (typeof window !== "undefined") {
          localStorage.setItem(LOCAL_STORAGE_REELS_KEY, JSON.stringify(formatted));
        }
      } else if (dbReels !== null && dbReels.length === 0) {
        await saveSiteReels(DEFAULT_REELS);
      }
    } catch (err) {
      console.warn("Could not sync reels from Supabase:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReels();
  }, [loadReels]);

  // Persist helper
  const persistReels = async (updatedList: ReelItem[]) => {
    setReels(updatedList);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_REELS_KEY, JSON.stringify(updatedList));
    }
    await saveSiteReels(updatedList);
  };

  const addReel = async (reelData: Omit<ReelItem, "id" | "order">) => {
    const newReel: ReelItem = {
      ...reelData,
      id: `reel-${Date.now()}`,
      order: reels.length + 1,
    };
    const updated = [...reels, newReel];
    await persistReels(updated);
  };

  const updateReel = async (id: string, updatedFields: Partial<ReelItem>) => {
    const updated = reels.map((item) =>
      item.id === id ? { ...item, ...updatedFields } : item
    );
    await persistReels(updated);
  };

  const deleteReel = async (id: string) => {
    const filtered = reels.filter((r) => r.id !== id);
    setReels(filtered);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_REELS_KEY, JSON.stringify(filtered));
    }
    try {
      await deleteSupabaseReel(id);
    } catch {
      // ignore
    }
  };

  const reorderReels = async (newOrder: ReelItem[]) => {
    const updated = newOrder.map((r, i) => ({ ...r, order: i + 1 }));
    await persistReels(updated);
  };

  const resetReels = async () => {
    await persistReels(DEFAULT_REELS);
  };

  return (
    <ReelsContext.Provider
      value={{
        reels,
        isLoading,
        addReel,
        updateReel,
        deleteReel,
        reorderReels,
        resetReels,
        refreshReels: loadReels,
      }}
    >
      {children}
    </ReelsContext.Provider>
  );
}

export function useReels() {
  const context = useContext(ReelsContext);
  if (!context) {
    return {
      reels: DEFAULT_REELS,
      isLoading: false,
      addReel: async () => {},
      updateReel: async () => {},
      deleteReel: async () => {},
      reorderReels: async () => {},
      resetReels: async () => {},
      refreshReels: async () => {},
    };
  }
  return context;
}

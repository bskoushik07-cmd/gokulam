"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { DEFAULT_IMAGE_MAP, IMAGE_REGISTRY } from "@/lib/image-registry";
import {
  fetchAllSiteImages,
  saveSiteImage,
  deleteSiteImage,
  getSupabase,
  getSupabaseCredentials,
} from "@/lib/supabase";

interface ImageContextType {
  images: Record<string, string>;
  getImage: (key: string, fallbackUrl?: string) => string;
  updateImage: (
    key: string,
    newUrl: string
  ) => Promise<{ success: boolean; error?: string }>;
  resetImage: (key: string) => Promise<{ success: boolean; error?: string }>;
  bulkUpdateImages: (updates: Record<string, string>) => Promise<void>;
  isSupabaseConnected: boolean;
  isLoading: boolean;
  refreshImages: () => Promise<void>;
}

const LOCAL_STORAGE_IMAGE_CACHE = "gokulam_image_overrides_v1";

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export function ImageProvider({ children }: { children: React.ReactNode }) {
  const [images, setImages] = useState<Record<string, string>>(() => {
    return { ...DEFAULT_IMAGE_MAP };
  });
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sync with localStorage & Supabase
  const refreshImages = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Load local cache first for instant response
      let localOverrides: Record<string, string> = {};
      if (typeof window !== "undefined") {
        try {
          const cached = localStorage.getItem(LOCAL_STORAGE_IMAGE_CACHE);
          if (cached) {
            localOverrides = JSON.parse(cached);
          }
        } catch {}
      }

      // Merge defaults with local cache
      const initialMap = { ...DEFAULT_IMAGE_MAP, ...localOverrides };
      setImages(initialMap);

      // 2. Check Supabase connection and fetch latest from DB
      const creds = getSupabaseCredentials();
      if (creds && creds.url && creds.anonKey) {
        const supabase = getSupabase();
        if (supabase) {
          const dbImages = await fetchAllSiteImages();
          if (Object.keys(dbImages).length > 0) {
            const merged = { ...initialMap, ...dbImages };
            setImages(merged);
            if (typeof window !== "undefined") {
              localStorage.setItem(
                LOCAL_STORAGE_IMAGE_CACHE,
                JSON.stringify({ ...localOverrides, ...dbImages })
              );
            }
          }
          setIsSupabaseConnected(true);
        } else {
          setIsSupabaseConnected(false);
        }
      } else {
        setIsSupabaseConnected(false);
      }
    } catch (err) {
      console.warn("Failed to load image overrides:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshImages();

    // Setup Supabase real-time listener if available
    const supabase = getSupabase();
    if (!supabase) return;

    try {
      const channel = supabase
        .channel("site_images_changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "site_images" },
          (payload) => {
            if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
              const newRecord = payload.new as { key: string; url: string };
              if (newRecord.key && newRecord.url) {
                setImages((prev) => {
                  const updated = { ...prev, [newRecord.key]: newRecord.url };
                  if (typeof window !== "undefined") {
                    localStorage.setItem(
                      LOCAL_STORAGE_IMAGE_CACHE,
                      JSON.stringify(updated)
                    );
                  }
                  return updated;
                });
              }
            } else if (payload.eventType === "DELETE") {
              const oldRecord = payload.old as { key: string };
              if (oldRecord.key) {
                const defaultVal = DEFAULT_IMAGE_MAP[oldRecord.key] || "";
                setImages((prev) => {
                  const updated = { ...prev, [oldRecord.key]: defaultVal };
                  if (typeof window !== "undefined") {
                    localStorage.setItem(
                      LOCAL_STORAGE_IMAGE_CACHE,
                      JSON.stringify(updated)
                    );
                  }
                  return updated;
                });
              }
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {
      // Supabase realtime channel error fallback
    }
  }, [refreshImages]);

  const getImage = useCallback(
    (key: string, fallbackUrl?: string): string => {
      if (images[key]) {
        return images[key];
      }
      if (DEFAULT_IMAGE_MAP[key]) {
        return DEFAULT_IMAGE_MAP[key];
      }
      return fallbackUrl || "/images/hero-dosa.webp";
    },
    [images]
  );

  const updateImage = async (
    key: string,
    newUrl: string
  ): Promise<{ success: boolean; error?: string }> => {
    // Update local state and localStorage immediately
    const updated = { ...images, [key]: newUrl };
    setImages(updated);
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_IMAGE_CACHE);
        const existing = cached ? JSON.parse(cached) : {};
        localStorage.setItem(
          LOCAL_STORAGE_IMAGE_CACHE,
          JSON.stringify({ ...existing, [key]: newUrl })
        );
      } catch {}
    }

    // Persist to Supabase if connected
    const creds = getSupabaseCredentials();
    if (creds && creds.url && creds.anonKey) {
      const res = await saveSiteImage(key, newUrl);
      if (!res.success) {
        return res;
      }
    }

    return { success: true };
  };

  const resetImage = async (
    key: string
  ): Promise<{ success: boolean; error?: string }> => {
    const defaultUrl = DEFAULT_IMAGE_MAP[key] || "";
    setImages((prev) => ({ ...prev, [key]: defaultUrl }));

    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_IMAGE_CACHE);
        if (cached) {
          const existing = JSON.parse(cached);
          delete existing[key];
          localStorage.setItem(
            LOCAL_STORAGE_IMAGE_CACHE,
            JSON.stringify(existing)
          );
        }
      } catch {}
    }

    const creds = getSupabaseCredentials();
    if (creds && creds.url && creds.anonKey) {
      const res = await deleteSiteImage(key);
      if (!res.success) {
        return res;
      }
    }

    return { success: true };
  };

  const bulkUpdateImages = async (updates: Record<string, string>) => {
    setImages((prev) => ({ ...prev, ...updates }));
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_IMAGE_CACHE);
        const existing = cached ? JSON.parse(cached) : {};
        localStorage.setItem(
          LOCAL_STORAGE_IMAGE_CACHE,
          JSON.stringify({ ...existing, ...updates })
        );
      } catch {}
    }

    const creds = getSupabaseCredentials();
    if (creds && creds.url && creds.anonKey) {
      for (const [key, url] of Object.entries(updates)) {
        await saveSiteImage(key, url);
      }
    }
  };

  return (
    <ImageContext.Provider
      value={{
        images,
        getImage,
        updateImage,
        resetImage,
        bulkUpdateImages,
        isSupabaseConnected,
        isLoading,
        refreshImages,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
}

export function useSiteImages() {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error("useSiteImages must be used within an ImageProvider");
  }
  return context;
}

export function useSiteImage(key: string, defaultUrl?: string): string {
  const context = useContext(ImageContext);
  if (!context) {
    return DEFAULT_IMAGE_MAP[key] || defaultUrl || "/images/hero-dosa.webp";
  }
  return context.getImage(key, defaultUrl);
}

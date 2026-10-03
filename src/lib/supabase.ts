import { createClient, SupabaseClient } from "@supabase/supabase-js";

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

const LOCAL_STORAGE_SUPABASE_KEY = "gokulam_supabase_config";
const STORAGE_BUCKET_NAME = "gokulam-media";

const DEFAULT_SUPABASE_URL = "https://gezalmnbkbbinrisjhqg.supabase.co";
const DEFAULT_SUPABASE_KEY = "sb_publishable_JcFXCtbgO5m_HM9_Wq4iOA_U_65dx69";

/**
 * Retrieves configured Supabase credentials from env or local storage or defaults
 */
export function getSupabaseCredentials(): SupabaseConfig | null {
  // Check env first
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const envKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    DEFAULT_SUPABASE_KEY;

  if (envUrl && envKey && !envUrl.includes("your-project-id")) {
    return { url: envUrl, anonKey: envKey };
  }

  // Check browser localStorage if available
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SUPABASE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.url && parsed.anonKey) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
  }

  return null;
}

/**
 * Saves Supabase credentials to localStorage
 */
export function saveSupabaseCredentials(config: SupabaseConfig) {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_SUPABASE_KEY, JSON.stringify(config));
    // Clear singleton client cache so it reinitializes
    cachedClient = null;
  }
}

/**
 * Clears saved Supabase credentials
 */
export function clearSupabaseCredentials() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(LOCAL_STORAGE_SUPABASE_KEY);
    cachedClient = null;
  }
}

let cachedClient: SupabaseClient | null = null;
let cachedConfigKey: string = "";

/**
 * Returns a configured Supabase client instance or null if not yet configured.
 */
export function getSupabase(): SupabaseClient | null {
  const creds = getSupabaseCredentials();
  if (!creds || !creds.url || !creds.anonKey) {
    return null;
  }

  const key = `${creds.url}:${creds.anonKey}`;
  if (cachedClient && cachedConfigKey === key) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(creds.url, creds.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    cachedConfigKey = key;
    return cachedClient;
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
    return null;
  }
}

/**
 * Test connection to Supabase database
 */
export async function testSupabaseConnection(
  url: string,
  anonKey: string
): Promise<{ success: boolean; message: string }> {
  try {
    const testClient = createClient(url, anonKey);
    // Attempt simple query to site_images or health
    const { error } = await testClient.from("site_images").select("key").limit(1);

    if (error) {
      // If error is table not found, connection succeeded but table needs creation
      if (error.code === "42P01" || error.message?.includes("does not exist") || error.message?.includes("not found")) {
        return {
          success: true,
          message: "Connected to Supabase! (Note: 'site_images' table needs to be created via SQL script)",
        };
      }
      return {
        success: false,
        message: `Supabase returned error: ${error.message}`,
      };
    }

    return {
      success: true,
      message: "Connected to Supabase database and verified 'site_images' table!",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Network or URL error connecting to Supabase.",
    };
  }
}

export interface SiteImageRecord {
  key: string;
  url: string;
  alt?: string;
  updated_at?: string;
}

/**
 * Fetch all image overrides from Supabase
 */
export async function fetchAllSiteImages(): Promise<Record<string, string>> {
  const supabase = getSupabase();
  if (!supabase) return {};

  try {
    const { data, error } = await supabase
      .from("site_images")
      .select("key, url");

    if (error) {
      console.warn("Supabase fetch images warning:", error.message);
      return {};
    }

    if (!data) return {};

    const map: Record<string, string> = {};
    for (const row of data) {
      if (row.key && row.url) {
        map[row.key] = row.url;
      }
    }
    return map;
  } catch (err) {
    console.warn("Error fetching site images from Supabase:", err);
    return {};
  }
}

/**
 * Save or update a single image override
 */
export async function saveSiteImage(
  key: string,
  url: string,
  alt?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) {
    return { success: false, error: "Supabase is not configured." };
  }

  try {
    const { error } = await supabase.from("site_images").upsert(
      {
        key,
        url,
        alt: alt || "",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save image." };
  }
}

/**
 * Reset/Delete an image override so it goes back to default
 */
export async function deleteSiteImage(
  key: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) {
    return { success: false, error: "Supabase is not configured." };
  }

  try {
    const { error } = await supabase.from("site_images").delete().eq("key", key);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to reset image." };
  }
}

/**
 * Upload an image file to Supabase Storage bucket
 */
export async function uploadImageToSupabase(
  file: File,
  customPath?: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) {
    return {
      success: false,
      error: "Supabase is not configured. Please enter your Supabase URL and Key in Settings.",
    };
  }

  try {
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const cleanFileName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .toLowerCase();
    const timestamp = Date.now();
    const path = customPath || `uploads/${cleanFileName}_${timestamp}.${fileExt}`;

    // Upload to bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET_NAME)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type || "image/jpeg",
      });

    if (uploadError) {
      // Check if bucket doesn't exist - try auto-creating bucket
      if (uploadError.message?.includes("Bucket not found") || uploadError.message?.includes("bucket")) {
        try {
          const { error: createErr } = await supabase.storage.createBucket(STORAGE_BUCKET_NAME, {
            public: true,
          });
          if (!createErr) {
            // Retry upload once
            const { data: retryData, error: retryError } = await supabase.storage
              .from(STORAGE_BUCKET_NAME)
              .upload(path, file, {
                cacheControl: "3600",
                upsert: true,
                contentType: file.type || "image/jpeg",
              });
            if (!retryError && retryData) {
              const { data: urlData } = supabase.storage
                .from(STORAGE_BUCKET_NAME)
                .getPublicUrl(retryData.path);
              if (urlData?.publicUrl) {
                return { success: true, url: urlData.publicUrl };
              }
            }
          }
        } catch {
          // ignore fallback failure and show message
        }

        return {
          success: false,
          error: `Storage bucket '${STORAGE_BUCKET_NAME}' needs to be created in Supabase. Please run the SQL setup script or create a public bucket named 'gokulam-media' in your Supabase Dashboard.`,
        };
      }
      return { success: false, error: uploadError.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET_NAME)
      .getPublicUrl(uploadData.path);

    if (!urlData?.publicUrl) {
      return { success: false, error: "Could not obtain public URL for uploaded file." };
    }

    return { success: true, url: urlData.publicUrl };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Network error during image upload.",
    };
  }
}

/**
 * List files in Supabase storage bucket for the Media Library
 */
export async function listSupabaseMedia(): Promise<{ name: string; url: string; created_at?: string | null }[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase.storage.from(STORAGE_BUCKET_NAME).list("uploads", {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });

    if (error || !data) return [];

    return data
      .filter((item) => item.name && !item.name.startsWith("."))
      .map((item) => {
        const { data: urlData } = supabase.storage
          .from(STORAGE_BUCKET_NAME)
          .getPublicUrl(`uploads/${item.name}`);
        return {
          name: item.name,
          url: urlData.publicUrl,
          created_at: item.created_at,
        };
      });
  } catch {
    return [];
  }
}

"use client";

import React from "react";
import Link from "next/link";
import {
  Database,
  ExternalLink,
  FolderOpen,
  LogOut,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Shield,
} from "lucide-react";
import { LogoPlate } from "@/components/Navbar";

interface AdminHeaderProps {
  isSupabaseConnected: boolean;
  overriddenCount: number;
  totalCount: number;
  onOpenSettings: () => void;
  onOpenMediaLibrary: () => void;
  onLogout: () => void;
}

export default function AdminHeader({
  isSupabaseConnected,
  overriddenCount,
  totalCount,
  onOpenSettings,
  onOpenMediaLibrary,
  onLogout,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-sand/70 bg-cream/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[96rem] items-center justify-between px-4 py-3.5 sm:px-8">
        {/* Brand & Title */}
        <div className="flex items-center gap-4">
          <Link href="/" target="_blank" title="View live site">
            <LogoPlate tone="dark" className="h-9 w-auto" />
          </Link>
          <div className="hidden h-6 w-px bg-sand sm:block" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-base font-bold text-ink sm:text-lg">
                Visual Content CMS
              </span>
              <span className="rounded-full bg-forest/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-forest">
                Admin
              </span>
            </div>
            <p className="hidden text-[11px] text-ink-soft sm:block">
              {overriddenCount} custom / {totalCount} total visual assets
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Media Library Button */}
          <button
            type="button"
            onClick={onOpenMediaLibrary}
            className="inline-flex items-center gap-1.5 rounded-full border border-sand bg-parchment px-3.5 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-copper hover:text-copper-deep shadow-sm"
          >
            <FolderOpen className="h-3.5 w-3.5 text-copper-deep" />
            <span className="hidden sm:inline">Media Library</span>
          </button>

          {/* Live Site Link */}
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-full bg-forest px-4 py-1.5 text-xs font-semibold text-cream shadow transition-colors hover:bg-forest-deep"
          >
            <span className="hidden sm:inline">Live Site</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          {/* Logout button */}
          <button
            type="button"
            onClick={onLogout}
            className="rounded-full p-2 text-ink-soft transition-colors hover:bg-rose-50 hover:text-rose-700"
            title="Lock session"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

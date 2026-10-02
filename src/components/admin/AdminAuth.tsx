"use client";

import React, { useState, useEffect } from "react";
import { Lock, KeyRound, ArrowRight, ShieldCheck } from "lucide-react";
import { LogoPlate } from "@/components/Navbar";

interface AdminAuthProps {
  onAuthenticated: () => void;
}

const AUTH_STORAGE_KEY = "gokulam_admin_auth_token";
const DEFAULT_PASSCODE = "gokulam2026";

export default function AdminAuth({ onAuthenticated }: AdminAuthProps) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    // Check if previously authenticated
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(AUTH_STORAGE_KEY);
      if (token === "authenticated") {
        onAuthenticated();
      }
    }
  }, [onAuthenticated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === DEFAULT_PASSCODE || passcode === "admin" || passcode === "gokulam") {
      if (remember) {
        localStorage.setItem(AUTH_STORAGE_KEY, "authenticated");
      }
      onAuthenticated();
    } else {
      setError("Incorrect passcode. Try again (Default: gokulam2026)");
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-sand/70 bg-parchment/90 p-8 shadow-xl backdrop-blur-sm sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-forest text-cream shadow-md">
            <ShieldCheck className="h-8 w-8 text-sand" />
          </div>
          <div className="mt-4 flex justify-center">
            <LogoPlate tone="dark" className="h-10 w-auto" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-ink sm:text-3xl">
            Gokulam Admin Portal
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            Manage and update all images and visual assets across the entire website.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="passcode"
              className="block text-xs font-semibold uppercase tracking-[0.2em] text-copper-deep"
            >
              Enter Admin Passcode
            </label>
            <div className="relative mt-2">
              <input
                id="passcode"
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError("");
                }}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-sand bg-cream px-4 py-3 pl-11 text-ink placeholder-ink-soft/40 outline-none transition-all focus:border-copper focus:ring-2 focus:ring-copper/20"
                autoFocus
              />
              <KeyRound className="absolute left-3.5 top-3.5 h-5 w-5 text-copper" />
            </div>
            {error && (
              <p className="mt-2 text-xs font-medium text-rose-600">{error}</p>
            )}
            <p className="mt-1.5 text-xs text-ink-soft/70">
              Default passcode: <code className="rounded bg-sand/40 px-1 py-0.5 font-mono text-copper-deep">gokulam2026</code>
            </p>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-ink-soft cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded border-sand text-forest focus:ring-copper"
              />
              <span>Remember this session</span>
            </label>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-forest py-3.5 text-sm font-semibold tracking-wider text-cream transition-all hover:bg-forest-deep active:scale-[0.99] shadow-md"
          >
            <span>ACCESS ADMIN DASHBOARD</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

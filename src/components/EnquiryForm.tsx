"use client";

import { useState } from "react";

/**
 * Simple enquiry form. Front-end only for now — on submit it opens the
 * visitor's mail client with a pre-filled enquiry (no backend needed yet).
 * Swap the handler for an API route / form service when the client is ready.
 */
export default function EnquiryForm() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const topic = String(data.get("topic") ?? "General enquiry");
    const message = String(data.get("message") ?? "");
    const subject = encodeURIComponent(`Gokulam enquiry — ${topic} (from ${name})`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:hello@gokulam.in?subject=${subject}&body=${body}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-2xl bg-parchment p-8 text-center">
        <p className="font-display text-2xl font-semibold text-ink">
          Thank you!
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          Your mail client should have opened with the enquiry ready to send.
          We&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-xl border border-sand bg-cream px-4 py-3 text-sm text-ink placeholder:text-ink-soft/70 focus:border-copper focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Name</span>
          <input name="name" required placeholder="Your name" className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Email</span>
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className={inputCls}
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">Topic</span>
        <select name="topic" className={inputCls} defaultValue="General enquiry">
          {[
            "General enquiry",
            "Celebrations & bulk orders",
            "Feedback",
            "Franchise / partnership",
            "Careers",
          ].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">Message</span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Tell us how we can help…"
          className={inputCls}
        />
      </label>
      <button
        type="submit"
        className="rounded-full bg-forest px-8 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-forest-deep"
      >
        Send Enquiry
      </button>
    </form>
  );
}

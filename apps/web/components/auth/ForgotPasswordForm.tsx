"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email })
    });
    setLoading(false);
    if (!response.ok) {
      setError("Unable to send reset link. Try again in a few minutes.");
      return;
    }
    setSentTo(email);
  }

  if (sentTo) {
    return (
      <div className="mt-5 grid gap-4">
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          Check your email. We sent a reset link to {sentTo}.
        </div>
        <Link href="/login" className="text-sm font-semibold text-primary hover:underline">Back to login</Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-5 grid gap-4">
      <label className="grid gap-2 text-sm font-medium">
        Email
        <input className="h-11 rounded-md border border-border bg-white px-3" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </label>
      {error ? <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
      <button type="submit" disabled={loading} className="h-11 rounded-md bg-primary font-semibold text-primary-foreground disabled:opacity-60">{loading ? "Sending" : "Send reset link"}</button>
      <Link href="/login" className="text-sm font-semibold text-primary hover:underline">Back to login</Link>
    </form>
  );
}

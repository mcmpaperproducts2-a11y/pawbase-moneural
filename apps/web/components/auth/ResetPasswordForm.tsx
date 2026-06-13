"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function validPassword(value: string) {
  return value.length >= 8 && /[A-Z]/.test(value) && /[0-9]/.test(value) && /[^A-Za-z0-9]/.test(value);
}

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!token) {
      setError("Reset token is missing.");
      return;
    }
    if (!validPassword(password)) {
      setError("Use 8+ chars with uppercase, number, and special character.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const response = await fetch("/api/auth/reset-password", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token, password })
    });
    setLoading(false);
    if (!response.ok) {
      setError("Invalid or expired reset link.");
      return;
    }
    setMessage("Password updated. Redirecting to login...");
    window.setTimeout(() => router.push("/login"), 2000);
  }

  return (
    <form onSubmit={submit} className="mt-5 grid gap-4">
      <label className="grid gap-2 text-sm font-medium">
        New password
        <input className="h-11 rounded-md border border-border bg-white px-3" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Confirm password
        <input className="h-11 rounded-md border border-border bg-white px-3" type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} required />
      </label>
      {error ? <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
      {message ? <div className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</div> : null}
      <button type="submit" disabled={loading} className="h-11 rounded-md bg-primary font-semibold text-primary-foreground disabled:opacity-60">{loading ? "Updating" : "Update password"}</button>
    </form>
  );
}

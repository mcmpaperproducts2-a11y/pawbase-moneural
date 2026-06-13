"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export function useAuth() {
  const { user, clearUser } = useAuthStore();
  const router = useRouter();

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    clearUser();
    router.push("/login");
    router.refresh();
  }, [clearUser, router]);

  useEffect(() => {
    const interval = window.setInterval(async () => {
      const response = await fetch("/api/auth/refresh", { method: "POST" });
      if (!response.ok) {
        clearUser();
        router.push("/login");
      }
    }, 12 * 60 * 1000);

    return () => window.clearInterval(interval);
  }, [clearUser, router]);

  return { user, logout, isAuthenticated: Boolean(user) };
}

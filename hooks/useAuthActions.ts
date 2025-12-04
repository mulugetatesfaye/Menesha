"use client";

import { useAuthActions as useConvexAuthActions } from "@convex-dev/auth/react";

export function useSignIn() {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { signIn } = useConvexAuthActions();
    return (provider: "google") => void signIn(provider);
  } catch {
    return () => console.warn("Auth not initialized");
  }
}

export function useSignOut() {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { signOut } = useConvexAuthActions();
    return () => void signOut();
  } catch {
    return () => console.warn("Auth not initialized");
  }
}

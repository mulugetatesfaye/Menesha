"use client";

import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useRef, useCallback } from "react";
import { UserRole } from "@/types";

interface User {
  _id: string;
  email?: string;
  name?: string;
  image?: string;
  role?: UserRole;
  createdAt?: number;
}

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCreator: boolean;
  isUser: boolean;
  role: UserRole;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

export function useAuth(): UseAuthReturn {
  const { isLoading: isConvexLoading, isAuthenticated } = useConvexAuth();
  const initializeUser = useMutation(api.users.initializeUser);

  // Track initialization state per session
  const initStateRef = useRef<{
    initialized: boolean;
    initializing: boolean;
    lastAuthState: boolean;
  }>({
    initialized: false,
    initializing: false,
    lastAuthState: false,
  });

  useEffect(() => {
    const state = initStateRef.current;

    // Reset on logout
    if (!isAuthenticated && state.lastAuthState) {
      state.initialized = false;
      state.initializing = false;
    }
    state.lastAuthState = isAuthenticated;

    // Initialize on login
    if (isAuthenticated && !state.initialized && !state.initializing) {
      state.initializing = true;
      initializeUser()
        .then(() => {
          state.initialized = true;
        })
        .catch((error) => {
          console.error("Failed to initialize user:", error);
          state.initialized = false;
        })
        .finally(() => {
          state.initializing = false;
        });
    }
  }, [isAuthenticated, initializeUser]);

  const user = useQuery(
    api.users.getCurrentUser,
    isAuthenticated ? {} : "skip"
  );

  // Compute loading state more accurately
  const isLoading = isConvexLoading || (isAuthenticated && user === undefined);

  // User is only authenticated if we have both auth AND user data
  const isFullyAuthenticated = isAuthenticated && user != null;

  const role: UserRole = user?.role ?? "user";

  // Utility function to check roles
  const hasRole = useCallback(
    (roles: UserRole | UserRole[]): boolean => {
      if (!isFullyAuthenticated) return false;
      if (role === "admin") return true; // Admin has all roles
      const roleArray = Array.isArray(roles) ? roles : [roles];
      return roleArray.includes(role);
    },
    [isFullyAuthenticated, role]
  );

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: isFullyAuthenticated,
    isAdmin: role === "admin",
    isCreator: role === "creator" || role === "admin",
    isUser: role === "user",
    role,
    hasRole,
  };
}

// Lightweight hook for just checking auth status
export function useAuthStatus() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  return { isLoading, isAuthenticated };
}

"use client";

import { createContext, useContext, ReactNode, useCallback } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

// Make provider type extensible
type AuthProvider = "google" | "github" | "apple"; // Add as needed

interface AuthActionsContextType {
  signIn: (provider: AuthProvider) => Promise<void>;
  signOut: () => Promise<void>;
  isReady: boolean;
}

const AuthActionsContext = createContext<AuthActionsContextType | null>(null);

export function AuthActionsProvider({ children }: { children: ReactNode }) {
  const { signIn, signOut } = useAuthActions();

  const handleSignIn = useCallback(
    async (provider: AuthProvider) => {
      try {
        await signIn(provider);
      } catch (error) {
        console.error(`Sign in with ${provider} failed:`, error);
        throw error; // Re-throw so caller can handle
      }
    },
    [signIn]
  );

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
      throw error;
    }
  }, [signOut]);

  return (
    <AuthActionsContext.Provider
      value={{
        signIn: handleSignIn,
        signOut: handleSignOut,
        isReady: true,
      }}
    >
      {children}
    </AuthActionsContext.Provider>
  );
}

// Strict version - throws if used outside provider (recommended for catching bugs)
export function useAuthActionsContext() {
  const context = useContext(AuthActionsContext);
  if (!context) {
    throw new Error(
      "useAuthActionsContext must be used within AuthActionsProvider"
    );
  }
  return context;
}

// Safe version - for optional auth contexts
export function useAuthActionsContextSafe() {
  const context = useContext(AuthActionsContext);
  return (
    context ?? {
      signIn: async () => {
        console.warn("Auth not ready");
      },
      signOut: async () => {
        console.warn("Auth not ready");
      },
      isReady: false,
    }
  );
}

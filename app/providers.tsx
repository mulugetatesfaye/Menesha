"use client";

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";
import { ErrorBoundary } from "@/components/error-boundary";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>
    </ErrorBoundary>
  );
}

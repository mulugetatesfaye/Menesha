"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useCallback } from "react";
import { UserRole } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Lock, Loader2 } from "lucide-react";

type AuthStatus = "loading" | "unauthenticated" | "unauthorized" | "authorized";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
  redirectTo?: string;
  fallback?: React.ReactNode;
  unauthorizedFallback?: React.ReactNode;
  showUnauthorizedUI?: boolean; // Whether to show UI or just redirect
}

export function AuthGuard({
  children,
  requiredRole,
  redirectTo,
  fallback,
  unauthorizedFallback,
  showUnauthorizedUI = true,
}: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const authStatus = useMemo((): AuthStatus => {
    if (isLoading) return "loading";
    if (!isAuthenticated || !user) return "unauthenticated";
    if (!requiredRole) return "authorized";

    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const userRole = user.role ?? "user";

    // Admin bypass
    if (userRole === "admin") return "authorized";

    return roles.includes(userRole as UserRole) ? "authorized" : "unauthorized";
  }, [isLoading, isAuthenticated, user, requiredRole]);

  // Memoize redirect URLs
  const signInUrl = useMemo(
    () => `/sign-in?redirect=${encodeURIComponent(pathname)}`,
    [pathname]
  );

  const unauthorizedUrl = useMemo(
    () => redirectTo ?? "/unauthorized",
    [redirectTo]
  );

  // Handle navigation
  const handleGoHome = useCallback(() => {
    router.push("/");
  }, [router]);

  // Handle redirects
  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.replace(signInUrl);
    } else if (authStatus === "unauthorized" && !showUnauthorizedUI) {
      router.replace(unauthorizedUrl);
    }
  }, [authStatus, router, signInUrl, unauthorizedUrl, showUnauthorizedUI]);

  // Early return for authorized - most common case
  if (authStatus === "authorized") {
    return <>{children}</>;
  }

  // Render fallbacks for other states
  switch (authStatus) {
    case "loading":
      return <>{fallback ?? <LoadingState />}</>;

    case "unauthenticated":
      return <UnauthenticatedState />;

    case "unauthorized":
      return (
        <>
          {unauthorizedFallback ?? (
            <UnauthorizedState onGoHome={handleGoHome} />
          )}
        </>
      );

    default:
      // TypeScript exhaustiveness check
      const _exhaustive: never = authStatus;
      return null;
  }
}

// Role-specific guard shortcuts
export function AdminGuard({
  children,
  ...props
}: Omit<AuthGuardProps, "requiredRole">) {
  return (
    <AuthGuard requiredRole="admin" {...props}>
      {children}
    </AuthGuard>
  );
}

export function CreatorGuard({
  children,
  ...props
}: Omit<AuthGuardProps, "requiredRole">) {
  return (
    <AuthGuard requiredRole={["creator", "admin"]} {...props}>
      {children}
    </AuthGuard>
  );
}

// Extracted Components
function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-muted/50 to-muted">
      <Card className="w-full max-w-md mx-4 border-none shadow-lg">
        <CardContent className="pt-8 pb-8">
          <div className="text-center space-y-4">
            <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Authenticating</h3>
              <p className="text-sm text-muted-foreground">
                Please wait while we verify your access...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function UnauthenticatedState() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-muted/50 to-muted">
      <Card className="w-full max-w-md mx-4 border-none shadow-lg">
        <CardContent className="pt-8 pb-8">
          <div className="text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Authentication Required</h3>
              <p className="text-sm text-muted-foreground">
                Redirecting to sign in...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function UnauthorizedState({ onGoHome }: { onGoHome: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-muted/50 to-muted">
      <Card className="w-full max-w-md mx-4 border-none shadow-lg">
        <CardContent className="pt-8 pb-8">
          <div className="text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Access Denied</h3>
              <p className="text-sm text-muted-foreground">
                You don&apos;t have permission to access this page.
              </p>
            </div>
            <Button onClick={onGoHome} className="mt-4">
              Go to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

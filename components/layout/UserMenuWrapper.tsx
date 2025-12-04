"use client";

import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { UserMenu } from "../auth/UserMenu";

export function UserMenuWrapper() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  return <UserMenu />;
}

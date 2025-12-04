"use client";

import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import {
  Rocket,
  LogOut,
  User as UserIcon,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { ModeToggle } from "../mode-toggle";
import { useAuth } from "@/hooks/useAuth";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Amharic Translations
const t = {
  brandName: "መነሻ",
  exploreCampaigns: "ፕሮጀክቶችን ያስሱ",
  howItWorks: "እንዴት እንደሚሰራ",
  signIn: "ግባ",
  signUp: "ይመዝገቡ",
  dashboard: "ዳሽቦርድ",
  myCampaigns: "የኔ ፕሮጀክቶች",
  adminPanel: "አስተዳዳሪ ፓነል",
  profile: "መገለጫ",
  signOut: "ውጣ",
};

function HeaderAuth() {
  const { user, isAuthenticated, isLoading, isAdmin, isCreator } = useAuth();
  const { signOut } = useAuthActions();

  const handleSignOut = () => {
    void signOut();
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/sign-in">{t.signIn}</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/sign-up">{t.signUp}</Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full">
          <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity">
            <AvatarImage src={user.image} alt={user.name || "User"} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            {user.role && (
              <Badge variant="secondary" className="w-fit mt-1 text-[10px]">
                {user.role}
              </Badge>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="cursor-pointer">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            {t.dashboard}
          </Link>
        </DropdownMenuItem>

        {(isCreator || isAdmin) && (
          <DropdownMenuItem asChild>
            <Link href="/dashboard/campaigns" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              {t.myCampaigns}
            </Link>
          </DropdownMenuItem>
        )}

        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4" />
              {t.adminPanel}
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile" className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            {t.profile}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t.signOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl transition-colors hover:text-primary"
          >
            <Rocket className="h-6 w-6 text-primary" />
            <span>{t.brandName}</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/campaigns"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t.exploreCampaigns}
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t.howItWorks}
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ModeToggle />
            <Suspense fallback={<Skeleton className="h-8 w-8 rounded-full" />}>
              <HeaderAuth />
            </Suspense>
          </div>
        </div>
      </div>
    </header>
  );
}

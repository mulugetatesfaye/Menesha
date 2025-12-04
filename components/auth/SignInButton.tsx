"use client";

import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";

interface SignInButtonProps {
  variant?: "default" | "outline" | "ghost";
  showIcon?: boolean;
}

export function SignInButton({
  variant = "default",
  showIcon = true,
}: SignInButtonProps) {
  return (
    <Button asChild variant={variant}>
      <Link href="/sign-in">
        {showIcon && <LogIn className="mr-2 h-4 w-4" />}
        Sign In
      </Link>
    </Button>
  );
}

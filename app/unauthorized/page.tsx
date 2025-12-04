import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ShieldX } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12">
        <div className="text-center space-y-6">
          <ShieldX className="h-16 w-16 text-destructive mx-auto" />
          <h1 className="text-4xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            You don&apos;t have permission to access this page. Please contact
            an administrator if you believe this is an error.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/">Go Home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

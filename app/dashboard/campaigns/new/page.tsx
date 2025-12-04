"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CreateCampaignForm } from "@/components/campaigns/CreateCampaignForm";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function CreateCampaignPage() {
  const { isCreator, isAdmin } = useAuth();

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Create New Campaign</h1>

            {!isCreator && !isAdmin ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You need to be approved as a creator to create campaigns.{" "}
                  <Link
                    href="/dashboard/become-creator"
                    className="underline font-medium"
                  >
                    Apply to become a creator
                  </Link>
                </AlertDescription>
              </Alert>
            ) : (
              <CreateCampaignForm />
            )}
          </div>
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}

"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { CreatorApplicationForm } from "@/components/creator/CreatorApplicationForm";
import { ApplicationStatus } from "@/components/creator/ApplicationStatus";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Rocket } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

function BecomeCreatorContent() {
  const { user, isLoading: authLoading, isCreator, isAdmin } = useAuth();
  const application = useQuery(
    api.creatorApplications.getMyApplication,
    user ? {} : "skip"
  );

  // Loading state
  if (authLoading || application === undefined) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-72 mb-8" />
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Already a creator
  if (isCreator || isAdmin) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <Alert className="mb-6 border-green-500/50 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>You&apos;re already a creator!</AlertTitle>
              <AlertDescription>
                You have creator access and can start creating campaigns.
              </AlertDescription>
            </Alert>
            <Button asChild>
              <Link href="/dashboard/campaigns/new">
                <Rocket className="mr-2 h-4 w-4" />
                Create a Campaign
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Has pending or approved application
  if (application?.status === "pending" || application?.status === "approved") {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <ApplicationStatus />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show application form
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Rejection Alert */}
          {application?.status === "rejected" && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Previous Application Rejected</AlertTitle>
              <AlertDescription>
                {application.rejectionReason ||
                  "Your previous application was not approved."}{" "}
                You can submit a new application below.
              </AlertDescription>
            </Alert>
          )}

          {/* Application Form */}
          <Card>
            <CardHeader>
              <CardTitle>Become a Creator</CardTitle>
              <CardDescription>
                Fill out the form below to apply for creator status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreatorApplicationForm />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function BecomeCreatorPage() {
  return (
    <AuthGuard>
      <BecomeCreatorContent />
    </AuthGuard>
  );
}

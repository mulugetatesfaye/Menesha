"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PaymentStatus } from "@/types";
import Link from "next/link";
import { ExternalLink, Heart } from "lucide-react";

const paymentStatusConfig: Record<
  PaymentStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  pending: { label: "Pending", variant: "outline" },
  processing: { label: "Processing", variant: "secondary" },
  completed: { label: "Completed", variant: "default" },
  failed: { label: "Failed", variant: "destructive" },
  refunded: { label: "Refunded", variant: "secondary" },
};

export default function DashboardPledgesPage() {
  const pledges = useQuery(api.pledges.getMyPledges);

  const totalPledged =
    pledges?.reduce((sum, p) => {
      if (p.paymentStatus === "completed") {
        return sum + p.amount;
      }
      return sum;
    }, 0) || 0;

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">My Pledges</h1>
              <p className="text-muted-foreground">
                Track the projects you&apos;ve supported
              </p>
            </div>

            {/* Summary Card */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Contribution Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Pledged
                    </p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(totalPledged, "USD")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Projects Supported
                    </p>
                    <p className="text-2xl font-bold">{pledges?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Active Pledges
                    </p>
                    <p className="text-2xl font-bold">
                      {pledges?.filter((p) => p.paymentStatus === "completed")
                        .length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pledges List */}
            {pledges === undefined ? (
              <div className="text-center py-12">Loading...</div>
            ) : pledges.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    You haven&apos;t backed any projects yet.
                  </p>
                  <Button asChild>
                    <Link href="/campaigns">Explore Campaigns</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pledges.map((pledge) => {
                  const status = paymentStatusConfig[pledge.paymentStatus];

                  return (
                    <Card key={pledge._id}>
                      <CardContent className="py-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">
                                {pledge.campaign?.title || "Campaign"}
                              </h3>
                              <Badge variant={status.variant}>
                                {status.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Pledged on {formatDate(pledge.createdAt)}
                            </p>
                            {pledge.message && (
                              <p className="text-sm italic mt-2">
                                &ldquo;{pledge.message}&rdquo;
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-2xl font-bold">
                                {formatCurrency(pledge.amount, pledge.currency)}
                              </p>
                              {pledge.isAnonymous && (
                                <p className="text-xs text-muted-foreground">
                                  Anonymous pledge
                                </p>
                              )}
                            </div>

                            {pledge.campaign && (
                              <Button asChild variant="outline" size="sm">
                                <Link
                                  href={`/campaigns/${pledge.campaign.slug}`}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}

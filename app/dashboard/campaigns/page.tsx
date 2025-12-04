"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Campaign } from "@/types";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { useState } from "react";
import {
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Send,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

const statusConfig: Record<
  Campaign["status"],
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  draft: { label: "Draft", variant: "secondary" },
  pending: { label: "Pending Review", variant: "outline" },
  approved: { label: "Approved", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
  active: { label: "Active", variant: "default" },
  successful: { label: "Successful", variant: "default" },
  failed: { label: "Failed", variant: "destructive" },
};

export default function DashboardCampaignsPage() {
  const campaigns = useQuery(api.campaigns.getMyCampaigns);
  const submitForReview = useMutation(api.campaigns.submitCampaignForReview);
  const deleteCampaign = useMutation(api.campaigns.deleteCampaign);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] =
    useState<Id<"campaigns"> | null>(null);

  const handleSubmitForReview = async (campaignId: Id<"campaigns">) => {
    try {
      await submitForReview({ campaignId });
      toast.success("Campaign submitted", {
        description: "Your campaign has been submitted for review.",
      });
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Failed to submit campaign",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedCampaignId) return;

    try {
      await deleteCampaign({ campaignId: selectedCampaignId });
      toast.success("Campaign deleted", {
        description: "Your campaign has been deleted.",
      });
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Failed to delete campaign",
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedCampaignId(null);
    }
  };

  const getStatusIcon = (status: Campaign["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "active":
      case "approved":
      case "successful":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
      case "failed":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <AuthGuard requiredRole="creator">
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold">My Campaigns</h1>
              <Button asChild>
                <Link href="/campaigns/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Campaign
                </Link>
              </Button>
            </div>

            {campaigns === undefined ? (
              <div className="text-center py-12">Loading...</div>
            ) : campaigns.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">
                    You haven&apos;t created any campaigns yet.
                  </p>
                  <Button asChild>
                    <Link href="/campaigns/new">
                      Create Your First Campaign
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {campaigns.map((campaign) => {
                  const percentageFunded =
                    (campaign.currentAmount / campaign.goalAmount) * 100;
                  const status = statusConfig[campaign.status];

                  return (
                    <Card key={campaign._id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="flex items-center gap-2">
                              {campaign.title}
                              <Badge variant={status.variant}>
                                {getStatusIcon(campaign.status)}
                                <span className="ml-1">{status.label}</span>
                              </Badge>
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {campaign.category} • Created{" "}
                              {formatDate(campaign.createdAt)}
                            </p>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/campaigns/${campaign.slug}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </Link>
                              </DropdownMenuItem>

                              {campaign.status === "draft" && (
                                <>
                                  <DropdownMenuItem asChild>
                                    <Link
                                      href={`/dashboard/campaigns/${campaign._id}/edit`}
                                    >
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleSubmitForReview(campaign._id)
                                    }
                                  >
                                    <Send className="mr-2 h-4 w-4" />
                                    Submit for Review
                                  </DropdownMenuItem>
                                </>
                              )}

                              {(campaign.status === "draft" ||
                                campaign.status === "rejected") && (
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => {
                                    setSelectedCampaignId(campaign._id);
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          {campaign.shortDescription}
                        </p>

                        {campaign.rejectionReason && (
                          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                            <p className="text-sm text-destructive">
                              <strong>Rejection reason:</strong>{" "}
                              {campaign.rejectionReason}
                            </p>
                          </div>
                        )}

                        <div className="space-y-2">
                          <Progress value={Math.min(percentageFunded, 100)} />
                          <div className="flex justify-between text-sm">
                            <span>
                              {formatCurrency(
                                campaign.currentAmount,
                                campaign.currency
                              )}{" "}
                              raised
                            </span>
                            <span className="text-muted-foreground">
                              of{" "}
                              {formatCurrency(
                                campaign.goalAmount,
                                campaign.currency
                              )}{" "}
                              goal
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                          <span>Ends: {formatDate(campaign.endDate)}</span>
                          <span>{Math.round(percentageFunded)}% funded</span>
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

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                campaign.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AuthGuard>
  );
}

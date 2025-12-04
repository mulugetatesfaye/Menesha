"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { CheckCircle2, XCircle, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import type { Doc } from "@/convex/_generated/dataModel";

// Use the actual type returned from the query
type CampaignWithCreator = Doc<"campaigns"> & {
  creator: Doc<"users"> | null;
};

interface CampaignReviewCardProps {
  campaign: CampaignWithCreator;
}

export function CampaignReviewCard({ campaign }: CampaignReviewCardProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const reviewCampaign = useMutation(api.campaigns.reviewCampaign);

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await reviewCampaign({
        campaignId: campaign._id,
        status: "approved",
      });
      toast.success("Campaign approved successfully!");
    } catch (error) {
      toast.error("Failed to approve campaign");
      console.error(error);
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setIsRejecting(true);
    try {
      await reviewCampaign({
        campaignId: campaign._id,
        status: "rejected",
        rejectionReason,
      });
      toast.success("Campaign rejected");
      setShowRejectForm(false);
      setRejectionReason("");
    } catch (error) {
      toast.error("Failed to reject campaign");
      console.error(error);
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2 mb-2">
              {campaign.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              by {campaign.creator?.name || "Anonymous"}
            </p>
          </div>
          <Badge variant="secondary" className="flex-shrink-0">
            {campaign.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Campaign Image */}
        {campaign.imageUrl && (
          <div className="relative aspect-video w-full bg-muted rounded-lg overflow-hidden">
            <Image
              src={campaign.imageUrl}
              alt={campaign.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Description */}
        <div>
          <p className="text-sm font-medium mb-1">Description</p>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {campaign.shortDescription}
          </p>
        </div>

        {/* Goal */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">Funding Goal</span>
          <span className="text-lg font-bold">
            {formatCurrency(campaign.goalAmount, campaign.currency)}
          </span>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Start Date</p>
            <p className="font-medium">{formatDate(campaign.startDate)}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">End Date</p>
            <p className="font-medium">{formatDate(campaign.endDate)}</p>
          </div>
        </div>

        {/* View Full Campaign */}
        <Button variant="outline" asChild className="w-full">
          <Link href={`/campaigns/${campaign.slug}`} target="_blank">
            View Full Campaign
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>

        {/* Actions */}
        {!showRejectForm ? (
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleApprove}
              disabled={isApproving}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isApproving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Approve
                </>
              )}
            </Button>
            <Button
              onClick={() => setShowRejectForm(true)}
              variant="destructive"
              className="flex-1"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            <Textarea
              placeholder="Reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleReject}
                disabled={isRejecting || !rejectionReason.trim()}
                variant="destructive"
                className="flex-1"
              >
                {isRejecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  "Confirm Rejection"
                )}
              </Button>
              <Button
                onClick={() => {
                  setShowRejectForm(false);
                  setRejectionReason("");
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

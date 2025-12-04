"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { CheckCircle2, XCircle, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import type { Doc } from "@/convex/_generated/dataModel";

// Use the actual type returned from the query
type ApplicationWithUser = Doc<"creatorApplications"> & {
  user: Doc<"users"> | null;
};

interface ApplicationReviewCardProps {
  application: ApplicationWithUser;
}

export function ApplicationReviewCard({
  application,
}: ApplicationReviewCardProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const reviewApplication = useMutation(
    api.creatorApplications.reviewApplication
  );

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await reviewApplication({
        applicationId: application._id,
        status: "approved",
      });
      toast.success("Application approved successfully!");
    } catch (error) {
      toast.error("Failed to approve application");
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
      await reviewApplication({
        applicationId: application._id,
        status: "rejected",
        rejectionReason,
      });
      toast.success("Application rejected");
      setShowRejectForm(false);
      setRejectionReason("");
    } catch (error) {
      toast.error("Failed to reject application");
      console.error(error);
    } finally {
      setIsRejecting(false);
    }
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

  return (
    <Card className="hover:shadow-lg transition-all">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src={application.user?.image} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-primary-foreground font-semibold">
                {getInitials(application.user?.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{application.fullName}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {application.user?.email}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="flex-shrink-0">
            {application.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Bio */}
        <div>
          <p className="text-sm font-medium mb-1">Bio</p>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {application.bio}
          </p>
        </div>

        {/* Website */}
        {application.website && (
          <div>
            <p className="text-sm font-medium mb-1">Website</p>
            <a
              href={application.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              {application.website}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}

        {/* Social Links */}
        {application.socialLinks && (
          <div>
            <p className="text-sm font-medium mb-2">Social Links</p>
            <div className="flex flex-wrap gap-2">
              {application.socialLinks.twitter && (
                <Badge variant="outline" className="gap-1">
                  Twitter
                </Badge>
              )}
              {application.socialLinks.linkedin && (
                <Badge variant="outline" className="gap-1">
                  LinkedIn
                </Badge>
              )}
              {application.socialLinks.github && (
                <Badge variant="outline" className="gap-1">
                  GitHub
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Submission Date */}
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Submitted {formatDate(application.createdAt)}
          </p>
        </div>

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

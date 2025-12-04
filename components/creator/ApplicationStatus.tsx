"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

export function ApplicationStatus() {
  const application = useQuery(api.creatorApplications.getMyApplication);

  if (application === undefined) {
    return <div>Loading...</div>;
  }

  if (!application) {
    return null;
  }

  const statusConfig = {
    pending: {
      icon: Clock,
      variant: "secondary" as const,
      title: "Application Under Review",
      description:
        "We're reviewing your application. This usually takes 1-3 business days.",
    },
    approved: {
      icon: CheckCircle,
      variant: "default" as const,
      title: "Application Approved!",
      description: "Congratulations! You can now create campaigns.",
    },
    rejected: {
      icon: XCircle,
      variant: "destructive" as const,
      title: "Application Rejected",
      description:
        application.rejectionReason || "Your application was not approved.",
    },
  };

  const config = statusConfig[application.status];
  const Icon = config.icon;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Creator Application</CardTitle>
          <Badge variant={config.variant}>{application.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Alert>
          <Icon className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold mb-1">{config.title}</p>
            <p className="text-sm">{config.description}</p>
          </AlertDescription>
        </Alert>

        <div className="mt-4 space-y-2 text-sm">
          <p>
            <span className="font-semibold">Submitted:</span>{" "}
            {formatDate(application.createdAt)}
          </p>
          {application.reviewedAt && (
            <p>
              <span className="font-semibold">Reviewed:</span>{" "}
              {formatDate(application.reviewedAt)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

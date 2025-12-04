"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import {
  Users,
  Target,
  Calendar,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CampaignStatsProps {
  campaignId: Id<"campaigns">;
  goalAmount: number;
  currency: string;
}

export function CampaignStats({
  campaignId,
  goalAmount,
  currency,
}: CampaignStatsProps) {
  const stats = useQuery(api.pledges.getCampaignStats, { campaignId });

  if (stats === undefined) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-4 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  const progressColor = stats.isFullyFunded
    ? "bg-green-500"
    : stats.percentageFunded > 50
      ? "bg-primary"
      : "bg-yellow-500";

  return (
    <Card className="overflow-hidden">
      {/* Funding Progress Header */}
      <div
        className={cn(
          "p-6 text-white",
          stats.isFullyFunded
            ? "bg-gradient-to-r from-green-500 to-green-600"
            : "bg-gradient-to-r from-primary to-purple-600"
        )}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium opacity-90">
            {stats.isFullyFunded ? "🎉 Fully Funded!" : "Funding Progress"}
          </span>
          <span className="text-2xl font-bold">
            {Math.round(stats.percentageFunded)}%
          </span>
        </div>
        <Progress
          value={Math.min(stats.percentageFunded, 100)}
          className="h-3 bg-white/20"
        />
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Amount Raised */}
        <div className="text-center pb-4 border-b">
          <p className="text-3xl font-bold">
            {formatCurrency(stats.totalAmount, currency)}
          </p>
          <p className="text-sm text-muted-foreground">
            raised of {formatCurrency(goalAmount, currency)} goal
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold">{stats.totalBackers}</p>
              <p className="text-xs text-muted-foreground">Backers</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/5">
            <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-xl font-bold">
                {stats.hasEnded ? "Ended" : stats.daysLeft}
              </p>
              <p className="text-xs text-muted-foreground">
                {stats.hasEnded ? "" : "Days Left"}
              </p>
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="space-y-2">
          {stats.isFullyFunded && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-500/10 p-3 rounded-lg">
              <CheckCircle2 className="h-4 w-4" />
              <span>This campaign has reached its funding goal!</span>
            </div>
          )}

          {stats.hasEnded && !stats.isFullyFunded && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-lg">
              <Calendar className="h-4 w-4" />
              <span>This campaign has ended</span>
            </div>
          )}

          {!stats.hasEnded && stats.daysLeft <= 3 && !stats.isFullyFunded && (
            <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 dark:bg-orange-500/10 p-3 rounded-lg">
              <TrendingUp className="h-4 w-4" />
              <span>Only {stats.daysLeft} days left to back this project!</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import Image from "next/image";
import { Target, Users, Clock } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// TRANSLATIONS (Amharic)
// ============================================================================
const t = {
  trending: "ታዋቂ",
  funded: "ተሟላ",
  of: "ከ",
  backers: "ደጋፊዎች",
  daysLeft: "ቀናት ቀሪ",
  ended: "ተጠናቅቋል",
  birr: "ብር",
};

// ============================================================================
// HELPERS
// ============================================================================
const formatBirr = (amount: number): string => {
  return `${amount.toLocaleString("en-US")} ${t.birr}`;
};

// ============================================================================
// TYPES
// ============================================================================
interface CampaignWithCreator {
  _id: Id<"campaigns">;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  goalAmount: number;
  currentAmount: number;
  currency: string;
  imageUrl?: string;
  startDate: number;
  endDate: number;
  status: string;
  creator: {
    _id: Id<"users">;
    name?: string;
    image?: string;
  } | null;
}

interface CampaignCardProps {
  campaign: CampaignWithCreator;
}

// ============================================================================
// COMPONENT
// ============================================================================
export function CampaignCard({ campaign }: CampaignCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);

  // Fetch real stats from the API
  const stats = useQuery(api.pledges.getCampaignStats, {
    campaignId: campaign._id,
  });

  // Calculate days left
  useEffect(() => {
    const calculateDaysLeft = () => {
      const now = Date.now();
      const timeLeft = campaign.endDate - now;
      setDaysLeft(Math.max(0, Math.ceil(timeLeft / (1000 * 60 * 60 * 24))));
    };

    calculateDaysLeft();
  }, [campaign.endDate]);

  // Use real stats or fallback to calculated values
  const percentageFunded = useMemo(() => {
    if (stats?.percentageFunded !== undefined) {
      return Math.round(stats.percentageFunded);
    }
    return Math.round((campaign.currentAmount / campaign.goalAmount) * 100);
  }, [stats, campaign.currentAmount, campaign.goalAmount]);

  const backersCount = stats?.totalBackers ?? 0;
  const totalAmount = stats?.totalAmount ?? campaign.currentAmount;
  const isFullyFunded = stats?.isFullyFunded ?? false;
  const hasEnded = stats?.hasEnded ?? false;

  return (
    // Changed from slug to _id
    <Link href={`/campaigns/${campaign._id}`}>
      <div
        className="group flex h-full flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Section */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
          {campaign.imageUrl ? (
            <Image
              src={campaign.imageUrl}
              alt={campaign.title}
              fill
              className={cn(
                "object-cover transition-transform duration-300",
                isHovered && "scale-105"
              )}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <Target className="h-10 w-10 text-muted-foreground/30" />
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Category Badge */}
          <Badge
            variant="secondary"
            className="absolute left-2.5 top-2.5 border-0 bg-background/90 text-xs font-medium backdrop-blur-sm"
          >
            {campaign.category}
          </Badge>

          {/* Status Badges */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
            {isFullyFunded && (
              <Badge className="border-0 bg-green-600 text-xs text-white hover:bg-green-600">
                {t.funded}
              </Badge>
            )}
            {!isFullyFunded && percentageFunded > 75 && (
              <Badge className="border-0 bg-orange-600 text-xs text-white hover:bg-orange-600">
                {t.trending}
              </Badge>
            )}
            {!isFullyFunded && percentageFunded <= 75 && <div />}

            {!hasEnded && daysLeft <= 7 && daysLeft > 0 && (
              <Badge variant="destructive" className="text-xs">
                {daysLeft} {t.daysLeft}
              </Badge>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col pt-4">
          {/* Title */}
          <h3 className="mb-1.5 line-clamp-2 text-lg font-bold leading-tight transition-colors group-hover:text-primary">
            {campaign.title}
          </h3>

          {/* Description */}
          <p className="mb-3 line-clamp-1 text-sm text-muted-foreground">
            {campaign.shortDescription}
          </p>

          {/* Progress Section */}
          <div className="mt-auto space-y-2">
            <Progress
              value={Math.min(percentageFunded, 100)}
              className="h-1.5"
            />

            {/* Amount */}
            <div className="flex items-center justify-between">
              <p className="text-sm">
                <span className="font-bold">{formatBirr(totalAmount)}</span>
                <span className="text-muted-foreground">
                  {" "}
                  {t.of} {formatBirr(campaign.goalAmount)}
                </span>
              </p>
              <span className="text-sm font-semibold text-primary">
                {percentageFunded}%
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span className="font-medium text-foreground">{backersCount}</span>
            <span>{t.backers}</span>
            <span className="mx-1.5">•</span>
            <Clock className="h-3 w-3" />
            {hasEnded ? (
              <span>{t.ended}</span>
            ) : (
              <>
                <span className="font-medium text-foreground">{daysLeft}</span>
                <span>{t.daysLeft}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

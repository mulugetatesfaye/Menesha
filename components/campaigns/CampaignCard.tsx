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

// Amharic Translations
const t = {
  trending: "ታዋቂ",
  funded: "ተሟላ",
  of: "ከ",
  backers: "ደጋፊዎች",
  daysLeft: "ቀናት ቀሪ",
  ended: "ተጠናቅቋል",
  birr: "ብር",
};

// Format currency in Ethiopian Birr
const formatBirr = (amount: number): string => {
  return `${amount.toLocaleString("en-US")} ${t.birr}`;
};

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

export function CampaignCard({ campaign }: CampaignCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Fetch real stats from the API
  const stats = useQuery(api.pledges.getCampaignStats, {
    campaignId: campaign._id,
  });

  // Calculate days left
  const [daysLeft, setDaysLeft] = useState(0);

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

  return (
    <Link href={`/campaigns/${campaign.slug}`}>
      <div
        className="group h-full flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Section */}
        <div className="relative aspect-[4/3] w-full bg-muted rounded-lg overflow-hidden">
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
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <Target className="h-10 w-10 text-muted-foreground/30" />
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Category Badge */}
          <Badge
            variant="secondary"
            className="absolute top-2.5 left-2.5 bg-background/90 backdrop-blur-sm text-xs font-medium border-0"
          >
            {campaign.category}
          </Badge>

          {/* Status Badges */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
            {stats?.isFullyFunded && (
              <Badge className="bg-green-600 hover:bg-green-600 text-white border-0 text-xs">
                {t.funded}
              </Badge>
            )}
            {!stats?.isFullyFunded && percentageFunded > 75 && (
              <Badge className="bg-orange-600 hover:bg-orange-600 text-white border-0 text-xs">
                {t.trending}
              </Badge>
            )}
            {!stats?.isFullyFunded && percentageFunded <= 75 && <div />}

            {!stats?.hasEnded && daysLeft <= 7 && (
              <Badge variant="destructive" className="text-xs">
                {daysLeft} {t.daysLeft}
              </Badge>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col pt-4">
          {/* Title */}
          <h3 className="font-bold text-lg line-clamp-2 mb-1.5 group-hover:text-primary transition-colors leading-tight">
            {campaign.title}
          </h3>

          {/* Description - 1 line */}
          <p className="text-sm text-muted-foreground line-clamp-1 mb-3">
            {campaign.shortDescription}
          </p>

          {/* Progress Section */}
          <div className="space-y-2 mt-auto">
            <Progress
              value={Math.min(percentageFunded, 100)}
              className="h-1.5"
            />

            {/* Amount - Single Line */}
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

          {/* Stats with dot separator */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-3">
            <Users className="h-3 w-3" />
            <span className="font-medium text-foreground">{backersCount}</span>
            <span>{t.backers}</span>
            <span className="mx-1.5">•</span>
            <Clock className="h-3 w-3" />
            {stats?.hasEnded ? (
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

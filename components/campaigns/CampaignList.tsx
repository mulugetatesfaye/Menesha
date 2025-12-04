"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CampaignCard } from "./CampaignCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { Search, RefreshCw } from "lucide-react";

// components/campaigns/CampaignList.tsx
interface CampaignListProps {
  category?: string;
  searchQuery?: string;
  sortBy?: "trending" | "newest" | "ending";
  viewMode?: "grid" | "list";
  emptyState?: React.ReactNode;
}

function CampaignCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-[4/3] w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-1.5 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export function CampaignList({
  category,
  searchQuery,
  sortBy = "trending",
}: CampaignListProps) {
  const campaigns = useQuery(api.campaigns.getActiveCampaigns, {
    category,
  });

  // Filter and sort campaigns
  const filteredCampaigns = useMemo(() => {
    if (!campaigns) return [];

    let result = [...campaigns];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (campaign) =>
          campaign.title.toLowerCase().includes(query) ||
          campaign.shortDescription.toLowerCase().includes(query) ||
          campaign.description.toLowerCase().includes(query) ||
          campaign.creator?.name?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "trending":
        result.sort((a, b) => {
          const aPercent = a.currentAmount / a.goalAmount;
          const bPercent = b.currentAmount / b.goalAmount;
          return bPercent - aPercent;
        });
        break;
      case "newest":
        result.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case "ending":
        result.sort((a, b) => a.endDate - b.endDate);
        break;
    }

    return result;
  }, [campaigns, searchQuery, sortBy]);

  // Loading state
  if (campaigns === undefined) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <CampaignCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (filteredCampaigns.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="h-20 w-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
          <Search className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No campaigns found</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {searchQuery
            ? `No campaigns match "${searchQuery}". Try a different search term.`
            : category
              ? `No active campaigns in the "${category}" category.`
              : "There are no active campaigns at the moment."}
        </p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium">{filteredCampaigns.length}</span>{" "}
          campaign{filteredCampaigns.length !== 1 ? "s" : ""}
          {category && (
            <span>
              {" "}
              in <span className="font-medium">{category}</span>
            </span>
          )}
        </p>
      </div>

      {/* Campaign Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10">
        {filteredCampaigns.map((campaign) => (
          <CampaignCard key={campaign._id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
}

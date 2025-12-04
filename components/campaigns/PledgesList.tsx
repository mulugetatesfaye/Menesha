"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "@/convex/_generated/dataModel";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { Award, Heart, MessageSquare, TrendingUp, Users } from "lucide-react";

interface PledgesListProps {
  campaignId: Id<"campaigns">;
  currency: string;
}

function PledgeSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PledgesList({ campaignId, currency }: PledgesListProps) {
  const pledges = useQuery(api.pledges.getCampaignPledges, { campaignId });

  const getInitials = (name?: string) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getTopBacker = () => {
    if (!pledges || pledges.length === 0) return null;
    return pledges.reduce((max, pledge) =>
      pledge.amount > max.amount ? pledge : max
    );
  };

  const topBacker = getTopBacker();
  const totalRaised =
    pledges?.reduce((sum, pledge) => sum + pledge.amount, 0) || 0;

  // Loading state
  if (pledges === undefined) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <PledgeSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Stats */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            Backers
          </h2>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <Users className="h-4 w-4 mr-2" />
            {pledges.length}
          </Badge>
        </div>

        {/* Stats Cards */}
        {pledges.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Raised
                    </p>
                    <p className="text-xl font-bold">
                      {formatCurrency(totalRaised, currency)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Backers
                    </p>
                    <p className="text-xl font-bold">{pledges.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-purple-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Pledge</p>
                    <p className="text-xl font-bold">
                      {formatCurrency(totalRaised / pledges.length, currency)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Backers List */}
      <div className="space-y-4">
        {pledges.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No backers yet</h3>
              <p className="text-muted-foreground max-w-sm">
                Be the first to support this amazing campaign!
              </p>
            </CardContent>
          </Card>
        ) : (
          pledges.map((pledge, index) => {
            const isTopBacker = topBacker && pledge._id === topBacker._id;
            const isRecent = index < 3;

            return (
              <Card
                key={pledge._id}
                className={
                  isTopBacker
                    ? "border-2 border-primary bg-gradient-to-r from-primary/5 to-transparent"
                    : ""
                }
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    {pledge.user && !pledge.isAnonymous ? (
                      <Avatar className="h-14 w-14 border-2 border-background shadow-md">
                        <AvatarImage src={pledge.user.image} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-primary-foreground font-semibold">
                          {getInitials(pledge.user.name)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="h-14 w-14 border-2 border-background shadow-md">
                        <AvatarFallback className="bg-muted">
                          <Users className="h-6 w-6 text-muted-foreground" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-lg">
                            {pledge.user && !pledge.isAnonymous
                              ? pledge.user.name
                              : "Anonymous Supporter"}
                          </p>
                          {isTopBacker && (
                            <Badge className="bg-primary text-xs gap-1">
                              <Award className="h-3 w-3" />
                              Top Backer
                            </Badge>
                          )}
                          {isRecent && !isTopBacker && (
                            <Badge variant="secondary" className="text-xs">
                              Recent
                            </Badge>
                          )}
                        </div>
                        <p className="font-bold text-xl text-primary whitespace-nowrap">
                          {formatCurrency(pledge.amount, currency)}
                        </p>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">
                        {formatRelativeTime(pledge.createdAt)}
                      </p>

                      {pledge.message && (
                        <Card className="bg-muted/50 border-0 mt-3">
                          <CardContent className="p-3">
                            <div className="flex gap-2">
                              <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <p className="text-sm italic text-foreground/90">
                                &ldquo;{pledge.message}&rdquo;
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

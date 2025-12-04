"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  Rocket,
  Heart,
  TrendingUp,
  DollarSign,
  Users,
  Settings,
  Plus,
  ArrowRight,
  Calendar,
  Target,
  Award,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { Campaign, Pledge } from "@/types/dashboard";

// Loading skeleton component
function DashboardSkeleton() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-96 lg:col-span-2" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Stat card component with proper types
interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color: string;
  bgColor: string;
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color,
  bgColor,
}: StatCardProps) {
  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold">{value}</p>
              {trend && (
                <Badge variant="secondary" className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {trend}
                </Badge>
              )}
            </div>
          </div>
          <div className={cn("p-3 rounded-xl", bgColor)}>
            <Icon className={cn("h-6 w-6", color)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Recent campaign card with proper types
interface RecentCampaignCardProps {
  campaign: Campaign;
}

function RecentCampaignCard({ campaign }: RecentCampaignCardProps) {
  const [daysLeft] = useState(() => {
    const now = Date.now();
    const timeLeft = campaign.endDate - now;
    return Math.max(0, Math.ceil(timeLeft / (1000 * 60 * 60 * 24)));
  });

  const percentageFunded = Math.round(
    (campaign.currentAmount / campaign.goalAmount) * 100
  );

  const getStatusColor = (status: Campaign["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "successful":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
      case "draft":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
    }
  };

  return (
    <Link href={`/campaigns/${campaign.slug}`}>
      <Card className="hover:shadow-md transition-all hover:border-primary/50 group cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {campaign.imageUrl ? (
              <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <img
                  src={campaign.imageUrl}
                  alt={campaign.title}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Target className="h-8 w-8 text-primary/60" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                  {campaign.title}
                </h4>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs flex-shrink-0",
                    getStatusColor(campaign.status)
                  )}
                >
                  {campaign.status}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  <span className="font-semibold text-foreground">
                    {formatCurrency(campaign.currentAmount, campaign.currency)}
                  </span>
                  <span className="text-xs">
                    of {formatCurrency(campaign.goalAmount, campaign.currency)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{daysLeft} days left</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-purple-600"
                    style={{ width: `${Math.min(percentageFunded, 100)}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-primary">
                  {percentageFunded}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Recent pledge card with proper types
interface RecentPledgeCardProps {
  pledge: Pledge;
}

function RecentPledgeCard({ pledge }: RecentPledgeCardProps) {
  const getStatusColor = (status: Pledge["paymentStatus"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "processing":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "failed":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      case "refunded":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  return (
    <Card className="hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Heart className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="font-semibold line-clamp-1">
                {formatCurrency(pledge.amount, pledge.currency)}
              </p>
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs flex-shrink-0",
                  getStatusColor(pledge.paymentStatus)
                )}
              >
                {pledge.paymentStatus}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1 mb-1">
              Campaign pledge
            </p>
            <p className="text-xs text-muted-foreground">
              {formatRelativeTime(pledge.createdAt)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main dashboard content
function DashboardContent() {
  const { user, isCreator, isAdmin } = useAuth();
  const myCampaigns = useQuery(api.campaigns.getMyCampaigns);
  const myPledges = useQuery(api.pledges.getMyPledges);

  // Loading state
  if (myCampaigns === undefined || myPledges === undefined) {
    return <DashboardSkeleton />;
  }

  // Calculate stats
  const activeCampaigns =
    myCampaigns?.filter((c) => c.status === "active").length || 0;
  const totalCampaigns = myCampaigns?.length || 0;
  const totalPledges = myPledges?.length || 0;
  const totalPledgedAmount =
    myPledges?.reduce((sum, p) => sum + p.amount, 0) || 0;
  const totalRaised =
    myCampaigns?.reduce((sum, c) => sum + c.currentAmount, 0) || 0;

  // Recent items
  const recentCampaigns = myCampaigns?.slice(0, 3) || [];
  const recentPledges = myPledges?.slice(0, 3) || [];

  const getInitials = (name?: string): string => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <div className="mb-8 md:mb-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary/20">
                  <AvatarImage src={user?.image} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-primary-foreground text-xl font-semibold">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-1">
                    Welcome back, {user?.name || "User"}!
                  </h1>
                  <p className="text-muted-foreground flex items-center gap-2">
                    {isAdmin ? (
                      <Badge className="bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20">
                        <Award className="h-3 w-3 mr-1" />
                        Admin
                      </Badge>
                    ) : isCreator ? (
                      <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Creator
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <Users className="h-3 w-3 mr-1" />
                        Backer
                      </Badge>
                    )}
                    <span className="text-sm">
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {(isCreator || isAdmin) && (
                  <Button asChild className="shadow-lg">
                    <Link href="/dashboard/campaigns/new">
                      <Plus className="mr-2 h-4 w-4" />
                      New Campaign
                    </Link>
                  </Button>
                )}
                <Button variant="outline" size="icon" asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {(isCreator || isAdmin) && (
              <>
                <StatCard
                  title="Active Campaigns"
                  value={activeCampaigns}
                  icon={Rocket}
                  color="text-purple-600"
                  bgColor="bg-purple-500/10"
                />
                <StatCard
                  title="Total Raised"
                  value={formatCurrency(totalRaised, "USD")}
                  icon={DollarSign}
                  trend="+12%"
                  color="text-green-600"
                  bgColor="bg-green-500/10"
                />
              </>
            )}
            <StatCard
              title="Campaigns Backed"
              value={totalPledges}
              icon={Heart}
              color="text-pink-600"
              bgColor="bg-pink-500/10"
            />
            <StatCard
              title="Total Pledged"
              value={formatCurrency(totalPledgedAmount, "USD")}
              icon={TrendingUp}
              color="text-blue-600"
              bgColor="bg-blue-500/10"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2 space-y-6">
              {/* My Campaigns Section */}
              {(isCreator || isAdmin) && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Rocket className="h-5 w-5 text-primary" />
                        My Campaigns
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {totalCampaigns} total campaign
                        {totalCampaigns !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/dashboard/campaigns">
                        View All
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentCampaigns.length > 0 ? (
                      recentCampaigns.map((campaign) => (
                        <RecentCampaignCard
                          key={campaign._id}
                          campaign={campaign}
                        />
                      ))
                    ) : (
                      <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                          <Rocket className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold mb-2">No campaigns yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Create your first campaign to get started
                        </p>
                        <Button asChild>
                          <Link href="/dashboard/campaigns/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Campaign
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Recent Pledges Section */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-primary" />
                      Recent Pledges
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {totalPledges} total pledge{totalPledges !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/pledges">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentPledges.length > 0 ? (
                    recentPledges.map((pledge) => (
                      <RecentPledgeCard key={pledge._id} pledge={pledge} />
                    ))
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                        <Heart className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold mb-2">No pledges yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Start supporting campaigns you believe in
                      </p>
                      <Button variant="outline" asChild>
                        <Link href="/campaigns">Explore Campaigns</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isCreator || isAdmin ? (
                    <>
                      <Button
                        asChild
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Link href="/dashboard/campaigns">
                          <Rocket className="mr-2 h-4 w-4" />
                          My Campaigns
                        </Link>
                      </Button>
                      <Button
                        asChild
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Link href="/dashboard/campaigns/new">
                          <Plus className="mr-2 h-4 w-4" />
                          Create Campaign
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
                      <CardContent className="p-4 text-center">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                          <Sparkles className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-2">Become a Creator</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Launch your own campaigns
                        </p>
                        <Button asChild className="w-full">
                          <Link href="/dashboard/become-creator">
                            Apply Now
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  <Button
                    asChild
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Link href="/dashboard/pledges">
                      <Heart className="mr-2 h-4 w-4" />
                      My Pledges
                    </Link>
                  </Button>

                  {isAdmin && (
                    <Button
                      asChild
                      className="w-full justify-start"
                      variant="secondary"
                    >
                      <Link href="/admin">
                        <Award className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Tips Card */}
              <Card className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    Pro Tip
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Campaigns with videos and detailed descriptions get 3x more
                    backers on average. Make your story compelling!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

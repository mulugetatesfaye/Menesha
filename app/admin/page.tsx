"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ApplicationReviewCard } from "@/components/admin/ApplicationReviewCard";
import { CampaignReviewCard } from "@/components/admin/CampaignReviewCard";
import {
  Users,
  Rocket,
  Clock,
  Shield,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Activity,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Loading skeleton
function AdminDashboardSkeleton() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Stat card component
interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  trend?: string;
  subtitle?: string;
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  trend,
  subtitle,
}: StatCardProps) {
  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold">{value}</p>
              {trend && (
                <Badge variant="secondary" className="text-xs">
                  {trend}
                </Badge>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={cn("p-3 rounded-xl", bgColor)}>
            <Icon className={cn("h-6 w-6", color)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Empty state component
interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="py-16">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
            <Icon className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main admin content
function AdminDashboardContent() {
  const pendingApplications = useQuery(
    api.creatorApplications.getPendingApplications
  );
  const pendingCampaigns = useQuery(api.campaigns.getPendingCampaigns);

  // Loading state
  if (pendingApplications === undefined || pendingCampaigns === undefined) {
    return <AdminDashboardSkeleton />;
  }

  const totalPending = pendingApplications.length + pendingCampaigns.length;
  const applicationsCount = pendingApplications.length;
  const campaignsCount = pendingCampaigns.length;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Manage applications and review campaigns
                </p>
              </div>
            </div>
            {totalPending > 0 && (
              <Badge className="bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20 mt-4">
                <AlertCircle className="h-3 w-3 mr-1" />
                {totalPending} item{totalPending !== 1 ? "s" : ""} require
                {totalPending === 1 ? "s" : ""} your attention
              </Badge>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <StatCard
              title="Pending Applications"
              value={applicationsCount}
              icon={Users}
              color="text-blue-600"
              bgColor="bg-blue-500/10"
              subtitle={
                applicationsCount === 0 ? "All caught up!" : "Needs review"
              }
            />
            <StatCard
              title="Pending Campaigns"
              value={campaignsCount}
              icon={Rocket}
              color="text-purple-600"
              bgColor="bg-purple-500/10"
              subtitle={
                campaignsCount === 0 ? "All caught up!" : "Needs review"
              }
            />
            <StatCard
              title="Total Pending"
              value={totalPending}
              icon={Clock}
              color="text-orange-600"
              bgColor="bg-orange-500/10"
              trend={totalPending > 0 ? "Action required" : "None"}
            />
            <StatCard
              title="System Status"
              value={100}
              icon={Activity}
              color="text-green-600"
              bgColor="bg-green-500/10"
              subtitle="All systems operational"
            />
          </div>

          {/* Review Tabs */}
          <Tabs defaultValue="applications" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid h-auto p-1 bg-muted/50">
              <TabsTrigger
                value="applications"
                className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-6 py-3"
              >
                <Users className="h-4 w-4" />
                <span>Creator Applications</span>
                {applicationsCount > 0 && (
                  <Badge className="ml-2 bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20">
                    {applicationsCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="campaigns"
                className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-6 py-3"
              >
                <Rocket className="h-4 w-4" />
                <span>Campaign Reviews</span>
                {campaignsCount > 0 && (
                  <Badge className="ml-2 bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20">
                    {campaignsCount}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Applications Tab */}
            <TabsContent value="applications" className="space-y-6 mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1">
                    Pending Creator Applications
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Review and approve or reject creator applications
                  </p>
                </div>
                {applicationsCount > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3 w-3" />
                      {applicationsCount} pending
                    </Badge>
                  </div>
                )}
              </div>

              {applicationsCount === 0 ? (
                <EmptyState
                  icon={CheckCircle2}
                  title="All applications reviewed"
                  description="There are no pending creator applications at the moment. New applications will appear here."
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {pendingApplications.map((application) => (
                    <ApplicationReviewCard
                      key={application._id}
                      application={application}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Campaigns Tab */}
            <TabsContent value="campaigns" className="space-y-6 mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1">
                    Pending Campaign Reviews
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Review and approve or reject campaign submissions
                  </p>
                </div>
                {campaignsCount > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3 w-3" />
                      {campaignsCount} pending
                    </Badge>
                  </div>
                )}
              </div>

              {campaignsCount === 0 ? (
                <EmptyState
                  icon={CheckCircle2}
                  title="All campaigns reviewed"
                  description="There are no pending campaign reviews at the moment. New submissions will appear here."
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {pendingCampaigns.map((campaign) => (
                    <CampaignReviewCard
                      key={campaign._id}
                      campaign={campaign}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Quick Stats Footer */}
          {totalPending === 0 && (
            <Card className="mt-8 bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20">
              <CardContent className="p-8 text-center">
                <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
                <p className="text-muted-foreground">
                  Great work! There are no pending reviews at the moment.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function AdminPage() {
  return (
    <AuthGuard requiredRole="admin">
      <AdminDashboardContent />
    </AuthGuard>
  );
}

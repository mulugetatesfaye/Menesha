"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CampaignStats } from "@/components/campaigns/CampaignStats";
import { PledgeForm } from "@/components/campaigns/PledgeForm";
import { PledgesList } from "@/components/campaigns/PledgesList";
import { CommentSection } from "@/components/campaigns/CommentSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatCurrency, cn } from "@/lib/utils";
import {
  Calendar,
  Share2,
  Heart,
  Flag,
  ChevronRight,
  Users,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  Target,
  MessageCircle,
  Bell,
  Copy,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  Info,
  AlertCircle,
  Gift,
  MoreHorizontal,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { use, useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function getVimeoVideoId(url: string): string | null {
  const regExp = /vimeo\.com\/(?:video\/)?(\d+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

// ============================================================================
// LOADING SKELETON
// ============================================================================

function CampaignDetailSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="mb-6 h-4 w-64" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <Skeleton className="aspect-video w-full rounded-2xl" />
            </div>
            <div className="space-y-4 lg:col-span-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-full" />
              <div className="grid grid-cols-3 gap-3">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </div>
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ============================================================================
// VIDEO PLAYER
// ============================================================================

function VideoPlayer({ videoUrl }: { videoUrl: string }) {
  const youtubeId = getYouTubeVideoId(videoUrl);
  const vimeoId = getVimeoVideoId(videoUrl);

  if (youtubeId) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
        title="Campaign Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    );
  }

  if (vimeoId) {
    return (
      <iframe
        src={`https://player.vimeo.com/video/${vimeoId}`}
        title="Campaign Video"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    );
  }

  return (
    <video
      src={videoUrl}
      controls
      className="absolute inset-0 h-full w-full object-cover"
    >
      Your browser does not support the video tag.
    </video>
  );
}

// ============================================================================
// SHARE DIALOG
// ============================================================================

function ShareDialog({
  campaign,
  isOpen,
  onClose,
}: {
  campaign: { title: string; shortDescription: string; _id: string };
  isOpen: boolean;
  onClose: () => void;
}) {
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/campaigns/${campaign._id}`
      : "";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(campaign.title)}&url=${encodeURIComponent(shareUrl)}`,
      color: "hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2]",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: "hover:bg-[#4267B2]/10 hover:text-[#4267B2]",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: "hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]",
    },
    {
      name: "Email",
      icon: Mail,
      href: `mailto:?subject=${encodeURIComponent(campaign.title)}&body=${encodeURIComponent(`Check out this campaign: ${shareUrl}`)}`,
      color: "hover:bg-primary/10 hover:text-primary",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Share Campaign
          </DialogTitle>
          <DialogDescription>
            Help spread the word about this campaign
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 truncate rounded-lg bg-muted p-3 text-sm">
              {shareUrl}
            </div>
            <Button size="icon" variant="outline" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {shareLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border p-4 transition-all",
                    link.color
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{link.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// STATUS BADGE
// ============================================================================

function CampaignStatusBadge({
  status,
  daysLeft,
  isFullyFunded,
}: {
  status: string;
  daysLeft: number;
  isFullyFunded: boolean;
}) {
  const getStatusConfig = () => {
    if (isFullyFunded) {
      return {
        label: "Fully Funded",
        icon: Sparkles,
        className:
          "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30",
      };
    }

    switch (status) {
      case "active":
        if (daysLeft <= 3) {
          return {
            label: "Ending Soon",
            icon: AlertCircle,
            className:
              "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30 animate-pulse",
          };
        }
        return {
          label: "Active",
          icon: Zap,
          className:
            "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30",
        };
      case "successful":
        return {
          label: "Successful",
          icon: CheckCircle2,
          className:
            "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30",
        };
      case "failed":
        return {
          label: "Not Funded",
          icon: AlertCircle,
          className:
            "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30",
        };
      default:
        return {
          label: status,
          icon: Info,
          className:
            "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/30",
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 px-3 py-1", config.className)}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </Badge>
  );
}

// ============================================================================
// REWARD TIER
// ============================================================================

function RewardTier({
  amount,
  title,
  description,
  backers,
  currency,
  isPopular,
}: {
  amount: number;
  title: string;
  description: string;
  backers: number;
  currency: string;
  isPopular?: boolean;
}) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg",
        isPopular && "ring-2 ring-primary"
      )}
    >
      {isPopular && (
        <div className="absolute right-0 top-0 rounded-bl-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
          Most Popular
        </div>
      )}
      <CardContent className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-2xl font-bold">
              {formatCurrency(amount, currency)}
            </p>
            <h4 className="mt-1 text-lg font-semibold">{title}</h4>
          </div>
          <Gift className="h-6 w-6 text-primary/60" />
        </div>
        <p className="mb-4 text-sm text-muted-foreground">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {backers} backers
          </span>
          <Button size="sm">
            Select
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { isAuthenticated, user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  // Convert string id to Convex Id type
  const campaignId = id as Id<"campaigns">;

  // Query campaign by ID instead of slug
  const campaign = useQuery(
    api.campaigns.getCampaignById,
    id ? { id: campaignId } : "skip"
  );

  const stats = useQuery(
    api.pledges.getCampaignStats,
    campaign ? { campaignId: campaign._id } : "skip"
  );

  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    if (!campaign) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDaysLeft(0);
      return;
    }

    const computeDaysLeft = () => {
      const now = Date.now();
      const timeLeft = campaign.endDate - now;
      setDaysLeft(Math.max(0, Math.ceil(timeLeft / (1000 * 60 * 60 * 24))));
    };

    computeDaysLeft();
    const interval = setInterval(computeDaysLeft, 60 * 1000);

    return () => clearInterval(interval);
  }, [campaign]);

  const percentageFunded = useMemo(() => {
    if (stats?.percentageFunded !== undefined) {
      return Math.round(stats.percentageFunded);
    }
    if (!campaign) return 0;
    return Math.round((campaign.currentAmount / campaign.goalAmount) * 100);
  }, [campaign, stats]);

  const backersCount = stats?.totalBackers ?? 0;
  const isFullyFunded = stats?.isFullyFunded ?? false;
  const hasEnded = stats?.hasEnded ?? false;

  const isCreator = useMemo(() => {
    if (!user || !campaign) return false;
    return campaign.creator?._id === user._id;
  }, [user, campaign]);

  if (campaign === undefined) {
    return <CampaignDetailSkeleton />;
  }

  if (campaign === null) {
    notFound();
  }

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: campaign.title,
          text: campaign.shortDescription,
          url: window.location.href,
        });
        toast.success("Shared successfully!");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setIsShareOpen(true);
        }
      }
    } else {
      setIsShareOpen(true);
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast.success(
      isFavorited ? "Removed from saved campaigns" : "Campaign saved!"
    );
  };

  const handleReport = () => {
    toast.info("Report functionality coming soon");
  };

  const rewards = [
    {
      amount: 25,
      title: "Early Bird Special",
      description: "Get early access and a special thank you in our credits.",
      backers: 45,
      isPopular: false,
    },
    {
      amount: 50,
      title: "Supporter Pack",
      description:
        "Includes Early Bird rewards plus exclusive updates and behind-the-scenes content.",
      backers: 128,
      isPopular: true,
    },
    {
      amount: 100,
      title: "Premium Backer",
      description:
        "All previous rewards plus limited edition merchandise and priority support.",
      backers: 32,
      isPopular: false,
    },
  ];

  const hasVideo = !!campaign.videoUrl;
  const hasImage = !!campaign.imageUrl;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 pb-4 pt-6">
          {/* Breadcrumb */}
          <nav
            className="scrollbar-hide mb-4 flex items-center gap-1.5 overflow-x-auto text-sm text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="flex-shrink-0 transition-colors hover:text-foreground"
            >
              Home
            </Link>
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
            <Link
              href="/campaigns"
              className="flex-shrink-0 transition-colors hover:text-foreground"
            >
              Campaigns
            </Link>
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
            <Link
              href={`/campaigns?category=${encodeURIComponent(campaign.category)}`}
              className="flex-shrink-0 transition-colors hover:text-foreground"
            >
              {campaign.category}
            </Link>
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
            <span className="max-w-[200px] truncate font-medium text-foreground">
              {campaign.title}
            </span>
          </nav>

          {/* Main Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
            {/* Media Section */}
            <div className="lg:col-span-3">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted shadow-xl ring-1 ring-black/5 dark:ring-white/5">
                {hasVideo ? (
                  <VideoPlayer videoUrl={campaign.videoUrl!} />
                ) : hasImage ? (
                  <Image
                    src={campaign.imageUrl!}
                    alt={campaign.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20">
                    <div className="space-y-2 text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm">
                        <Target className="h-8 w-8 text-muted-foreground/60" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Campaign Media
                      </p>
                    </div>
                  </div>
                )}

                {!hasVideo && (
                  <Badge className="absolute left-3 top-3 border-0 bg-background/90 shadow-lg backdrop-blur-sm">
                    {campaign.category}
                  </Badge>
                )}

                {!hasVideo && percentageFunded > 80 && !isFullyFunded && (
                  <Badge className="absolute right-3 top-3 gap-1.5 border-0 bg-orange-500/90 shadow-lg backdrop-blur-sm">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Trending
                  </Badge>
                )}
              </div>

              {hasVideo && (
                <div className="mt-3 flex items-center gap-2">
                  <Badge variant="secondary">{campaign.category}</Badge>
                  {percentageFunded > 80 && !isFullyFunded && (
                    <Badge className="gap-1.5 border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-400">
                      <TrendingUp className="h-3.5 w-3.5" />
                      Trending
                    </Badge>
                  )}
                </div>
              )}

              {/* Mobile Actions */}
              <div className="mt-3 flex items-center justify-between lg:hidden">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleFavorite}
                    className={cn(
                      "h-9 w-9",
                      isFavorited && "border-red-500/50 text-red-500"
                    )}
                  >
                    <Heart
                      className={cn("h-4 w-4", isFavorited && "fill-current")}
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShare}
                    className="h-9 w-9"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                <CampaignStatusBadge
                  status={campaign.status}
                  daysLeft={daysLeft}
                  isFullyFunded={isFullyFunded}
                />
              </div>
            </div>

            {/* Campaign Info */}
            <div className="space-y-4 lg:col-span-2">
              {/* Desktop Status & Actions */}
              <div className="hidden items-center justify-between lg:flex">
                <CampaignStatusBadge
                  status={campaign.status}
                  daysLeft={daysLeft}
                  isFullyFunded={isFullyFunded}
                />
                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleFavorite}
                          className={cn(
                            "h-9 w-9",
                            isFavorited && "text-red-500"
                          )}
                        >
                          <Heart
                            className={cn(
                              "h-4 w-4",
                              isFavorited && "fill-current"
                            )}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Save</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleShare}
                          className="h-9 w-9"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Share</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleReport}>
                        <Flag className="mr-2 h-4 w-4" />
                        Report
                      </DropdownMenuItem>
                      {isCreator && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/campaigns/${campaign._id}/edit`}
                            >
                              Edit Campaign
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Title */}
              <div>
                <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl lg:text-3xl">
                  {campaign.title}
                </h1>
                <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground md:text-base">
                  {campaign.shortDescription}
                </p>
              </div>

              {/* Creator */}
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border-2 border-background shadow ring-1 ring-primary/10">
                  <AvatarImage
                    src={campaign.creator?.image}
                    alt={campaign.creator?.name}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-xs font-semibold text-primary-foreground">
                    {getInitials(campaign.creator?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {campaign.creator?.name || "Anonymous"}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                    <span>Verified Creator</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Funding Progress */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-2xl font-bold md:text-3xl">
                        {formatCurrency(
                          stats?.totalAmount ?? campaign.currentAmount,
                          campaign.currency
                        )}
                      </span>
                      <span className="ml-1.5 text-sm text-muted-foreground">
                        of{" "}
                        {formatCurrency(campaign.goalAmount, campaign.currency)}
                      </span>
                    </div>
                    <span className="text-xl font-bold text-primary">
                      {percentageFunded}%
                    </span>
                  </div>
                  <Progress
                    value={Math.min(percentageFunded, 100)}
                    className="h-2.5"
                  />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-muted/50 p-2.5 text-center">
                    <div className="mb-0.5 flex items-center justify-center gap-1">
                      <Users className="h-3.5 w-3.5 text-primary" />
                      <span className="text-lg font-bold">{backersCount}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">Backers</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2.5 text-center">
                    <div className="mb-0.5 flex items-center justify-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-orange-600" />
                      <span className="text-lg font-bold">
                        {hasEnded ? "—" : daysLeft}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {hasEnded ? "Ended" : "Days Left"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2.5 text-center">
                    <div className="mb-0.5 flex items-center justify-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                      <span className="text-lg font-bold">
                        {percentageFunded}%
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">Funded</p>
                  </div>
                </div>
              </div>

              {/* Ended Notice */}
              {hasEnded && (
                <Card
                  className={cn(
                    "border-l-4",
                    isFullyFunded
                      ? "border-l-green-500 bg-green-500/5"
                      : "border-l-muted-foreground bg-muted/50"
                  )}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      {isFullyFunded ? (
                        <Sparkles className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          {isFullyFunded
                            ? "Successfully Funded!"
                            : "Campaign Ended"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Trust */}
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-green-600" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid h-auto w-full grid-cols-4 gap-1 rounded-lg bg-muted/50 p-1">
                  <TabsTrigger
                    value="description"
                    className="rounded-md px-3 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <Info className="mr-1.5 hidden h-4 w-4 sm:inline" />
                    Story
                  </TabsTrigger>
                  <TabsTrigger
                    value="rewards"
                    className="rounded-md px-3 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <Gift className="mr-1.5 hidden h-4 w-4 sm:inline" />
                    Rewards
                  </TabsTrigger>
                  <TabsTrigger
                    value="backers"
                    className="rounded-md px-3 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <Users className="mr-1.5 hidden h-4 w-4 sm:inline" />
                    Backers
                  </TabsTrigger>
                  <TabsTrigger
                    value="comments"
                    className="rounded-md px-3 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <MessageCircle className="mr-1.5 hidden h-4 w-4 sm:inline" />
                    Comments
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-6 space-y-6">
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <div className="h-1 w-8 rounded-full bg-gradient-to-r from-primary to-purple-600" />
                        About This Project
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <div className="whitespace-pre-wrap leading-relaxed text-foreground/90">
                          {campaign.description}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Calendar className="h-4 w-4 text-primary" />
                        Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="flex flex-1 items-center gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Started
                            </p>
                            <p className="font-medium">
                              {formatDate(campaign.startDate)}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-1 items-center gap-3">
                          <div
                            className={cn(
                              "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg",
                              hasEnded ? "bg-muted" : "bg-orange-500/10"
                            )}
                          >
                            <Clock
                              className={cn(
                                "h-5 w-5",
                                hasEnded
                                  ? "text-muted-foreground"
                                  : "text-orange-600"
                              )}
                            />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              {hasEnded ? "Ended" : "Ends"}
                            </p>
                            <p className="font-medium">
                              {formatDate(campaign.endDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Award className="h-4 w-4 text-primary" />
                        Creator
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12 border-2 border-background shadow-lg ring-2 ring-primary/10">
                          <AvatarImage
                            src={campaign.creator?.image}
                            alt={campaign.creator?.name}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 font-semibold text-primary-foreground">
                            {getInitials(campaign.creator?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold">
                            {campaign.creator?.name || "Anonymous"}
                          </h4>
                          <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                            <span>Verified Creator</span>
                          </div>
                          <Button variant="outline" size="sm" className="mt-3">
                            <Bell className="mr-1.5 h-3 w-3" />
                            Follow
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="rewards" className="mt-6 space-y-4">
                  {rewards.map((reward, index) => (
                    <RewardTier
                      key={index}
                      {...reward}
                      currency={campaign.currency}
                    />
                  ))}

                  <Card className="border-dashed">
                    <CardContent className="p-6 text-center">
                      <Gift className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                      <h4 className="mb-1 font-semibold">Custom Amount</h4>
                      <p className="mb-3 text-xs text-muted-foreground">
                        Back with any amount
                      </p>
                      <Button variant="outline" size="sm">
                        Make a Pledge
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="backers" className="mt-6">
                  <Card>
                    <CardContent className="p-4">
                      <PledgesList
                        campaignId={campaign._id}
                        currency={campaign.currency}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="comments" className="mt-6">
                  <Card>
                    <CardContent className="p-4">
                      <CommentSection campaignId={campaign._id} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
              {isAuthenticated && campaign.status === "active" && !hasEnded && (
                <PledgeForm
                  campaignId={campaign._id}
                  currency={campaign.currency}
                />
              )}

              {!isAuthenticated && (
                <CampaignStats
                  campaignId={campaign._id}
                  goalAmount={campaign.goalAmount}
                  currency={campaign.currency}
                />
              )}

              {/* Sign in CTA */}
              {!isAuthenticated &&
                campaign.status === "active" &&
                !hasEnded && (
                  <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
                    <CardContent className="p-4 text-center">
                      <Heart className="mx-auto mb-2 h-8 w-8 text-primary" />
                      <h4 className="mb-1 font-semibold">
                        Want to back this project?
                      </h4>
                      <p className="mb-3 text-xs text-muted-foreground">
                        Sign in to pledge and support this campaign
                      </p>
                      <Button asChild className="w-full">
                        <Link
                          href={`/sign-in?redirect=/campaigns/${campaign._id}`}
                        >
                          Sign in to Back
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}

              <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-green-500/10">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    Trust & Safety
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    {
                      title: "Verified Campaign",
                      desc: "Reviewed and approved",
                    },
                    {
                      title: "Secure Payments",
                      desc: "256-bit SSL encryption",
                    },
                    {
                      title: "Refund Policy",
                      desc: "Full refund if not funded",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-green-600" />
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Share</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Campaign
                  </Button>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReport}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  <Flag className="mr-1.5 h-3 w-3" />
                  Report
                </Button>
              </div>
            </div>
          </div>
        </div>

        <ShareDialog
          campaign={campaign}
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
        />
      </main>

      <Footer />
    </div>
  );
}

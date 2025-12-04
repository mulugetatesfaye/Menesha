"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Rocket,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Star,
  CheckCircle2,
  Lock,
  BarChart3,
  Globe,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { formatCurrency, cn } from "@/lib/utils";

// ============================================================================
// TRANSLATIONS (Amharic) - Original Hero Text Restored
// ============================================================================
const t = {
  // Hero - Original
  heroTagline: "ቁጥር 1 የፈንድ ማሰባሰቢያ መድረክ",
  heroTitle: "ታላላቅ የፈጠራ ሃሳቦችን",
  heroTitleHighlight: "ዕውን ያድርጉ",
  heroDescription:
    "በርካታ የኪነጥበብ እና የስነጥበብ ባለሙያዎች ሀሳቦቻቸውን ዕውን የሚያደርጉበትን መድረክ ተቀላቀሉ።",
  startCampaign: "ፈንድ ማሰባሰብ ይጀምሩ",
  exploreProjects: "ፕሮጀክቶችን ያስሱ",

  // Live Stats - Original
  active: "ንቁ ዘመቻዎች",
  raised: "ተሰብስቧል",
  funded: "ተደግፈዋል",

  // Stats Section
  totalRaised: "አጠቃላይ የተሰበሰበ",
  activeCampaigns: "ንቁ ዘመቻዎች",
  successRate: "የስኬት መጠን",
  backers: "ደጋፊዎች",

  // Featured
  featured: "ተለይተው የቀረቡ",
  featuredDescription: "በጣም ተወዳጅ ፕሮጀክቶች",
  viewAll: "ሁሉንም ይመልከቱ",

  // Categories
  categories: "ምድቦች",
  categoriesDescription: "ፍላጎትዎን ያግኙ",
  technology: "ቴክኖሎጂ",
  art: "ጥበብ",
  music: "ሙዚቃ",
  film: "ፊልም",
  games: "ጨዋታዎች",
  design: "ዲዛይን",
  publishing: "ህትመት",
  food: "ምግብ",
  projects: "ፕሮጀክቶች",

  // How It Works
  howItWorks: "እንዴት እንደሚሰራ",
  howItWorksDescription: "በሶስት ቀላል ደረጃዎች ዘመቻዎን ያስጀምሩ",
  step1Title: "ዘመቻ ይፍጠሩ",
  step1Description: "ታሪክዎን ይንገሩ፣ ግብዎን ያዘጋጁ፣ ሽልማቶችን ያክሉ",
  step2Title: "ማህበረሰብ ይገንቡ",
  step2Description: "ዘመቻዎን ያጋሩ እና ደጋፊዎችን ያሳትፉ",
  step3Title: "ገንዘብ ይሰብስቡ",
  step3Description: "ድጋፍ ይቀበሉ እና ራዕይዎን ይገንዙ",

  // Why Us
  whyUs: "ለምን እኛን ይምረጡ",
  whyUsDescription: "ለስኬትዎ የተነደፈ መድረክ",
  feature1Title: "ደህንነቱ የተጠበቀ",
  feature1Description: "የባንክ ደረጃ ምስጠራ ለሁሉም ግብይቶች",
  feature2Title: "ዓለም አቀፍ ተደራሽነት",
  feature2Description: "ከመላው ዓለም ደጋፊዎች ጋር ይገናኙ",
  feature3Title: "ቀላል ትንታኔዎች",
  feature3Description: "የእውነተኛ ጊዜ ዳሽቦርድ እና ሪፖርቶች",
  feature4Title: "24/7 ድጋፍ",
  feature4Description: "ለማንኛውም ጥያቄ እርዳታ ይጠይቁ",

  // Testimonials
  testimonials: "ምስክርነቶች",
  testimonialsDescription: "ደንበኞቻችን ምን ይላሉ",

  // CTA
  ctaTitle: "ዛሬ ይጀምሩ",
  ctaDescription: "ከሺዎች ስኬታማ ፈጣሪዎች ጋር ይቀላቀሉ",
  getStarted: "አሁን ይጀምሩ",
  contactSales: "ሽያጮችን ያነጋግሩ",

  // Trust
  trustedBy: "በሺዎች የታመነ",
  securePayments: "ደህንነቱ የተጠበቀ ክፍያ",
  verifiedProjects: "የተረጋገጡ ፕሮጀክቶች",

  // Empty State
  noCampaignsYet: "እስካሁን ምንም ዘመቻዎች የሉም",
  beFirstCreator: "የመጀመሪያው ዘመቻ ፈጣሪ ይሁኑ",
};

// ============================================================================
// LIVE STATS TICKER - Original Component
// ============================================================================
function LiveStatsTicker() {
  const stats = useQuery(api.stats.getStats, {});

  if (!stats) {
    return (
      <div className="flex items-center justify-center gap-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-28" />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground md:gap-6">
      {/* Active Campaigns */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
        </span>
        <span>
          <span className="font-semibold text-foreground">
            {stats.activeCampaigns}
          </span>{" "}
          {t.active}
        </span>
      </div>

      <Separator orientation="vertical" className="hidden h-4 md:block" />

      {/* Total Raised */}
      <span>
        <span className="font-semibold text-foreground">
          {formatCurrency(stats.totalRaised, "ETB")}
        </span>{" "}
        {t.raised}
      </span>

      <Separator orientation="vertical" className="hidden h-4 md:block" />

      {/* Funded Count */}
      <span>
        <span className="font-semibold text-foreground">
          {stats.fundedCount}
        </span>{" "}
        {t.funded}
      </span>
    </div>
  );
}

// ============================================================================
// HERO SECTION - Enterprise Level with Original Content
// ============================================================================
function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/[0.08] via-transparent to-transparent" />

      {/* Grid Pattern (subtle) */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container relative mx-auto px-4 py-20 md:py-28 lg:py-36">
        <div className="mx-auto max-w-4xl text-center">
          {/* Tagline Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            <span>{t.heroTagline}</span>
          </div>

          {/* Main Title */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {t.heroTitle}
            <br />
            <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
              {t.heroTitleHighlight}
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            {t.heroDescription}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="h-13 min-w-[200px] px-8 text-base font-medium shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
              asChild
            >
              <Link href="/dashboard/campaigns/new">
                <Rocket className="mr-2 h-5 w-5" />
                {t.startCampaign}
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-13 min-w-[200px] px-8 text-base font-medium"
              asChild
            >
              <Link href="/campaigns">
                {t.exploreProjects}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// STATS SECTION
// ============================================================================
function StatsSection() {
  const stats = useQuery(api.stats.getStats, {});

  const statItems = [
    {
      label: t.totalRaised,
      value: stats ? formatCurrency(stats.totalRaised, "ETB") : "—",
      icon: TrendingUp,
    },
    {
      label: t.activeCampaigns,
      value: stats ? stats.activeCampaigns.toString() : "—",
      icon: Rocket,
    },
    {
      label: t.successRate,
      value: stats ? `${stats.successRate}%` : "—",
      icon: CheckCircle2,
    },
    {
      label: t.backers,
      value: stats ? stats.totalBackers.toLocaleString() : "—",
      icon: Users,
    },
  ];

  return (
    <section className="border-y bg-muted/30">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="text-center">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-2xl font-bold md:text-3xl">
                  {stats ? (
                    item.value
                  ) : (
                    <Skeleton className="mx-auto h-8 w-24" />
                  )}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FEATURED CAMPAIGNS - Now shows 4 cards
// ============================================================================
function FeaturedCampaigns() {
  const campaigns = useQuery(api.campaigns.getActiveCampaigns, {});

  const featuredCampaigns = useMemo(() => {
    if (!campaigns) return [];
    return [...campaigns]
      .sort(
        (a, b) =>
          b.currentAmount / b.goalAmount - a.currentAmount / a.goalAmount
      )
      .slice(0, 4); // Changed from 6 to 4
  }, [campaigns]);

  const isLoading = campaigns === undefined;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              {t.featured}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {t.featuredDescription}
            </p>
          </div>
          <Button variant="ghost" className="hidden sm:flex" asChild>
            <Link href="/campaigns">
              {t.viewAll}
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Campaigns Grid - 4 columns on large screens */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <CampaignCardSkeleton key={i} />
            ))}
          </div>
        ) : featuredCampaigns.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredCampaigns.map((campaign) => (
              <CampaignCard key={campaign._id} campaign={campaign} />
            ))}
          </div>
        )}

        {/* Mobile View All */}
        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" asChild>
            <Link href="/campaigns">
              {t.viewAll}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CATEGORIES SECTION
// ============================================================================
function CategoriesSection() {
  const campaigns = useQuery(api.campaigns.getActiveCampaigns, {});
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const categoryCounts = useMemo(() => {
    if (!campaigns) return {};
    const counts: Record<string, number> = {};
    campaigns.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return counts;
  }, [campaigns]);

  const categories = [
    { id: "Technology", label: t.technology, icon: "💻" },
    { id: "Art", label: t.art, icon: "🎨" },
    { id: "Music", label: t.music, icon: "🎵" },
    { id: "Film & Video", label: t.film, icon: "🎬" },
    { id: "Games", label: t.games, icon: "🎮" },
    { id: "Design", label: t.design, icon: "✏️" },
    { id: "Publishing", label: t.publishing, icon: "📚" },
    { id: "Food", label: t.food, icon: "🍽️" },
  ];

  return (
    <section className="border-t bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t.categories}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {t.categoriesDescription}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((category, index) => {
            const count = categoryCounts[category.id] || 0;
            const isHovered = hoveredIndex === index;

            return (
              <Link
                key={category.id}
                href={`/campaigns?category=${encodeURIComponent(category.id)}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={cn(
                  "group relative flex flex-col items-center rounded-xl border bg-background p-6 transition-all duration-200",
                  isHovered && "border-primary/50 shadow-lg shadow-primary/5"
                )}
              >
                <span className="mb-3 text-3xl transition-transform duration-200 group-hover:scale-110">
                  {category.icon}
                </span>
                <span className="font-medium">{category.label}</span>
                <span className="mt-1 text-sm text-muted-foreground">
                  {count} {t.projects}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// HOW IT WORKS SECTION
// ============================================================================
function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: t.step1Title,
      description: t.step1Description,
    },
    {
      number: "02",
      title: t.step2Title,
      description: t.step2Description,
    },
    {
      number: "03",
      title: t.step3Title,
      description: t.step3Description,
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t.howItWorks}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {t.howItWorksDescription}
          </p>
        </div>

        {/* Steps */}
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 md:grid-cols-3 md:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-8 hidden h-px w-full bg-border md:block" />
                )}

                {/* Number */}
                <div className="relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  {step.number}
                </div>

                {/* Content */}
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// WHY US SECTION
// ============================================================================
function WhyUsSection() {
  const features = [
    {
      icon: Shield,
      title: t.feature1Title,
      description: t.feature1Description,
    },
    {
      icon: Globe,
      title: t.feature2Title,
      description: t.feature2Description,
    },
    {
      icon: BarChart3,
      title: t.feature3Title,
      description: t.feature3Description,
    },
    {
      icon: Zap,
      title: t.feature4Title,
      description: t.feature4Description,
    },
  ];

  return (
    <section className="border-t bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t.whyUs}
          </h2>
          <p className="mt-2 text-muted-foreground">{t.whyUsDescription}</p>
        </div>

        {/* Features Grid */}
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="border-0 bg-background shadow-sm transition-shadow hover:shadow-md"
              >
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TESTIMONIALS SECTION
// ============================================================================
function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "ምነሻ የፕሮጀክታችንን ፈንዲንግ በጣም ቀላል አድርጎታል። በአንድ ሳምንት ውስጥ የ200% ግባችንን አሳካን!",
      author: "ሳራ ተስፋዬ",
      role: "የቴክ ፈጣሪ",
      initials: "ሳተ",
    },
    {
      quote: "ከዚህ በፊት ከነበሩት ሁሉ በተሻለ መንገድ ገንዘብ ሰብሳቢያለሁ። የድጋፍ ቡድኑ በጣም ጥሩ ነው።",
      author: "ማርቆስ አበበ",
      role: "የሙዚቃ አርቲስት",
      initials: "ማአ",
    },
    {
      quote: "ቀላል፣ ፈጣን እና ውጤታማ። ማንኛውንም ፈጣሪ ምነሻን እንዲጠቀም እመክራለሁ!",
      author: "ፍሬህይወት ገብሩ",
      role: "ፊልም ዳይሬክተር",
      initials: "ፍገ",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t.testimonials}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {t.testimonialsDescription}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 bg-muted/50">
              <CardContent className="p-6">
                {/* Stars */}
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-500 text-yellow-500"
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="mb-6 text-sm leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="font-medium">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CTA SECTION
// ============================================================================
function CTASection() {
  return (
    <section className="border-t bg-primary py-16 text-primary-foreground md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t.ctaTitle}
          </h2>
          <p className="mt-4 text-lg opacity-90">{t.ctaDescription}</p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              className="h-12 px-8 text-base"
              asChild
            >
              <Link href="/dashboard/campaigns/new">
                {t.getStarted}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 border-primary-foreground/20 px-8 text-base text-primary-foreground hover:bg-primary-foreground/10"
            >
              {t.contactSales}
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>{t.securePayments}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>{t.verifiedProjects}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{t.trustedBy}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================
function CampaignCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <CardContent className="p-4">
        <Skeleton className="mb-2 h-5 w-3/4" />
        <Skeleton className="mb-4 h-4 w-full" />
        <Skeleton className="mb-2 h-2 w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="border-dashed py-16 text-center">
      <CardContent>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Rocket className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 font-semibold">{t.noCampaignsYet}</h3>
        <p className="mb-4 text-sm text-muted-foreground">{t.beFirstCreator}</p>
        <Button asChild>
          <Link href="/dashboard/campaigns/new">
            {t.startCampaign}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <FeaturedCampaigns />
        <CategoriesSection />
        <HowItWorksSection />
        <WhyUsSection />
        <TestimonialsSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CampaignList } from "@/components/campaigns/CampaignList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { CAMPAIGN_CATEGORIES } from "@/lib/categories";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  TrendingUp,
  Clock,
  Target,
  Sparkles,
  Filter,
  X,
  Grid3X3,
  LayoutList,
  SlidersHorizontal,
  Rocket,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

// ============================================================================
// TRANSLATIONS (Amharic)
// ============================================================================
const t = {
  // Hero
  heroTagline: "ንቁ ዘመቻዎች",
  heroTitle: "ዘመቻዎችን ያስሱ",
  heroDescription: "አዳዲስ ፕሮጀክቶችን ያግኙ እና የፈጠራ ሃሳቦችን እውን ለማድረግ ይሳተፉ",
  searchPlaceholder: "ዘመቻዎችን ይፈልጉ...",

  // Search
  searchResults: "የፍለጋ ውጤቶች",
  popularCampaigns: "ታዋቂ ዘመቻዎች",
  noResults: "ምንም ውጤት አልተገኘም",
  tryDifferentKeyword: "የተለየ ቁልፍ ቃል ይሞክሩ",
  viewAllResults: "ሁሉንም ውጤቶች ይመልከቱ",
  searching: "በመፈለግ ላይ...",
  funded: "ተደግፏል",

  // Categories
  popularCategories: "ታዋቂ ምድቦች",
  allCategories: "ሁሉም ምድቦች",
  technology: "ቴክኖሎጂ",
  art: "ጥበብ",
  music: "ሙዚቃ",
  film: "ፊልም",
  games: "ጨዋታዎች",
  design: "ዲዛይን",
  publishing: "ህትመት",
  food: "ምግብ",

  // Filters
  filters: "ማጣሪያዎች",
  trending: "በጣም የተፈለጉ",
  newest: "አዲስ",
  endingSoon: "በቅርቡ የሚያልቁ",
  clearAll: "ሁሉንም አጽዳ",
  activeFilters: "ንቁ ማጣሪያዎች",
  category: "ምድብ",
  search: "ፍለጋ",

  // View
  gridView: "ፍርግርግ እይታ",
  listView: "ዝርዝር እይታ",

  // Results
  noCampaignsFound: "ምንም ዘመቻ አልተገኘም",
  tryDifferentFilters: "የተለያዩ ማጣሪያዎችን ይሞክሩ",
  startCampaign: "ዘመቻ ይጀምሩ",
  projects: "ፕሮጀክቶች",
};

// Category mapping
const categoryLabels: Record<string, string> = {
  Technology: t.technology,
  Art: t.art,
  Music: t.music,
  "Film & Video": t.film,
  Games: t.games,
  Design: t.design,
  Publishing: t.publishing,
  Food: t.food,
};

// ============================================================================
// SEARCH INPUT WITH DROPDOWN
// ============================================================================
interface SearchInputProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

function SearchInput({ onSearch, initialValue = "" }: SearchInputProps) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const campaigns = useQuery(api.campaigns.getActiveCampaigns, {});
  const isLoading = campaigns === undefined;

  // Filter campaigns based on search
  const searchResults = useMemo(() => {
    if (!campaigns || !inputValue.trim()) return [];

    const query = inputValue.toLowerCase().trim();
    return campaigns
      .filter(
        (campaign) =>
          campaign.title.toLowerCase().includes(query) ||
          campaign.shortDescription.toLowerCase().includes(query) ||
          campaign.category.toLowerCase().includes(query)
      )
      .slice(0, 6);
  }, [campaigns, inputValue]);

  // Popular campaigns when no search
  const popularCampaigns = useMemo(() => {
    if (!campaigns) return [];
    return [...campaigns]
      .sort(
        (a, b) =>
          b.currentAmount / b.goalAmount - a.currentAmount / a.goalAmount
      )
      .slice(0, 4);
  }, [campaigns]);

  const displayedCampaigns = inputValue.trim()
    ? searchResults
    : popularCampaigns;
  const hasQuery = inputValue.trim().length > 0;
  const hasResults = searchResults.length > 0;

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < displayedCampaigns.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && displayedCampaigns[selectedIndex]) {
          // Navigate to selected campaign
          window.location.href = `/campaigns/${displayedCampaigns[selectedIndex].slug}`;
        } else if (inputValue.trim()) {
          // Search with query
          onSearch(inputValue.trim());
          setIsOpen(false);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Reset selected index when results change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIndex(-1);
  }, [inputValue]);

  // Highlight matching text
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query.trim()})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="rounded bg-primary/20 px-0.5 text-foreground">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-2xl">
      {/* Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={t.searchPlaceholder}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="h-14 rounded-xl border-2 bg-background pl-12 pr-12 text-base shadow-sm transition-all focus-visible:shadow-md md:text-lg"
        />
        {inputValue && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setInputValue("");
              inputRef.current?.focus();
            }}
            className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Results Dropdown */}
          <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border-2 bg-background shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
            {isLoading ? (
              // Loading State
              <div className="flex items-center gap-3 p-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">{t.searching}</span>
              </div>
            ) : hasQuery && !hasResults ? (
              // No Results
              <div className="p-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="font-medium">{t.noResults}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t.tryDifferentKeyword}
                </p>
              </div>
            ) : (
              // Results List
              <div className="max-h-[400px] overflow-y-auto">
                {/* Header */}
                <div className="border-b bg-muted/50 px-4 py-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    {hasQuery
                      ? `${t.searchResults} (${searchResults.length})`
                      : t.popularCampaigns}
                  </p>
                </div>

                {/* Campaign List */}
                <div className="p-2">
                  {displayedCampaigns.map((campaign, index) => {
                    const percentFunded = Math.round(
                      (campaign.currentAmount / campaign.goalAmount) * 100
                    );
                    const isSelected = selectedIndex === index;

                    return (
                      <Link
                        key={campaign._id}
                        href={`/campaigns/${campaign.slug}`}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-4 rounded-lg p-3 transition-colors",
                          isSelected
                            ? "bg-primary/10"
                            : "hover:bg-muted focus-visible:bg-muted"
                        )}
                        onMouseEnter={() => setSelectedIndex(index)}
                      >
                        {/* Thumbnail */}
                        <div className="relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                          {campaign.imageUrl ? (
                            <Image
                              src={campaign.imageUrl}
                              alt={campaign.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Rocket className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="truncate text-sm font-medium">
                              {highlightText(campaign.title, inputValue)}
                            </h4>
                            <Badge
                              variant="outline"
                              className="flex-shrink-0 text-[10px]"
                            >
                              {categoryLabels[campaign.category] ||
                                campaign.category}
                            </Badge>
                          </div>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {highlightText(
                              campaign.shortDescription,
                              inputValue
                            )}
                          </p>
                          <div className="mt-1 flex items-center gap-3 text-xs">
                            <span className="font-medium text-primary">
                              {percentFunded}% {t.funded}
                            </span>
                            <span className="text-muted-foreground">
                              {formatCurrency(
                                campaign.currentAmount,
                                campaign.currency
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Arrow */}
                        <ArrowRight
                          className={cn(
                            "h-4 w-4 flex-shrink-0 transition-transform",
                            isSelected
                              ? "translate-x-1 text-primary"
                              : "text-muted-foreground"
                          )}
                        />
                      </Link>
                    );
                  })}
                </div>

                {/* View All Button */}
                {hasQuery && searchResults.length >= 4 && (
                  <div className="border-t p-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-between"
                      onClick={() => {
                        onSearch(inputValue.trim());
                        setIsOpen(false);
                      }}
                    >
                      <span>{t.viewAllResults}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Keyboard Hints */}
            <div className="hidden border-t bg-muted/30 px-4 py-2 md:flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>
                  <kbd className="rounded bg-muted px-1.5 py-0.5">↑</kbd>{" "}
                  <kbd className="rounded bg-muted px-1.5 py-0.5">↓</kbd> ለመምረጥ
                </span>
                <span>
                  <kbd className="rounded bg-muted px-1.5 py-0.5">Enter</kbd>{" "}
                  ለመክፈት
                </span>
              </div>
              <span>
                <kbd className="rounded bg-muted px-1.5 py-0.5">Esc</kbd> ለመዝጋት
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// HERO BADGE COMPONENT
// ============================================================================
function HeroBadge() {
  const campaigns = useQuery(api.campaigns.getActiveCampaigns, {});
  const count = campaigns?.length ?? 0;
  const isLoading = campaigns === undefined;

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm">
      <Sparkles className="h-4 w-4" />
      {isLoading ? (
        <Skeleton className="h-4 w-24" />
      ) : (
        <span>
          {count.toLocaleString()} {t.heroTagline}
        </span>
      )}
    </div>
  );
}

// ============================================================================
// CATEGORY PILLS COMPONENT
// ============================================================================
function CategoryPills({
  selectedCategory,
  onSelectCategory,
}: {
  selectedCategory?: string;
  onSelectCategory: (category?: string) => void;
}) {
  const campaigns = useQuery(api.campaigns.getActiveCampaigns, {});

  const categoryCounts = useMemo(() => {
    if (!campaigns) return {};
    const counts: Record<string, number> = {};
    campaigns.forEach((campaign) => {
      counts[campaign.category] = (counts[campaign.category] || 0) + 1;
    });
    return counts;
  }, [campaigns]);

  const popularCategories = [
    { id: "Technology", icon: "💻" },
    { id: "Art", icon: "🎨" },
    { id: "Games", icon: "🎮" },
    { id: "Music", icon: "🎵" },
    { id: "Film & Video", icon: "🎬" },
  ];

  const totalCampaigns = campaigns?.length ?? 0;

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button
        variant={!selectedCategory ? "default" : "outline"}
        size="sm"
        onClick={() => onSelectCategory(undefined)}
        className="rounded-full"
      >
        {t.allCategories}
        {totalCampaigns > 0 && (
          <Badge variant="secondary" className="ml-2 px-1.5 text-xs">
            {totalCampaigns}
          </Badge>
        )}
      </Button>
      {popularCategories.map((cat) => {
        const count = categoryCounts[cat.id] || 0;
        const label = categoryLabels[cat.id] || cat.id;
        return (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? "default" : "outline"}
            size="sm"
            onClick={() =>
              onSelectCategory(selectedCategory === cat.id ? undefined : cat.id)
            }
            className="gap-2 rounded-full"
          >
            <span>{cat.icon}</span>
            <span className="hidden sm:inline">{label}</span>
            {count > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 text-xs">
                {count}
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
}

// ============================================================================
// FILTER BAR COMPONENT
// ============================================================================
interface FilterBarProps {
  selectedCategory?: string;
  setSelectedCategory: (category?: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: "trending" | "newest" | "ending";
  setSortBy: (sort: "trending" | "newest" | "ending") => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

function FilterBar({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  onClearFilters,
  hasActiveFilters,
}: FilterBarProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <Card className="border-muted/50 bg-muted/30">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
          {/* Mobile Filters Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="gap-2 lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {t.filters}
          </Button>

          {/* Category Filter */}
          <div
            className={cn(
              "flex flex-1 items-center gap-3",
              !showMobileFilters && "hidden lg:flex"
            )}
          >
            <div className="rounded-lg bg-primary/10 p-2">
              <Filter className="h-4 w-4 text-primary" />
            </div>
            <Select
              value={selectedCategory || "all"}
              onValueChange={(value) =>
                setSelectedCategory(value === "all" ? undefined : value)
              }
            >
              <SelectTrigger className="w-full bg-background lg:w-[220px]">
                <SelectValue placeholder={t.allCategories} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <span className="flex items-center gap-2">
                    <Grid3X3 className="h-4 w-4" />
                    {t.allCategories}
                  </span>
                </SelectItem>
                {CAMPAIGN_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {categoryLabels[category] || category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Options */}
          <div
            className={cn(
              "flex items-center gap-3",
              !showMobileFilters && "hidden lg:flex"
            )}
          >
            <Tabs
              value={sortBy}
              onValueChange={(v) => setSortBy(v as typeof sortBy)}
              className="w-full lg:w-auto"
            >
              <TabsList className="grid w-full grid-cols-3 bg-background">
                <TabsTrigger
                  value="trending"
                  className="gap-2 text-xs sm:text-sm"
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t.trending}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="newest"
                  className="gap-2 text-xs sm:text-sm"
                >
                  <Clock className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t.newest}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="ending"
                  className="gap-2 text-xs sm:text-sm"
                >
                  <Target className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t.endingSoon}</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* View Mode Toggle */}
          <div className="hidden items-center gap-1 border-l pl-6 lg:flex">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8"
              aria-label={t.gridView}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="h-8 w-8"
              aria-label={t.listView}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="gap-2 transition-colors hover:border-destructive hover:bg-destructive hover:text-destructive-foreground lg:ml-auto"
            >
              <X className="h-4 w-4" />
              {t.clearAll}
            </Button>
          )}
        </div>

        {/* Active Filters Pills */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/50 pt-4">
            <span className="text-sm text-muted-foreground">
              {t.activeFilters}:
            </span>
            {selectedCategory && (
              <Badge
                variant="secondary"
                className="gap-1.5 bg-primary/10 py-1 pl-2.5 pr-1 transition-colors hover:bg-primary/20"
              >
                <span>
                  {t.category}:{" "}
                  {categoryLabels[selectedCategory] || selectedCategory}
                </span>
                <button
                  onClick={() => setSelectedCategory(undefined)}
                  className="rounded-full p-0.5 transition-colors hover:bg-primary/30"
                  aria-label="Remove filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {searchQuery && (
              <Badge
                variant="secondary"
                className="gap-1.5 bg-muted py-1 pl-2.5 pr-1 transition-colors hover:bg-muted/80"
              >
                <span>
                  {t.search}: &quot;{searchQuery}&quot;
                </span>
                <button
                  onClick={() => setSearchQuery("")}
                  className="rounded-full p-0.5 transition-colors hover:bg-muted"
                  aria-label="Remove filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// EMPTY STATE COMPONENT
// ============================================================================
function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <Card className="border-dashed py-16 text-center">
      <CardContent>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Rocket className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">{t.noCampaignsFound}</h3>
        <p className="mb-6 text-sm text-muted-foreground">
          {t.tryDifferentFilters}
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button variant="outline" onClick={onClearFilters}>
            <X className="mr-2 h-4 w-4" />
            {t.clearAll}
          </Button>
          <Button asChild>
            <Link href="/dashboard/campaigns/new">{t.startCampaign}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
export default function CampaignsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    searchParams.get("category") || undefined
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState<"trending" | "newest" | "ending">(
    (searchParams.get("sort") as "trending" | "newest" | "ending") || "trending"
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // URL update helper
  const updateURL = useCallback(
    (params: Record<string, string | undefined>) => {
      const newParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
      });

      const queryString = newParams.toString();
      const newURL = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(newURL, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // Handlers
  const handleCategoryChange = useCallback(
    (category?: string) => {
      setSelectedCategory(category);
      updateURL({ category });
    },
    [updateURL]
  );

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      updateURL({ q: query || undefined });
    },
    [updateURL]
  );

  const handleSortChange = useCallback(
    (sort: "trending" | "newest" | "ending") => {
      setSortBy(sort);
      updateURL({ sort: sort === "trending" ? undefined : sort });
    },
    [updateURL]
  );

  const clearFilters = useCallback(() => {
    setSelectedCategory(undefined);
    setSearchQuery("");
    setSortBy("trending");
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  const hasActiveFilters = Boolean(selectedCategory || searchQuery);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/[0.03] to-transparent">
          {/* Background Pattern */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className="container relative mx-auto px-4 py-16 md:py-24">
            <div className="mx-auto max-w-4xl space-y-8 text-center">
              {/* Badge */}
              <HeroBadge />

              {/* Title */}
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                {t.heroTitle}
              </h1>

              {/* Description */}
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                {t.heroDescription}
              </p>

              {/* Search Input with Dropdown */}
              <SearchInput onSearch={handleSearch} initialValue={searchQuery} />

              {/* Category Pills */}
              <div className="pt-2">
                <p className="mb-4 text-sm text-muted-foreground">
                  {t.popularCategories}:
                </p>
                <CategoryPills
                  selectedCategory={selectedCategory}
                  onSelectCategory={handleCategoryChange}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filters and Content */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            {/* Filter Bar */}
            <div className="mb-8">
              <FilterBar
                selectedCategory={selectedCategory}
                setSelectedCategory={handleCategoryChange}
                searchQuery={searchQuery}
                setSearchQuery={handleSearch}
                sortBy={sortBy}
                setSortBy={handleSortChange}
                viewMode={viewMode}
                setViewMode={setViewMode}
                onClearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>

            {/* Campaign List */}
            <CampaignList
              category={selectedCategory}
              searchQuery={searchQuery}
              sortBy={sortBy}
              viewMode={viewMode}
              emptyState={<EmptyState onClearFilters={clearFilters} />}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

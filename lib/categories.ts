export const CAMPAIGN_CATEGORIES = [
  "Technology",
  "Art",
  "Music",
  "Film & Video",
  "Games",
  "Food & Craft",
  "Design",
  "Comics & Illustration",
  "Photography",
  "Publishing",
  "Fashion",
  "Education",
  "Health & Fitness",
  "Community",
  "Other",
] as const;

export type CampaignCategory = (typeof CAMPAIGN_CATEGORIES)[number];

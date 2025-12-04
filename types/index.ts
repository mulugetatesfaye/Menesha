import { Doc, Id } from "../convex/_generated/dataModel";

export type Campaign = Doc<"campaigns">;
export type Pledge = Doc<"pledges">;
export type Comment = Doc<"comments">;
export type CreatorApplication = Doc<"creatorApplications">;

export type UserRole = "user" | "creator" | "admin";
export type CampaignStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "active"
  | "successful"
  | "failed";
export type ApplicationStatus = "pending" | "approved" | "rejected";
export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "refunded";

export interface User {
  _id: string;
  email?: string;
  name?: string;
  image?: string;
  role?: UserRole;
  createdAt?: number;
  emailVerificationTime?: number;
  isAnonymous?: boolean;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface CampaignWithCreator extends Campaign {
  creator: User | null;
}

export interface PledgeWithUser extends Pledge {
  user: User | null;
}

export interface PledgeWithCampaign extends Pledge {
  campaign: Campaign | null;
}

export interface CommentWithUser extends Comment {
  user: User | null;
}

export interface ApplicationWithUser extends CreatorApplication {
  user: User | null;
}

export interface CampaignStats {
  totalBackers: number;
  totalAmount: number;
  percentageFunded: number;
  daysLeft: number;
  goalAmount: number;
  isFullyFunded: boolean;
}

export interface CreateCampaignInput {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  goalAmount: number;
  currency: string;
  imageUrl?: string;
  videoUrl?: string;
  endDate: number;
}

export interface UpdateCampaignInput {
  campaignId: Id<"campaigns">;
  title?: string;
  description?: string;
  shortDescription?: string;
  category?: string;
  goalAmount?: number;
  imageUrl?: string;
  videoUrl?: string;
  endDate?: number;
}

export interface CreatePledgeInput {
  campaignId: Id<"campaigns">;
  amount: number;
  currency: string;
  message?: string;
  isAnonymous: boolean;
}

export interface CreatorApplicationInput {
  fullName: string;
  bio: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

import { Id } from "@/convex/_generated/dataModel";

export interface CreatorApplication {
  _id: Id<"creatorApplications">;
  _creationTime: number;
  userId: Id<"users">;
  fullName: string;
  bio: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  status: "pending" | "approved" | "rejected";
  reviewedBy?: Id<"users">;
  reviewedAt?: number;
  rejectionReason?: string;
  createdAt: number;
}

export interface ApplicationWithUser extends CreatorApplication {
  user?: {
    _id: Id<"users">;
    userId: string;
    email: string;
    name?: string;
    image?: string;
    role: "user" | "creator" | "admin";
    createdAt: number;
  };
}

export interface CampaignWithCreator {
  _id: Id<"campaigns">;
  _creationTime: number;
  creatorId: Id<"users">;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  goalAmount: number;
  currentAmount: number;
  currency: string;
  imageUrl?: string;
  videoUrl?: string;
  startDate: number;
  endDate: number;
  status:
    | "draft"
    | "pending"
    | "approved"
    | "rejected"
    | "active"
    | "successful"
    | "failed";
  approvedBy?: Id<"users">;
  approvedAt?: number;
  rejectionReason?: string;
  createdAt: number;
  updatedAt: number;
  creator?: {
    _id: Id<"users">;
    userId: string;
    email: string;
    name?: string;
    image?: string;
    role: "user" | "creator" | "admin";
    createdAt: number;
  };
}

export interface StatCardData {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  trend?: string;
}

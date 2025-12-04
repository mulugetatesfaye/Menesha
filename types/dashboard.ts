import { Id } from "@/convex/_generated/dataModel";
import { LucideIcon } from "lucide-react";

export interface Campaign {
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
}

export interface Pledge {
  _id: Id<"pledges">;
  _creationTime: number;
  campaignId: Id<"campaigns">;
  userId: Id<"users">;
  amount: number;
  currency: string;
  message?: string;
  isAnonymous: boolean;
  paymentStatus: "pending" | "processing" | "completed" | "failed" | "refunded";
  paymentIntentId?: string;
  createdAt: number;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color: string;
  bgColor: string;
}

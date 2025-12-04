import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // Extend auth users table with custom fields
  users: defineTable({
    // Auth fields (required by Convex Auth)
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    image: v.optional(v.string()),
    name: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    // Your custom fields (must be optional)
    role: v.optional(
      v.union(v.literal("user"), v.literal("creator"), v.literal("admin"))
    ),
    createdAt: v.optional(v.number()),
  }).index("email", ["email"]),

  creatorApplications: defineTable({
    userId: v.id("users"),
    fullName: v.string(),
    bio: v.string(),
    website: v.optional(v.string()),
    socialLinks: v.optional(
      v.object({
        twitter: v.optional(v.string()),
        linkedin: v.optional(v.string()),
        github: v.optional(v.string()),
      })
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    ),
    reviewedBy: v.optional(v.id("users")),
    reviewedAt: v.optional(v.number()),
    rejectionReason: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"]),

  campaigns: defineTable({
    creatorId: v.id("users"),
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    shortDescription: v.string(),
    category: v.string(),
    goalAmount: v.number(),
    currentAmount: v.number(),
    currency: v.string(),
    imageUrl: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    startDate: v.number(),
    endDate: v.number(),
    status: v.union(
      v.literal("draft"),
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("active"),
      v.literal("successful"),
      v.literal("failed")
    ),
    approvedBy: v.optional(v.id("users")),
    approvedAt: v.optional(v.number()),
    rejectionReason: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_creatorId", ["creatorId"])
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_category", ["category"]),

  pledges: defineTable({
    campaignId: v.id("campaigns"),
    userId: v.id("users"),
    amount: v.number(),
    currency: v.string(),
    message: v.optional(v.string()),
    isAnonymous: v.boolean(),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("refunded")
    ),
    paymentIntentId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_campaignId", ["campaignId"])
    .index("by_userId", ["userId"])
    .index("by_paymentStatus", ["paymentStatus"]),

  comments: defineTable({
    campaignId: v.id("campaigns"),
    userId: v.id("users"),
    content: v.string(),
    createdAt: v.number(),
  })
    .index("by_campaignId", ["campaignId"])
    .index("by_userId", ["userId"]),
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

export const createCampaign = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    shortDescription: v.string(),
    category: v.string(),
    goalAmount: v.number(),
    currency: v.string(),
    imageUrl: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // ✅ Direct get - userId IS the _id
    const user = await ctx.db.get(userId);
    if (!user || (user.role !== "creator" && user.role !== "admin")) {
      throw new Error("Only creators can create campaigns");
    }

    // Check if slug is unique
    const existingCampaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existingCampaign) {
      throw new Error("Campaign slug already exists");
    }

    const campaignId = await ctx.db.insert("campaigns", {
      creatorId: userId, // ✅ Use userId directly
      title: args.title,
      slug: args.slug,
      description: args.description,
      shortDescription: args.shortDescription,
      category: args.category,
      goalAmount: args.goalAmount,
      currentAmount: 0,
      currency: args.currency,
      imageUrl: args.imageUrl,
      videoUrl: args.videoUrl,
      startDate: Date.now(),
      endDate: args.endDate,
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return campaignId;
  },
});

export const updateCampaign = mutation({
  args: {
    campaignId: v.id("campaigns"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    shortDescription: v.optional(v.string()),
    category: v.optional(v.string()),
    goalAmount: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    if (campaign.creatorId !== userId && user.role !== "admin") {
      throw new Error("You don't have permission to update this campaign");
    }

    const { campaignId, ...updateData } = args;
    await ctx.db.patch(campaignId, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

export const submitCampaignForReview = mutation({
  args: {
    campaignId: v.id("campaigns"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    if (campaign.creatorId !== userId) {
      throw new Error("You don't have permission to submit this campaign");
    }

    if (campaign.status !== "draft") {
      throw new Error("Only draft campaigns can be submitted for review");
    }

    await ctx.db.patch(args.campaignId, {
      status: "pending",
      updatedAt: Date.now(),
    });
  },
});

export const reviewCampaign = mutation({
  args: {
    campaignId: v.id("campaigns"),
    status: v.union(v.literal("approved"), v.literal("rejected")),
    rejectionReason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      throw new Error("Only admins can review campaigns");
    }

    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    const updateData: {
      status: "approved" | "rejected" | "active";
      approvedBy?: typeof userId;
      approvedAt?: number;
      rejectionReason?: string;
      updatedAt: number;
    } = {
      status: args.status,
      updatedAt: Date.now(),
    };

    if (args.status === "approved") {
      updateData.status = "active";
      updateData.approvedBy = userId;
      updateData.approvedAt = Date.now();
    } else {
      updateData.status = "rejected";
      updateData.rejectionReason = args.rejectionReason;
    }

    await ctx.db.patch(args.campaignId, updateData);
  },
});

export const getCampaignBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!campaign) {
      return null;
    }

    const creator = await ctx.db.get(campaign.creatorId);

    return {
      ...campaign,
      creator,
    };
  },
});

export const getCampaignById = query({
  args: { id: v.id("campaigns") },
  handler: async (ctx, args) => {
    const campaign = await ctx.db.get(args.id);

    if (!campaign) {
      return null;
    }

    // Get creator info
    const creator = campaign.creatorId
      ? await ctx.db.get(campaign.creatorId)
      : null;

    return {
      ...campaign,
      creator: creator
        ? {
            _id: creator._id,
            name: creator.name,
            image: creator.image,
          }
        : null,
    };
  },
});

export const getActiveCampaigns = query({
  args: {
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let campaigns = await ctx.db
      .query("campaigns")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    if (args.category) {
      campaigns = campaigns.filter((c) => c.category === args.category);
    }

    const campaignsWithCreators = await Promise.all(
      campaigns.map(async (campaign) => {
        const creator = await ctx.db.get(campaign.creatorId);
        return {
          ...campaign,
          creator,
        };
      })
    );

    return campaignsWithCreators;
  },
});

export const getMyCampaigns = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }

    // ✅ Query by creatorId which is the userId directly
    return await ctx.db
      .query("campaigns")
      .withIndex("by_creatorId", (q) => q.eq("creatorId", userId))
      .order("desc")
      .collect();
  },
});

export const getPendingCampaigns = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      return [];
    }

    const campaigns = await ctx.db
      .query("campaigns")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    const campaignsWithCreators = await Promise.all(
      campaigns.map(async (campaign) => {
        const creator = await ctx.db.get(campaign.creatorId);
        return {
          ...campaign,
          creator,
        };
      })
    );

    return campaignsWithCreators;
  },
});

export const deleteCampaign = mutation({
  args: {
    campaignId: v.id("campaigns"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    if (campaign.creatorId !== userId && user.role !== "admin") {
      throw new Error("You don't have permission to delete this campaign");
    }

    // Only allow deletion if campaign has no pledges
    const pledges = await ctx.db
      .query("pledges")
      .withIndex("by_campaignId", (q) => q.eq("campaignId", args.campaignId))
      .first();

    if (pledges) {
      throw new Error("Cannot delete campaign with existing pledges");
    }

    await ctx.db.delete(args.campaignId);
  },
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

export const createPledge = mutation({
  args: {
    campaignId: v.id("campaigns"),
    amount: v.number(),
    currency: v.string(),
    message: v.optional(v.string()),
    isAnonymous: v.boolean(),
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

    if (campaign.status !== "active") {
      throw new Error("Campaign is not active");
    }

    if (Date.now() > campaign.endDate) {
      throw new Error("Campaign has ended");
    }

    if (args.amount <= 0) {
      throw new Error("Pledge amount must be greater than 0");
    }

    const pledgeId = await ctx.db.insert("pledges", {
      campaignId: args.campaignId,
      userId: userId,
      amount: args.amount,
      currency: args.currency,
      message: args.message,
      isAnonymous: args.isAnonymous,
      paymentStatus: "pending",
      createdAt: Date.now(),
    });

    // Update campaign current amount
    // Note: In production, update only after payment confirmation
    await ctx.db.patch(args.campaignId, {
      currentAmount: campaign.currentAmount + args.amount,
      updatedAt: Date.now(),
    });

    return pledgeId;
  },
});

export const updatePledgePaymentStatus = mutation({
  args: {
    pledgeId: v.id("pledges"),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("refunded")
    ),
    paymentIntentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      throw new Error("Only admins can update payment status");
    }

    const pledge = await ctx.db.get(args.pledgeId);
    if (!pledge) {
      throw new Error("Pledge not found");
    }

    await ctx.db.patch(args.pledgeId, {
      paymentStatus: args.paymentStatus,
      paymentIntentId: args.paymentIntentId,
    });

    // If payment failed or refunded, update campaign amount
    if (args.paymentStatus === "failed" || args.paymentStatus === "refunded") {
      const campaign = await ctx.db.get(pledge.campaignId);
      if (campaign) {
        await ctx.db.patch(pledge.campaignId, {
          currentAmount: Math.max(0, campaign.currentAmount - pledge.amount),
          updatedAt: Date.now(),
        });
      }
    }
  },
});

export const getCampaignPledges = query({
  args: {
    campaignId: v.id("campaigns"),
  },
  handler: async (ctx, args) => {
    const pledges = await ctx.db
      .query("pledges")
      .withIndex("by_campaignId", (q) => q.eq("campaignId", args.campaignId))
      .order("desc")
      .collect();

    // Filter completed pledges
    const completedPledges = pledges.filter(
      (p) => p.paymentStatus === "completed" || p.paymentStatus === "pending"
    );

    const pledgesWithUsers = await Promise.all(
      completedPledges.map(async (pledge) => {
        if (pledge.isAnonymous) {
          return {
            ...pledge,
            user: null,
          };
        }
        const user = await ctx.db.get(pledge.userId);
        return {
          ...pledge,
          user: user
            ? {
                _id: user._id,
                name: user.name,
                image: user.image,
              }
            : null,
        };
      })
    );

    return pledgesWithUsers;
  },
});

export const getMyPledges = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }

    const pledges = await ctx.db
      .query("pledges")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    const pledgesWithCampaigns = await Promise.all(
      pledges.map(async (pledge) => {
        const campaign = await ctx.db.get(pledge.campaignId);
        return {
          ...pledge,
          campaign,
        };
      })
    );

    return pledgesWithCampaigns;
  },
});

export const getCampaignStats = query({
  args: {
    campaignId: v.id("campaigns"),
  },
  handler: async (ctx, args) => {
    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) {
      return null;
    }

    const pledges = await ctx.db
      .query("pledges")
      .withIndex("by_campaignId", (q) => q.eq("campaignId", args.campaignId))
      .collect();

    // Count only completed or pending pledges
    const validPledges = pledges.filter(
      (p) => p.paymentStatus === "completed" || p.paymentStatus === "pending"
    );

    const totalBackers = validPledges.length;
    const totalAmount = validPledges.reduce(
      (sum, pledge) => sum + pledge.amount,
      0
    );
    const percentageFunded =
      campaign.goalAmount > 0 ? (totalAmount / campaign.goalAmount) * 100 : 0;
    const daysLeft = Math.max(
      0,
      Math.ceil((campaign.endDate - Date.now()) / (1000 * 60 * 60 * 24))
    );

    return {
      totalBackers,
      totalAmount,
      percentageFunded: Math.min(percentageFunded, 100),
      daysLeft,
      goalAmount: campaign.goalAmount,
      currency: campaign.currency,
      isFullyFunded: totalAmount >= campaign.goalAmount,
      hasEnded: Date.now() > campaign.endDate,
    };
  },
});

export const cancelPledge = mutation({
  args: {
    pledgeId: v.id("pledges"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const pledge = await ctx.db.get(args.pledgeId);
    if (!pledge) {
      throw new Error("Pledge not found");
    }

    if (pledge.userId !== userId) {
      throw new Error("You can only cancel your own pledges");
    }

    if (pledge.paymentStatus === "completed") {
      throw new Error("Cannot cancel a completed pledge");
    }

    // Update campaign amount
    const campaign = await ctx.db.get(pledge.campaignId);
    if (campaign) {
      await ctx.db.patch(pledge.campaignId, {
        currentAmount: Math.max(0, campaign.currentAmount - pledge.amount),
        updatedAt: Date.now(),
      });
    }

    await ctx.db.delete(args.pledgeId);
  },
});

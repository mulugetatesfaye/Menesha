import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

export const submitApplication = mutation({
  args: {
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

    // Check if user is already a creator
    if (user.role === "creator" || user.role === "admin") {
      throw new Error("You are already a creator");
    }

    // Check if user already has a pending application
    const existingApplication = await ctx.db
      .query("creatorApplications")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "pending"),
          q.eq(q.field("status"), "approved")
        )
      )
      .first();

    if (existingApplication) {
      throw new Error("You already have an active application");
    }

    const applicationId = await ctx.db.insert("creatorApplications", {
      userId: userId,
      fullName: args.fullName,
      bio: args.bio,
      website: args.website,
      socialLinks: args.socialLinks,
      status: "pending",
      createdAt: Date.now(),
    });

    return applicationId;
  },
});

export const getMyApplication = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return null;
    }

    return await ctx.db
      .query("creatorApplications")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .first();
  },
});

export const getPendingApplications = query({
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

    const applications = await ctx.db
      .query("creatorApplications")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    const applicationsWithUsers = await Promise.all(
      applications.map(async (app) => {
        const applicantUser = await ctx.db.get(app.userId);
        return {
          ...app,
          user: applicantUser,
        };
      })
    );

    return applicationsWithUsers;
  },
});

export const reviewApplication = mutation({
  args: {
    applicationId: v.id("creatorApplications"),
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
      throw new Error("Only admins can review applications");
    }

    const application = await ctx.db.get(args.applicationId);
    if (!application) {
      throw new Error("Application not found");
    }

    if (application.status !== "pending") {
      throw new Error("Application has already been reviewed");
    }

    await ctx.db.patch(args.applicationId, {
      status: args.status,
      reviewedBy: userId,
      reviewedAt: Date.now(),
      rejectionReason: args.rejectionReason,
    });

    // If approved, update user role to creator
    if (args.status === "approved") {
      await ctx.db.patch(application.userId, { role: "creator" });
    }
  },
});

export const getAllApplications = query({
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

    const applications = await ctx.db
      .query("creatorApplications")
      .order("desc")
      .collect();

    const applicationsWithUsers = await Promise.all(
      applications.map(async (app) => {
        const applicantUser = await ctx.db.get(app.userId);
        const reviewer = app.reviewedBy
          ? await ctx.db.get(app.reviewedBy)
          : null;
        return {
          ...app,
          user: applicantUser,
          reviewer,
        };
      })
    );

    return applicationsWithUsers;
  },
});

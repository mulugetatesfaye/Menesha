import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { auth } from "./auth";

// Define the role type to match schema
type UserRole = "user" | "creator" | "admin";

const userRoleValidator = v.union(
  v.literal("user"),
  v.literal("creator"),
  v.literal("admin")
);

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user) return null;

    return {
      ...user,
      role: user.role ?? "user",
    };
  },
});

export const initializeUser = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // ✅ Use Pick to get exact types from the Doc
    const updates: Partial<Pick<Doc<"users">, "role" | "createdAt">> = {};

    if (!user.role) {
      updates.role = "user";
    }

    if (!user.createdAt) {
      updates.createdAt = Date.now();
    }

    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(userId, updates);
    }

    return userId;
  },
});

export const getUserById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    if (!user) return null;

    return {
      ...user,
      role: user.role ?? "user",
    };
  },
});

export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: userRoleValidator,
  },
  handler: async (ctx, args) => {
    const currentUserId = await auth.getUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db.get(currentUserId);
    if (!currentUser || currentUser.role !== "admin") {
      throw new Error("Only admins can update user roles");
    }

    if (currentUserId === args.userId && args.role !== "admin") {
      throw new Error("Cannot remove your own admin role");
    }

    const targetUser = await ctx.db.get(args.userId);
    if (!targetUser) {
      throw new Error("Target user not found");
    }

    await ctx.db.patch(args.userId, { role: args.role });

    return { success: true, userId: args.userId, newRole: args.role };
  },
});

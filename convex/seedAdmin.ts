import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedAdminUser = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Find user by email
    const users = await ctx.db.query("users").collect();
    const user = users.find((u) => u.email === args.email);

    if (!user) {
      throw new Error(
        `User with email ${args.email} not found. Make sure to sign in first.`
      );
    }

    // Update to admin
    await ctx.db.patch(user._id, { role: "admin" });

    return {
      success: true,
      userId: user._id,
      message: `User ${args.email} is now an admin`,
    };
  },
});

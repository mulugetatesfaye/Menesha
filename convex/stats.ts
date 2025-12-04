// convex/stats.ts
import { query } from "./_generated/server";

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const campaigns = await ctx.db
      .query("campaigns")
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    const pledges = await ctx.db.query("pledges").collect();
    const uniqueBackers = new Set(pledges.map((p) => p.userId));

    const totalRaised = campaigns.reduce((sum, c) => sum + c.currentAmount, 0);
    const fundedCount = campaigns.filter(
      (c) => c.currentAmount >= c.goalAmount
    ).length;

    return {
      totalRaised,
      activeCampaigns: campaigns.length,
      fundedCount,
      successRate:
        campaigns.length > 0
          ? Math.round((fundedCount / campaigns.length) * 100)
          : 0,
      totalBackers: uniqueBackers.size,
    };
  },
});

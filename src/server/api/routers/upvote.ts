import { and, eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { upvotes } from "~/server/db/schema";

export const upvoteRouter = createTRPCRouter({
    create: protectedProcedure
      .input(z.object({
          id: z.string().min(1),
          answerID: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        await ctx.db.insert(upvotes).values({
          id: input.id,
          userID: ctx.session.user.id,
          answerID: input.answerID,
        });
      }),

    remove: protectedProcedure
      .input(z.object({
          answerID: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        await ctx.db.delete(upvotes)
              .where(and(
                  eq(upvotes.userID, ctx.session.user.id),
                  eq(upvotes.answerID, input.answerID),
              ));
      }),
});

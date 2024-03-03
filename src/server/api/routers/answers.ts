import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { answers } from "~/server/db/schema";

export const answerRouter = createTRPCRouter({
    getAnswers: publicProcedure
        .input(z.object({
            id: z.string().min(1),
        }))
        .query(async ({ ctx, input }) => {
            return ctx.db.query.answers.findMany({
                where: eq(answers.questionID, input.id),
                with: {
                  user: true,
                },
            })
        }),
    create: protectedProcedure
      .input(z.object({
          id: z.string().min(1),
          questionID: z.string().min(1),
          content: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        await ctx.db.insert(answers).values({
            postedBy: ctx.session.user.id,
            ...input
        });
      }),
});

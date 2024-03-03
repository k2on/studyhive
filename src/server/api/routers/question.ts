import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { questions } from "~/server/db/schema";

export const questionRouter = createTRPCRouter({
    getQuestions: publicProcedure
        .input(z.object({
            id: z.string().min(1),
        }))
        .query(async ({ ctx, input }) => {
            return ctx.db.query.questions.findMany({
                where: eq(questions.materialID, input.id),
                orderBy: (questions, { asc }) => [asc(questions.createdAt)],
            })
        }),
    create: protectedProcedure
      .input(z.object({
          id: z.string().min(1),
          materialID: z.string().min(1),
          content: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        await ctx.db.insert(questions).values({
            postedBy: ctx.session.user.id,
            ...input
        });
      }),
});

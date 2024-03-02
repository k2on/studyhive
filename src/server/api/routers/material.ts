import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { courseMaterials } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const materialsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1), term: z.string().min(1), id: z.string().min(1), courseID: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(courseMaterials).values({ 
        id: input.id,
        name: input.name,
        term: input.term,
        courseID: input.courseID,
      });
    }),

  getForCourse: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.courseMaterials.findMany({
        where: eq(courseMaterials.courseID, input),
      });
  }),
});

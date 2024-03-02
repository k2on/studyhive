import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { courses, usersToCourses, users, courseMaterials } from "~/server/db/schema";
import { v4 } from "uuid";
import { eq } from "drizzle-orm";

export const materialRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ id: z.string(), courseID: z.string(), term: z.string().min(1), name: z.string().min(1) }))
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

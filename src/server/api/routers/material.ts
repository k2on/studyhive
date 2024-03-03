import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { courseMaterials } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const materialsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      materialName: z.string().min(1),
      term: z.string().min(1),
      id: z.string().min(1),
      courseId: z.string().min(1) }))

    .mutation(async ({ ctx, input }) => {    
      return await ctx.db.insert(courseMaterials).values({
        id: input.id,
        name: input.materialName,
        term: input.term,
        courseID: input.courseId,
      });
    }),
});

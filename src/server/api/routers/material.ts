import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { courseMaterials } from "~/server/db/schema";
import { asc, eq } from "drizzle-orm";

export function sleep(ms: number) {                                         
    return new Promise(resolve => setTimeout(resolve, ms));                                         
}  

export const materialsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.string())
    .query(({input, ctx })=> {
      return ctx.db.query.courseMaterials.findMany({
        where: eq(courseMaterials.courseID, input),
        orderBy: (courseMaterials, { asc }) => [asc(courseMaterials.name)],
      })
    }),
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
        //term: ctx.session.user.id,
      });
    }),
});

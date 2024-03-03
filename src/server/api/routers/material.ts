import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { courseMaterials } from "~/server/db/schema";
import {v4} from "uuid"
import{ eq } from "drizzle-orm";

export const materialsRouter = createTRPCRouter({

  create: protectedProcedure
    .input(z.object({
      materialName: z.string().min(1),
      term: z.string().min(1),
      id: z.string().min(1),
      courseId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
    
      return  await ctx.db.insert(courseMaterials).values({
        id: input.id,
        name: input.materialName,
        term: input.term,
        //term: ctx.session.user.id,
      });
    }),

/*
    getJoined: protectedProcedure.query(async ({ ctx }) => {
      let r = await ctx.db.query.usersToCourses.findMany({
        columns: {
          materialID: false,
          termID: false,
        },
        where: eq(usersToCourses.termID, ctx.session.term.id),
        with: {
          material: true,
        },
      });

      return r.map(x => x.material);
    }),
    */

});

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
    .input(z.object({ term: z.string().min(1), name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(courseMaterials).values({ 
        id: v4(),
        name: input.name,
        term: input.term,
      });
    }),

  getForCourse: protectedProcedure.query(async ({ ctx }) => {
    let r = await ctx.db.query.courseMaterials.findMany({
      where: eq(usersToCourses.userID, ctx.session.user.id),
      with: {
        course: true,
      },
    });

    return r.map(x => x.course);
  }),
});

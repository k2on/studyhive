import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { courses, usersToCourses } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const courseRouter = createTRPCRouter({  
  create: protectedProcedure
    .input(z.object({ courseName: z.string().min(1), teacherName: z.string().min(1), id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(courses).values({
        id: input.id,
        name: input.courseName,
        instructorName: input.teacherName,
      });
    }),

  getJoined: protectedProcedure.query(async ({ ctx }) => {
    let r = await ctx.db.query.usersToCourses.findMany({
      columns: {
        courseID: false,
        userID: false,
      },
      where: eq(usersToCourses.userID, ctx.session.user.id),
      with: {
        course: true,
      },
    });

    return r.map(x => x.course);
  }),
});

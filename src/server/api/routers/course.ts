import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { courses, usersToCourses, users } from "~/server/db/schema";
import { v4 } from "uuid";
import { eq } from "drizzle-orm";

export const courseRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ courseName: z.string().min(1), teacherName: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(courses).values({ 
        id: v4(),
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

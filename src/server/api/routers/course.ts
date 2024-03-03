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

  leaveCourse: protectedProcedure
    .input(z.object({ courseID: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.delete(usersToCourses)
        .where(eq(usersToCourses.userID, ctx.session.user.id) && eq(usersToCourses.courseID, input.courseID));
    }),

  joinCourse: protectedProcedure
    .input(z.object({ courseID: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(usersToCourses).values({
        courseID: input.courseID,
        userID: ctx.session.user.id,
      })
    }),

  isInCourse: protectedProcedure
    .input(z.object({ courseID: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.usersToCourses.findFirst({
        where: eq(usersToCourses.courseID, input.courseID) && eq(usersToCourses.userID, ctx.session.user.id),
      }) !== undefined;
    })
})

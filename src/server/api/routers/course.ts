import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { courses, usersToCourses, users } from "~/server/db/schema";

export const courseRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // await ctx.db.insert(courses).values({
      //   name: input.name,
      //   createdById: ctx.session.user.id,
      // });
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

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});

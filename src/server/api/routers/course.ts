import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { courses } from "~/server/db/schema";
import { v4 } from "uuid";

export const courseRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ courseName: z.string().min(1), teacherName: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call

      await ctx.db.insert(courses).values({ 
        id: v4(),
        name: input.courseName,
        instructorName: input.teacherName,
      });
    }),
});

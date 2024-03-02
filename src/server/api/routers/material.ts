import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { courseMaterials } from "~/server/db/schema";
import {v4} from "uuid"

export const materialsRouter = createTRPCRouter({

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1), term: z.string().min(1), id: z.string().min(1),courseId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(courseMaterials).values({
        id: input.id,
        name: input.name,
        term: ctx.session.user.id,
      });
    }),
});

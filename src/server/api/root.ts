import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { courseRouter } from "./routers/course";
import { materialsRouter } from "./routers/material";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  course: courseRouter,
  post: postRouter,
  materials: materialsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

import { createTRPCRouter } from "~/server/api/trpc";
import { courseRouter } from "./routers/course";
import { materialsRouter } from "./routers/material";
import { questionRouter } from "./routers/question";
import { answerRouter } from "./routers/answers";
import { upvoteRouter } from "./routers/upvote";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  course: courseRouter,
  materials: materialsRouter,
  question: questionRouter,
  answer: answerRouter,
  upvote: upvoteRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

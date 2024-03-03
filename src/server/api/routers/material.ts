import { Schema, z } from "zod";
import { OpenAI } from "openai";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { courseMaterials } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { env } from "~/env";
import { createReadStream } from "fs";

export function sleep(ms: number) {                                         
    return new Promise(resolve => setTimeout(resolve, ms));                                         
}  

export const materialsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.string())
    .query(({input, ctx })=> {
      return ctx.db.query.courseMaterials.findMany({
        where: eq(courseMaterials.courseID, input)
      })
    }),
  create: protectedProcedure
    .input(z.object({
      materialName: z.string().min(1),
      term: z.string().min(1),
      id: z.string().min(1),
      courseId: z.string().min(1) }))

    .mutation(async ({ ctx, input }) => {    
      return await ctx.db.insert(courseMaterials).values({
        id: input.id,
        name: input.materialName,
        term: input.term,
        courseID: input.courseId,
        //term: ctx.session.user.id,
      });
    }),
  uploadPDF: protectedProcedure
    .mutation(async ({ ctx }) => {
        const client = new OpenAI({
            apiKey: env.OPENAI_API_KEY,
        });


        const file = await client.files.create({ file: createReadStream('01.pdf'), purpose: 'assistants' });


        const thread = await client.beta.threads.create({
          messages: [
            {
              "role": "user",
              "content": "Extract the dollar amount of the ticket from an attached PDF",
              file_ids: [file.id],

            }
          ]
        });

        const run = await client.beta.threads.runs.create(thread.id, {
            assistant_id: "asst_wnjccB2tMzuljc8R0AJq7Ilu",
        });

        while (true) {
            let r = await client.beta.threads.runs.retrieve(thread.id, run.id);

            console.log("run", JSON.stringify(r, null, 4));

            const shouldWait = r.status == "in_progress" || r.status == "queued";
            if (!shouldWait) break;

            await sleep(1000);
        }


        const t = await client.beta.threads.messages.list(thread.id);

        console.log("run", JSON.stringify(t.data, null, 4));
        console.log("DONE!")



        // const assistant = await client.beta.assistants.create({
        //     instructions: "You are supposed to read an uploaded PDF document and be able to extract dollar amounts from it.",
        //     model: "gpt-4-turbo-preview",
        //     tools: [{"type": "code_interpreter"}],
        //     file_ids: [file.id],
        // });
    



        // const runner = client.beta.chat.completions
        //     .runTools({
        //       model: 'gpt-3.5-turbo',
        //       messages: [{ role: 'user', content: 'Please save the amount of the receipt that was charged.' }],
        //       tools: [
        //             {
        //                 type: 'function',
        //                 function: {
        //                   function: function saveAmount(args: any) {
        //                     console.log("Amount", args);

        //                     return "OK";
        //                   },
        //                   parse: JSON.parse,
        //                   description: 'Save a amount of the PDF receipt to the system.',
        //                   parameters: {
        //                     type: 'object',
        //                     properties: {
        //                       amount: {
        //                         type: 'string',
        //                         description: 'The dollar cost of the receipt.',
        //                       },
        //                     },
        //                   },
        //                 },
        //               },
        //       ],
        //     });

        //   const finalContent = await runner.finalContent();
        //   console.log();
        //   console.log('Final content:', finalContent);





    })
});

"use server"

import { createReadStream } from "fs";
import { OpenAI } from "openai";
import { v4 } from "uuid";
import { env } from "~/env";
import { sleep } from "~/server/api/routers/material";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";
import { questions } from "~/server/db/schema";

interface Qs {
    questions: Q[],
}

interface Q {
    content: string;
}

export async function saveDocumentInteraction(materialID: string, formData: FormData) {
    const session = await getServerAuthSession();
    if (!session) return "Need to log in!";

  const fileI = formData.get('file') as File;

  console.log(fileI);

        const client = new OpenAI({
            apiKey: env.OPENAI_API_KEY,
        });

        const file = await client.files.create({ file: fileI, purpose: 'assistants' });


        const thread = await client.beta.threads.create({
          messages: [
            {
              "role": "user",
              "content": "Extract the questions from the attached PDF",
              file_ids: [file.id],

            }
          ]
        });

        const run = await client.beta.threads.runs.create(thread.id, {
            assistant_id: "asst_wnjccB2tMzuljc8R0AJq7Ilu",
        });

        let final = run;

        while (true) {
            let r = await client.beta.threads.runs.retrieve(thread.id, run.id);

            final = r;

            console.log("run", JSON.stringify(r, null, 4));

            const shouldWait = r.status == "in_progress" || r.status == "queued";
            if (!shouldWait) break;

            await sleep(1000);
        }

        const action = final.required_action;
        if (!action) {
            throw Error("Failed");
        }

        const tool = action.submit_tool_outputs.tool_calls[0];
        if (!tool) {
            throw Error("No tool");
        }

        const qs = JSON.parse(tool.function.arguments) as Qs;

        for (const q of qs.questions) {
            await db.insert(questions).values({
                id: v4(),
                materialID,
                content: q.content,
                postedBy: session.user.id,

            })
            

        }


        console.log("Qs: ", JSON.stringify(qs, null, 4));
        console.log("len: ", qs.questions.length);
        console.log("DONE!")


  // const userId = formData.get('userId') as string;

  console.log("from server");
}

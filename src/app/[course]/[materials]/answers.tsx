"use client"

import { useState } from "react";
import { v4 } from "uuid";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { RouterOutputs } from "~/trpc/shared";
import ReactQuill from "react-quill";
import parse from "html-react-parser";
import TimeAgo from "react-timeago";

interface AnswersProps {
    questionID: string;
}
export function Answers({ questionID }: AnswersProps) {
    const { data } = api.answer.getAnswers.useQuery({ id: questionID });

    return <div>
        {data?.map(answer => <Answer key={answer.id} answer={answer} />)}
        <NewAnswer questionID={questionID} />
    </div>
}

interface AnswerProps {
    answer: RouterOutputs["answer"]["getAnswers"][number];
}
export function Answer({ answer }: AnswerProps) {
    return (
      <div className="border-b text-xs">
          <div className="text-gray-500">
            <img className="rounded-full h-5 inline-block" src={answer.user.image ?? "/addclasses.webp"}/> {answer.user.name}
          </div>
          {parse(answer.content)}
          <TimeAgo date={answer.createdAt} className="text-gray-400 block justify-right"/>
          <br />
          <hr />
      </div>
    );
}

interface NewAnswerProps {
    questionID: string;
}
export function NewAnswer({ questionID }: NewAnswerProps) {
    const [content, setContent] = useState("");
    const util = api.useUtils();

    const { mutate } = api.answer.create.useMutation({
        onSuccess() {
            util.answer.getAnswers.invalidate({ id: questionID });
            setContent("");
        },
    });

    const onPost = () => {
        mutate({
            id: v4(),
            questionID,
            content,
        })
    }

    return (
      <div className="">
          <ReactQuill
            theme="snow"
            placeholder="Write an answer!"
            value={content}
            onChange={setContent}
            modules={{
              toolbar: [
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [
                  { script: 'sub' },
                  { script: 'super' },
                  { list: 'ordered' },
                  { list: 'bullet' },
                  { indent: '-1' },
                  { indent: '+1' },
                ],
                ['link', 'image'],
                ['code-block'],
              ],
            }}
          />
          <br />
          <Button onClick={onPost}>Post</Button>
      </div>
    );
}

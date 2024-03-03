"use client"

import { useState } from "react";
import { v4 } from "uuid";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { RouterOutputs } from "~/trpc/shared";
import ReactQuill from "react-quill";
import parse from "html-react-parser";
import TimeAgo from "react-timeago";
import { HeartIcon } from "lucide-react";

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
  const util = api.useUtils();

  const [upvoteStatus, setUpvoteStatus] = useState(answer.fromLoggedIn);
  const [upvoteNum, setUpvoteNum] = useState(answer.upvote.length);

  const { mutate } = api.upvote.create.useMutation({
        onSuccess() {
            util.answer.getAnswers.invalidate();
        },
    });

  const { mutate: removeUpvote } = api.upvote.remove.useMutation({
        onSuccess() {
            util.answer.getAnswers.invalidate();
        },
    });

    const upvote = () => {
        setUpvoteNum(upvoteNum + 1);
        setUpvoteStatus(!upvoteStatus);

        mutate({
            id: v4(),
            answerID: answer.id,
        })
    };

    const unUpvote = () => {
        setUpvoteNum(upvoteNum - 1);
        setUpvoteStatus(!upvoteStatus);

        removeUpvote({
            answerID: answer.id,
        })
    };

    return (
      <div className="border-b text-sm my-2 py-2">
        <div className="text-muted-foreground text-xs flex justify-between mb-2">
          <div className="text-gray-450">
            <img className="rounded-full h-5 inline-block" src={answer.user.image ?? "/addclasses.webp"}/> {answer.user.name}
          </div>
          <TimeAgo date={answer.createdAt} className="text-gray-400 block justify-right"/>
        </div>
        {parse(answer.content)}
      
        <Button variant="outline" onClick={upvoteStatus ? unUpvote : upvote} className="mt-2 justify-right">
          <HeartIcon className={"justify-right mr-1 " + (upvoteStatus ? "fill-red-500 stroke-red-500" : "")}/> {upvoteNum}
        </Button>
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
          <Button disabled={content.length == 0} onClick={onPost}>Post</Button>
      </div>
    );
}

"use client"

import { useState } from "react";
import { v4 } from "uuid";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { RouterOutputs } from "~/trpc/shared";

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
    return <div>
        {answer.content}
    </div>
}

interface NewAnswerProps {
    questionID: string;
}
export function NewAnswer({ questionID }: NewAnswerProps) {
    const [content, setContent] = useState("");
    const util = api.useUtils();

    const { mutate } = api.answer.create.useMutation({
        onSuccess(data, variables, context) {
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

    return <div className="flex flex-row space-x-2">
        <Input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Submit an answer" />
        <Button onClick={onPost}>Post</Button>
    </div>
}
